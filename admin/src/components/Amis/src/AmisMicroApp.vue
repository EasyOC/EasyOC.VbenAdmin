<template>
  <div>
    <!-- 
      name(必传)：应用名称
      url(必传)：应用地址，会被自动补全为http://localhost:3000/index.html
      baseroute(可选)：基座应用分配给子应用的基础路由，就是上面的 `/my-page`
    -->
    <micro-app
      name="amisViwer"
      :url="url"
      @created="handleCreate"
      @beforemount="handleBeforeMount"
      @mounted="handleMount"
      @unmount="handleUnmount"
      @error="handleError"
      @datachange="handleDataChange"
      keep-alive
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const microAppData = ref<any>({})
const url = ref(
  // window.location.origin + '/amisRenderer/render.html#/view/0?page=1',
  "http://localhost:3000/amisRenderer/render.html#/v/0?page=1"
)

function handleCreate(): void {
  console.log('child-vue3 创建了')
}
function handleBeforeMount(): void {
  console.log('child-vue3 即将被渲染')
}
function handleMount(): void {
  console.log('child-vue3 已经渲染完成')
  setTimeout(() => {
    // @ts-ignore
    this.microAppData = { msg: '来自基座的新数据' }
  }, 2000)
}
function handleUnmount(): void {
  console.log('child-vue3 卸载了')
}
function handleError(): void {
  console.log('child-vue3 加载出错了')
}
function handleDataChange(e: CustomEvent): void {
  console.log('来自子应用 child-vue3 的数据:', e.detail.data)
}
</script>
