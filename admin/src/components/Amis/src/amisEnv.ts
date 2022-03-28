import { AxiosRequestConfig } from 'axios'
import { ocApi } from '@admin/service/request/index'
import { useGo } from '@/hooks/web/usePage'
import { router } from '@/router'
export default function getEnv() {
  return {
    enableAMISDebug: process.env.NODE_ENV !== 'production',
    //
    // 主题，默认是 default，还可以设置成 cxd, antd 或 dark，但记得引用它们的 css，比如 sdk 目录下的 cxd.css
    // theme: 'antd',
    theme: 'cxd',
    //https://baidu.gitee.io/amis/zh-CN/docs/start/getting-started#sdk
    // 下面是一些可选的外部控制函数
    // TODO 在 sdk 中可以不传，用来实现 ajax 请求，但在 npm 中这是必须提供的
    fetcher: async (config: any) => {
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
      console.log('go', to)
      // useGo(to)
      router.push(to)
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

    // //
    // // 用来实现用户行为跟踪，详细请查看左侧高级中的说明
    // tracker: (tracker: EventTrack, eventProps: any) => {
    //   console.log('eventTracker: ', tracker)
    //   console.log('eventProps: ', eventProps)
    //   emit('eventTrackerEvent', { tracker, eventProps })
    // },
  }
}
