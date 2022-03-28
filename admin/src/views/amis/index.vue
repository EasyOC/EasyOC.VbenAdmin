<template>
  <div>
    <Amis
      ref="amisRender"
      :amisjson="amisjson"
      @amisMounted="amisMounted"
      @eventTrackerEvent="eventTrackerEvent"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Amis, AmisRenderer } from '@/components/Amis'
import schema from './schema.json'
import { TrackerEventArgs } from '@/components/Amis/src/types'
// import { parser } from 'xijs'
// window.enableAMISDebug = true
// const editorJson = ref<any>()
// const editor = ref<any>(null)

const amisjson = ref<any>(schema)
function eventTrackerEvent(tracker: TrackerEventArgs) {
  console.log('该信息来自于Vue事件监听：', tracker)
}
const amisScoped = ref<any>(null)
function amisMounted(amisScope) {
  amisScoped.value = amisScope
  console.log('amisScoped.value: ', amisScoped.value)
  console.log(JSON.stringify(amisjson.value.raw))
}
</script>
