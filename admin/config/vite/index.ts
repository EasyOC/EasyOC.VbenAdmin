import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import purgeIcons from 'vite-plugin-purge-icons'
import VitePluginCertificate from 'vite-plugin-mkcert'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { configHtmlPlugin } from './html'
import { configPwaConfig } from './pwa'
import { configMockPlugin } from './mock'
import { configCompressPlugin } from './compress'
import { configVisualizerConfig } from './visualizer'
import { configThemePlugin } from './theme'
import { configImageminPlugin } from './imagemin'
import { configSvgIconsPlugin } from './svgSprite'
import { configProxy } from './proxy'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
function __uri(url: string) {
  return url
}

export const configVitePlugins = (viteEnv: ViteEnv, isBuild: boolean) => {
  const {
    VITE_USE_IMAGEMIN,
    VITE_USE_MOCK,
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
  } = viteEnv

  const vitePlugins = [
    // have to
    vue(),
    // have to
    vueJsx(),
    // support name
    vueSetupExtend(),
    VitePluginCertificate({
      source: 'coding',
    }),
  ]

  // @vitejs/plugin-legacy
  VITE_LEGACY && isBuild && vitePlugins.push(legacy())

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin(isBuild))

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild))

  // vite-plugin-purge-icons
  vitePlugins.push(purgeIcons())

  // rollup-plugin-visualizer
  vitePlugins.push(configVisualizerConfig())

  // vite-plugin-theme
  vitePlugins.push(configThemePlugin(isBuild))

  // The following plugins only work in the production environment
  if (isBuild) {
    // vite-plugin-imagemin
    VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin())

    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(
        VITE_BUILD_COMPRESS,
        VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
      ),
    )

    // vite-plugin-pwa
    vitePlugins.push(configPwaConfig(viteEnv))
  }
  // //Add Monaco
  // vitePlugins.push(
  //   monacoEditorPlugin({
  //     customWorkers: [
  //       { label: 'graphql.worker', entry: 'monaco-graphql/esm/graphql.worker' },
  //       {
  //         label: 'editor.worker',
  //         entry: 'monaco-editor/esm/vs/editor/editor.worker',
  //       },
  //       {
  //         label: 'json.worker',
  //         entry: 'monaco-editor/esm/vs/language/json/json.worker',
  //       },
  //       {
  //         label: 'css.worker',
  //         entry: 'monaco-editor/esm/vs/language/css/css.worker',
  //       },
  //       {
  //         label: 'html.worker',
  //         entry: 'monaco-editor/esm/vs/language/html/html.worker',
  //       },
  //       {
  //         label: 'ts.worker',
  //         entry: 'monaco-editor/esm/vs/language/typescript/ts.worker',
  //       },
  //       {
  //         label: 'loader',
  //         entry: 'monaco-editor/min/vs/loader',
  //       },
  //       // {
  //       //   label: 'vs',
  //       //   entry: 'monaco-editor/min/vs/editor/editor.main.js'.replace(
  //       //     /\/vs\/.*$/,
  //       //     '',
  //       //   ),
  //       // },
  //       // {
  //       //   label: 'vs/base/worker/workerMain',
  //       //   entry: 'monaco-editor/min/vs/base/worker/workerMain.js',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/apex/apex',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/apex/apex',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/azcli/azcli',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/azcli/azcli',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/clojure/clojure',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/clojure/clojure',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/bat/bat',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/bat/bat',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/coffee/coffee',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/coffee/coffee',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/cpp/cpp',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/cpp/cpp',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/csharp/csharp',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/csharp/csharp',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/css/css',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/css/css',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/dockerfile/dockerfile',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/dockerfile/dockerfile',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/fsharp/fsharp',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/fsharp/fsharp',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/go/go',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/go/go',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/handlebars/handlebars',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/handlebars/handlebars',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/html/html',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/html/html',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/ini/ini',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/ini/ini',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/java/java',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/java/java',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/javascript/javascript',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/javascript/javascript',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/less/less',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/less/less',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/lua/lua',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/lua/lua',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/markdown/markdown',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/markdown/markdown',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/msdax/msdax',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/msdax/msdax',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/objective-c/objective-c',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/objective-c/objective-c',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/php/php',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/php/php',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/postiats/postiats',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/postiats/postiats',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/powershell/powershell',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/powershell/powershell',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/pug/pug',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/pug/pug',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/python/python',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/python/python',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/r/r',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/r/r',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/razor/razor',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/razor/razor',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/redis/redis',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/redis/redis',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/redshift/redshift',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/redshift/redshift',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/ruby/ruby',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/ruby/ruby',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/rust/rust',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/rust/rust',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/sb/sb',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/sb/sb',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/scheme/scheme',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/scheme/scheme',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/scss/scss',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/scss/scss',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/shell/shell',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/shell/shell',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/solidity/solidity',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/solidity/solidity',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/sql/sql',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/sql/sql',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/st/st',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/st/st',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/swift/swift',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/swift/swift',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/typescript/typescript',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/typescript/typescript',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/vb/vb',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/vb/vb',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/xml/xml',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/xml/xml',
  //       // },
  //       // {
  //       //   label: 'vs/basic-languages/yaml/yaml',
  //       //   entry: 'monaco-editor/min/vs/basic-languages/yaml/yaml',
  //       // },
  //       // {
  //       //   label: 'vs/editor/editor.main',
  //       //   entry: 'monaco-editor/min/vs/editor/editor.main.js',
  //       // },
  //       // {
  //       //   label: 'vs/editor/editor.main.css',
  //       //   entry: 'monaco-editor/min/vs/editor/editor.main.css',
  //       // },
  //       // {
  //       //   label: 'vs/editor/editor.main.nls',
  //       //   entry: 'monaco-editor/min/vs/editor/editor.main.nls.js',
  //       // },
  //       // {
  //       //   label: 'vs/editor/editor.main.nls.zh-cn',
  //       //   entry: 'monaco-editor/min/vs/editor/editor.main.nls.zh-cn.js',
  //       // },
  //       // // label:'vs/editor/contrib/suggest/media/String_16x.svg', entry: 'monaco-editor/min/vs/editor/contrib/suggest/media/String_16x.svg'},
  //       // // label:'vs/editor/contrib/suggest/media/String_inverse_16x.svg', entry: 'monaco-editor/min/vs/editor/contrib/suggest/media/String_inverse_16x.svg'},
  //       // // label:'vs/editor/standalone/browser/quickOpen/symbol-sprite.svg', entry: 'monaco-editor/min/vs/editor/standalone/browser/quickOpen/symbol-sprite.svg'},
  //       // // label:'vs/language/typescript/lib/typescriptServices', entry: 'monaco-editor/min/vs/language/typescript/lib/typescriptServices.js'},
  //       // {
  //       //   label: 'vs/language/typescript/tsWorker',
  //       //   entry: 'monaco-editor/min/vs/language/typescript/tsWorker.js',
  //       // },
  //       // {
  //       //   label: 'vs/language/json/jsonMode',
  //       //   entry: 'monaco-editor/min/vs/language/json/jsonMode.js',
  //       // },
  //       // {
  //       //   label: 'vs/language/json/jsonWorker',
  //       //   entry: 'monaco-editor/min/vs/language/json/jsonWorker.js',
  //       // },
  //       // {
  //       //   label: 'vs/language/html/htmlMode',
  //       //   entry: 'monaco-editor/min/vs/language/html/htmlMode.js',
  //       // },
  //       // {
  //       //   label: 'vs/language/html/htmlWorker',
  //       //   entry: 'monaco-editor/min/vs/language/html/htmlWorker.js',
  //       // },
  //       // {
  //       //   label: 'vs/language/css/cssMode',
  //       //   entry: 'monaco-editor/min/vs/language/css/cssMode.js',
  //       // },
  //       // {
  //       //   label: 'vs/language/css/cssWorker',
  //       //   entry: 'monaco-editor/min/vs/language/css/cssWorker.js',
  //       // },
  //     ],
  //     publicPath: 'node_modules/.vite/thirds/monaco-editor',
  //     globalAPI: true,
  //   }),
  // )

  return vitePlugins
}

export { configProxy }
