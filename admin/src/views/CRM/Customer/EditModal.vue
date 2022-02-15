<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
    <!-- <ContentForm type-name="Customer" :content-item-id="model.rowId" /> -->
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, computed, ref, unref, reactive, onBeforeMount } from 'vue'
import { BasicModal, useModalInner } from '@/components/Modal'
import { BasicForm, useForm } from '@/components/Form/index'
import { FormSchema } from '@/components/Table';
import {  excuteGraphqlQuery } from '@service/eoc/GraphqlService'
// import { ContentForm, useForm } from '@/components/OrchardCore'

import { getMenuList } from '@service/system'

export default defineComponent({
  name: 'EditModal',
  components: { BasicModal, BasicForm },
  setup(_, { emit }) {
    const isUpdate = ref(true)
    const schemas = ref<FormSchema[] >([]);

    const model = reactive<{
      isUpdate: boolean
      rowId: string
    }>({
      isUpdate: true,
      rowId: '',
    })

    onBeforeMount(async () => {
      getSchema();
    })



    async function getSchema() {
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

      const listMapping = JSON.parse(listConfig.listMapping);
        console.log('listConfig: ', listConfig, listMapping);
      // let schemas:FormSchema[] = [];
      listMapping.forEach((item)=>{
        let sc:FormSchema =  {} as FormSchema;
        if(Array.isArray(item.dataIndex)){
          sc.field = item.dataIndex[0];
        } else {
          sc.field = item.dataIndex;
        }        
        sc.label = item.title;
        sc.component = 'Input';
        sc.required = true;
        schemas.value.push(sc);
      });
        // console.log('schemas: ', schemas);
        updateSchema(schemas);
    
      
    }
    
    

    // const schemas:FormSchema[] = [{
    //   field: 'name',
    //   label: '客户名称',
    //   component: 'Input',
    //   required: true,
    // },{
    //   field: 'custNum',
    //   label: '客户编号',
    //   component: 'Input',
    //   required: true,
    // },{
    //   field: 'customerRemark',
    //   label: '客户备注',
    //   component: 'InputTextArea',
    //   required: true,
    // },{
    //   field: 'marketSegment',
    //   label: '市场细分',
    //   component: 'ApiSelect',
    //   required: true,
    // },{
    //   field: 'source',
    //   label: '客户来源',
    //   component: 'ApiSelect',
    //   required: true,
    // },{
    //   field: 'salesOwner',
    //   label: '销售负责人',
    //   component: 'ApiSelect',
    //   required: true,
    // }];

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

        const treeData = schemas//await getSchema(); //await getMenuList()
        console.log('treeData: ', treeData);
        // updateSchema(treeData)
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
