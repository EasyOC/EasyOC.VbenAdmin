<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      title="部门列表"
      toolbar
      search
      :clickRowToExpand="false"
      :expandedKeys="expandedKeys"
      :treeData="treeData"
      :fieldNames="{ key: 'id', title: 'deptName' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

import { BasicTree, TreeItem } from '@/components/Tree'
import { getDeptList } from '@service/system'
// import { TreeNodeBuilder } from '@/utils'
import { listToTree } from '@admin/utils/src/helper/tree'

export default defineComponent({
  name: 'DeptTree',
  components: { BasicTree },

  emits: ['select'],
  setup(_, { emit }) {
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
    return { treeData, expandedKeys, handleSelect }
  },
})
</script>
