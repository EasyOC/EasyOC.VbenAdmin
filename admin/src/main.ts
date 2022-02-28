import 'ant-design-vue/dist/antd.less'
import '@/styles/index.less'
// Register icon sprite
import 'virtual:svg-icons-register'

import App from './App.vue'
import { initAdminModules } from './initAdminModules'
import { createApp } from 'vue'
import { initAppConfigStore } from '@/logics/initAppConfig'
import { router, setupRouter } from '@/router'
import { setupRouterGuard } from '@/router/guard'
import { pinia, registerGlobalComponents } from '@/internal'
import { setupI18n } from '@admin/locale'
import { registerGlobalDirective } from '@admin/directives'

const bootstrap = async () => {
  const app = createApp(App)

  app.use(pinia)

  // ! Need to pay attention to the timing of execution
  // ! 需要注意调用时机
  await initAdminModules()

  // Initialize internal system configuration
  initAppConfigStore()

  // Register global components
  registerGlobalComponents(app)

  // Multilingual configuration
  // Asynchronous case: language files may be obtained from the server side
  // 多语言配置
  // 异步情况：可以从服务端获取语言文件
  await setupI18n(app)

  // Configure routing
  setupRouter(app)

  // router-guard
  setupRouterGuard(router)

  // Register global directive
  registerGlobalDirective(app)

  await router.isReady()

  app.mount('#app')

  // When closing MOCK, Tree Shaking `mockjs` dep
  // 在关闭 MOCK 的时候, Tree Shaking `mockjs` 依赖
  if (__VITE_USE_MOCK__) {
    import('../mock/_createProductionServer').then(
      ({ setupProdMockServer }) => {
        setupProdMockServer()
      },
    )
  }
}

bootstrap()
