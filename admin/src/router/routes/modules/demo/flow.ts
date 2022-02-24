import { LAYOUT } from '@/router/constant'
import { t } from '@admin/locale'

const charts: RouteRecordItem = {
  path: '/flow',
  name: 'FlowDemo',
  component: LAYOUT,
  redirect: '/flow/flowChart',
  meta: {
    orderNo: 5000,
    icon: 'tabler:chart-dots',
    title: t('routes.default.flow.name'),
  },
  children: [
    {
      path: 'flowChart',
      name: 'flowChartDemo',
      component: () => import('@/views/demo/comp/flow-chart/index.vue'),
      meta: {
        title: t('routes.default.flow.flowChart'),
      },
    },
  ],
}

export default charts
