import type {
  FormProps,
  FormActionType,
  UseFormReturnType,
  FormSchema,
} from '@/components/Form'
import type { DynamicProps } from '@admin/types'
import { schemas } from '@/views/demo/page/form/basic/data'
import { ContentTypeDefinitionDto } from '@service/api/app-service-proxies'
import { FieldType, ContentFieldsMapping } from '@service/eoc/contentApi'
import { SelectProps } from 'ant-design-vue'
import { onUnmounted } from 'vue'

type Props = Partial<DynamicProps<FormProps>>
export function useContentForm(props?: Props) {
  function register(instance: FormActionType) {}

  const methods = {
    buildSchema(contentType: ContentTypeDefinitionDto) {
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
