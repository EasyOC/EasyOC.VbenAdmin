<template>
  <div className="amis-renderer-box">
    <div ref="renderBox"></div>
  </div>
</template>

<script setup lang="ts">
// import copy from 'copy-to-clipboard'
import * as qs from 'qs'
import { ref, onMounted, unref } from 'vue'
import { toast, alert, confirm, render as renderSchema } from 'amis'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { useGo } from '@/hooks/web/usePage'
import getEnv from './amisEnv'

import 'amis/lib/helper.css'
import 'amis/sdk/iconfont.css'
// import 'amis/sdk/sdk.js'
// import './style/themes/antd.less'
import './style/themes/cxd.less'
import { RenderOptions } from 'amis/lib/factory'
const go = useGo()

const props = defineProps({
  schema: {
    type: Object,
    required: true,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: {},
  },
  updateLocation: {
    type: Function,
  },
  onAction: {
    type: Function,
  },
})
const VbenEnv = getEnv()
const env = ref<RenderOptions>({
  ...getEnv(), //, ...VbenEnv
})

const renderBox = ref(null)
onMounted(() => {
  console.log('try to render amis', props)
  const schema: any = unref(props).schema || {}
  ReactDOM.render(renderSchema(schema, {}, env.value), renderBox.value)
})

function initEnv(): RenderOptions {
  return {
    session: 'global',
    updateLocation: props.updateLocation || updateRoute,
    isCurrentUrl: (to) => {
      const link = normalizeLink(to)
      const location = window.location
      let pathname = link
      let search = ''
      const idx = link.indexOf('?')
      if (~idx) {
        pathname = link.substring(0, idx)
        search = link.substring(idx)
      }
      if (search) {
        if (pathname !== location.pathname || !location.search) {
          return false
        }
        const query = qs.parse(search.substring(1))
        const currentQuery = qs.parse(location.search.substring(1))
        return Object.keys(query).every(
          (key) => query[key] === currentQuery[key],
        )
      } else if (pathname === location.pathname) {
        return true
      }
      return false
    },
    fetcher: VbenEnv.fetcher,
    isCancel: (e) => axios.isCancel(e),
    alert,
    notify: (type, msg) => {
      toast[type]
        ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
        : console.warn('[Notify]', type, msg)
      console.log('[notify]', type, msg)
    },
    mobile: false,
    confirm,
    // copy: (contents, options = {}) => {
    //   const ret = copy(contents, options)
    //   ret &&
    //     (!options || options.shutup !== true) &&
    //     toast.info('内容已拷贝到剪切板')
    //   return ret
    // },
  }
}

function updateRoute(location, replace) {
  if (location === 'goBack') {
    return go(-1)
  }
  go(location)
}

// function handleAction(e, action) {
//   env.value.alert(`没有识别的动作：${JSON.stringify(action)}`)
// }

function normalizeLink(to) {
  if (/^\/api\//.test(to)) {
    return to
  }
  to = to || ''
  const location = window.location
  if (to && to[0] === '#') {
    to = location.pathname + location.search + to
  } else if (to && to[0] === '?') {
    to = location.pathname + to
  }
  const idx = to.indexOf('?')
  const idx2 = to.indexOf('#')
  let pathname = ~idx
    ? to.substring(0, idx)
    : ~idx2
    ? to.substring(0, idx2)
    : to
  const search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : ''
  const hash = ~idx2 ? to.substring(idx2) : ''
  if (!pathname) {
    pathname = location.pathname
  } else if (pathname[0] != '/' && !/^https?:\/\//.test(pathname)) {
    const relativeBase = location.pathname
    const paths = relativeBase.split('/')
    paths.pop()
    let m
    while ((m = /^\.\.?\//.exec(pathname))) {
      if (m[0] === '../') {
        paths.pop()
      }
      pathname = pathname.substring(m[0].length)
    }
    pathname = paths.concat(pathname).join('/')
  }
  return pathname + search + hash
}
</script>
