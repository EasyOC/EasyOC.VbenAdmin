<template>
  <div>
    <Amis :amisjson="amisjson" @amisMounted="amisMounted" />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Amis } from '@/components/Amis'
import schema from './schema.json'
// import { parser } from 'xijs'
// window.enableAMISDebug = true
// const editorJson = ref<any>()
// const editor = ref<any>(null)

const amisjson = ref<any>(schema)

const amisScoped = ref<any>(null)
function amisMounted(amisScope) {
  amisScoped.value = amisScope
  console.log('amisScoped.value: ', amisScoped.value)
  console.log(JSON.stringify(amisjson.value.raw))
}
</script>
