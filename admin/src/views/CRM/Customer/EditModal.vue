<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
    <!-- <ContentForm type-name="Customer" :content-item-id="model.rowId" /> -->
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, computed, ref, reactive, onMounted } from 'vue'
import { BasicModal, useModalInner } from '@/components/Modal'
import { BasicForm, useForm } from '@/components/Form/index'
import {  excuteGraphqlQuery } from '@service/eoc/GraphqlService'
// import { ContentForm, useForm } from '@/components/OrchardCore'

import { getMenuList } from '@service/system'

export default defineComponent({
  name: 'EditModal',
  components: { BasicModal, BasicForm },
  created() {
    this.getSchema();
  },
  methods: {
    async getSchema() {
      const listConfigs= await excuteGraphqlQuery({query:`query MyQuery {
        vbenList(first: 1, where: {displayText: "CustomerList"}) {
          createdUtc
          displayText
          enablePage
          fieldList
          graphQL
          listMapping
          modifiedUtc
          publishedUtc
          queryMethod
          queryName
          targetContentType
        }
      }
      `})
      let listConfig:any = {} as any;
      if(listConfigs){
        listConfig = listConfigs.data.vbenList[0]
      }

      const listMapping = JSON.parse(listConfig.fieldList);
        console.log('listConfig: ', listConfig, listMapping);


    }
  },
  setup(_, { emit }) {
    const isUpdate = ref(true)

    const model = reactive<{
      isUpdate: boolean
      rowId: string
    }>({
      isUpdate: true,
      rowId: '',
    })

    onMounted(async () => {})
    

    const schemas:any[] = [{
    field: 'menuName',
    label: '客户名称',
    component: 'Input',
    required: true,
  },];

    const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
      labelWidth: 100,
      schemas: schemas,
      showActionButtonGroup: false,
      baseColProps: { lg: 12, md: 24 },
    });


    const [registerModal, { closeModal, setModalProps }] = useModalInner(
      async (data) => {
        console.log('data: ', data);
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate

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
      });


    



    const getTitle = computed(() =>
      !model.isUpdate ? '新增客户信息' : '编辑客户信息',
    )


    async function handleSubmit() {
      try {
        const values = await validate()
        setModalProps({ confirmLoading: true })
        // TODO custom api
        console.log(values)
        closeModal()
        emit('success')
      } finally {
        setModalProps({ confirmLoading: false })
      }
    }

    return { model, getTitle, registerForm, registerModal, handleSubmit }
  },
})
</script>
