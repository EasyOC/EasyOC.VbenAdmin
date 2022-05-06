import type {
  ProjectConfig,
  HeaderSetting,
  MenuSetting,
  MultiTabsSetting,
  BeforeMiniState,
} from '@pkg/types'
import { ThemeEnum } from '@pkg/tokens'
import { deepMerge } from '@pkg/utils'
import { darkMode } from '@pkg/setting'
import { defineStore } from 'pinia'
import { pinia } from '@/internal'
import { resetRouter } from '@/router'
// import { loadGraphQLSchema } from '@pkg/apis/eoc/GraphqlService'
import { ContentFieldsMapping } from '@pkg/apis/eoc/contentApi'

interface AppState {
  darkMode?: ThemeEnum
  // Page loading status
  pageLoading: boolean
  // project config
  projectConfig: ProjectConfig | null
  // When the window shrinks, remember some states, and restore these states when the window is restored
  beforeMiniInfo: BeforeMiniState
  typeFieldCache: { [key: string]: ContentFieldsMapping[] }
}
let timeId: TimeoutHandle
export const useAppStore = defineStore({
  id: 'app',
  persist: {
    strategies: [
      {
        paths: ['darkMode', 'projectConfig'],
      },
    ],
  },
  state: (): AppState => ({
    darkMode: undefined,
    pageLoading: false,
    projectConfig: {} as any,
    beforeMiniInfo: {},
    typeFieldCache: {},
  }),
  getters: {
    getPageLoading(): boolean {
      return this.pageLoading
    },

    getDarkMode(): 'light' | 'dark' | string {
      return this.darkMode || darkMode
    },

    getBeforeMiniInfo(): BeforeMiniState {
      return this.beforeMiniInfo
    },

    getProjectConfig(): ProjectConfig {
      return this.projectConfig || ({} as ProjectConfig)
    },

    getHeaderSetting(): HeaderSetting {
      return this.getProjectConfig.headerSetting
    },

    getMenuSetting(): MenuSetting {
      return this.getProjectConfig.menuSetting
    },

    getMultiTabsSetting(): MultiTabsSetting {
      return this.getProjectConfig.multiTabsSetting
    },
  },
  actions: {
    updateTypeFieldCache(typeName: string, fields: ContentFieldsMapping[]) {
      this.typeFieldCache[typeName] = fields
    },
    setPageLoading(loading: boolean): void {
      this.pageLoading = loading
    },

    setDarkMode(mode: ThemeEnum): void {
      this.darkMode = mode
    },

    setBeforeMiniInfo(state: BeforeMiniState): void {
      this.beforeMiniInfo = state
    },

    setProjectConfig(config: DeepPartial<ProjectConfig>): void {
      this.projectConfig = deepMerge(this.projectConfig || {}, config)
    },

    async resetAllState() {
      resetRouter()
    },

    async setPageLoadingAction(loading: boolean): Promise<void> {
      if (loading) {
        clearTimeout(timeId)
        // Prevent flicker
        timeId = setTimeout(() => {
          this.setPageLoading(loading)
        }, 50)
      } else {
        this.setPageLoading(loading)
        clearTimeout(timeId)
      }
    },
  },
})

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(pinia)
}
