<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增角色</a-button>
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
    <RoleDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

import { BasicTable, useTable, TableAction } from '@/components/Table'
// import { getAllRoleList } from '@service/system'

import { useDrawer } from '@/components/Drawer'
import RoleDrawer from './RoleDrawer.vue'

import { columns, searchFormSchema } from './role.data'
import {
  PermissionDto,
  RoleDto,
  RolesServiceProxy,
} from '@service/api/app-service-proxies'

export default defineComponent({
  name: 'RoleManagement',
  components: { BasicTable, RoleDrawer, TableAction },
  setup() {
    const rolesService = new RolesServiceProxy()
    const [registerDrawer, { openDrawer }] = useDrawer()
    const [registerTable, { reload }] = useTable({
      title: '角色列表',
      api: getRoles,
      columns,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        submitOnChange: true,
        autoSubmitOnEnter: true,
      },
      useSearchForm: true,
      showTableSetting: true,
      bordered: true,
      pagination: false,
      showIndexColumn: false,
      actionColumn: {
        width: 80,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
        fixed: undefined,
      },
    })
    let roles: RoleDto[] = []
    async function getRoles(params) {
      if (roles.length == 0) {
        roles = await rolesService.getRoles()
      }
      if (params.roleName) {
        const filter = params.roleName.toLowerCase()
        return roles.filter(
          (x) =>
            x.roleName?.toLowerCase().includes(filter) ||
            x.roleDescription?.toLowerCase().includes(filter),
        )
      }
      return roles
    }
    let allPermissions: { [key: string]: PermissionDto[] } | null = null
    async function getAllPermissions() {
      if (!allPermissions) {
        allPermissions = await rolesService.getAllPermissions()
      }
      return allPermissions
    }

    async function handleCreate() {
      openDrawer(true, {
        isUpdate: false,
        allPermissions: await getAllPermissions(),
      })
    }

    async function handleEdit(record: Recordable) {
      openDrawer(true, {
        record,
        isUpdate: true,
        allPermissions: await getAllPermissions(),
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
    }
  },
})
</script>
