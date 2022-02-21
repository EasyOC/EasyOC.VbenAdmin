<template>
  <div>
    <a-button type @click="showCode" v-if="v1">显示代码</a-button>
    <a-button type @click="copyCode">复制代码</a-button>
    <Amis v-if="amitShow" :amisjson="amisjson" @amisMounted="amisMounted" />
    <Amis :amisjson="amisjson1" @amisMounted="amisMounted" />

    <a-drawer v-model:visible="codeVisible" size="large" title="代码" placement="right">
      <a-button size="small" @click="formatSchema" title="快捷键：shift+alt+f">格式化</a-button>
      <!-- <CodeEditor @change="editorChange" v-model:value="editorJson" /> -->
      <MonacoEditor v-model:value="editorJson" @change="editorChange" />
    </a-drawer>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
// import { CodeEditor } from '@/components/CodeEditor'
import { Amis } from '@/components/Amis'
import { parser } from 'xijs'
// window.enableAMISDebug = true
const editorJson = ref<any>(
  `
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
      "username": "` +
  '${username}' +
  `",
      "password": "` +
  '${password}' +
  `",
      "rememberMe": "` +
  '${rememberMe}' +
  `"
    }
  },
  "mode": "normal"
}`,
)
// const editor = ref<any>(null)
const amisjson = computed(() => {
  return parser.parse(editorJson.value)
})

const amisjson1 = computed(() => {
  return {
    type: 'button',
    label: '按钮',
    actionType: '',
    onClick: showV1(),
  }
})

const codeVisible = ref(false)
const v1 = ref(true)
function showCode() {
  codeVisible.value = true
}

function showV1() {
  v1.value = true
}

function copyCode() {
  const code = editorJson.value

  const aux = document.createElement('input')
  // 获取复制内容
  const content = code
  // 设置元素内容
  aux.setAttribute('value', content)
  // 将元素插入页面进行调用
  document.body.appendChild(aux)
  // 复制内容
  aux.select()
  // 将内容复制到剪贴板
  document.execCommand('copy')
  // 删除创建元素
  document.body.removeChild(aux)
}

// function editorDidMount(loadedEditor) {
//   editor.value = loadedEditor
//   // try {
//   //   editor.value.setValue(editorJson.value)
//   // } catch (error) {}
// }

const amitShow = ref(true)
function editorChange(value) {
  amitShow.value = false
  editorJson.value = value
  console.log('amisjson: ', amisjson.value)
  amisScoped.value.updateProps(amisjson.value)

  amitShow.value = true
}

function formatSchema() {
  // amisScoped?.value.getAction(['editor.action.formatDocument'])._run()
}

const amisScoped = ref<any>(null)
function amisMounted(amisScope) {
  amisScoped.value = amisScope
}
</script>
