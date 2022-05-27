<template>
  <div className="amis-renderer-box">
    <AMIS scoped ref="amisRender" :schema="amisjsonSchema" :trackerFn="eventTrackerEvent" :amisMounted="amisMounted" />
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
import { defineComponent, toRaw, onBeforeUnmount, unref, onActivated, ref, watchEffect, } from 'vue'
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
    modelValue: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    amisScope: {
      type: Object,
    },
  },
  emits: ['amisMounted', 'eventTrackerEvent', "update:amisScope"],
  setup(props, { emit }) {
    const _amisScoped = ref<any>();


    function amisMounted(amisScoped) {
      _amisScoped.value = amisScoped
      // if (_amisScoped.value && (!_amisScoped.value.updateProps)) {
      //   _amisScoped.value.updateProps = (attrs) => {
      //     _amisjsonSchema.value = deepMerge(unref(_amisjsonSchema), { ...attrs })
      //     throw 'react 方式集成无法支持此方法， 请直接修改 amisjson 对象'
      //   }
      // }
      emit("amisMounted", _amisScoped.value)
      console.log('amisMounted111: ', _amisScoped.value);
      emit("update:amisScope", _amisScoped.value)
    }


    function eventTrackerEvent(params: TrackerEventArgs) {
      console.log('AMIS Renderer eventTrackerEvent', params);
      console.log('AMIS Renderer eventTrackerEvent', _amisScoped.value);
      emit("amisMounted", _amisScoped.value)
      emit("eventTrackerEvent", params)
    }
    return {
      amisMounted,
      eventTrackerEvent,
      amisjsonSchema: toRaw(props.modelValue),
    }
  }
})

</script>