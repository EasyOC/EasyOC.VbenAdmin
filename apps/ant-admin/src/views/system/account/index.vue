<template>

  <Amis ref="amisRender" v-model="amisjson" @amisMounted="amisMounted" @eventTrackerEvent="eventTrackerEvent" />
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import {
  Amis
} from '@/components/Amis'


// import VeauryAMISRenderer from '@/components/Amis/src/veauryAMISRenderer.vue'
import schema from './account.json'
import { TrackerEventArgs } from '@/components/Amis/src/types'


const amisjson = ref(schema)
onBeforeMount(() => {
 
}) 
function eventTrackerEvent(params: TrackerEventArgs) {
  console.log('该信息来自于Vue事件监听：', params)
 
}
let amisScoped
function amisMounted(amisScope) {
  amisScoped = amisScope
  console.log('amis 加载完成 ', amisScoped)
  // console.log(JSON.stringify(amisjson.value.raw))
}
</script>
