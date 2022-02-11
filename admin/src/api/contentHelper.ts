import { BasicColumn, FormSchema } from '@/components/Table'
import {
  ContentFieldsMapping,
  FieldType,
  ContentItemUpperCase,
  getValuePath,
} from '@service/eoc/contentApi'
import {
  ContentTypeDefinitionDto,
  ContentPartDefinitionDto,
} from '@service/api/app-service-proxies'
import { t } from '@admin/locale'
import { camelCase, deepMerge } from '@admin/utils'

export class ContentHelper {
  public getAllFields(
    def: ContentTypeDefinitionDto | ContentPartDefinitionDto,
  ): ContentFieldsMapping[] {
    return this.getFieldsFromType(def as ContentTypeDefinitionDto)
  }
  public expandContentType(
    _contentItem: ContentItemUpperCase,
    fields: ContentFieldsMapping[],
    toCamelCase = false,
  ) {
    const expandedContentItem: any = {}
    fields.forEach((f) => {
      if (toCamelCase) {
        expandedContentItem[camelCase(f.fieldName)] = eval(
          `_contentItem.${f.keyPath}`,
        )
      } else {
        expandedContentItem[f.fieldName] = eval(`_contentItem.${f.keyPath}`)
      }
    })
    expandedContentItem.isCamelCase = toCamelCase
    return expandedContentItem
  }

  public updateContentItem(
    _formModel: any,
    targetContentItem: ContentItemUpperCase,
    fields: ContentFieldsMapping[],
  ) {
    fields.forEach((f) => {
      if (_formModel.isCamelCase) {
        eval(
          `targetContentItem.${f.keyPath}=_formModel.${camelCase(
            f.fieldName,
          )}||null`,
        )
      } else {
        eval(`targetContentItem.${f.keyPath}=_formModel.${f.fieldName}||null`)
      }
    })
    return targetContentItem
  }

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
