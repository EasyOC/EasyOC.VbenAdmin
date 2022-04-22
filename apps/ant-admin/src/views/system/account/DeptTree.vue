<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
title="部门列表" toolbar search :clickRowToExpand="false" :expandedKeys="expandedKeys" :treeData="treeData"
      :fieldNames="{ key: 'id', title: 'deptName' }" @select="handleSelect" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { BasicTree, TreeItem } from '@/components/Tree'
import { getDeptList } from '@pkg/apis/system'
// import { TreeNodeBuilder } from '@/utils'
// import { listToTree } from '@pkg/utils'
const emit = defineEmits(['select']) 
const treeData = ref<TreeItem[]>([])
const expandedKeys = ref<string[]>([])

function handleSelect(keys) {
  emit('select', keys[0])
}

onMounted(async () => {
  const result = await getDeptList()
  try {
    console.log(result, 'TreeBuilderResult')
    treeData.value = result as unknown as TreeItem[]
    treeData.value
      .filter((x) => !x.parentId)
      .forEach((x) => {
        expandedKeys.value.push(x.id)
        if (x.children) {
          x.children.forEach((c) => {
            expandedKeys.value.push(c.id)
          })
        }
      })
  } catch (error) {
    console.log(error)
  }
})
// return { treeData, expandedKeys, handleSelect }
  // }
// })
</script>
