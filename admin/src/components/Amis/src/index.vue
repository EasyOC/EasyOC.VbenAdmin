<template>
  <div ref="rendererBox"></div>
</template>

<script lang="ts" setup>
import { ocApi } from '@admin/service/request'
// import { PageWrapper } from '@/components/Page'
import { onMounted, onUnmounted, ref, unref } from 'vue'

// import 'amis/lib/themes/default.css'
import 'amis/lib/helper.css'
import 'amis/sdk/iconfont.css'
import 'amis/lib/themes/cxd.css'
// import * as monaco from 'monaco-editor'
// import 'amis/lib/themes/cxd.css'
const props = defineProps({
  amisjson: {
    type: Object,
    required: true,
  },
})
const rendererBox = ref(null)

const emit = defineEmits(['amisMounted'])
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
      //
      // 主题，默认是 default，还可以设置成 cxd, antd 或 dark，但记得引用它们的 css，比如 sdk 目录下的 cxd.css
      // theme: 'antd',
      theme: 'cxd',
      //https://baidu.gitee.io/amis/zh-CN/docs/start/getting-started#sdk
      // 下面是一些可选的外部控制函数
      // TODO 在 sdk 中可以不传，用来实现 ajax 请求，但在 npm 中这是必须提供的
      fetcher: async (config) => {
        config.data = Object.assign({}, config.body)
        console.log('config ', config)
        return await ocApi.request(config)
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
      // responseAdaptor: (api, response, query, request) => {
      //   return response
      // },
      //
      // 用来接管页面跳转，比如用 location.href 或 window.open，或者自己实现 amis 配置更新
      jumpTo: (to) => {
        location.href = to
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
      tracker: (eventTracker) => {
        console.log('eventTracker: ', eventTracker)
      },
    },
  )
  emit('amisMounted', amisScoped.value)
})
onUnmounted(() => {
  amisScoped.value.unmount()
})
</script>
<style scoped lang="less">
// html {
//   font-size: 16px;
// }
@import './assets/css/global-class';

.app-wrapper,
.routes-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.navbtn {
  float: right;
  margin: 3px;
  visibility: visible;
}

.a-Tabs--line > .a-Tabs-links > li > a:first-child {
  margin-right: 30px;
}

.editor-header {
  position: relative;
  text-align: right;

  .navbar-brand {
    float: left !important;
  }

  > .editor-preview {
    display: inline-block;
    line-height: 50px;
    margin-right: 15px;
    color: #c1c4c9;
  }
}

.editor-header-btns {
  display: inline-block;
  white-space: nowrap;

  > .btn-item {
    user-select: none;
    cursor: pointer;
    display: inline-block;
    border-left: 1px solid #595c65;
    line-height: 50px;
    padding: 0 20px;
    color: #c1c4c9;

    > svg {
      display: inline-block;
      fill: #c1c4c9;
      width: 20px;
      position: relative;
      top: 4px;
    }

    &:hover {
      color: #fff;
      background-color: rgb(46, 50, 67);

      > svg {
        fill: #fff;
      }
    }

    &.disabled {
      color: #8b8e99;
      pointer-events: none;
      cursor: default;

      > svg {
        fill: #8b8e99;
      }
    }
  }
}

.ae-Editor.is-fixed .ae-Settings-inner .ae-Editor-config-tab > .tab-content,
.ae-Editor.is-fixed .ae-Settings-inner .ae-Editor-code-tab > .tab-content {
  bottom: 50px;
}

.editor-verions {
  max-height: 100%;
  overflow: auto;
}
</style>
