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
let amisjson
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
  let id = currentRoute.value.meta.schemaId
  if (!id) {
    id = currentRoute.value.params.id;
  }
  if (id) {
    const result = await excuteGraphqlQuery({
      query: `{
          contentItem(contentItemId: "${id}") {
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
    amisjson = JSON.parse(result.data.contentItem.schema)
  }
})


function eventTrackerEvent(tracker: TrackerEventArgs) {
  console.log('该信息来自于Vue事件监听：', tracker)
}




function amisMounted(amisScope) {
  console.log('amisScope: ', amisScope);
 
  amisScope.updateProps(amisjson)

  // monacoEditor.value.getAction(['editor.action.formatDocument'])._run()
}
</script>
