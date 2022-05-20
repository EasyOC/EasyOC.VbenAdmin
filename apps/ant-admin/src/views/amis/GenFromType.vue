<template>
  <Amis ref="amisRender" :amisjson="amisjson" @amisMounted="amisMounted" @eventTrackerEvent="eventTrackerEvent" />
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Amis } from '@/components/Amis'
import schema from './GenFromType.json'
import { useGo } from '@/hooks/web/usePage'


import { ContentTypeManagementServiceProxy } from '@pkg/apis/eoc/app-service-proxies'

import { TrackerEventArgs } from '../../components/Amis/src/types';
import { useRouter } from 'vue-router'
import fieldstoGraph from './FieldstoGraph'
const { currentRoute } = useRouter()
const go = useGo()
const apiService = new ContentTypeManagementServiceProxy()

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
let amisScoped
async function eventTrackerEvent(params: TrackerEventArgs) {
  // console.log('data: ', data);
  // console.log('', params)
  // console.log('params?.tracker: ', params?.tracker);
  // console.log('params?.eventProps: ', params?.eventProps);
  if (params?.tracker?.eventData?.id == "ftypeName" && params?.tracker?.eventType == "formItemChange" && params?.tracker?.eventData?.value) {
    console.log('该信息来自于Vue事件监听： params: ', params);

    const typeName = params?.tracker?.eventData?.value;
    console.log('typeName: ', typeName);
    const fields = await apiService.getFields(typeName);
    // const form = amisScoped.getComponentByName('page1.schemaForm');
    //   console.log('typeName: ', formModel);
    const tempGraphqlStr = fieldstoGraph(fields as any)
    console.log('tempGraphqlStr: ', tempGraphqlStr);
    // form.setValues({schema:JSON.stringify(Fields)});
    // }
  }


}
function amisMounted(amisScope) {
  amisScoped = amisScope;
  console.log('gft-amisScoped.value: ', amisScope)
  if (!amisScope) {
    return;
  }
  // amisScope.updateProps({
  //   data: { typeName: "Customer" }
  // }) 
  // 替代 amisScope.updateProps
  amisjson.value.data = { typeName: "Customer" }

  // amisScope.getComponentByName("page1.firstForm").handleFormSubmit = (a, b, c) => console.log("1111111111111111111111111",a, b, c);
  const svrPreview = amisScope.getComponentByName('page1.service1');
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
