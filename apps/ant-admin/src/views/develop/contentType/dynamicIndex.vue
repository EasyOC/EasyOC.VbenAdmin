<template>
  <div>
    <Amis ref="amisRender" :amisjson="amisjson" @amisMounted="amisMounted" @eventTrackerEvent="eventTrackerEvent" />
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import {
  Amis
} from '@/components/Amis'
import schema from './dynamicIndex.json'
import { TrackerEventArgs } from '@/components/Amis/src/types' 


const amisjson = ref<any>(schema)
onBeforeMount(() => {
  
})
function eventTrackerEvent(params: TrackerEventArgs) {
  console.log('该信息来自于Vue事件监听：', params)
}
const amisScoped = ref<any>(null)
function amisMounted(amisScope) {
  amisScoped.value = amisScope
  console.log('amisScoped.value: ', amisScoped.value)
}
</script>
