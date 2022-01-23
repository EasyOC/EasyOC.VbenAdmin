<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <!-- <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" /> -->
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">添加客户</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看用户详情',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑用户资料',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除此账号',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <!-- <AccountModal @register="registerModal" @success="handleSuccess" /> -->
  </PageWrapper>
</template>
<script setup lang="ts">
import { reactive } from 'vue'

import { BasicTable, useTable, TableAction } from '@/components/Table'
import { ContentHelper } from '@/api/contentHelper'
import { getAccountList } from '@service/system'
import {
  ContentManagementServiceProxy,
  ContentTypeDefinitionDto,
} from '@service/api/app-service-proxies'

import { PageWrapper } from '@/components/Page'
// import DeptTree from './DeptTree.vue'
import { useModal } from '@/components/Modal'
// import AccountModal from './AccountModal.vue'
import { BasicColumn } from '@/components/Table'

import { columns, searchFormSchema } from './data'
import { useGo } from '@/hooks/web/usePage'
import { ContentTypeService } from '@/api/ContentTypeService'
import { useQuery } from '@urql/vue'

const helper = new ContentHelper()
let dynamicSettings: ContentTypeDefinitionDto
let dynamicColumns: BasicColumn[]
async function init() {
  contentManagementService = new ContentManagementServiceProxy()
  dynamicSettings = await contentManagementService.getTypeDefinition({
    name: 'Customer',
    withSettings: true,
  })
  dynamicColumns = helper.getColumnsFromType(dynamicSettings)
}
let contentManagementService: ContentManagementServiceProxy

const go = useGo()
const [registerModal, { openModal }] = useModal()
const searchInfo = reactive<Recordable>({})
const typeService = new ContentTypeService('Customer')
await typeService.getTableSchema({ hasTotal: true, query: `` })
// const result = useQuery({
//   query: `
// {
//   crmCustomers {
//     total
//     items {
//       custNum
//     }
//   }
// }`,
// })
// console.log(result)
await init()

const [registerTable, { reload, updateTableDataRecord }] = useTable({
  title: '客户列表',
  api: getAccountList,
  columns: dynamicColumns,
  rowKey: 'id',
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
    autoSubmitOnEnter: true,
  },
  useSearchForm: true,
  showTableSetting: true,
  bordered: true,
  handleSearchInfoFn(info) {
    console.log('handleSearchInfoFn', info)
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
  openModal(true, {
    isUpdate: false,
    dynamicSettings,
  })
}

function handleEdit(record: Recordable) {
  console.log(record)
  openModal(true, {
    record,
    isUpdate: true,
  })
}

function handleDelete(record: Recordable) {
  console.log(record)
}

function handleSuccess({ isUpdate, values }) {
  if (isUpdate) {
    // 演示不刷新表格直接更新内部数据。
    // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
    const result = updateTableDataRecord(values.id, values)
    console.log(result)
  } else {
    reload()
  }
}

function handleSelect(deptId = '') {
  searchInfo.departmentId = deptId
  reload()
}

function handleView(record: Recordable) {
  go('/system/account_detail/' + record.id)
}
</script>
