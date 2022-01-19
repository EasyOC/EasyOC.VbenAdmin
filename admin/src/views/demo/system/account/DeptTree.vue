<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      title="部门列表"
      toolbar
      search
      :clickRowToExpand="false"
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

    async function fetch() {
      const deptList = await getDeptList()
      // const nodeBuilder = new TreeNodeBuilder(
      //   deptList,
      //   (item) => {
      //     return !item.parentId
      //   },
      //   (parent, node) => {
      //     return node.parentId == parent.id
      //   },
      // )
      // const result = nodeBuilder.buildDataNode()

      const result = listToTree(deptList, { pid: 'parentId' })
      console.log(result, 'TreeBuilderResult')
      treeData.value = result as unknown as TreeItem[]
    }

    function handleSelect(keys) {
      emit('select', keys[0])
    }

    onMounted(() => {
      fetch()
    })
    return { treeData, handleSelect }
  },
})
</script>
