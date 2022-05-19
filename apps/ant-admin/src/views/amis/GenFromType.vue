<template>
  <Amis ref="amisRender" :amisjson="amisjson" @amisMounted="amisMounted" @eventTrackerEvent="eventTrackerEvent" />
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Amis } from '@/components/Amis'
import schema from './GenFromType.json'
import { useGo } from '@/hooks/web/usePage'
import { useRouter } from 'vue-router'

import { TrackerEventArgs } from '../../components/Amis/src/types';
const { currentRoute } = useRouter()
const go = useGo()

// 页面左侧点击返回链接时的操作
function goBack() {
  // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
  go(currentRoute.value.meta.currentActiveMenu)
}

const amisjson = ref(schema)
onBeforeMount(() => {
  //使用 JSON Handler 之类的工具 获取Json路径
  // set(amisjson.value, "body[0].columns[7].buttons[1].url", globConfig.amisEditorUrl + url);

})
function eventTrackerEvent(params: TrackerEventArgs) {
  console.log('该信息来自于Vue事件监听：', params)

}
function amisMounted(amisScope) {
  console.log('gft-amisScoped.value: ', amisScope)
  if (!amisScope) {
    return;
  }
  // amisScope.updateProps({
  //   data: { typeName: "Customer" }
  // }) 
  // 替代 amisScope.updateProps
  amisjson.value.data = { typeName: "Customer" }

  const svrPreview = amisScope.getComponentByName('page1.svrPreview');
  console.log('svrPreview: ', svrPreview);
  // amisjson.data = { typeName: "Customer" }
  if (svrPreview) {
    svrPreview.setValue(`{ 
          "type": "tpl",
          "tpl": "内容aaaaaaaaaa",
          "inline": false
        }`)
  }
}
</script>
