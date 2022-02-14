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
    <EditModal @register="registerModal" />
  </PageWrapper>
</template>
<script setup lang="ts">
import { reactive, onBeforeMount, onMounted } from 'vue'

import { BasicTable, useTable, TableAction } from '@/components/Table'
import { ContentHelper } from '@/api/contentHelper'
import {
  ContentManagementServiceProxy,
  ContentTypeDefinitionDto,
} from '@service/api/app-service-proxies'

import { PageWrapper } from '@/components/Page'
// import DeptTree from './DeptTree.vue'
import { useModal } from '@/components/Modal'
import EditModal from './EditModal.vue'
import { BasicColumn } from '@/components/Table'

import { columns, searchFormSchema } from './data'
import { useGo } from '@/hooks/web/usePage'
import { ContentTypeService } from '@/api/ContentTypeService'
import {
  excuteGraphqlQuery,
  LuceneCommonQueryParams,
} from '@service/eoc/GraphqlService'
// import { useQuery } from '@urql/vue'

const helper = new ContentHelper()
let dynamicSettings: ContentTypeDefinitionDto
const dynamicColumns = reactive<BasicColumn[]>([])

const fieldNames = [
  'published',
  'publishedUtc',
  'name',
  'modifiedUtc',
  'custNum',
  'displayText',
]
let contentManagementService: ContentManagementServiceProxy
onBeforeMount(async () => {
  contentManagementService = new ContentManagementServiceProxy()
  dynamicSettings = await contentManagementService.getTypeDefinition({
    name: 'Customer',
    withSettings: true,
  })
  //TODO 从 API 读取 列定义
  const gpCols = helper.getGraphqlTableCols(dynamicSettings, fieldNames)
  dynamicColumns.push(...gpCols)
  setProps({ columns: dynamicColumns, showTableSetting: true })
})

const go = useGo()
const [registerModal, { openModal }] = useModal()
const searchInfo = reactive<Recordable>({})

const [registerTable, { setProps }] = useTable({
  title: '客户列表',
  api: getList,
  rowKey: 'id',
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
    autoSubmitOnEnter: true,
  },
  useSearchForm: true,
  pagination: true,
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
    variables: {
      from: (params.page - 1) * params.pageSize,
      skip: params.pageSize,
    },
    query: `query MyQuery($params:String) {
              crmCustomers(parameters:$params) {
                items {
                 ${fieldNames.join(' ')}
                }
                total
              }
            }`,
  })
  return result.data.crmCustomers
}
function handleCreate() {
  // openModal(true, {
  //   isUpdate: false,
  //   dynamicSettings,
  // })
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

function handleView(record: Recordable) {
  go('/system/account_detail/' + record.id)
}
</script>
