import type { FormProps, FormSchema } from '@/components/Form'
import type { DynamicProps } from '@pkg/types'
import { schemas } from '@/views/demo/page/form/basic/data'
import { FieldType, ContentFieldsMapping } from '@pkg/apis/eoc/contentApi'
import { SelectProps } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { ContentTypeService } from '@/api/ContentTypeService'

type Props = Partial<
  DynamicProps<FormProps> & {
    contentType: string
  }
>
// const contentTypeService = ref<ContentTypeService>()
const fields = ref<ContentFieldsMapping[]>([])
export function useContentForm(props: Props) {
  const { contentType } = props
  // function register(instance: FormActionType) {}
  const contentTypeService = new ContentTypeService(contentType || '')
  onMounted(async () => {
    fields.value = await contentTypeService.getAllFields()
  })
  const methods = {
    buildSchema() {
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
            this.updateTextFieldSchema(s, f)
            break
        }
        schemas.push(s)
      })
    },
    updateTextFieldSchema(schema: FormSchema, field: ContentFieldsMapping) {
      const settings = field.fieldSettings

      if (settings.TextFieldSettings.Required) {
        schema.required = true
      }
      if (settings.ContentPartFieldSettings.Editor) {
        const ocEditor = settings.ContentPartFieldSettings.Editor
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
    },
  }
  return [register, methods]
}
