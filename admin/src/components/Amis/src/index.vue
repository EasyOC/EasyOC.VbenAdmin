<template>
  <div id="box"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
console.log('ces ')
const props = defineProps({
  amisjson: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['amisMounted'])
const amisScoped = ref<any>(null)
onMounted(() => {
  // @ts-ignore
  var amis = amisRequire('amis/embed')
  console.log(amis)

  amisScoped.value = amis.embed(
    '#box',
    {
      // amis schema
      ...props.amisjson,
    },
    {
      // 这里是初始 props
    },
    {
      theme: 'antd',
    },
  )
  emit('amisMounted', amisScoped.value)
})
onUnmounted(() => {
  amisScoped.value.unmount()
})
</script>
