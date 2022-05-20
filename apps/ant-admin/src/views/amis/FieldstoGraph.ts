import { ContentFieldsMapping } from '@pkg/apis/eoc/contentApi'
import { camelCase } from '@pkg/utils'
import { FieldType } from '@pkg/apis/eoc/contentApi'

export default function buildGraphql(fields: ContentFieldsMapping[]) {
  const gfields: { [key: string]: any } = {}
  fields
    // .filter((x) => !GraphQLNotSupportFields.includes(x.fieldType))
    .forEach((field) => {
      console.log('field: ', field);
      const fieldName = camelCase(field.fieldName)
      console.log('fieldName: ', fieldName);
      // const formValue = getFieldsValue()
      const isPart = false
      // if (field.partName) {
      //   isPart = ![formValue.TargetContentType, 'TitlePart'].includes(
      //     field.partName,
      //   )
      // }

      let tempPart = gfields
      if (isPart) {
        if (!gfields[camelCase(field.partName)]) {
          gfields[camelCase(field.partName)] = {}
        }
        tempPart = gfields[camelCase(field.partName)]
      }

        switch (field.fieldType) {
          case FieldType.ContentPickerField:
            tempPart[fieldName] = { 
              firstValue: false,
              firstContentItem: {
                displayText: false,
              },
            }
            break
          case FieldType.UserPickerField:
            tempPart[fieldName] = {
              userIds: false,
              firstValue: false,
              userProfiles: { displayText: false },
            }
            break
          case FieldType.HtmlField:
            break
          default:
            tempPart[fieldName] = false
        }
    })
  // console.log('stringify', JSON.stringify(gfields, null, 2))
  const tempGraphqlStr = JSON.stringify(gfields, null, 2).replace(
    /false|'|"|:|,/g,
    '',
  )
  return tempGraphqlStr
}