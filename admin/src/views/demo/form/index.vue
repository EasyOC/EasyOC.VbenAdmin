<template>
  <Amis :amisjson="amisjson" @amisMounted="amisMounted" />
  <MonacoEditor
    @editorDidMount="editorDidMount"
    @change="editorChange"
    v-model:value="editorJson"
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import { Amis } from '@/components/Amis'
import { parser } from 'xijs'

const editorJson = ref<any>(`
    {
  "type": "page",
  "body": {
    "type": "form",
    "mode": "horizontal",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "debug": true,
    "body": [
      {
        "type": "input-date",
        "name": "date",
        "label": "日期"
      }
    ]
  }
}`)
const editor = ref<any>(null)
const amisjson = computed(() => {
  return parser.parse(editorJson.value)
})
function editorDidMount(loadedEditor) {
  editor.value = loadedEditor
  // try {
  //   editor.value.setValue(editorJson.value)
  // } catch (error) {}
}
function editorChange(value) {
  editorJson.value = value
}
const amisScoped = ref<any>({})
function amisMounted(amisScope) {
  amisScoped.value = amisScope
}
</script>
