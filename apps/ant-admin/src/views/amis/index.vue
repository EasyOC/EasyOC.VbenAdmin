<template>
  <div>
    <Amis ref="amisRender" :amisjson="amisjson" @amisMounted="amisMounted" @eventTrackerEvent="eventTrackerEvent" />
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import {
  Amis,
  // AmisRenderer,
  // AMISRendererSetup,
  // AMISRenderer1,
} from '@/components/Amis'
import schema from './schema.json'
import { TrackerEventArgs } from '@/components/Amis/src/types'
// import { getGlobalConfig } from '@/internal/config'
// import { set } from '@pkg/utils'
// const globConfig = getGlobalConfig();

// <AmisRenderer
//   ref="amisRender"
//   :amisjson="amisjson"
//   @amisMounted="amisMounted"
//   @eventTrackerEvent="eventTrackerEvent"
// />


const amisjson = ref<any>(schema)
onBeforeMount(() => {
  //使用 JSON Handler 之类的工具 获取Json路径
  // set(amisjson.value, "body[0].columns[7].buttons[1].url", globConfig.amisEditorUrl + url);

})
// function openInDesigner(event,props){
//   console.log(props,"aaaaa")
//   window.open(globConfig.amisEditorUrl +`index.html#/edit/${props.data.contentItemId}`)
//   return false;
// }
function eventTrackerEvent(params: TrackerEventArgs) {
  console.log('该信息来自于Vue事件监听：', params)
  // switch(params.tracker.eventData.id){
  //   case "btnOpenDesign":
  //     openInDesigner(params.eventProps)
  //     return false;
  // }
}
const amisScoped = ref<any>(null)
function amisMounted(amisScope) {
  amisScoped.value = amisScope
  console.log('amisScoped.value: ', amisScoped.value)
  // console.log(JSON.stringify(amisjson.value.raw))
}
</script>
