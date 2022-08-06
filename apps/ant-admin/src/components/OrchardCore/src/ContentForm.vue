<template>
  <BasicForm @register="register" />
</template>

<script lang="ts">
import { BasicForm, FormSchema, useForm } from '@/components/form/'
import { defineComponent, onMounted, onBeforeMount, ref } from 'vue'
import { basicProps } from './props'
import {
  getContent,
  FieldType,
  ContentItemUpperCase,
  ContentFieldsMapping,
} from '@pkg/apis/eoc/contentApi'
import { SelectProps } from 'ant-design-vue'
import { ContentTypeService } from '@/api/ContentTypeService'
export default defineComponent({
  name: 'ContentForm',
  components: { BasicForm },
  props: basicProps,
  emits: ['advanced-change', 'reset', 'submit', 'register'],
  setup(props) {
    // const typeManager = new ContentTypeManagementServiceProxy()
    const schemas = ref<FormSchema[]>([])
    const contentTypeService = new ContentTypeService(props.typeName)
    let contentItem = ref<ContentItemUpperCase>({ ContentType: props.typeName })
    let formModel = ref({})
    let fields = ref<ContentFieldsMapping[]>([])

    onBeforeMount(async () => {
      // 获取所有字段
      fields.value = await contentTypeService.getAllFields()
      schemas.value = buildSchema()
      await setProps({ schemas })

      if (props.contentItemId) {
        contentItem.value = await getContent(props.contentItemId?.toString())
          ; (formModel.value = contentTypeService.expandContentType(
            contentItem.value,
          )),
            setFieldsValue(formModel)
      }
    })

    onMounted(async () => { })

    const [register, { setProps, setFieldsValue, updateSchema, validate }] =
      useForm({
        labelWidth: 120,
        submitFunc: handleSubmit,
        actionColOptions: {
          span: 24,
        },
        fieldMapToTime: [['fieldTime', ['startTime', 'endTime'], 'YYYY-MM-DD']],
      })

    async function handleSubmit() {
      try {
        const data = await validate()
        await contentTypeService.saveContentItem(formModel, contentItem)
        console.log(data)
      } catch (e) {
        console.log(e)
      }
    }

    function buildSchema(): FormSchema[] {
      const tempSchemas: FormSchema[] = []
      fields.value.forEach((f) => {
        const s = {
          label: f.displayName,
          field: f.fieldName,
          colProps: {
            span: 8,
          },
        } as FormSchema
        switch (f.fieldType) {
          case FieldType.BooleanField:
            s.component = 'Switch'
            break
          case FieldType.TextField:
            updateTextFieldSchema(s, f)
            break
        }
        tempSchemas.push(s)
      })
      return tempSchemas
    }

    function updateTextFieldSchema(
      schema: FormSchema,
      field: ContentFieldsMapping,
    ) {
      const settings = field.fieldSettings

      if (settings.TextFieldSettings.Required) {
        schema.required = true
      }
      if (settings.ContentPartFieldSettings.Editor) {
        var ocEditor = settings.ContentPartFieldSettings.Editor
        //预定义列表的下拉菜单
        if (ocEditor == 'PredefinedList') {
          const ocOptions =
            settings.TextFieldPredefinedListEditorSettings.Options
          const options = ocOptions.map((x) => {
            return {
              label: x.name,
              value: x.value,
              key: x.value,
            }
          })
          schema.component = 'Select'
          schema.componentProps = {
            options,
          } as SelectProps
        }
      }
    }

    return {
      register,
      updateSchema,
    }
  },
})
</script>
