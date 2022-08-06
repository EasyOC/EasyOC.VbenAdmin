import { LAYOUT } from '@/router/constant'
import { t } from '@admin/locale'

const crm: RouteRecordItem = {
  path: '/crm',
  name: 'crm',
  component: LAYOUT,
  redirect: '/crm/customer',
  meta: {
    orderNo: 2001,
    icon: 'carbon:development',
    title: t('routes.crm.crm'),
  },
  children: [
    {
      path: 'customer',
      name: 'customer',
      component: () => import('@/views/CRM/Customer/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.crm.customer'),
      },
    },
  ],
}

export default crm
