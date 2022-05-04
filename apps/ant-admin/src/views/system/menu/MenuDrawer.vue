<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" showFooter :title="getTitle" width="50%" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref, onBeforeMount, onMounted } from 'vue'
import { BasicForm, FormSchema, useForm } from '@/components/form'
import { formSchema } from './menu.data'
import { BasicDrawer, useDrawerInner } from '@/components/drawer'

import { getMenuList } from '@pkg/apis/system'
import { ContentManagementServiceProxy } from '@pkg/apis/eoc/app-service-proxies'
import { GpContentItem } from '@pkg/apis/eoc/contentApi'
import { merge } from '@pkg/utils'
import { TreeSelectProps } from 'ant-design-vue'
import { restoreComplexModel, expandComplexModel } from '@/api/ocUtils'
// import { TreeSelectProps } from 'ant-design-vue'
export default defineComponent({
  name: 'MenuDrawer',
  components: { BasicDrawer, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const isUpdate = ref(true)
    const typeName = 'VbenMenu'
    const contentSvr = new ContentManagementServiceProxy()
    let contentItem=ref<any>(new GpContentItem(typeName)) 
    //复杂对象配置

    // const treeData = ref([])
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
    // onMounted(async () => {
    //   treeData.value = await getMenuList()
    // })
    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
      async (data) => {
        resetFields()
        setDrawerProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        contentItem = data.record; 
        if (unref(isUpdate)) {
          setFieldsValue({
            ...expandComplexModel(data.record, formSchema),
          })
        }
        const treeData = await getMenuList()
        updateSchema({
          field: 'parentMenu',
          componentProps: {
            treeData
          } as TreeSelectProps,
        })

      },
    )


    const getTitle = computed(() =>
      !unref(isUpdate) ? '新增菜单' : '编辑菜单',
    )

    async function handleSubmit() {

      try {
        await validate()
        //兼容复杂对象获取值
        const values = restoreComplexModel(await getFieldsValue(), formSchema)
        console.log("NewData:values", values)
        setDrawerProps({ confirmLoading: true })
        //合并到新的对象
        const res = merge(contentItem, values)
        // Save to Db
        await contentSvr.postContent(false, res)
        closeDrawer()
        emit('success')
      }     
      finally {
        setDrawerProps({ confirmLoading: false })
      }
    }

    return { registerDrawer, registerForm, getTitle, handleSubmit }
  },
})
</script>
