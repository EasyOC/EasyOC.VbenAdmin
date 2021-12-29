import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const develop: AppRouteModule = {
  path: '/develop',
  name: 'Develop',
  component: LAYOUT,
  redirect: '/develop/type',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.develop.develop'),
  },
  children: [
    {
      path: 'type',
      name: 'Type',
      component: () => import('/@/views/develop/type/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.develop.type'),
      },
    },
  ],
};

export default develop;
