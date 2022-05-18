<template>
  <div className="amis-renderer-box">
    <AMIS ref="amisRender" :schema="amisjsonSchema" :trackerFn="eventTrackerEvent" :amisMounted="amisMounted" />
  </div>

</template>
<script lang="ts" >
// import './style/themes/cxd.less'

import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/css/v4-shims.css'
import 'amis/lib/themes/cxd.css';

import { applyReactInVue } from 'veaury'
// import { lazyReactInVue } from 'veaury'
// 这是一个React组件
//@ts-ignore
import AMISRendererComponent from './react/Renderer.tsx'
import { defineComponent, toRaw } from 'vue'
import { TrackerEventArgs } from './types'
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

    function amisMounted(amisScoped) {
      emit("amisMounted", amisScoped)
    }
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