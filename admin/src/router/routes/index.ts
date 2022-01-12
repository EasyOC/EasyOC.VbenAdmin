import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '@/router/routes/basic'

import { mainOutRoutes } from './mainOut'
import { PageEnum } from '@admin/tokens'
import { t } from '@admin/locale'

const modules = import.meta.globEager('./modules/**/*.ts')

const routeModuleList: RouteRecordItem[] = []

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList]

export const RootRoute: RouteRecordItem = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
}

export const LoginRoute: RouteRecordItem = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
}

// Basic routing without permission
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
]
