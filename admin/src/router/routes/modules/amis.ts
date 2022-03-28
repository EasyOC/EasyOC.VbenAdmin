import { LAYOUT } from '@/router/constant'
const IFrame = () => import('@/views/sys/iframe/FrameBlank.vue')
import { t } from '@admin/locale'

const amis: RouteRecordItem = {
  path: '/amis',
  name: 'Amis',
  component: LAYOUT,
  redirect: '/amis/index',
  meta: {
    orderNo: 1000,
    icon: 'ion:tv-outline',
    title: t('routes.amis.amis'),
  },

  children: [
    {
      path: 'index',
      name: 'amisPageList',
      component: () => import('@/views/amis/index.vue'),
      meta: {
        title: t('routes.amis.amisPageList'),
      },
    },
    {
      path: 'adv/:pageName?',
      name: 'AmisDynamicSchema',
      component: () => import('@/views/amis/AmisDynamic.vue'),
      meta: {
        hideMenu: true,
        title: t('routes.amis.AmisPreview'),
      },
    },
    // 暂不启用 ，hash 路由无法跳转 ，可能需要重写 Amis 编辑器项目的 路由功能
    // {
    //   path: 'InternalEditor/:id',
    //   name: 'amisInternalEditor',
    //   component: IFrame,
    //   meta: {
    //     frameSrc: '/amis-editor-renderer/index.html#/edit/',
    //     title: t('routes.amis.Internal'),
    //   },
    // },
    // {
    //   path: window.location.origin + '/amis-editor-renderer/index.html',
    //   name: 'amisEditor',
    //   component: IFrame,
    //   meta: {
    //     isLink: true,
    //     // hideMenu: true,
    //     title: t('routes.amis.amisEditor'),
    //   },
    // },
    {
      path: 'Editor',
      name: 'Editor',
      component: () => import('@/views/amis/Editor.vue'),
      meta: {
        isLink: true,
        hideMenu: true,
        title: t('routes.amis.amisIndex'),
      },
    },
  ],
}

export default amis
