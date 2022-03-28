import pkg from './package.json'
import dayjs from 'dayjs'
import { loadEnv, defineConfig, UserConfigExport } from 'vite'
import path, { resolve } from 'path'
import { OUTPUT_DIR, wrapperEnv } from './config'
import { configProxy, configVitePlugins } from './config/vite'
import { generateModifyVars } from './config/modifyVars'
// import { cyan } from 'chalk'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
// import MonacoEditorNlsPlugin, {
//   esbuildPluginMonacoEditorNls,
//   Languages,
// } from 'vite-plugin-monaco-editor-nls'

// console.log(cyan('当前处于开发测试阶段，请勿用于实际项目！\n'))
export default defineConfig(async ({ command, mode }) => {
  const { dependencies, devDependencies, name, version } = pkg
  const root = process.cwd()
  const env = loadEnv(mode, root)

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env)

  const { VITE_PUBLIC_PATH, VITE_PROXY, VITE_USE_MOCK, VITE_DROP_CONSOLE } =
    viteEnv
  const prefix = 'monaco-editor/esm/vs'

  return {
    root,
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '@/': `${resolve(__dirname, 'src')}/`,
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
        vue: 'vue/dist/vue.esm-bundler.js',
        '@service': '@admin/service/modules',
      },
    },
    server: {
      port: 3000,
      open: true,
      // https: true,
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
          filename: '[name].js',
          publicPath: '/',
          path: path.resolve(__dirname, 'dist'),
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
        // `${prefix}/language/json/json.worker`,
        // `${prefix}/language/css/css.worker`,
        // `${prefix}/language/html/html.worker`,
        // `${prefix}/language/typescript/ts.worker`,
        // `${prefix}/editor/editor.worker`,
        // 'monaco-editor/min/vs/loader.js',
      ],
      exclude: ['vue-demi'],
      // esbuildOptions: {
      //   plugins: [
      //     esbuildPluginMonacoEditorNls({
      //       locale: Languages.zh_hans,
      //     }),
      //   ],
      // },
    },
    plugins: [
      ...configVitePlugins(viteEnv, command === 'build'),
      // MonacoEditorNlsPlugin({ locale: Languages.zh_hans }),
      //Add Monaco
      monacoEditorPlugin({
        customWorkers: [
          {
            label: 'vs',
            entry: 'monaco-editor/min/vs/editor/editor.main.js'.replace(
              /\/vs\/.*$/,
              '',
            ),
          },
          {
            label: 'graphql.worker',
            entry: 'monaco-graphql/esm/graphql.worker',
          },
          {
            label: 'editor.worker',
            entry: 'monaco-editor/esm/vs/editor/editor.worker',
          },
          {
            label: 'json.worker',
            entry: 'monaco-editor/esm/vs/language/json/json.worker',
          },
          {
            label: 'css.worker',
            entry: 'monaco-editor/esm/vs/language/css/css.worker',
          },
          {
            label: 'html.worker',
            entry: 'monaco-editor/esm/vs/language/html/html.worker',
          },
          {
            label: 'ts.worker',
            entry: 'monaco-editor/esm/vs/language/typescript/ts.worker',
          },
          {
            label: 'loader',
            entry: 'monaco-editor/min/vs/loader',
          },
          {
            label: 'vs/base/worker/workerMain',
            entry: 'monaco-editor/min/vs/base/worker/workerMain.js',
          },
        ],
        // publicPath: 'node_modules/.vite/thirds/monaco-editor',
        // globalAPI: true,
      }),
    ],
  } as UserConfigExport
})
