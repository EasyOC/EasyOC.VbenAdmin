import { name, version } from '../package.json'

// The name of the configuration file entered in the production environment
export const GLOB_CONFIG_FILE_NAME = '_app.config.js'

// vite package output directory
export const OUTPUT_DIR = 'dist'

// project name
export const PKG_NAME = name

// project version
export const PKG_VERSION = version

// Read all environment variable configuration files to process.env
export const wrapperEnv = (envConf: Recordable): ViteEnv => {
  const viteEnv: Partial<ViteEnv> = {}

  for (const key of Object.keys(envConf)) {
    let realName = envConf[key].replace(/\\n/g, '\n')
    realName =
      realName === 'true' ? true : realName === 'false' ? false : realName

    if (key === 'VITE_PROXY' && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'))
      } catch (error) {
        realName = ''
      }
    }

    viteEnv[key] = realName
    if (typeof realName === 'string') {
      process.env[key] = realName
    } else if (typeof realName === 'object') {
      process.env[key] = JSON.stringify(realName)
    }
  }
  return viteEnv as ViteEnv
}
