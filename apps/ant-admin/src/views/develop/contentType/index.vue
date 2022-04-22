<template>
  <div>
    <BasicTable @register="registerTable">
      <!-- <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增角色 </a-button>
      </template> -->
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <!-- <RoleDrawer @register="registerDrawer" @success="handleSuccess" /> -->
  </div>
</template>
<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue'

import { BasicTable, useTable, TableAction } from '@/components/table'
import { getAllTypes } from '@pkg/apis/develop'

import { useDrawer } from '@/components/drawer'
// import EditContentTypeDrawer from './EditContentTypeDrawer.vue'

import { columns, searchFormSchema } from './data'
// import {
//   ContentTypeListItemDto,
//   PagedResultOfContentTypeListItemDto,
// } from '@pkg/apis/eoc/app-service-proxies'

export default defineComponent({
  name: 'ContentType',
  // eslint-disable-next-line vue/no-unused-components
  components: {
    BasicTable, //EditContentTypeDrawer,
    TableAction,
  },
  setup() {
    // let allTypes = reactive<PagedResultOfContentTypeListItemDto>(
    //   new PagedResultOfContentTypeListItemDto(),
    // )
    onBeforeMount(async () => {
      // console.log(allTypes)
    })
    const [registerDrawer, { openDrawer }] = useDrawer()
    const [registerTable, { reload }] = useTable({
      title: '类型列表',
      api: getAllTypes,
      columns,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
      },
      useSearchForm: true,
      showTableSetting: true,
      bordered: true,
      showIndexColumn: false,
      actionColumn: {
        width: 80,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
        fixed: undefined,
      },
    })

    // async function filterTypes(params: {
    //   stereotype: string | undefined
    //   filter: string | undefined
    //   page: number | undefined
    //   pageSize: number | undefined
    // }) {
    //   if (!allTypes.items) {
    //     allTypes = await getAllTypes()
    //   }
    //   if (params.filter || params.stereotype) {
    //     let items = (allTypes.items as ContentTypeListItemDto[]).filter(
    //       (x) =>
    //         x.displayName?.includes(params.filter || '') ||
    //         x.name?.includes(params.filter || ''),
    //     )

    //     if (params.stereotype) {
    //       items = items.filter((x) => x.stereotype == params.stereotype)
    //     }
    //     return {
    //       items: items,
    //       total: allTypes.total,
    //     } as PagedResultOfContentTypeListItemDto
    //   } else {
    //     return allTypes
    //   }
    // }

    function handleCreate() {
      openDrawer(true, {
        isUpdate: false,
      })
    }

    function handleEdit(record: Recordable) {
      openDrawer(true, {
        record,
        isUpdate: true,
      })
    }

    function handleDelete(record: Recordable) {
      console.log(record)
    }

    function handleSuccess() {
      reload()
    }

    return {
      registerTable,
      registerDrawer,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSuccess,
      // filterTypes,
    }
  },
})
</script>
