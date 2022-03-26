<template>
  <div className="amis-renderer-box">
    <div ref="rendererBox"></div>
  </div>
</template>
<script lang="ts" setup>
import 'amis/sdk/sdk.js'
// import './style/themes/antd.less'
import './style/themes/cxd.less'
import { ocApi } from '@admin/service/request/index'
import { onMounted, ref, unref, onUnmounted } from 'vue'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/css/v4-shims.css'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
// import 'amis/lib/themes/default.css'
// import 'amis/lib/themes/antd.css'
import 'monaco-editor'
import { useGo } from '@/hooks/web/usePage'
import { EventTrack } from 'amis/lib/types'
import { TrackerEventArgs } from './AmisTypes'
// import 'amis/lib/themes/cxd.css'
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

// ;(self as any).MonacoEnvironment = {
//   getWorker(_, label) {
//     if (label === 'json') {
//       return new jsonWorker()
//     }
//     if (label === 'css' || label === 'scss' || label === 'less') {
//       return new cssWorker()
//     }
//     if (label === 'html' || label === 'handlebars' || label === 'razor') {
//       return new htmlWorker()
//     }
//     if (label === 'typescript' || label === 'javascript') {
//       return new tsWorker()
//     }
//     return new editorWorker()
//   },
// }

const props = defineProps({
  amisjson: {
    type: Object,
    required: true,
  },
})
const rendererBox = ref(null)
const emit = defineEmits<{
  (e: 'amisMounted', value: any): void
  (e: 'eventTrackerEvent', value: TrackerEventArgs): void
}>()
const amisScoped = ref<any>(null)
onMounted(() => {
  // @ts-ignore
  var amis = amisRequire('amis/embed')
  console.log(amis)

  amisScoped.value = amis.embed(
    rendererBox.value,
    {
      // amis schema
      ...unref(props).amisjson,
    },
    {
      // 这里是初始 props
    },
    {
      enableAMISDebug: process.env.NODE_ENV !== 'production',
      //
      // 主题，默认是 default，还可以设置成 cxd, antd 或 dark，但记得引用它们的 css，比如 sdk 目录下的 cxd.css
      // theme: 'antd',
      theme: 'cxd',
      //https://baidu.gitee.io/amis/zh-CN/docs/start/getting-started#sdk
      // 下面是一些可选的外部控制函数
      // TODO 在 sdk 中可以不传，用来实现 ajax 请求，但在 npm 中这是必须提供的
      fetcher: async (config: AxiosRequestConfig) => {
        console.log('config: ', config)
        const { url, method, data } = config
        console.log('url: ', url)
        config = config || {}
        config.headers = config.headers || {}
        config.timeout = 10 * 1000
        if (method !== 'post' && method !== 'put' && method !== 'patch') {
          if (data) {
            config.params = data
          }
          // return axiosInstance.request({url,method,data });
        } else if (data && data instanceof FormData) {
          config.headers = config.headers || {}
          config.headers['Content-Type'] = 'multipart/form-data'
        } else if (
          data &&
          typeof data !== 'string' &&
          !(data instanceof Blob) &&
          !(data instanceof ArrayBuffer)
        ) {
          config.data = JSON.stringify(data)
          config.headers['Content-Type'] = 'application/json'
        }
        console.log('configconfigconfigconfig: ', config)
        if (!config.url?.startsWith('/')) {
          config.url = '/' + config.url
        }
        if (url?.toLowerCase().startsWith('/api/graphql')) {
          const result = await ocApi.request(config)
          console.log('graphql result', result)
          const finalResult = {
            data: result.data.data,
            status: result.status == 200 ? 0 : result.status,
            msg: result.statusText,
          }
          console.log('graphql finalResult', finalResult)
          return finalResult
        } else {
          const result = await ocApi.request(config)
          console.log('defaultRequest result ', result)
          const finalResult = {
            data: result.data,
            ...result,
          }
          console.log('defaultRequest finalResult', finalResult)
          return finalResult
        }
      },
      // 全局 api 请求适配器
      // 另外在 amis 配置项中的 api 也可以配置适配器，针对某个特定接口单独处理。
      //TODO
      requestAdaptor(api) {
        return api
      },
      //
      // 全局 api 适配器。
      // 另外在 amis 配置项中的 api 也可以配置适配器，针对某个特定接口单独处理。
      adaptor: (payload, response, api) => {
        console.log('adaptoradaptoradaptor', response)
        return response.data
      },
      //
      // 用来接管页面跳转，比如用 location.href 或 window.open，或者自己实现 amis 配置更新
      jumpTo: (to) => {
        useGo(to)
      },
      //
      // 用来实现地址栏更新
      updateLocation: (to, replace) => {
        console.log('to, replace: ', to, replace)
      },
      //
      // 用来判断是否目标地址当前地址。
      // isCurrentUrl: url => {},
      //
      // 用来实现复制到剪切板
      // copy: content => {},
      //
      // 用来实现通知
      notify: (type, msg) => {
        console.log('type, msg: ', type, msg)
      },

      //
      // 用来实现提示
      alert: (content) => {
        console.log('content: ', content)
      },

      //
      // 用来实现确认框。
      // confirm: (content) => {
      //   console.log('content: ', content)
      //   return window.confirm(content)
      // },

      //
      // 用来实现用户行为跟踪，详细请查看左侧高级中的说明
      tracker: (tracker: EventTrack, eventProps: any) => {
        console.log('eventTracker: ', tracker)
        console.log('eventProps: ', eventProps)
        emit('eventTrackerEvent', { tracker, eventProps })
      },
    },
  )
  emit('amisMounted', amisScoped.value)
})
onUnmounted(() => {
  amisScoped.value.unmount()
})
// import './style/themes/antd.less'
// import './style/themes/cxd.less'
// import './style/themes/ang.less'
// import './style/themes/dark.less'
// import './style/themes/default.less'
</script>
<style lang="less" scoped>
// @import './style/themes/antd_var.less';
</style>
<!--<style scoped lang="less" src="./style/themes/antd.less"></style> -->
