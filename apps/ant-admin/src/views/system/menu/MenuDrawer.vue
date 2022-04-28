<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" showFooter :title="getTitle" width="50%" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue'
import { BasicForm, useForm } from '@/components/form'
import { formSchema } from './menu.data'
import { BasicDrawer, useDrawerInner } from '@/components/drawer'

import { getMenuList } from '@pkg/apis/system'
import { ContentManagementServiceProxy } from '@pkg/apis/eoc/app-service-proxies'
import { GpContentItem } from '@pkg/apis/eoc/contentApi'
import { deepMerge } from '@pkg/utils'
export default defineComponent({
  name: 'MenuDrawer',
  components: { BasicDrawer, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const typeName = 'VbenMenu'
    const isUpdate = ref(true)
    const contentSvr = new ContentManagementServiceProxy()
    const contentItem = ref<GpContentItem>(new GpContentItem(typeName))
    const [
      registerForm,
      { resetFields, setFieldsValue, updateSchema, validate },
    ] = useForm({
      labelWidth: 100,
      schemas: formSchema,
      showActionButtonGroup: false,
      baseColProps: { lg: 12, md: 24 },
    })

    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
      async (data) => {
        resetFields()
        setDrawerProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        contentItem.value = data.record
        // contentFields.value = data.contentFields
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          })
        }
        const treeData = await getMenuList()
        updateSchema({
          field: 'parentMenu',
          componentProps: { treeData },
        })
      },
    )

    const getTitle = computed(() =>
      !unref(isUpdate) ? '新增菜单' : '编辑菜单',
    )

    async function handleSubmit() {
      try {
        const values = await validate()
        setDrawerProps({ confirmLoading: true })
        // Save to Db
        deepMerge(contentItem.value, values)
        console.log(contentItem.value)
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
