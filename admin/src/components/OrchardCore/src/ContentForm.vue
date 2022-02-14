<template>
  <BasicForm @register="register" />
</template>

<script lang="ts">
import { BasicForm, FormSchema, useForm } from '@/components/Form/index'
import { defineComponent, reactive, onMounted, onBeforeMount, ref } from 'vue'
import { basicProps } from './props'
import { ContentFieldsMappingDto } from '@service/api/app-service-proxies'
import { ContentManagementServiceProxy } from '@service/api/app-service-proxies'
import {
  getContent,
  FieldType,
  ContentItemUpperCase,
} from '@service/eoc/contentApi'
import { ContentHelper } from '@/api/contentHelper'
import { SelectProps } from 'ant-design-vue'
export default defineComponent({
  name: 'ContentForm',
  components: { BasicForm },
  props: basicProps,
  emits: ['advanced-change', 'reset', 'submit', 'register'],
  setup(props) {
    // const typeManager = new ContentManagementServiceProxy()
    const contentHelper = new ContentHelper()
    const schemas = ref<FormSchema[]>([])

    let contentItem = ref<ContentItemUpperCase>({ ContentType: props.typeName })
    let formModel = ref({})
    // let typeDef = reactive(new ContentTypeDefinitionDto())
    let fields = ref<ContentFieldsMappingDto[]>([])

    onBeforeMount(async () => {
      fields.value = await contentHelper.getAllFields(props.typeName)
      schemas.value = buildSchema()
      await setProps({ schemas: schemas })

      if (props.contentItemId) {
        contentItem.value = await getContent(props.contentItemId?.toString())
        ;(formModel.value = contentHelper.expandContentType(
          contentItem.value,
          fields.value,
        )),
          setFieldsValue(formModel)
      }
    })

    onMounted(async () => {})

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
        contentHelper.saveContentItem(formModel, fields.value, contentItem)
        console.log(data)
      } catch (e) {
        console.log(e)
      }
    }

    function buildSchema() {
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
      field: ContentFieldsMappingDto,
    ) {
      const settings = field.fieldSettings

      if (settings.TextFieldSettings.Required) {
        schema.required = true
      }
      if (settings.ContentPartFieldSettings.Editor) {
        var ocEditor = settings.ContentPartFieldSettings.Editor
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
