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
import { merge, isArray, set, has, get } from '@pkg/utils'
import { TreeSelectProps } from 'ant-design-vue'
// import { TreeSelectProps } from 'ant-design-vue'
export default defineComponent({
  name: 'MenuDrawer',
  components: { BasicDrawer, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const typeName = 'VbenMenu'
    const isUpdate = ref(true)
    const contentSvr = new ContentManagementServiceProxy()
    const contentItem = ref<GpContentItem>(new GpContentItem(typeName))
    //复杂对象配置
    const complexKeys = [
      { keyName: 'parentMenu', keyPath: "parentMenu.firstValue", isArray: false }
    ];
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
        contentItem.value = data.record
        await convertModelValue()
        if (unref(isUpdate)) {
          setFieldsValue({
            ...contentItem.value,
          })
        }
        console.log("complexKeys，get", contentItem.value)
        const treeData = await getMenuList()
        updateSchema({
          field: 'parentMenu',
          // defaultValue: unref(contentItem).parentMenu.firstValue,
          // field: 'parentMenu.contentItemIds[0]',
          // field: 'parentMenu.firstValue',
          // valueField: 'parentMenu.firstValue',
          // itemProps: {
          //   name: ['parentMenu', 'contentItemIds',0],
          // },
          componentProps: {
            // transitionName
            // defaultValue: contentItem.value.parentMenu?.contentItemIds,
            // fieldNames: ['contentItemIds[0]'],
            treeData,//: unref(treeData),
            
            // api: getMenuList
            onChange: async (a, b, c) => {
              console.log('a,b,c: ', a, b, c);
            },
          } as TreeSelectProps,
        })

      },
    )

    async function convertModelValue() {
      //复杂对象展开
      complexKeys.forEach((item) => {
        if (has(contentItem.value, item.keyPath)) {
          if (item.isArray) {
            contentItem.value[item.keyName] = get(contentItem.value, item.keyPath)
          } else {
            contentItem.value[item.keyName] = get(contentItem.value, item.keyPath )
          }
        }
      })
      console.log("complexKeys", contentItem.value)
    }

    const getTitle = computed(() =>
      !unref(isUpdate) ? '新增菜单' : '编辑菜单',
    )

    async function handleSubmit() {
      try {
        const v = await validate()
        console.log('v: ', v);

        // console.log("NewData:validateFields", await validateFields())
        //兼容复杂对象获取值
        const values = await getFieldsValue()
        complexKeys.forEach(item => {
          if (item.isArray) {
            // const arrVal = [...values[item.keyName]]
            set(values, item.keyPath, values[item.keyName])
          } else {
            set(values, item.keyPath, values[item.keyName])
          }
          debugger
          console.log(values, "NewData")
        })
        console.log("NewData:values", values)

        setDrawerProps({ confirmLoading: true })

        contentItem.value = merge(contentItem.value, values)
        //复杂对象赋值保存

        // Save to Db
        await contentSvr.postContent(false, contentItem.value)
        closeDrawer()
        emit('success')
      } finally {
        setDrawerProps({ confirmLoading: false })
        //报错，重新折叠
        convertModelValue()
      }
    }

    return { registerDrawer, registerForm, getTitle, handleSubmit }
  },
})
</script>
