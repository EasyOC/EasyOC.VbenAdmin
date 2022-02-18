import { LAYOUT } from '@/router/constant'
const IFrame = () => import('@/views/sys/iframe/FrameBlank.vue')
import { t } from '@admin/locale'

const amis: RouteRecordItem = {
  path: '/amis',
  name: 'Amis',
  component: LAYOUT,
  redirect: '/amis/amis',
  meta: {
    orderNo: 1000,
    icon: 'ion:tv-outline',
    title: t('routes.amis.amis'),
  },

  children: [
    {
      path: 'index',
      name: 'renderTest',
      component: () => import('@/views/amis/index.vue'),
      meta: {
        title: t('routes.amis.renderTest'),
      },
    },
    {
      path: 'index',
      name: 'amisPageList',
      component: IFrame,
      meta: {
        frameSrc: '/amis/index.html',
        title: t('routes.amis.Internal'),
      },
    },
    {
      path: window.location.origin + '/amis/index.html',
      name: 'amisEditor',
      component: IFrame,
      meta: {
        isLink: true,
        // hideMenu: true,
        title: t('routes.amis.amisEditor'),
      },
    },
  ],
}

export default amis
