<template>

  <Amis ref="amisRender" :amisjson="amisjson" @amisMounted="amisMounted" @eventTrackerEvent="eventTrackerEvent" />
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import {
  Amis,
  // AmisRenderer,
  // AMISRendererSetup,
  // AMISRenderer1,
} from '@/components/Amis'

  
// import VeauryAMISRenderer from '@/components/Amis/src/veauryAMISRenderer.vue'
import schema from './index.json'
import { TrackerEventArgs } from '@/components/Amis/src/types'
import { useGo } from '@/hooks/web/usePage'
// import { PageWrapper } from '@/components/Page'

const go = useGo()

// 页面左侧点击返回链接时的操作
function goBack() {
  // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
  go(route.meta.currentActiveMenu)
}
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
