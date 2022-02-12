<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue'
import { BasicForm, useForm } from '@/components/Form/index'
import { formSchema } from './menu.data'
import { BasicDrawer, useDrawerInner } from '@/components/Drawer'

import { getMenuList } from '@service/system'
import { ContentFieldsMappingDto } from '@service/api/app-service-proxies'
import { ContentHelper } from '@/api/contentHelper'
import {
  ContentItemUpperCase,
  createOrUpdateContent,
} from '@service/eoc/contentApi'

export default defineComponent({
  name: 'MenuDrawer',
  components: { BasicDrawer, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const typeName = 'VbenMenu'
    const isUpdate = ref(true)
    const contentHelper = new ContentHelper()
    const contentItem = ref<ContentItemUpperCase>({ ContentType: typeName })
    const contentFields = ref<ContentFieldsMappingDto[]>([])
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
        contentItem.value = data.contentItem
        contentFields.value = data.contentFields
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
        const content = contentHelper.updateContentItem(
          values,
          unref(contentFields),
          typeName,
          unref(contentItem),
        )
        await createOrUpdateContent(content)
        console.log(values)
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
