<template>

  <Amis ref="amisRender" v-model="amisjson" @amisMounted="amisMounted" @eventTrackerEvent="eventTrackerEvent" />
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import {
  Amis
} from '@/components/Amis'
import schema from './dynamicIndex.json'
import { TrackerEventArgs } from '@/components/Amis/src/types'
import { get } from '@pkg/utils';



const amisjson = ref<any>(schema)
onBeforeMount(() => {

  // const indexEditor = get("body[1].body[1].tabs[1].body[0]", amisjson.value) as any
  // indexEditor.type = "textarea"

})
function eventTrackerEvent(params: TrackerEventArgs) {
  console.log('该信息来自于Vue事件监听：', params)
}
let amisScoped 
function amisMounted(amisScope) {
  amisScoped = amisScope
  console.log('amis 渲染完成', amisScoped)
}
</script>
