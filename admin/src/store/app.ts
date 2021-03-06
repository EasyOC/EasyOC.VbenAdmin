import type {
  ProjectConfig,
  HeaderSetting,
  MenuSetting,
  TransitionSetting,
  MultiTabsSetting,
  BeforeMiniState,
} from '@admin/types'
import { ThemeEnum } from '@admin/tokens'
import { deepMerge } from '@admin/utils'
import { darkMode } from '@admin/setting'
import { defineStore } from 'pinia'
import { pinia } from '@/internal'
import { resetRouter } from '@/router'
import { loadGraphQLSchema } from '@service/eoc/GraphqlService'
import { ContentFieldsMapping } from '@service/eoc/contentApi'

interface AppState {
  darkMode?: ThemeEnum
  graphqlSchema: any
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
    graphqlSchema: null,
    typeFieldCache: {},
  }),
  getters: {
    getPageLoading(): boolean {
      return this.pageLoading
    },
    getGraphqlSchema(): any {
      return this.graphqlSchema
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

    getTransitionSetting(): TransitionSetting {
      return this.getProjectConfig.transitionSetting
    },

    getMultiTabsSetting(): MultiTabsSetting {
      return this.getProjectConfig.multiTabsSetting
    },
  },
  actions: {
    async loadGraphQLSchema() {
      if (!this.graphqlSchema) {
        this.graphqlSchema = await loadGraphQLSchema()
      }
    },
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
