import { getParentLayout, LAYOUT } from '@/router/constant'
import { RoleEnum } from '@admin/tokens'
import { t } from '@admin/locale'

const permission: RouteRecordItem = {
  path: '/permission',
  name: 'Permission',
  component: LAYOUT,
  redirect: '/permission/front/page',
  meta: {
    orderNo: 15,
    icon: 'ion:key-outline',
    title: t('routes.default.permission.permission'),
  },

  children: [
    {
      path: 'front',
      name: 'PermissionFrontDemo',
      component: getParentLayout(),
      meta: {
        title: t('routes.default.permission.front'),
      },
      children: [
        {
          path: 'page',
          name: 'FrontPageAuth',
          component: () => import('@/views/demo/permission/front/index.vue'),
          meta: {
            title: t('routes.default.permission.frontPage'),
          },
        },
        {
          path: 'btn',
          name: 'FrontBtnAuth',
          component: () => import('@/views/demo/permission/front/Btn.vue'),
          meta: {
            title: t('routes.default.permission.frontBtn'),
          },
        },
        {
          path: 'auth-pageA',
          name: 'FrontAuthPageA',
          component: () =>
            import('@/views/demo/permission/front/AuthPageA.vue'),
          meta: {
            title: t('routes.default.permission.frontTestA'),
            roles: [RoleEnum.SUPER],
          },
        },
        {
          path: 'auth-pageB',
          name: 'FrontAuthPageB',
          component: () =>
            import('@/views/demo/permission/front/AuthPageB.vue'),
          meta: {
            title: t('routes.default.permission.frontTestB'),
            roles: [RoleEnum.TEST],
          },
        },
      ],
    },
    {
      path: 'back',
      name: 'PermissionBackDemo',
      component: getParentLayout(),
      meta: {
        title: t('routes.default.permission.back'),
      },
      children: [
        {
          path: 'page',
          name: 'BackAuthPage',
          component: () => import('@/views/demo/permission/back/index.vue'),
          meta: {
            title: t('routes.default.permission.backPage'),
          },
        },
        {
          path: 'btn',
          name: 'BackAuthBtn',
          component: () => import('@/views/demo/permission/back/Btn.vue'),
          meta: {
            title: t('routes.default.permission.backBtn'),
          },
        },
      ],
    },
  ],
}

export default permission
