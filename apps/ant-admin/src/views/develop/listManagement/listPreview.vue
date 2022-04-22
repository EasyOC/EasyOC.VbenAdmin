<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">添加</a-button>
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
<script lang="ts">
import { reactive, onBeforeMount, onMounted, defineComponent } from 'vue'
import { BasicTable, useTable, TableAction } from '@/components/Table'
import { ContentHelper } from '@/api/contentHelper'
import {
  ContentTypeManagementServiceProxy,
  ContentTypeDefinitionDto,
} from '@pkg/apis/eoc/app-service-proxies'

import { PageWrapper } from '@/components/Page'
// import DeptTree from './DeptTree.vue'
import { useModal } from '@/components/Modal'
import EditModal from './EditModal.vue'
import { BasicColumn } from '@/components/Table'
import { useGo } from '@/hooks/web/usePage'
import { ContentTypeService } from '@/api/ContentTypeService'
import {
  excuteGraphqlQuery,
  LuceneCommonQueryParams,
} from '@pkg/apis/eoc/GraphqlService'

export default defineComponent({
  name: 'listPreview',
  components: { BasicTable },
  emits: ['success', 'register'],
  setup(_, { emit }) {
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
    let contentManagementService: ContentTypeManagementServiceProxy
    onBeforeMount(async () => {
      contentManagementService = new ContentTypeManagementServiceProxy()
      dynamicSettings = await contentManagementService.getTypeDefinition({
        name: 'Customer',
        withSettings: true,
      })
      const gpCols = helper.getGraphqlTableCols(dynamicSettings, fieldNames)
      dynamicColumns.push(...gpCols)
      setProps({ columns: dynamicColumns, showTableSetting: true })
    })

    const go = useGo()
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
  },
})
</script>
