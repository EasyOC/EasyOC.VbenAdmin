<template>
  <PageWrapper>
    <Amis v-model="amisjson" @amisMounted="amisMounted" @eventTrackerEvent="eventTrackerEvent" />
  </PageWrapper>
</template>
<script setup lang="ts">
import { computed, ref, onMounted, onBeforeMount } from 'vue'
import { Amis } from '@/components/Amis'
import { TrackerEventArgs } from '@/components/Amis/src/types'
import { excuteGraphqlQuery } from '@pkg/apis/eoc/graphqlApi'
import { useRouter } from 'vue-router'
import { PageWrapper } from '@/components/page'

const amisjson = ref<any>({})
const { currentRoute } = useRouter()
const amisScope = ref<any>()
onMounted(async () => { })

onBeforeMount(async () => {

  console.log('currentRoute', currentRoute.value)

  let id = currentRoute.value.meta.schemaId
  if (!id) {
    //用户浏览
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
    amisjson.value = JSON.parse(result.data.contentItem.schema)
  }
  else if (currentRoute.value.params.id) {
    //管理页面预览
    const versionId = currentRoute.value.params.id;
    const result = await excuteGraphqlQuery({
      query: `{
          contentItem:contentItemByVersion(contentItemVersionId: "${versionId}") {
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
  }
})


function eventTrackerEvent(tracker: TrackerEventArgs) {
  console.log('该信息来自于Vue事件监听：', tracker)
}


async function amisMounted(amisScoped) {
  console.log('amisScope: ', amisScoped);
  amisScope.value = amisScoped

}
</script>
