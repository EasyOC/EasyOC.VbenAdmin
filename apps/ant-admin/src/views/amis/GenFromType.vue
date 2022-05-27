<template>
  <Amis ref="amisRender" :amisjson="amisjson" @amisMounted="amisMounted" @eventTrackerEvent="eventTrackerEvent" />
</template>
<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { Amis } from '@/components/Amis'
import schema from './GenFromType.json'
import { useGo } from '@/hooks/web/usePage'

import { TrackerEventArgs } from '../../components/Amis/src/types';
import { useRouter } from 'vue-router'
import buildCrud from './GenCrud'
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
onMounted(() => {
  // console.log(' amisScoped.value.getCompomentById: ',  amisScoped.value.getComponentById('u:4324e9e667ba'));

})

const amisScoped = ref<any>();
async function eventTrackerEvent(params: TrackerEventArgs) {
  if (params?.tracker?.eventData?.id == "ftypeName" && params?.tracker?.eventType == "formItemChange" && params?.tracker?.eventData?.value) {

    const typeName = params?.tracker?.eventData?.value;
    const genCrudString = await buildCrud(typeName);
    // console.log('genCrudString: ', genCrudString);
    // console.log('genCrudString: ', genCrudString);

    // console.log('typeName: ', typeName);
    // const fields = await apiService.getFields(typeName);
    // const form = amisScoped.getComponentByName('page1.schemaForm');
    //   console.log('typeName: ', formModel);
    // const tempGraphqlStr = `query queryDepartment {
    //     ${typeName[0].toLowerCase() + typeName.slice(1)} ${fieldstoGraph(fields as any)}
    //    }`


    // amisjson.value.dialog.body = JSON.parse(tempGraphqlStr)
    console.log('amisScoped: ', amisScoped);
    const service = amisScoped.value.getComponentByName("page1").props.toolbar.find(o => o.id == "u:4324e9e667ba").dialog;
    // set(amisjson.value, "body[1].body[2].value", genCrudString)

    var schemaForm = amisScoped.value.getComponentByName("page1.schemaForm");
    console.log('schemaForm: ', schemaForm);
    if (schemaForm) {
      try {
        schemaForm.setValues({ schema: genCrudString })
      } catch (e) {
        console.log('e: ', e);
      }
      // schemaForm.load();
    }

    console.log('service: ', service);
    service.body = [JSON.parse(genCrudString)]



    //     const svrPreview = amisScope.getComponentByName('page1.service1');
    // console.log('svrPreview: ', svrPreview);

    // if (svrPreview) {
    //   svrPreview.setValue(`{ 
    //         "type": "tpl",
    //         "tpl": "内容aaaaaaaaaa",
    //         "inline": false
    //       }`)
    // }
  }
}
function amisMounted(amisScope) {

  console.log('gft-amisScoped.value: ', amisScope)
  if (!amisScope) {
    return;
  }
  amisScoped.value = amisScope;

  // amisScope.updateProps({
  //   data: { typeName: "Customer" }
  // }) 
  // 替代 amisScope.updateProps
  // amisjson.value.data = { typeName: "Customer" }

  // amisScope.getComponentByName("page1.firstForm").handleFormSubmit = (a, b, c) => console.log("1111111111111111111111111",a, b, c);

}
</script>
