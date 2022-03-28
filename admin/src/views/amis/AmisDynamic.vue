<template>
  <div>
    <Amis
      :amisjson="amisjson"
      @amisMounted="amisMounted"
      @eventTrackerEvent="eventTrackerEvent"
    />

    <MonacoEditor
      height="500"
      language="json"
      :value="amisjsonStr"
      @editorDidMount="editorDidMounted"
      @change="editorUpdated"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Amis } from '@/components/Amis'
import { TrackerEventArgs } from '@/components/Amis/src/types'
import { excuteGraphqlQuery } from '@service/eoc/GraphqlService'
import { useRouter } from 'vue-router'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
let monacoEditor = ref<any>({})
const amisjson = ref<any>({})
const amisjsonStr = computed({
  get: () => {
    return JSON.stringify(amisjson.value, null, '\t')
  },
  set: (value) => {
    amisjson.value = JSON.parse(value)
  },
})

function editorDidMounted(editor) {
  monacoEditor.value = editor
}
function editorUpdated(value) {
  amisjsonStr.value = value
  amisScoped.value.updateProps(amisjson.value)
}
const { currentRoute } = useRouter()
console.log('currentRoute', currentRoute.value)
onMounted(async () => {})

function eventTrackerEvent(tracker: TrackerEventArgs) {
  console.log('该信息来自于Vue事件监听：', tracker)
}

const amisScoped = ref<any>(null)
async function amisMounted(amisScope) {
  amisScoped.value = amisScope
  const pageName = currentRoute.value.params.pageName as string
  const result = await excuteGraphqlQuery({
    query: `{
    amisPageSchema: getAmisPageSchema(
      parameters: "{'name':'${pageName.toLowerCase()}'}") {
      schemaText:schema
    }
  }
      `,
  })
  if (!result?.data?.amisPageSchema) {
    console.log('page Not found')
  }
  amisjson.value = JSON.parse(result?.data?.amisPageSchema[0].schemaText)
  amisScoped.value.updateProps(amisjson.value)
  monacoEditor.value.getAction(['editor.action.formatDocument'])._run()
}
</script>
