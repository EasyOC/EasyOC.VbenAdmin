<template>
  <div className="amis-renderer-box">
    <div ref="rendererBox"></div>
  </div>
</template>
<script lang="ts" setup>
import 'amis/sdk/sdk.js'
import './style/themes/cxd.less'
import { onMounted, ref, unref, onUnmounted } from 'vue'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/css/v4-shims.css'
import { EventTrack } from 'amis/lib/types'
import { TrackerEventArgs } from './types'
import getEnv from './amisEnv'
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
const env = getEnv()
onMounted(() => {
  // @ts-ignore
  var amis = amisRequire('amis/embed')
  console.log(amis)

  amisScoped.value = amis.embed(
    rendererBox.value,
    // '#amis',
    // document.querySelector('#amis'),
    {
      // amis schema
      ...unref(props).amisjson,
    },
    {
      // 这里是初始 props
    },
    {
      ...env,
      // inVue: true,
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
</script>
