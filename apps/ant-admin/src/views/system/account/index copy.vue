<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增账号</a-button>
      </template>
      <template #action="{ record }">
        <TableAction :actions="[
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
        ]" />
      </template>
    </BasicTable>
    <AccountModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script setup lang="ts">
import { reactive, onBeforeMount } from 'vue'

import { BasicTable, useTable, TableAction } from '@/components/table'
import { ContentHelper } from '@/api/contentHelper'
import { getAccountList, userService } from '@pkg/apis/system'
import { ContentTypeDefinitionDto } from '@pkg/apis/eoc/app-service-proxies'

import { PageWrapper } from '@/components/page'
import DeptTree from './DeptTree.vue'
import { useModal } from '@/components/modal'
import AccountModal from './AccountModal.vue'
// import { BasicColumn } from '@/components/table'

import { columns, searchFormSchema } from './account.data'
import { useGo } from '@/hooks/web/usePage'

let userCustomSettings: ContentTypeDefinitionDto[]

// (options:{
//   getter:(async () => (await getCols()),
//   setter:
// })
onBeforeMount(async () => {
  userCustomSettings = await userService.getUserSettingTypes()
  const helper = new ContentHelper()
  const customPropCols = helper.getColumnsFromUserProperties(userCustomSettings)
  setProps({ columns: [...columns, ...customPropCols], showTableSetting: true })
})

const go = useGo()
const [registerModal, { openModal }] = useModal()
const searchInfo = reactive<Recordable>({})
const [registerTable, { reload, updateTableDataRecord, setProps }] = useTable({
  title: '账号列表',
  api: getAccountList,
  rowKey: 'userId',
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
    autoSubmitOnEnter: true,
  },
  useSearchForm: true,
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
    record: {},
    userCustomSettings,
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
    const result = updateTableDataRecord(values.userId, values)
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
