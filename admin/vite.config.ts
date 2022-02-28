import pkg from './package.json'
import dayjs from 'dayjs'
import { loadEnv, defineConfig } from 'vite'
import { resolve } from 'path'
import { OUTPUT_DIR, wrapperEnv } from './config'
import { configProxy, configVitePlugins } from './config/vite'
import { generateModifyVars } from './config/modifyVars'
import { cyan } from 'chalk'

console.log(cyan('当前处于开发测试阶段，请勿用于实际项目！\n'))

export default defineConfig(async ({ command, mode }) => {
  const { dependencies, devDependencies, name, version } = pkg
  const root = process.cwd()
  const env = loadEnv(mode, root)

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env)

  const { VITE_PUBLIC_PATH, VITE_PROXY, VITE_USE_MOCK, VITE_DROP_CONSOLE } =
    viteEnv

  return {
    root,
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '@/': `${resolve(__dirname, 'src')}/`,
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
        vue: 'vue/dist/vue.esm-bundler.js',
        '@service': `@admin/service/modules`,
      },
    },
    server: {
      port: 3000,
      https: true,
      host: true,
      proxy: configProxy(VITE_PROXY),
      fs: {
        strict: true,
      },
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
    },
    build: {
      target: 'chrome80',
      cssTarget: 'chrome80',
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
    define: {
      __VITE_USE_MOCK__: VITE_USE_MOCK,
      // Suppress vue-i18-next warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify({
        pkg: { dependencies, devDependencies, name, version },
        lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }),
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true,
        },
      },
    },
    optimizeDeps: {
      include: [
        '@vue/shared',
        '@iconify/iconify',
        '@ant-design/icons-vue',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
        'dayjs/locale/en',
        'dayjs/locale/zh-cn',
        'lodash-es',
      ],
      exclude: ['vue-demi'],
    },
    plugins: configVitePlugins(viteEnv, command === 'build'),
  }
})
