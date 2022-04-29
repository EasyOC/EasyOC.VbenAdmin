<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" showFooter :title="getTitle" width="50%" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, onBeforeMount, onMounted } from 'vue'
import { BasicForm, useForm } from '@/components/form'
import { formSchema } from './menu.data'
import { BasicDrawer, useDrawerInner } from '@/components/drawer'

import { getMenuList } from '@pkg/apis/system'
import { ContentManagementServiceProxy } from '@pkg/apis/eoc/app-service-proxies'
import { GpContentItem } from '@pkg/apis/eoc/contentApi'
import { deepMerge } from '@pkg/utils'
import { TreeSelectProps } from 'ant-design-vue'
export default defineComponent({
  name: 'MenuDrawer',
  components: { BasicDrawer, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const typeName = 'VbenMenu'
    const isUpdate = ref(true)
    const contentSvr = new ContentManagementServiceProxy()
    const contentItem = ref<GpContentItem>(new GpContentItem(typeName))
    const treeData = ref<any>([])
    const [
      registerForm,
      { resetFields, setFieldsValue, updateSchema, validate, getFieldsValue },
    ] = useForm({
      model: contentItem,
      labelWidth: 100,
      schemas: formSchema,
      showActionButtonGroup: false,
      baseColProps: { lg: 12, md: 24 },
    })
    onBeforeMount(async () => {
      treeData.value = await getMenuList()
    })
    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
      async (data) => {
        resetFields()
        setDrawerProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        contentItem.value = data.record
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          })
        }
        updateSchema({
          // field: 'parentMenu',   
          field: 'parentMenu.contentItemIds[0]',
          componentProps: {
            treeData: treeData.value,
          }
        })
      },
    )

    const getTitle = computed(() =>
      !unref(isUpdate) ? '新增菜单' : '编辑菜单',
    )

    async function handleSubmit() {
      try {
        await validate()
        // console.log("NewData:validateFields", await validateFields())
        const values = await getFieldsValue()
        console.log("NewData:values", values)

        setDrawerProps({ confirmLoading: true })

        // Save to Db
        contentItem.value = deepMerge(contentItem.value, values)
        console.log(contentItem.value, "NewData")
        await contentSvr.postContent(false, contentItem.value)
        closeDrawer()
        emit('success')
      } finally {
        setDrawerProps({ confirmLoading: false })
      }
    }

    return { registerDrawer, registerForm, getTitle, handleSubmit }
  },
})
</script>
