<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <!-- <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" /> -->
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增账号</a-button>
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
    <AccountModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script setup lang="ts">
  import { reactive, onMounted } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getAccountList, getUserDetails, userService } from '../../../api/system';
  import { PageWrapper } from '/@/components/Page';
  // import DeptTree from './DeptTree.vue';
  import { useModal } from '/@/components/Modal';
  import AccountModal from './AccountModal.vue';
  import { columns, searchFormSchema } from './account.data';
  import { useGo } from '/@/hooks/web/usePage';
  import { ContentHelper } from '/@/api/EOC/ContentHelper';
  import { ContentTypeDefinitionDto } from '/@/api/app-service-proxies';

  onMounted(async () => {
    let userCustomSettings: ContentTypeDefinitionDto[] = await userService.getUserSettingsTypes();
    console.log(userCustomSettings, 'aauserCustomSettings');
    const helper = new ContentHelper();
    const customPropCols = helper.getColumnsFromUserProperties(userCustomSettings);
    const userListColumns = [...columns, ...customPropCols];
    console.log(userListColumns, 'userListColumnsuserListColumnsuserListColumns');
    setColumns(userListColumns);
  });

  const go = useGo();
  const [registerModal, { openModal }] = useModal();
  const searchInfo = reactive<Recordable>({});

  const [registerTable, { reload, updateTableDataRecord, setColumns }] = useTable({
    title: '账号列表',
    api: getAccountList,
    rowKey: 'id',
    // columns: userListColumns,
    columns: columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: true,
    handleSearchInfoFn(info) {
      console.log('handleSearchInfoFn', info);
      return info;
    },
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  async function handleEdit(record: Recordable) {
    console.log(record);
    var user = await getUserDetails(record.userId);
    openModal(true, {
      record: user,
      isUpdate: true,
    });
  }

  function handleDelete(record: Recordable) {
    console.log(record);
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      // 演示不刷新表格直接更新内部数据。
      // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
      const result = updateTableDataRecord(values.id, values);
      console.log(result, 'updateTableDataRecord');
    } else {
      reload();
    }
  }

  function handleView(record: Recordable) {
    go('/system/account_detail/' + record.id);
  }
</script>
