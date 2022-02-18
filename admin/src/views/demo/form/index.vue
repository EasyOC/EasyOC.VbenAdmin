<template>
  <div>
    <Amis :amisjson="amisjson" @amisMounted="amisMounted" />
    <!-- <CodeEditor @change="editorChange" v-model:value="editorJson" /> -->、
    <MonacoEditor
      v-model:value="editorJson"
      @change="editorChange"
      :height="500"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import { CodeEditor } from '@/components/CodeEditor'
import { Amis } from '@/components/Amis'
import { parser } from 'xijs'

const editorJson = ref<any>(`
    {
  "type": "form", 
  "api": {
    "method": "post",
    "url": "/connect/token",
    "dataType": "form-data",
    "replaceData": false,
    "data": {
      "grant_type": "password",
      "client_id": "vue_client_app",
      "scopes": "openid profile roles api permissions"
    }
  },
  "title": "常规模式",
  "mode": "normal",
  "body": [
    {
      "type": "input-text",
      "name": "username",
      "required": true,
      "placeholder": "请输入邮箱",
      "label": "邮箱",
      "size": "full"
    },
    {
      "type": "input-password",
      "name": "password",
      "label": "密码",
      "required": true,
      "placeholder": "请输入密码",
      "size": "full"
    },
    {
      "type": "checkbox",
      "name": "rememberMe",
      "label": "记住登录"
    },
    {
      "type": "submit",
      "label": "登录"
    }
  ]
}`)
// const editor = ref<any>(null)
const amisjson = computed(() => {
  return parser.parse(editorJson.value)
})
// function editorDidMount(loadedEditor) {
//   editor.value = loadedEditor
//   // try {
//   //   editor.value.setValue(editorJson.value)
//   // } catch (error) {}
// }
function editorChange(value) {
  editorJson.value = value
  amisScoped.value.updateProps(amisjson.value)
}
const amisScoped = ref<any>(null)
function amisMounted(amisScope) {
  amisScoped.value = amisScope
}
</script>
