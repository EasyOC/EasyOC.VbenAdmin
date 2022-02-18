<template>
  <div>
    <a-button type="" @click="showCode" >显示代码</a-button>
    <a-button type="" @click="copyCode" >复制代码</a-button>
    <Amis :amisjson="amisjson" @amisMounted="amisMounted" />
    
    <a-drawer
      v-model:visible="codeVisible"
      size="large"
      title="代码"
      placement="right"
    >
      <CodeEditor @change="editorChange" v-model:value="editorJson" />
    </a-drawer>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
// import MonacoEditor from '@/components/MonacoEditor/index.vue'
import { CodeEditor } from '@/components/CodeEditor'
import { Amis } from '@/components/Amis'
import { parser } from 'xijs'

const editorJson = ref<any>(`
   {
  "type": "form",
  "title": "常规模式",
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
      "option": "记住登录",
      "value": false
    },
    {
      "type": "submit",
      "label": "登录"
    }
  ],
  "api": {
    "method": "post",
    "url": "/connect/token",
    "dataType": "form-data",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "replaceData": false,
    "data": {
      "grant_type": "password",
      "client_id": "vue_client_app",
      "scopes": "openid profile roles api permissions",
      "username": "`+'${username}'+`",
      "password": "`+'${password}'+`",
      "rememberMe": "`+'${rememberMe}'+`"
    }
  },
  "mode": "normal"
}`)
// const editor = ref<any>(null)
const amisjson = computed(() => {
  return parser.parse(editorJson.value)
})

let  codeVisible = ref(false);
function showCode() {
  codeVisible.value = true;
}

function copyCode() {
  const code = editorJson.value;

  const aux = document.createElement("input");
  // 获取复制内容
  const content = code;
  // 设置元素内容
  aux.setAttribute("value", content);
  // 将元素插入页面进行调用
  document.body.appendChild(aux);
  // 复制内容
  aux.select();
  // 将内容复制到剪贴板
  document.execCommand("copy");
  // 删除创建元素
  document.body.removeChild(aux);
}

// function editorDidMount(loadedEditor) {
//   editor.value = loadedEditor
//   // try {
//   //   editor.value.setValue(editorJson.value)
//   // } catch (error) {}
// }
function editorChange() {
  // editorJson.value = value
  // amisScoped.value.updateProps(amisjson.value)
}
const amisScoped = ref<any>(null)
function amisMounted(amisScope) {
  amisScoped.value = amisScope
}
</script>
