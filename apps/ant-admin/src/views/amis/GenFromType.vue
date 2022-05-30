<template>
  <div>
    <a-row scoped>
      <a-col :span="11" style="margin:5px;">
        <a-card title="Schema" :bordered="false" size="small">
          <template #extra>
            <a-button size="small">预览</a-button>
          </template>

          <CodeEditor style="height:750px" v-model:value="builderJsonStr" mode="application/json" />
          <!-- <MonacoEditor :height="500" language="json" v-model="builderJsonStr" @editorDidMount="editorDidMounted"
            @change="editorUpdated" /> -->
        </a-card>

      </a-col>
      <a-col :span="11" style="margin:5px;">
        <Amis ref="amisRender" v-model="builderJson" @amisMounted="amisMounted" v-model:amisScope="amisScope"
          @eventTrackerEvent="eventTrackerEvent" />
      </a-col>
    </a-row>

  </div>
</template>
<script setup lang="ts" name="页面生成器">
import { onBeforeMount, onMounted, ref, watchEffect, onActivated, computed } from 'vue'
import { Amis } from '@/components/Amis'
import schema from './GenFromType.json'
import { CodeEditor } from '@/components/CodeEditor'
import { TrackerEventArgs } from '../../components/Amis/src/types';

import buildCrud from './GenCrud'

const amisScope = ref<any>();

const builderJson = ref<any>(schema)

const builderJsonStr = ref<string>('')
const previewService = builderJson.value.toolbar[0].dialog.body[0]


onBeforeMount(() => {
})
onMounted(() => {

})
watchEffect(() => {
  if (builderJsonStr.value) {
    try {
      previewService.body = JSON.parse(builderJsonStr.value);
    } catch (error) {
      console.error(error)
    }
  }
})

async function eventTrackerEvent(params: TrackerEventArgs) {
  if (params?.tracker?.eventData?.id == "ftypeName" &&
    params?.tracker?.eventType == "formItemChange" &&
    params?.tracker?.eventData?.value) {

    console.log('eventTrackerEvent:ftypeName ', params);
    const typeName = params?.tracker?.eventData?.value;
    builderJsonStr.value = await buildCrud(typeName);
    //试试watchEffect
    // service.body = [JSON.parse(builderJsonStr.value)];
    // if (amisScope.value) {
    //   console.log('amisScope.value: ', amisScope.value);
    //   // amisScope.value.reload()
    // }
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
