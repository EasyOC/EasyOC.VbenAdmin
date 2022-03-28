<template>
  <div>
    <Amis
      :amisjson="amisjson"
      @amisMounted="amisMounted"
      @eventTrackerEvent="eventTrackerEvent"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onBeforeMount } from 'vue'
import { Amis } from '@/components/Amis'
import { TrackerEventArgs } from '@/components/Amis/src/types'
import { excuteGraphqlQuery } from '@service/eoc/GraphqlService'
import { useRouter } from 'vue-router'

const { currentRoute } = useRouter()
console.log('currentRoute', currentRoute.value)
const amisjson = ref<any>({})
onBeforeMount(async () => {
  const result = await excuteGraphqlQuery({
    query: `{
    amisPageSchema: getAmisPageSchema(
      parameters: "{'name':'${currentRoute.value.params.pageName}'}") {
      schemaText:amisSchema_Schema
    }
  }
      `,
  })
  if (!result?.data?.amisPageSchema) {
    console.log('page Not found')
  }
  amisjson.value = JSON.parse(result?.data?.amisPageSchema[0].schemaText)
  console.log('amisjson.value: ', amisjson.value)
})
function eventTrackerEvent(tracker: TrackerEventArgs) {
  console.log('该信息来自于Vue事件监听：', tracker)
}

const amisScoped = ref<any>(null)
function amisMounted(amisScope) {
  amisScoped.value = amisScope
  console.log('amisScoped.value: ', amisScoped.value)
  console.log(JSON.stringify(amisjson.value.raw))
  // amisScoped.value.updateProps(amisjson.value, () => {
  //   console.log('更新完成')
  // })
}
</script>
