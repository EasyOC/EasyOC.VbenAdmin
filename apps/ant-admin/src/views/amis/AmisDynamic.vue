<template>
    <Amis :amisjson="amisjson" @amisMounted="amisMounted" @eventTrackerEvent="eventTrackerEvent" />


</template>
<script setup lang="ts">
import { computed, ref, onMounted, onBeforeMount } from 'vue'
import { Amis } from '@/components/Amis'
import { TrackerEventArgs } from '@/components/Amis/src/types'
import { excuteGraphqlQuery } from '@pkg/apis/eoc/graphqlApi'
import { useRouter } from 'vue-router'
import { PageWrapper } from '@/components/Page'

// import MonacoEditor from '@/components/MonacoEditor/index.vue'
// let monacoEditor = ref<any>({})
const amisjson = ref<any>({})
// const amisjsonStr = computed({
//   get: () => {
//     return JSON.stringify(amisjson.value, null, '\t')
//   },
//   set: (value) => {
//     amisjson.value = JSON.parse(value)
//   },
// })
const { currentRoute } = useRouter()
onMounted(async () => { })

// const schemaId = ref<string>('')
onBeforeMount(async () => {
  console.log('currentRoute', currentRoute.value)

})
 

function eventTrackerEvent(tracker: TrackerEventArgs) {
  console.log('该信息来自于Vue事件监听：', tracker)
}




const amisScoped = ref<any>(null)
async function amisMounted(amisScope) {
  amisScoped.value = amisScope
  if (currentRoute.value.meta.schemaId) {
    const result = await excuteGraphqlQuery({
      query: `{
          contentItem(contentItemId: "${currentRoute.value.meta.schemaId}") {
            ... on AmisSchema {
              displayText
              createdUtc
              description
              schema
              name
            }
          }
        }`
    })
    amisjson.value = JSON.parse(result.data.contentItem.schema)
    amisScoped.value.updateProps(amisjson.value)
  }

  // monacoEditor.value.getAction(['editor.action.formatDocument'])._run()
}
</script>
