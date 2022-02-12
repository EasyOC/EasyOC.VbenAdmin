<template>
  <BasicForm @register="register" />
</template>

<script lang="ts">
import { BasicForm, FormSchema, useForm } from '@/components/Form/index'
import { defineComponent, reactive, onMounted, onBeforeMount, ref } from 'vue'
import { basicProps } from './props'
import { ContentTypeDefinitionDto } from '@service/api/app-service-proxies'
import { ContentManagementServiceProxy } from '@service/api/app-service-proxies'
import {
  getContent,
  createOrUpdateContent,
  ContentFieldsMapping,
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
    const typeManager = new ContentManagementServiceProxy()
    const contentHelper = new ContentHelper()

    let contentItem = reactive(new ContentItemUpperCase())
    let formModel = ref({})
    let typeDef = reactive(new ContentTypeDefinitionDto())
    let fields = reactive<ContentFieldsMapping[]>([])

    onBeforeMount(async () => {
      contentItem.ContentType = props.typeName
      typeDef = await typeManager.getTypeDefinition({
        name: props.typeName,
        withSettings: true,
      })
      console.log(typeDef, '重新赋值后')
      buildSchema(typeDef)
      await setProps({ schemas })

      if (props.contentItemId) {
        contentItem = await getContent(props.contentItemId?.toString())
        formModel.value = {
          ...contentHelper.expandContentType(contentItem, fields),
        }
        setFieldsValue(formModel)
      }
    })

    onMounted(async () => {})
    const schemas: FormSchema[] = reactive([])

    const [register, { setProps, setFieldsValue, updateSchema, validate }] =
      useForm({
        labelWidth: 120,
        schemas,
        submitFunc: handleSubmit,
        actionColOptions: {
          span: 24,
        },
        fieldMapToTime: [['fieldTime', ['startTime', 'endTime'], 'YYYY-MM-DD']],
      })

    async function handleSubmit() {
      try {
        const data = await validate()
        updateContentItem(formModel, contentItem, fields)
        await createOrUpdateContent(contentItem)
        console.log(data)
      } catch (e) {
        console.log(e)
      }
    }

    function buildSchema(contentType: ContentTypeDefinitionDto) {
      fields = contentHelper.getAllFields(contentType)
      fields.forEach((f) => {
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
        schemas.push(s)
      })
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
