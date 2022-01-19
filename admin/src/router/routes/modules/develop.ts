import { LAYOUT } from '@/router/constant'
import { t } from '@admin/locale'

const develop: RouteRecordItem = {
  path: '/develop',
  name: 'Develop',
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
  ],
}

export default develop
