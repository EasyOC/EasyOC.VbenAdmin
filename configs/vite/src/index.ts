import { UserConfig, UserConfigFn } from 'vite'
import type { FrameworkType } from './presets'
import { mergeConfig, loadEnv, defineConfig } from 'vite'
import { cyan } from 'picocolors'
import { readPackageJSON } from 'pkg-types'
import { wrapperEnv, resolveProxy } from './utils'
import { resolve } from 'path'
import { configVitePlugins } from './plugins'
import { createPreset } from './presets'
import { OUTPUT_DIR } from './constants'
import dayjs from 'dayjs'
import react from '@vitejs/plugin-react'

export * from './constants'

export type ViteConfig = Promise<UserConfig | UserConfigFn>

export async function createViteConfig(
  cwd: string,
  framework: FrameworkType,
): Promise<UserConfig | UserConfigFn> {
  console.log()
  console.log(
    cyan(
      '当前处于开发测试阶段，还会有大量更新，仅供参考，请勿用于实际项目！\n',
    ),
  )
  console.log()

  return defineConfig(async ({ command, mode }) => {
    const root = cwd
    const env = loadEnv(mode, root)
    const { dependencies, devDependencies, name, version } =
      await readPackageJSON(cwd)

    // The boolean type read by loadEnv is a string. This function can be converted to boolean type
    const viteEnv = wrapperEnv(env)

    const { VITE_PUBLIC_PATH, VITE_PROXY, VITE_USE_MOCK, VITE_DROP_CONSOLE } =
      viteEnv
    const prefix = 'monaco-editor/esm/vs'

    const commonConfig: UserConfig = {
      root,
      base: VITE_PUBLIC_PATH,
      resolve: {
        alias: {
          '@/': `${resolve(root, 'src')}/`,
          'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
          vue: 'vue/dist/vue.esm-bundler.js',
        },
      },
      define: {
        __VITE_USE_MOCK__: VITE_USE_MOCK,
        // Suppress vue-i18-next warning
        __INTLIFY_PROD_DEVTOOLS__: false,
        __APP_INFO__: JSON.stringify({
          pkg: { dependencies, devDependencies, name, version },
          lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        }),
      },
      server: {
        port: 3000,
        https: false,
        open: true,
        host: true,
        proxy: resolveProxy(VITE_PROXY),
        fs: { strict: false }
        // fs: {
        //   strict: false,
        //   // allow: [
        //   //   // 搜索工作区的根目录
        //   //   searchForWorkspaceRoot(process.cwd()),
        //   //   // // 自定义规则
        //   //   './public/amis-editor-renderer'
        //   // ]
        // },
      },
      esbuild: {
        pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
      },
      build: {
        target: 'chrome80',
        cssTarget: 'chrome80',
        sourcemap: true,
        outDir: OUTPUT_DIR,
        /**
         * 当 minify=“minify:'terser'” 解开注释
         * Uncomment when minify="minify:'terser'"
         */
        // terserOptions: {
        //   compress: {
        //     keep_infinity: true,
        //     drop_console: VITE_DROP_CONSOLE,
        //   },
        // },

        brotliSize: false,
        chunkSizeWarningLimit: 2048,
        rollupOptions: {
          // input: [
          //   '/index.html',
          //   '/public/amis-editor-renderer/index.html'
          // ],
          output: {
            manualChunks: {
              vue: ['vue', 'pinia', 'vue-router', '@vue/shared'],
              // antdv: ['ant-design-vue'],
              // icons: ['@ant-design/icons-vue'],
              echarts: ['echarts'],
              mockjs: ['mockjs'],
            },
          },
        },
      },
      optimizeDeps: {
        // entries: ["/index.html",'/amis-editor-renderer/index.html'],
        include: [
          '@vue/shared',
          '@iconify/iconify',
          'dayjs/locale/en',
          'dayjs/locale/zh-cn',
          'lodash-es',
          `${prefix}/language/json/json.worker`,
          `${prefix}/language/css/css.worker`,
          `${prefix}/language/html/html.worker`,
          `${prefix}/language/typescript/ts.worker`,
          `${prefix}/editor/editor.worker`,
          'monaco-editor/min/vs/loader.js',
        ],
        exclude: ['vue-demi'],
      },
      plugins: [
        react(
          {
            include: [/[/\\]react_app[\\/$]+/]
          }
        ),
        ...await configVitePlugins(root, viteEnv, command === 'build')
        // react()
      ],
    }

    return mergeConfig(commonConfig, await createPreset(framework)(command))
  })
}
