import { FormSchema } from '@/components/Form'
import { camelCase } from '@admin/utils'
import { ContentFieldsMapping, FieldType } from '@service/eoc/contentApi'
import { excuteGraphqlQuery } from '@service/eoc/GraphqlService'

export default class VbenFormService {
  // private typeName: string
  // constructor(typeName: string) {
  //   this.typeName = typeName
  // }
  public static ContentItemIndexFields = 'ContentItemIndexFields'
  public getFormSchema(fields: ContentFieldsMapping[]) {
    const schemas: { [key: string]: FormSchema[] } = {
      [VbenFormService.ContentItemIndexFields]: [],
    }
    fields.forEach((f) => {
      if (!f.partName) {
        schemas[VbenFormService.ContentItemIndexFields].push(
          this.getPartFormSchema(f),
        )
      } else {
        if (!schemas[f.partName]) {
          schemas[f.partName] = []
        }
        schemas[f.partName].push(this.getPartFormSchema(f))
      }
    })
    return schemas
  }

  public getPartFormSchema(field: ContentFieldsMapping) {
    console.log('field: ', field)
    const schema: FormSchema = {
      field: field.fieldName,
      label: field.displayName,
      component: 'Input',
    }
    //TODO:处理类型映射
    switch (field.fieldType) {
      case FieldType.DateField:
        schema.component = 'DatePicker'
        break
      case FieldType.BooleanField:
        schema.component = 'Switch'
        break
      case FieldType.ContentPickerField:
        //TODO:绑定数据源 ,参考列表管理
        //根据 设置信息读取需要显示的下拉类型
        //根据指定的下拉类型绑定Graphql 查询
        break
      case FieldType.ContentPickerField:
        //TODO: 参考 userProfile
        break
    }
    return schema
  }
  public async getApiSelectSource(typeName: string, filterText: string) {
    const camelCaseName = camelCase(typeName)
    let whereText = ''
    if (filterText) {
      whereText = `(where: {displayText_in: "${filterText}"})`
    }
    const result = await excuteGraphqlQuery({
      query: `query MyQuery {
                ${camelCaseName}${whereText} {
                  displayText
                  contentItemId
                }
              }`,
    })
    return result.data[camelCaseName]
  }

  public async getApiSelectUserSource(filterText: string) {
    let whereText = ''
    if (filterText) {
      whereText = `(where: {displayText_in: "${filterText}"})`
    }
    const result = await excuteGraphqlQuery({
      query: `query MyQuery {
            userProfile${whereText} {
                  displayText
                  owner
                }
              }`,
    })
    return result.data.userProfile
  }
}
