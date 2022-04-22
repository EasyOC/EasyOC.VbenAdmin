<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <!-- <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" /> -->
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">添加</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除',
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
import { reactive, onBeforeMount, ref } from 'vue'

import { BasicTable, useTable, TableAction } from '@/components/Table'
// import { ContentHelper } from '@/api/contentHelper'
import {
  ContentTypeManagementServiceProxy,
  ContentTypeDefinitionDto,
} from '@pkg/apis/eoc/app-service-proxies'

import { PageWrapper } from '@/components/Page'
// import { useModal } from '@/components/Modal'
import { BasicColumn } from '@/components/Table'

import { columns, searchFormSchema } from './data'
import { useGo } from '@/hooks/web/usePage'
// import { ContentTypeService } from '@/api/ContentTypeService'
import { excuteGraphqlQuery } from '@pkg/apis/eoc/GraphqlService'
const contentTypeName = 'VbenList'
let dynamicSettings: ContentTypeDefinitionDto
const dynamicColumns = ref<BasicColumn[]>(columns)

const contentManagementService = new ContentTypeManagementServiceProxy()
onBeforeMount(async () => {
  dynamicSettings = await contentManagementService.getTypeDefinition({
    name: contentTypeName,
    withSettings: true,
  })
  // let temp = helper.getColumnsFromType(dynamicSettings)
  dynamicColumns.value = [...columns]
  setProps({ columns: dynamicColumns, showTableSetting: true })
})

const go = useGo()
const searchInfo = reactive<Recordable>({})

const [registerTable, { reload, updateTableDataRecord, setProps }] = useTable({
  title: '列表管理',
  api: getList,
  pagination: false,
  rowKey: 'contentItemId',
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

async function getList(params) {
  const result = await excuteGraphqlQuery({
    // variables: { where: { displayText_contains: params.filter } },
    //   skip: ${(params.page - 1) * params.pageSize}
    // first: ${params.pageSize}
    query: `query MyQuery {
  vbenList(
    where: {displayText_contains: "${params.filter || ''}"}
    orderBy: {publishedUtc: DESC}

  ) {
    contentItemId
    createdUtc
    displayText
    listMapping
    modifiedUtc
    publishedUtc
    queryMethod
    targetContentType
    published
  }
}`,
  })
  // var result1 = {
  //   items: result.data.data.vbenList,
  //   total: result.data.data.vbenList.length,
  // }
  // console.log(result1, 'excuteGraphqlQueryexcuteGraphqlQueryexcuteGraphqlQuery')
  return result.data.vbenList
}

function handleCreate() {
  go('listDetails')
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
  go('listDetails/' + record.contentItemId)
}
</script>
