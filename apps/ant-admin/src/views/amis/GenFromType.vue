<template>
  <div>
    <a-row scoped>
      <a-col :span="11" style="margin:5px;">
        <a-card title="Schema" :bordered="false" size="small">
          <template #extra>
            <a-button size="small">预览</a-button>
          </template>
          <MonacoEditor :height="500" language="json" v-model="amisjsonStr" @editorDidMount="editorDidMounted"
            @change="editorUpdated" />
        </a-card>

      </a-col>
      <a-col :span="11" style="margin:5px;">
        <a-card title="字段映射" :bordered="false" size="small">
          <Amis ref="amisRender" v-model="builderJson" @amisMounted="amisMounted" v-model:amisScope="amisScope"
            @eventTrackerEvent="eventTrackerEvent" />
        </a-card>
      </a-col>
    </a-row>

  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watchEffect } from 'vue'
import { Amis } from '@/components/Amis'
import schema from './GenFromType.json'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import { TrackerEventArgs } from '../../components/Amis/src/types';

import buildCrud from './GenCrud'


const amisScope = ref<any>();

const builderJson = ref<any>(schema)

const amisjsonStr = ref<string>('')

function editorUpdated(value) {
  amisjsonStr.value = value
}
onBeforeMount(() => {
  //使用 JSON Handler 之类的工具 获取Json路径
  // set(amisjson.value, "body[0].columns[7].buttons[1].url", globConfig.amisEditorUrl + url);
  const service = builderJson.value.toolbar[0].dialog.body[0];
  service.dataProvider = (data, setData) => {
    watchEffect(() => {
      console.log("1111111")
      setData(
        {
          "status": 0,
          "msg": "",
          "data": JSON.parse(amisjsonStr.value)
        }
      )
    })
  }
})


onMounted(() => {
  // console.log(' amisScoped.value.getCompomentById: ',  amisScoped.value.getComponentById('u:4324e9e667ba'));

})

const monacoEditor = ref<any>({})
function editorDidMounted(editor) {
  monacoEditor.value = editor
  monacoEditor.value.getAction(['editor.action.formatDocument'])._run()
}
async function eventTrackerEvent(params: TrackerEventArgs) {  
  if (params?.tracker?.eventData?.id == "ftypeName" && params?.tracker?.eventType == "formItemChange" && params?.tracker?.eventData?.value) {

    const typeName = params?.tracker?.eventData?.value;
    amisjsonStr.value = await buildCrud(typeName);
    console.log('eventTrackerEvent:ftypeName ', params);
    const service = builderJson.value.toolbar[0].dialog.body[0];
    service.body = [JSON.parse(amisjsonStr.value)];
    if (amisScope.value) {
      console.log('amisScope.value: ', amisScope.value);
      amisScope.value.reload()
    }
  }
}


function amisMounted(amisScoped) {
  if (!amisScoped) {
    console.warn("amisMounted：amisScope is not ready", amisScope.value)
    return;
  }
  amisScope.value = amisScoped
  console.log('amisScoped: ', amisScoped);
  if (amisScoped.getComponentByName) {
    const svrPreview = amisScoped.getComponentByName('page1.svrPreview');
    console.log('svrPreview: ', svrPreview);

  }
}
</script>
