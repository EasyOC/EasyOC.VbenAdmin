<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">添加客户</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑客户资料',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除此客户',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <!-- <EditModal @register="registerModal" /> -->
  </PageWrapper>
</template>
<script setup lang="ts">
import { reactive, onBeforeMount, ref } from 'vue'

import { BasicTable, useTable, TableAction } from '@/components/Table'
import { PageWrapper } from '@/components/Page'
// import DeptTree from './DeptTree.vue'
import { useModal } from '@/components/Modal'
import EditModal from './EditModal.vue'
import { BasicColumn } from '@/components/Table'

import { searchFormSchema } from './data'
// import { useGo } from '@/hooks/web/usePage'
import { ContentTypeService } from '@/api/ContentTypeService'
import VbenListService, { VbenListConfigModel } from '@/api/VbenListService'
import {
  ContentFieldsMapping,
  ContentItemUpperCase,
} from '@pkg/apis/eoc/contentApi'

// import { useQuery } from '@urql/vue'
// const go = useGo()
const typeName = 'Customer'
const dynamicColumns = ref<BasicColumn[]>([])
const vbenListService = new VbenListService('CustomerList')
const listConfig = ref<VbenListConfigModel>({} as VbenListConfigModel)
const typeFields = ref<ContentFieldsMapping[]>([])
const contentItem = ref<ContentItemUpperCase>({ ContentType: typeName })
const contentTypeService = new ContentTypeService(typeName)
onBeforeMount(async () => {
  listConfig.value = await vbenListService.getListConfig()
  dynamicColumns.value.push(...JSON.parse(listConfig.value.listMapping))
  setProps({
    columns: dynamicColumns.value,
    api: getListData,
    pagination: listConfig.value.enablePage,
    showTableSetting: true,
  })
  reload()
  typeFields.value = await contentTypeService.getAllFields()
})

async function getListData(params) {
  return await vbenListService.getListData(params)
}
// const [registerModal, { openModal }] = useModal()
const searchInfo = reactive<Recordable>({})

const [registerTable, { setProps, reload }] = useTable({
  title: '客户列表',
  rowKey: 'contentItemId',
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
    autoSubmitOnEnter: true,
  },
  useSearchForm: true,
  pagination: true,
  bordered: true,
  handleSearchInfoFn(info) {
    return info
  },
  actionColumn: {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
})

function handleCreate() {
  // openModal(true, {
  //   isUpdate: false,
  //   contentTypeService,
  //   contentItem: contentItem.value,
  //   typeFields: typeFields.value,
  // })
}

async function handleEdit(record: Recordable) {
  // console.log(record)
  // contentItem.value = await contentTypeService.getContent(record.contentItemId)
  // const editModel = contentTypeService.expandContentType(contentItem.value)
  // openModal(true, {
  //   record: editModel,
  //   contentTypeService,
  //   isUpdate: true,
  //   typeFields: typeFields.value,
  // })
}

async function handleDelete(record: Recordable) {
  await contentTypeService.deleteContent(record.contentItemId)
}

// function handleView(record: Recordable) {
//   go('/system/account_detail/' + record.id)
// }
</script>
