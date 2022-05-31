// import { AxiosRequestConfig } from 'axios'
import { ocApi } from '@pkg/request'
// import { useGo } from '@/hooks/web/usePage'
import { useGo } from '@/hooks/web/usePage'
import { getGlobalConfig } from '@/internal'


// enum filterFieldOperator {
//   equal = 'equal',
//   not_equal = 'not_equal',
//   less = 'less',
//   less_or_equal = 'less_or_equal',
//   greater = 'greater',
//   greater_or_equal = 'greater_or_equal',
//   between = 'between',
//   not_between = 'not_between',
//   is_empty = 'is_empty',
//   is_not_empty = 'is_not_empty'
//   // 'equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between', 'is_empty', 'is_not_empty' 

// }

//@ts-ignore
window.amisExt = {
  convertCondition: function (condition) {

    console.log(condition, "convertCondition")
    let filterString = "";
    if(condition && condition.children && condition.children.length > 0){
      const children = condition.children;
      // if(condition.children.length == 1){
        // const child = children[0];
        // if(child.left&&child.op&&child.right){
        //   if(child.left&&child.left.field){
        //     const filter = { logic:condition.conjunction,field:child.left.field,operator:child.op,value:child.right };
        //     console.log('filter: ', filter);
        //     console.log('filter: ', JSON.stringify(filter));
        //     let filterStringJoin = '';
        //     for(const item in filter) { 
        //       if(filterStringJoin) {
        //         filterStringJoin = filterStringJoin+"," 
        //         } 
        //         if(item === "field" || item === "value")
        //         { 
        //           filterStringJoin = filterStringJoin + item + ':"' + filter[item]+'"' 
        //         } else { 
        //           filterStringJoin = filterStringJoin + item + ':' + filter[item]
        //         }
        //     }
        //     filterString = "{" + filterStringJoin + "}";
        //     //return JSON.stringify(filter)
        //   }
        // }
      // } else {
        
        console.log('children: ', children);
        filterString = "{" + "logic:" + condition.conjunction + "," + "filters:"+genGraphqlFilter(children)+"}";
        

        console.log(filterString, "filterString")
        //return JSON.stringify(condition)
      // }
    }

    if(filterString) {
      return filterString;

    } else {
      return JSON.stringify({})
    }
    
  }

}


function genGraphqlFilter(children) {
  const arr = children.map(child => {
    if(child.left&&child.left.field) {
      if(child.left&&child.op&&child.right) {
        const filter = { field:child.left.field,operator:child.op,value:child.right };
        let filterStringJoin = '';
        for(const item in filter) {
          if(filterStringJoin) {
            filterStringJoin = filterStringJoin+","
          }
          if(item === "field" || item === "value")
          {
            filterStringJoin = filterStringJoin + item + ':"' + filter[item]+'"'
          }
          else {
            filterStringJoin = filterStringJoin + item + ':' + filter[item]
          }
        }

        console.log('child: ', child);
        if(child.children && child.children.length > 0) {
          
        } else {
          return "{" + filterStringJoin + "}";
        }
      } else {
        return "{}";
      }
    } else if(child.children&&child.children.length>0){
      const genChilds = genGraphqlFilter(child.children)
      if(genChilds === "[]") {
        return "{}"
      } else {
        return "{" + "logic:" + child.conjunction + ",filters:" + genChilds + "}";
      }
    }else {
      return "{}";
    }
  }).filter(item => item !== "{}");

  console.log('arr: ', arr);
  if(arr.length > 0) {
    return "[" + arr.join(",") + "]";

  }else {
    return "[]";
  }
}





export default function getEnv() {
  const go = useGo()

  return {
    // enableAMISDebug: true,
    //
    // 主题，默认是 default，还可以设置成 cxd, antd 或 dark，但记得引用它们的 css，比如 sdk 目录下的 cxd.css
    // theme: 'antd',
    theme: 'cxd',
    //https://baidu.gitee.io/amis/zh-CN/docs/start/getting-started#sdk
    // 下面是一些可选的外部控制函数
    // TODO 在 sdk 中可以不传，用来实现 ajax 请求，但在 npm 中这是必须提供的
    fetcher: async (config: any) => {
      if (!config) {
        return { data: null }
      }
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
      const result = await ocApi.request(config)
      if (url?.toLowerCase().startsWith('/api/graphql')) {
        console.log('graphql result', result)
        const finalResult = {
          data: result.data.data,
          status: result.status == 200 ? 0 : result.status,
          msg: result.statusText,

        }
        console.log('global graphql Result', finalResult)
        return finalResult
      } else {
        console.log('global result ', result)
        const finalResult = {
          ...result,
          status: result.data.statusCode,
          data: result.data.data,
        }
        console.log('global Result', finalResult)
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
    jumpTo: (url, schema, data) => {
      console.log('to, schema, data: ', url, schema, data);
      url = url.toLocaleLowerCase()
      if (schema.blank || url.startsWith("http")) {
        const globConfig = getGlobalConfig();
        if (!url.startsWith("http"))
          if (!url.startsWith('/')) {
            url = '/' + url;
          }
        if (globConfig.amisEditorUrl?.endsWith('/')) {
          url = globConfig.amisEditorUrl.substring(0, globConfig.amisEditorUrl.length - 1) + url;
        } else {
          url = globConfig.amisEditorUrl + url;
        }
        window.open(url);
      } else {
        go(url)
      }
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
