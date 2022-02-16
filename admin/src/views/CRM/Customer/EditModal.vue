<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
    <!-- <ContentForm type-name="Customer" :content-item-id="model.rowId" /> -->
  </BasicModal>
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  unref,
  reactive,
  onBeforeMount,
} from 'vue'
import { BasicModal, useModalInner } from '@/components/Modal'
import { BasicForm, useForm } from '@/components/Form/index'
import { FormSchema } from '@/components/Table'
import { excuteGraphqlQuery } from '@service/eoc/GraphqlService'
import { ContentTypeService } from '@/api/ContentTypeService'
// import { ContentForm, useForm } from '@/components/OrchardCore'

export default defineComponent({
  name: 'EditModal',
  components: { BasicModal, BasicForm },
  setup(_, { emit }) {
    const isUpdate = ref(true)
    const schemas = ref<FormSchema[]>([])
    const contentTypeService = ref<ContentTypeService>({})
    const model = reactive<{
      isUpdate: boolean
      rowId: string
    }>({
      isUpdate: true,
      rowId: '',
    })

    onBeforeMount(async () => {
      getSchema()
    })

    async function getSchema() {
      const fields = await contentTypeService.value.getAllFields()
      // let schemas:FormSchema[] = [];
      fields.forEach((item) => {
        let sc: FormSchema = {} as FormSchema
        if (Array.isArray(item.fieldName)) {
          sc.field = item.fieldName
        } else {
          sc.field = item.dataIndex
        }
        sc.label = item.title
        sc.component = 'Input'
        sc.required = true
        schemas.value.push(sc)
      })
      // console.log('schemas: ', schemas);
      updateSchema(schemas)
    }

    const [
      registerForm,
      { resetFields, setFieldsValue, updateSchema, validate },
    ] = useForm({
      labelWidth: 100,
      schemas: schemas,
      showActionButtonGroup: false,
      baseColProps: { lg: 12, md: 24 },
    })

    const [registerModal, { closeModal, setModalProps }] = useModalInner(
      async (data) => {
        console.log('data: ', data)
        contentTypeService.value = data.contentTypeService
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          })
        }
      },
    )

    const getTitle = computed(() =>
      !model.isUpdate ? '新增客户信息' : '编辑客户信息',
    )

    async function handleSubmit() {
      try {
        const values = await validate()
        setModalProps({ confirmLoading: true })
        // Save to Db
        await contentHelper.saveContentItem(
          values,
          unref(contentFields),
          unref(contentItem),
        )
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
