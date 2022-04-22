import { LAYOUT } from '@/router/constant'
import { t } from '@pkg/locale'

const develop: RouteRecordItem = {
  path: '/develop',
  name: 'develop',
  component: LAYOUT,
  redirect: '/develop/contentType',
  meta: {
    orderNo: 2001,
    icon: 'carbon:development',
    title: t('routes.develop.develop'),
  },
  children: [
    {
      path: 'contentType',
      name: 'contentType',
      component: () => import('@/views/develop/contentType/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.develop.type'),
      },
    },
    {
      path: 'listManagement',
      name: 'listManagement',
      component: () => import('@/views/develop/listManagement/index.vue'),
      meta: {
        title: t('routes.develop.listManagement'),
      },
    },
    {
      path: 'listDetails/:id?',
      name: 'ListDetails',
      meta: {
        hideMenu: true,
        title: t('routes.develop.listDetails'),
        ignoreKeepAlive: true,
        showMenu: false,
        currentActiveMenu: '/develop/listManagement',
      },
      component: () => import('@/views/develop/listManagement/ListDetails.vue'),
    },
  ],
}

export default develop
