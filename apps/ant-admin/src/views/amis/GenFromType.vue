<template>
  <Amis ref="amisRender" :amisjson="amisjson" @amisMounted="amisMounted" @eventTrackerEvent="eventTrackerEvent" />
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import {
  Amis,
} from '@/components/Amis'
import schema from './GenFromType.json'
import { TrackerEventArgs } from '@/components/Amis/src/types'
import { useGo } from '@/hooks/web/usePage'

const go = useGo()

// 页面左侧点击返回链接时的操作
function goBack() {
  // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
  go(route.meta.currentActiveMenu)
}

const amisjson = ref<any>(schema)
onBeforeMount(() => {
  //使用 JSON Handler 之类的工具 获取Json路径
  // set(amisjson.value, "body[0].columns[7].buttons[1].url", globConfig.amisEditorUrl + url);

})
function eventTrackerEvent(params: TrackerEventArgs) {
  console.log('该信息来自于Vue事件监听：', params)

}
const amisScoped = ref<any>(null)
function amisMounted(amisScope) {
  amisScoped.value = amisScope
  console.log('amisScoped.value: ', amisScoped.value)
  // console.log(JSON.stringify(amisjson.value.raw))
}
</script>
