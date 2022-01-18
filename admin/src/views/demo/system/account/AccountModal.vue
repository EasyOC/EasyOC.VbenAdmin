<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, computed, unref, reactive, onMounted } from 'vue'
import { BasicModal, useModalInner } from '@/components/Modal'
import { BasicForm, FormSchema, useForm } from '@/components/Form/index'
import { accountFormSchema } from './account.data'
import { getDeptList } from '@service/system'
import {
  ContentTypeDefinitionDto,
  UserDetailsDto,
} from '@service/api/app-service-proxies'
import { ContentHelper } from '@/api/contentHelper'

export default defineComponent({
  name: 'AccountModal',
  components: { BasicModal, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const model = reactive<{
      isUpdate: boolean
      rowId: string
      userInfo: UserDetailsDto | null
      userCustomSettings: ContentTypeDefinitionDto[]
    }>({
      isUpdate: true,
      rowId: '',
      userInfo: null,
      userCustomSettings: [],
    })

    let finalFormSchema: FormSchema[] = []
    onMounted(async () => {
      const helper = new ContentHelper()
      const customPropCols = helper.getFormSchemaFromUserProperties(
        model.userCustomSettings,
      )
      finalFormSchema = [...accountFormSchema, ...customPropCols]
      console.log(finalFormSchema, 'getFormSchemaFromUserProperties')
    })
    const [
      registerForm,
      { setFieldsValue, updateSchema, resetFields, validate },
    ] = useForm({
      labelWidth: 100,
      schemas: accountFormSchema,
      showActionButtonGroup: false,
      actionColOptions: {
        span: 23,
      },
    })

    const [registerModal, { setModalProps, closeModal }] = useModalInner(
      async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        model.isUpdate = !!data?.isUpdate
        model.userInfo = data.record

        if (unref(model.isUpdate)) {
          model.rowId = data.record.userId
          setFieldsValue({
            ...data.record,
          })
        }

        const treeData = await getDeptList()
        updateSchema([
          {
            field: 'pwd',
            show: !unref(model.isUpdate),
          },
          {
            field: 'dept',
            componentProps: { treeData },
          },
        ])
      },
    )

    const getTitle = computed(() => (!model.isUpdate ? '新增账号' : '编辑账号'))

    async function handleSubmit() {
      try {
        const values = await validate()
        setModalProps({ confirmLoading: true })
        // TODO custom api
        console.log(values)
        closeModal()
        emit('success', {
          isUpdate: unref(model.isUpdate),
          values: { ...values, id: model.rowId },
        })
      } finally {
        setModalProps({ confirmLoading: false })
      }
    }

    return { registerModal, registerForm, getTitle, handleSubmit }
  },
})
</script>
