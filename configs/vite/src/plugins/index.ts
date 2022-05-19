import type { PluginOption } from 'vite'
import type { ViteEnv } from '../utils'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import purgeIcons from 'vite-plugin-purge-icons'
import VitePluginCertificate from 'vite-plugin-mkcert'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { configHtmlPlugin } from './html'
import { configMockPlugin } from './mock'
import { configCompressPlugin } from './compress'
import { configVisualizerConfig } from './visualizer'
import { configImageminPlugin } from './imagemin'
import { configSvgIconsPlugin } from './svg-icons'
import react from '@vitejs/plugin-react'
import { babel } from '@rollup/plugin-babel'
export async function configVitePlugins(
  root: string,
  viteEnv: ViteEnv,
  isBuild: boolean,
) {
  const {
    VITE_USE_IMAGEMIN,
    VITE_USE_MOCK,
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
  } = viteEnv

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    
    // have to
    vue({
      // exclude: [/.*react_app[\\/].*/],
    }),
    // have to
    vueJsx({
      // 排除所有react_app目录
      exclude: [/[/\\]react_app[\\/$]+/]
    }),
    // support name
    vueSetupExtend(),
    // react({
    //   include: /react_app/,
    //   exclude: /(?!react_app)/
    // }),
    babel({
      exclude: [/node_modules/],
      presets: [
        // 需要提前安装 @vue/cli-plugin-babel
        '@vue/cli-plugin-babel/preset',
        'veaury/babel/ReactPreset'
      ],
      babelHelpers: 'runtime',
    }),
    VitePluginCertificate({
      source: 'coding',
    }),
  ]

  // @vitejs/plugin-legacy
  VITE_LEGACY && isBuild && vitePlugins.push(legacy())

  // vite-plugin-html
  vitePlugins.push(await configHtmlPlugin(root, viteEnv, isBuild))

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin(isBuild))

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild))

  // vite-plugin-purge-icons
  vitePlugins.push(purgeIcons())

  // rollup-plugin-visualizer
  vitePlugins.push(configVisualizerConfig())

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
  }

  return vitePlugins
}
