<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="800px"
    @ok="handleSubmit"
  >
    <a-form v-bind="layout" :model="roleDetails">
      <a-form-item name="name" label="角色名称">
        <a-input
          v-model:value="roleDetails.name"
          :rules="{
            required: true, //读取字段配置
            message: '角色名称不可为空',
            trigger: 'change',
          }"
        />
      </a-form-item>
      <a-form-item name="roleDescription" label="角色描述">
        <a-input v-model:value="roleDetails.roleDescription" />
      </a-form-item>
      <a-tabs class="offset-2" v-model:activeKey="pageState.acitvePane">
        <a-tab-pane key="permitions" tab="权限">
          <a-form-item name="permissions">
            <BasicTree
              v-model:value="roleDetails.permissions"
              :treeData="allPermissions"
              :fieldNames="{ key: 'name' }"
              toolbar
              search
              key="name"
              :filterFn="filterPermission"
              checkable
              title="权限分配"
            >
              <template #title="item">
                <div>
                  <span>{{ item.name }}</span>
                  <span class="ml-10 ant-list-item-meta-description">
                    {{
                      item.description
                    }}
                  </span>
                </div>
              </template>
            </BasicTree>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="menus" tab="菜单">
          <a-form-item name="vbenMenuIds">
            <BasicTree
              v-model:value="roleDetails.vbenMenuIds"
              :treeData="treeData"
              :fieldNames="{ title: 'menuName', key: 'contentItemId' }"
              checkable
              :filterFn="filterMenu"
              search
              toolbar
              title="菜单分配"
            />
          </a-form-item>
        </a-tab-pane>
      </a-tabs>
    </a-form>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, reactive } from 'vue'
// import { BasicForm, useForm } from '@/components/Form/index'
// import { formSchema } from './role.data'
import { BasicDrawer, useDrawerInner } from '@/components/Drawer'
import { BasicTree, TreeItem } from '@/components/Tree'

import { getMenuList } from '@service/system'
import {
  PermissionDto,
  RoleDetailsDto,
  RoleDto,
  RolesServiceProxy,
} from '@service/api/app-service-proxies'
type PermissionTreeItem = {
  name: string | null
  checkable?: boolean
  description?: string | null
  category?: string | null
  impliedBy?: PermissionTreeItem[] | null
  children?: PermissionTreeItem[]
}
export default defineComponent({
  name: 'RoleDrawer',
  components: { BasicDrawer, BasicTree },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    }
    const pageState = reactive({
      acitvePane: 'permitions',
    })
    const isUpdate = ref(true)
    const treeData = ref<TreeItem[]>([])
    const roleDetails = ref<RoleDetailsDto>(new RoleDetailsDto())
    const rolesService = new RolesServiceProxy()
    const allPermissions = ref<PermissionTreeItem[]>([])
    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
      async (data) => {
        setDrawerProps({ confirmLoading: false })
        allPermissions.value = buildPermissionTree(data.allPermissions)
        // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
        if (unref(treeData).length === 0) {
          treeData.value = (await getMenuList()) as any as TreeItem[]
        }
        isUpdate.value = !!data?.isUpdate

        if (unref(isUpdate)) {
          const role = data.record as RoleDto
          if (role.roleName) {
            roleDetails.value = await rolesService.getRoleDetails(role.roleName)
          }
        } else {
          roleDetails.value = new RoleDetailsDto()
        }
      },
    )

    function buildPermissionTree(permissions: {
      [key: string]: PermissionDto[]
    }) {
      const tree: PermissionTreeItem[] = []
      for (const key in permissions) {
        const treeRoot = {
          name: key,
          checkable: false,
          children: [],
        } as PermissionTreeItem

        if (permissions[key]) {
          permissions[key].forEach((item: PermissionDto) => {
            treeRoot.children?.push({
              checkable: true,
              ...item,
            })
          })
          tree.push(treeRoot)
        }
      }
      return tree
    }
    const getTitle = computed(() =>
      !unref(isUpdate) ? '新增角色' : '编辑角色',
    )

    async function handleSubmit() {
      try {
        setDrawerProps({ confirmLoading: true })
        console.log('roleDetails.value: ', roleDetails.value)
        await rolesService.updateRole(roleDetails.value)
        closeDrawer()
        emit('success')
      } finally {
        setDrawerProps({ confirmLoading: false })
      }
    }

    function filterMenu(searchValue: any, node: any) {
      if (searchValue) {
        return node.menuName.toLowerCase().includes(searchValue.toLowerCase())
      } else {
        return true
      }
    }
    function filterPermission(searchValue: any, node: PermissionTreeItem) {
      console.log('node: ', node)
      if (searchValue && node.name) {
        try {
          return (
            (node.name &&
              node.name.toLowerCase()?.includes(searchValue.toLowerCase())) ||
            (node.description &&
              node.description
                .toLowerCase()
                .includes(searchValue.toLowerCase()))
          )
        } catch (error) {
          console.log('error: ', error)
          return true
        }
      } else {
        return true
      }
    }
    return {
      registerDrawer,
      // registerForm,
      getTitle,
      handleSubmit,
      allPermissions,
      filterPermission,
      filterMenu,
      treeData,
      roleDetails,
      layout,
      pageState,
    }
  },
})
</script>
