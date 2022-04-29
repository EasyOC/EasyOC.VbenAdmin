<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="[
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
        ]" />
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, onBeforeMount } from 'vue'
import { BasicTable, useTable, TableAction } from '@/components/table'
import { getMenuList } from '@pkg/apis/system'
import { useDrawer } from '@/components/drawer'
import MenuDrawer from './MenuDrawer.vue'
import { columns, searchFormSchema } from './menu.data'
import {
  // ContentFieldsMapping,
  getGPContentItem,
GpContentItem
} from '@pkg/apis/eoc/contentApi'
import { ContentTypeService } from '@/api/ContentTypeService'

export default defineComponent({
  name: 'MenuManagement',
  components: { BasicTable, MenuDrawer, TableAction },
  setup() {
    const typeName = 'VbenMenu'
    // const contentFields = ref<ContentFieldsMapping[]>([])
    // const contentItem = ref<ContentItemUpperCase>({ ContentType: typeName })
    const contentTypeService = new ContentTypeService(typeName)

    const [registerDrawer, { openDrawer }] = useDrawer()
    const [registerTable, { reload, expandAll }] = useTable({
      title: '菜单列表',
      api: getMenuList,
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
      // contentFields.value = await contentTypeService.getAllFields()
    })
    async function getDetails(contentItemId: string) {
      return await getGPContentItem(
        contentItemId,
        `... on VbenMenu {
          component
          createdUtc
          show
          orderNo
          icon
          routePath
          component
          permission
          status
          isExt
          keepalive
          show
          menuName
          menuType
          parentMenu {
            contentItemIds 
          }
        }`
      )
    }
    function handleCreate() {
      openDrawer(true, {
        record: new GpContentItem(typeName),
        isUpdate: false,
        // contentFields: contentFields.value,
      })
    }

    async function handleEdit(record: Recordable) {
      const contentItem = await getDetails(record.contentItemId)
      // const editModel = contentTypeService.expandContentType(contentItem.value)
      openDrawer(true, {
        record: contentItem,
        // contentItem: contentItem.value,
        isUpdate: true,
        // contentFields: contentFields.value,
      })
    }

    async function handleDelete(record: Recordable) {
      await contentTypeService.deleteContent(record.contentItemId)
      reload()
    }

    function handleSuccess() {
      reload()
    }

    function onFetchSuccess() {
      // 演示默认展开所有表项
      nextTick(expandAll)
    }

    return {
      registerTable,
      getMenuList,
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
