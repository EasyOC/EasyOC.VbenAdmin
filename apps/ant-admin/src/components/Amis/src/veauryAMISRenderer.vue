<template>
  <div className="amis-renderer-box">
    <AMIS ref="amisRender" :schema="amisjsonSchema" :trackerFn="eventTrackerEvent" :amisMounted="amisMounted" />
  </div>

</template>
<script lang="ts" >

import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/css/v4-shims.css'
import 'amis/lib/themes/cxd.css';
import './style/themes/cxd/fix.less'

import { applyReactInVue } from 'veaury'
// import { lazyReactInVue } from 'veaury'
// 这是一个React组件
//@ts-ignore
import AMISRendererComponent from './react_app/Renderer.jsx'
import { defineComponent, toRaw, onBeforeUnmount, unref } from 'vue'
import { TrackerEventArgs } from './types'
import { deepMerge } from '@pkg/utils';
export default defineComponent({
  name: 'VeauryAMISRenderer',
  components: {
    // 使用高阶组件 'applyReactInVue'
    AMIS: applyReactInVue(AMISRendererComponent)
    // AMIS: lazyReactInVue(() => import('./react/Renderer.tsx'))

  },
  props: {
    amisjson: {
      type: Object,
      required: true,
    },
  },
  emits: ['amisMounted', 'eventTrackerEvent'],
  setup(props, { emit }) {
    let _amisScoped: any;
    function amisMounted(amisScoped) {
      _amisScoped = amisScoped
      // if (_amisScoped && (!_amisScoped.updateProps)) {
      //   _amisScoped.updateProps = (attrs) => {
      //     // props.amisjson = deepMerge(unref(props).amisjson, { ...attrs })
      //     throw 'react 方式集成无法支持此方法， 请直接修改 amisjson 对象'
      //   }
      // }
      emit("amisMounted", amisScoped)
    }
    onBeforeUnmount(() => {
      if (_amisScoped?.unmount)
        _amisScoped.unmount()
    })
    function eventTrackerEvent(params: TrackerEventArgs) {
      emit("eventTrackerEvent", params)
    }
    return {
      amisMounted,
      eventTrackerEvent,
      amisjsonSchema: toRaw(props.amisjson),
    }
  }
})
</script>