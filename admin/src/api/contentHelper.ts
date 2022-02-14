import { BasicColumn, FormSchema } from '@/components/Table'
import {
  ContentFieldsMapping,
  FieldType,
  ContentItemUpperCase,
  getValuePath,
  createOrUpdateContent,
} from '@service/eoc/contentApi'
import {
  ContentTypeDefinitionDto,
  ContentPartDefinitionDto,
  ContentFieldsMappingDto,
  ContentManagementServiceProxy,
} from '@service/api/app-service-proxies'
import { t } from '@admin/locale'
import { camelCase, deepMerge, isObject } from '@admin/utils'

export class ContentHelper {
  // public getAllFields(
  //   def: ContentTypeDefinitionDto | ContentPartDefinitionDto,
  // ): ContentFieldsMapping[] {
  //   return this.getFieldsFromType(def as ContentTypeDefinitionDto)
  // }

  public async getAllFields(typeName: string) {
    return deepMerge(
      [],
      await await new ContentManagementServiceProxy().getFields(typeName),
    ) as ContentFieldsMapping[]
  }
  public expandContentType(
    _contentItem: ContentItemUpperCase,
    fields: ContentFieldsMapping[] | ContentFieldsMappingDto[],
    // toCamelCase = false,
  ) {
    const expandedContentItem: any = {}
    for (const key in _contentItem) {
      if (!isObject(_contentItem[key])) {
        expandedContentItem[key] = _contentItem[key]
      }
    }
    fields.forEach((f) => {
      expandedContentItem[f.fieldName] = eval(`_contentItem.${f.keyPath}`)
    })
    console.log('expandedContentItem: ', expandedContentItem)
    return expandedContentItem
  }

  public async saveContentItem(
    _formModel: any,
    fields: ContentFieldsMapping[] | ContentFieldsMappingDto[],
    targetContentItem: ContentItemUpperCase = {},
    typeName?: string,
    beforeUpdate?: (contentItem: ContentItemUpperCase) => boolean,
  ) {
    fields.forEach((f) => {
      {
        if (f.fieldName == 'DisplayText' && !f.partName) {
          targetContentItem.TitlePart = { Title: _formModel.DisplayText }
          targetContentItem.DisplayText = _formModel.DisplayText
          return
        }

        if (f.partName) {
          if (!targetContentItem[f.partName]) {
            targetContentItem[f.partName] = {}
          }
          if (!targetContentItem[f.partName][f.fieldName]) {
            targetContentItem[f.partName][f.fieldName] = {}
          }
          targetContentItem[f.partName][f.fieldName][f.lastValueKey] =
            _formModel[f.fieldName]
        } else {
          targetContentItem[f.fieldName] = _formModel[f.fieldName]
        }
      }
    })
    if (typeName) {
      targetContentItem.ContentType = typeName
    }
    if (beforeUpdate) {
      beforeUpdate(targetContentItem)
    }
    console.log(targetContentItem, 'Saved content')
    await createOrUpdateContent(targetContentItem)
    return targetContentItem
  }

  // public async updateContentItem2(
  //   _formModel: any,
  //   fields: ContentFieldsMapping[] | ContentFieldsMappingDto[],
  //   targetContentItem: ContentItemUpperCase = {},
  //   typeName?: string,
  // ) {
  //   fields.forEach((f) => {
  //     {
  //       if (f.fieldName == 'DisplayText' && !f.partName) {
  //         targetContentItem.TitlePart = { Title: _formModel.DisplayText }
  //         targetContentItem.DisplayText = _formModel.DisplayText
  //         return
  //       }
  //       const val = eval(`_formModel.${f.fieldName}`)
  //       if (val !== undefined) {
  //         const pathArray = f.keyPath.split('.')
  //         if (pathArray.length > 1) {
  //           let temp = targetContentItem
  //           for (let index = 0; index < pathArray.length; index++) {
  //             let path = pathArray[index]
  //             const isLast = index == pathArray.length - 1
  //             if (path.includes('[0]')) {
  //               path = path.replace('[0]', '')
  //               temp[path] = [val]
  //             } else {
  //               if (!temp[path]) {
  //                 temp[path] = isLast ? val : {}
  //               }
  //             }
  //             //利用引用类型层级赋值
  //             temp = temp[path]
  //           }
  //         } else {
  //           targetContentItem[f.keyPath] = val
  //         }
  //       }
  //     }
  //   })
  //   if (typeName) {
  //     targetContentItem.ContentType = typeName
  //   }
  //   console.log(targetContentItem, 'Saved content')
  //   await createOrUpdateContent(targetContentItem)
  //   return targetContentItem
  // }

  public getFieldsFromType(
    typeDef: ContentTypeDefinitionDto,
    parentPath: string | undefined = '',
  ): ContentFieldsMapping[] {
    const cols: ContentFieldsMapping[] = []
    if (!!parentPath && !parentPath.endsWith('.')) {
      parentPath = parentPath + '.'
    }
    const dataPath = parentPath
    typeDef.parts?.forEach((x) => {
      if (x.partDefinition.name == 'TitlePart') {
        cols.push(
          deepMerge(new ContentFieldsMapping(), {
            displayName: t('显示名称'),
            partName: 'TitlePart',
            fieldType: FieldType.TitlePart,
            editable: false,
            lastValueKey: 'Title',
            visible: false,
            fieldName: 'DisplayText',
            keyPath: dataPath + 'TitlePart.Title',
            fieldSettings: x.partDefinition.settings,
            buildFrom: 'ContentTypeDefinition',
          }),
        )
      } else {
        cols.push(
          ...this.getFieldsFromPart(x.partDefinition, `${dataPath}${x.name}`),
        )
      }
    })
    return cols
  }

  public getFieldsFromPart(
    partDef: ContentPartDefinitionDto,
    parentPath = '',
  ): ContentFieldsMapping[] {
    const cols: ContentFieldsMapping[] = []
    if (!!parentPath && !parentPath.endsWith('.')) {
      parentPath = parentPath + '.'
    }
    const dataPath = parentPath
    partDef.fields?.forEach((x) => {
      const fieldType = x.fieldDefinition.name as FieldType
      const valuePath = getValuePath(fieldType)
      const col = deepMerge(new ContentFieldsMapping(), {
        displayName: x.displayName || '',
        buildFrom: 'ContentTypeDefinition',
        partName: partDef.name || '',
        fieldName: x.name || '',
        editable: true,
        lastValueKey: valuePath,
        visible: true,
        keyPath: `${dataPath}${x.name}.${valuePath}`,
        fieldSettings: x.settings,
        fieldType: fieldType,
      })
      cols.push(col)
    })
    return cols
  }

  public getColumns(
    def: ContentTypeDefinitionDto | ContentPartDefinitionDto,
    rootPath = '',
  ): BasicColumn[] {
    if (def instanceof ContentTypeDefinitionDto) {
      return this.getColumnsFromType(def as ContentTypeDefinitionDto, rootPath)
    } else {
      return this.getColumsFromPart(def as ContentPartDefinitionDto, rootPath)
    }
  }

  getGraphqlTableCols(
    typeDef: ContentTypeDefinitionDto,
    colFilter: string[],
    parentPath = '',
  ) {
    let cols: BasicColumn[] = []
    const fields = this.getFieldsFromType(typeDef, parentPath)

    cols = fields
      .filter((x) => colFilter.includes(x.fieldName.toLocaleLowerCase()))
      .map((x) => {
        return {
          title: t(x.displayName),
          dataIndex: camelCase(x.fieldName),
        } as BasicColumn
      })
    return cols
  }

  getColumnsFromType(
    typeDef: ContentTypeDefinitionDto,
    parentPath = '',
  ): BasicColumn[] {
    const fields = this.getFieldsFromType(typeDef, parentPath)
    const cols: BasicColumn[] = fields.map((x) => {
      return {
        title: t(x.displayName),
        dataIndex: x.keyPath.split('.'),
      } as BasicColumn
    })
    return cols
  }

  getColumsFromPart(
    partDef: ContentPartDefinitionDto,
    parentPath = '',
  ): BasicColumn[] {
    const cols: BasicColumn[] = []
    if (!!parentPath && !parentPath.endsWith('.')) {
      parentPath = parentPath + '.'
    }
    const dataPath = parentPath
    partDef.fields?.forEach((x) => {
      const col: BasicColumn = {
        title: x.displayName,
      }
      const valuePath = getValuePath(x.fieldDefinition.name as FieldType)
      col.dataIndex = `${dataPath}${x.name}.${valuePath}`.split('.')
      cols.push(col)
    })
    return cols
  }

  public getColumnsFromUserProperties(
    userProperties: ContentTypeDefinitionDto[],
    parentPath = 'properties.',
  ): BasicColumn[] {
    const cols: BasicColumn[] = []
    if (!!parentPath && !parentPath.endsWith('.')) {
      parentPath = parentPath + '.'
    }
    console.log(userProperties, 'userProperties')

    userProperties.forEach((x) => {
      console.log(x, 'userProperties.' + x.displayName)
      cols.push(...this.getColumnsFromType(x, `${parentPath}${x.name}`))
    })
    return cols
  }

  public getFormSchemaFromUserProperties(
    userProperties: ContentTypeDefinitionDto[],
    parentPath = 'properties.',
  ): FormSchema[] {
    const cols: FormSchema[] = []
    if (!!parentPath && !parentPath.endsWith('.')) {
      parentPath = parentPath + '.'
    }
    console.log(userProperties, 'userProperties')

    userProperties.forEach((x) => {
      console.log(x, 'userProperties.' + x.displayName)
      cols.push(...this.getFormSchemaFromType(x, `${parentPath}${x.name}`))
    })
    return cols
  }

  public getFormSchemaFromType(
    typeDef: ContentTypeDefinitionDto,
    parentPath = '',
  ): FormSchema[] {
    const cols: FormSchema[] = []
    if (!!parentPath && !parentPath.endsWith('.')) {
      parentPath = parentPath + '.'
    }
    const dataPath = parentPath
    typeDef.parts?.forEach((x) => {
      if (x.partDefinition.name == 'TitlePart') {
        cols.push({
          label: 'DisplayName',
          field: dataPath + 'TitlePart.Title',
          component: 'Input',
        })
      } else {
        cols.push(
          ...this.getFormSchemaFromPart(
            x.partDefinition,
            `${dataPath}${x.name}`,
          ),
        )
      }
    })
    return cols
  }

  public getFormSchemaFromPart(
    partDef: ContentPartDefinitionDto,
    parentPath = '',
  ): FormSchema[] {
    const cols: FormSchema[] = []
    if (!!parentPath && !parentPath.endsWith('.')) {
      parentPath = parentPath + '.'
    }
    const dataPath = parentPath
    partDef.fields?.forEach((x) => {
      let valuePath = getValuePath(x.fieldDefinition.name as FieldType)
      valuePath = `${dataPath}${x.name}.${valuePath}`
      const formItem: FormSchema = {
        label: x.displayName || '',
        field: valuePath,
        component: 'Input',
      }

      cols.push(formItem)
    })
    return cols
  }
}
