import type { Menu } from '@/router/types'

import { defineStore } from 'pinia'
import { pinia } from '@/internal'
import { useI18n } from '@pkg/locale'
import { useUserStore } from '@/store/user'
import { useAppStoreWithOut } from '@/store/app'
import { toRaw } from 'vue'
import {
  transformObjToRoute,
  flatMultiLevelRoutes,
} from '@/router/helper/route'
import { transformRouteToMenu } from '@/router/helper/menu'
import { projectSetting } from '@pkg/setting'
import { PermissionModeEnum, PageEnum } from '@pkg/tokens'
import { asyncRoutes } from '@/router/routes'
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic'
import { filterTree } from '@pkg/utils'
import { getMenuList, getPermCode } from '@pkg/apis/sys'
import { useMessage } from '@/hooks/web/useMessage'

interface PermissionState {
  // Permission code list
  permCodeList: string[] | number[]
  // Whether the route has been dynamically added
  isDynamicAddedRoute: boolean
  // To trigger a menu update
  lastBuildMenuTime: number
  // Backstage menu list
  backMenuList: Menu[]
  frontMenuList: Menu[]
}
export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [],
    // Whether the route has been dynamically added
    isDynamicAddedRoute: false,
    // To trigger a menu update
    lastBuildMenuTime: 0,
    // Backstage menu list
    backMenuList: [],
    // menu List
    frontMenuList: [],
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list
      list?.length > 0 && this.setLastBuildMenuTime()
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime()
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added
    },
    resetState(): void {
      this.isDynamicAddedRoute = false
      this.permCodeList = []
      this.backMenuList = []
      this.lastBuildMenuTime = 0
    },
    async changePermissionCode() {
      const codeList = await getPermCode()
      this.setPermCodeList(codeList)
    },
    async buildRoutesAction(): Promise<RouteRecordItem[]> {
      const { t } = useI18n()
      const userStore = useUserStore()
      const appStore = useAppStoreWithOut()

      let routes: RouteRecordItem[] = []
      const roleList = toRaw(userStore.getRoleList) || []
      const { permissionMode = projectSetting.permissionMode } =
        appStore.getProjectConfig

      const routeFilter = (route: RouteRecordItem) => {
        const { meta } = route
        const { roles } = meta || {}
        if (!roles) return true
        return roleList.some((role) => roles.includes(role))
      }

      const routeRemoveIgnoreFilter = (route: RouteRecordItem) => {
        const { meta } = route
        const { ignoreRoute } = meta || {}
        return !ignoreRoute
      }

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: RouteRecordItem[]) => {
        if (!routes || routes.length === 0) return
        let homePath: string =
          userStore.getUserInfo.homePath || PageEnum.BASE_HOME
        function patcher(routes: RouteRecordItem[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/'
          routes.forEach((route: RouteRecordItem) => {
            const { path, children, redirect } = route
            const currentPath = path.startsWith('/') ? path : parentPath + path
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true })
                throw new Error('end')
              }
            }
            children && children.length > 0 && patcher(children, currentPath)
          })
        }
        try {
          patcher(routes)
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return
      }

      switch (permissionMode) {
        case PermissionModeEnum.ROLE:
          routes = filterTree(asyncRoutes, routeFilter)
          routes = routes.filter(routeFilter)
          // Convert multi-level routing to level 2 routing
          routes = flatMultiLevelRoutes(routes)
          break

        case PermissionModeEnum.ROUTE_MAPPING:
          routes = filterTree(asyncRoutes, routeFilter)
          routes = routes.filter(routeFilter)
          const menuList = transformRouteToMenu(routes, true)
          routes = filterTree(routes, routeRemoveIgnoreFilter)
          routes = routes.filter(routeRemoveIgnoreFilter)
          menuList.sort((a, b) => {
            return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0)
          })

          this.setFrontMenuList(menuList as Menu[])
          // Convert multi-level routing to level 2 routing
          routes = flatMultiLevelRoutes(routes)
          break

        //  If you are sure that you do not need to do background dynamic permissions, please comment the entire judgment below
        case PermissionModeEnum.BACK:
          const { createMessage } = useMessage()

          createMessage.loading(t('sys.app.menuLoading'))

          // !Simulate to obtain permission codes from the background,
          // this function may only need to be executed once, and the actual project can be put at the right time by itself
          let routeList: RouteRecordItem[] = []
          try {
            this.changePermissionCode()
            routeList = (await getMenuList()) as RouteRecordItem[]
          } catch (error) {
            console.error(error)
          }

          // Dynamically introduce components
          routeList = transformObjToRoute(routeList)

          //  Background routing to menu structure
          const backMenuList = transformRouteToMenu(routeList)
          this.setBackMenuList(backMenuList as Menu[])

          // remove meta.ignoreRoute item
          routeList = filterTree(routeList, routeRemoveIgnoreFilter)
          routeList = routeList.filter(routeRemoveIgnoreFilter)

          routeList = flatMultiLevelRoutes(routeList)
          routes = [PAGE_NOT_FOUND_ROUTE, ...routeList]
          break
      }

      patchHomeAffix(routes)
      return routes
    },
  },
})

// Need to be used outside the setup
export function usePermissionStoreWithOut() {
  return usePermissionStore(pinia)
}
