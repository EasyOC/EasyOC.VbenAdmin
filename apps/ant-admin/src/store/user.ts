import type { UserInfo, ErrorMessageMode } from '@pkg/types'
import type { GetUserInfoModel, LoginParams } from '@pkg/apis/sys'
import { defineStore } from 'pinia'
import { RoleEnum, PageEnum } from '@pkg/tokens'
import {
  decodeJwt,
  // , isArray
} from '@pkg/utils'
import { useI18n } from '@pkg/locale'
import { pinia } from '@/internal'

import { doLogout, loginApi } from '@pkg/apis/sys'
import { useMessage } from '@/hooks/web/useMessage'
import { router } from '@/router'
import { usePermissionStore } from '@/store/permission'
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic'
import { h } from 'vue'
import authService from '@/api/authService'

interface UserState {
  userInfo: Nullable<UserInfo>
  token?: string
  timeout?: Date
  roleList: RoleEnum[]
  sessionTimeout?: boolean
  lastUpdateTime: number
}

export const useUserStore = defineStore({
  id: 'app-user',
  persist: {
    strategies: [
      {
        paths: ['userInfo', 'token', 'roleList', 'timeout'],
      },
    ],
  },
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    //timeout
    timeout: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || ({} as UserInfo)
    },
    getToken(): string {
      if (this.token) {
        window.localStorage.setItem('token', this.token)
      }
      return this.token as string
    },
    getTimeout(): Date | null {
      return this.timeout ? new Date(this.timeout) : null
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : []
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : '' // for null or undefined value
      if (info) window.localStorage.setItem('token', info)
    },
    setTimeout(timeout: Date | undefined) {
      this.timeout = timeout
      if (timeout) window.localStorage.setItem('timeout', timeout.toString())
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info
      this.lastUpdateTime = new Date().getTime()
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag
    },
    resetState() {
      this.userInfo = null
      this.token = ''
      this.roleList = []
      this.sessionTimeout = false
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean
        mode?: ErrorMessageMode
      },
    ): Promise<UserInfo | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params

        const data = await loginApi(loginParams, mode)
        const { access_token, expires_in } = data

        // save token
        this.setToken(access_token)
        this.setTimeout(new Date(new Date().getTime() + expires_in * 1000))
        return this.afterLoginAction(goHome)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async oidclogin(): Promise<UserInfo | null> {
      try {
        const goHome = true
        console.log(1111111111111111)
        const oidcuser = await authService.getUserInfo()
        console.log('oidcuser: ', oidcuser);
        if (oidcuser) {

          const { access_token, expires_in } = oidcuser

          // save token
          this.setToken(access_token)
          this.setTimeout(new Date(new Date().getTime() + expires_in * 1000))
          return this.afterLoginAction(goHome)
        } else {
          return Promise.resolve(null)
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<UserInfo | null> {
      // if ((this.getToken && this.getTimeout && new Date(this.getTimeout) < new Date())) {
      //   await authService.startSilentRenew()
      //   // authService.getClient
      //   // this.logout(true)
      //   // return null
      // }

      // get user info
      const userInfo = await this.getUserInfoAction()

      const sessionTimeout = this.sessionTimeout
      if (sessionTimeout) {
        this.setSessionTimeout(false)
      } else {
        const permissionStore = usePermissionStore()
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction()
          routes.forEach((route) => {
            router.addRoute(route)
          })
          router.addRoute(PAGE_NOT_FOUND_ROUTE)
          permissionStore.setDynamicAddedRoute(true)
        }
        goHome &&
          (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME))
      }
      return userInfo
    },

    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!(this.getToken && this.getTimeout)) {
        this.logout(true)
        return null
      }

      if (new Date(this.getTimeout) < new Date()) {
        this.logout(true)
        return null
      }

      // const userInfo = await getUserInfo()
      const userInfo = {} as GetUserInfoModel //await getUserInfo();

      const data = decodeJwt(this.getToken)
      console.log('data: ', data)
      if (!data) {
        throw Error('Verification failed, please Login again.')
      }
      const { name, email } = data
      userInfo.username = name
      userInfo.realName = name
      userInfo.email = email
      // const { roles = [] } = userInfo
      const roles = data.Permission as Array<string>
      const dataRole =
        data['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      if (typeof dataRole == 'object') {
        data.profile.roles.forEach((element) => {
          roles.push(element)
          userInfo.roles.push(element)
        })
      } else {
        roles.push(dataRole)
      }
      // if (isArray(roles)) {
      //   const roleList = roles.map((item) => item.value) as RoleEnum[]
      //   this.setRoleList(roleList)
      // } else {
      //   userInfo.roles = []
      //   this.setRoleList([])
      // }
      this.setUserInfo(userInfo)
      return userInfo
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        await doLogout()
          .catch(() => {
            console.log('注销Token失败')
          })
          .finally(() => {
            this.setTimeout(undefined)
          })
      }
      this.setToken(undefined)
      this.setTimeout(undefined)
      this.setSessionTimeout(false)
      this.setUserInfo(null)
      goLogin && router.push(PageEnum.BASE_LOGIN)
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage()
      const { t } = useI18n()
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true)
        },
      })
    },
  },
})

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(pinia)
}
