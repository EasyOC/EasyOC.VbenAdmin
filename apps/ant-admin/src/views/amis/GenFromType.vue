<template>
  <Amis ref="amisRender" :amisjson="amisjson" @amisMounted="amisMounted" @eventTrackerEvent="eventTrackerEvent" />
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Amis } from '@/components/Amis'
import schema from './GenFromType.json'
import { TrackerEventArgs } from '@/components/Amis/src/types'
import { useGo } from '@/hooks/web/usePage'

import { ContentTypeManagementServiceProxy } from '@pkg/apis/eoc/app-service-proxies'

const go = useGo()
const apiService = new ContentTypeManagementServiceProxy()

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
async function eventTrackerEvent(params: TrackerEventArgs) {
  console.log('该信息来自于Vue事件监听：', params)
    console.log('params?.tracker: ', params?.tracker.eventData?.id);
    console.log('params?.eventProps?: ', params?.eventProps);
  if(params?.tracker?.eventData?.id == "typeName" && params?.tracker?.eventType =="formItemChange" && params?.eventProps?.data?.typeName){
    const typeName = params.eventProps.data.typeName;
    console.log('typeName: ', typeName);
    const Fields = await apiService.getFields(typeName);
    const form = amisScoped.value.getComponentByName('page.svrPreview');
    console.log('form: ', form);
    console.log('Fields: ', Fields);
    form.setValue(JSON.stringify(Fields));
  }

}
const amisScoped = ref<any>(null)
function amisMounted(amisScope) {
  amisScoped.value = amisScope
  console.log('amisScoped.value: ', amisScoped.value)
  const svrPreview = amisScope.getComponentByName('page.svrPreview');
  console.log('svrPreview: ', svrPreview);
  svrPreview.setValue(`{
    
          "type": "tpl",
          "tpl": "内容aaaaaaaaaa",
          "inline": false
        }`)
  // console.log(JSON.stringify(amisjson.value.raw))
}
</script>
