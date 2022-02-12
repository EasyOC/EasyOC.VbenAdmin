<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
      </template>
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
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref, onBeforeMount } from 'vue'

import { BasicTable, useTable, TableAction } from '@/components/Table'
import { getMenuList } from '@service/system'

import { useDrawer } from '@/components/Drawer'
import MenuDrawer from './MenuDrawer.vue'

import { columns, searchFormSchema } from './menu.data'
import { ContentFieldsMappingDto } from '@service/api/app-service-proxies'
import { ContentHelper } from '@/api/contentHelper'
import {
  ContentItemUpperCase,
  deletContent,
  getContent,
} from '@service/eoc/contentApi'

export default defineComponent({
  name: 'MenuManagement',
  components: { BasicTable, MenuDrawer, TableAction },
  setup() {
    const typeName = 'VbenMenu'
    const contentFields = ref<ContentFieldsMappingDto[]>([])
    const contentItem = ref<ContentItemUpperCase>({ ContentType: typeName })
    const contentHelper = new ContentHelper()
    const [registerDrawer, { openDrawer }] = useDrawer()
    const [registerTable, { reload, expandAll }] = useTable({
      title: '菜单列表',
      api: getAllMenuList,
      columns,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
      },
      isTreeTable: true,
      pagination: false,
      striped: false,
      useSearchForm: true,
      showTableSetting: true,
      bordered: true,
      showIndexColumn: false,
      canResize: false,
      actionColumn: {
        width: 80,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
        fixed: undefined,
      },
    })
    onBeforeMount(async () => {
      contentFields.value = await contentHelper.getAllFields(typeName)
    })
    function handleCreate() {
      // const editModel = contentHelper.expandContentType(
      //   contentItem.value,
      //   contentFields.value,
      // )
      openDrawer(true, {
        // record: editModel,
        contentItem: contentItem.value,
        isUpdate: false,
        contentFields: contentFields.value,
      })
    }

    async function handleEdit(record: Recordable) {
      contentItem.value = await getContent(record.contentItemId)
      const editModel = contentHelper.expandContentType(
        contentItem.value,
        contentFields.value,
      )
      openDrawer(true, {
        record: editModel,
        contentItem: contentItem.value,
        isUpdate: true,
        contentFields: contentFields.value,
      })
    }

    async function handleDelete(record: Recordable) {
      await deletContent(record.contentItemId)
      reload()
    }

    function handleSuccess() {
      reload()
    }

    function onFetchSuccess() {
      // 演示默认展开所有表项
      nextTick(expandAll)
    }
    async function getAllMenuList() {
      return await getMenuList()
    }
    return {
      registerTable,
      getAllMenuList,
      registerDrawer,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSuccess,
      onFetchSuccess,
    }
  },
})
</script>
