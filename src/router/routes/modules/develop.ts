import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const develop: AppRouteModule = {
  path: '/develop',
  name: 'Develop',
  component: LAYOUT,
  redirect: '/develop/contentType',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.develop.develop'),
  },
  children: [
    {
      path: 'contentType',
      name: 'contentType',
      component: () => import('/@/views/develop/contentType/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.develop.type'),
      },
    },
  ],
};

export default develop;
