import { BasicColumn, FormSchema } from '@/components/Table'
import { ContentFieldsMapping, ContentFiledType } from '@service/eoc/contentApi'
import {
  ContentTypeDefinitionDto,
  ContentPartDefinitionDto,
} from '@service/api/app-service-proxies'
import { t } from '@admin/locale'

export class ContentHelper {
  public getAllFields(
    def: ContentTypeDefinitionDto | ContentPartDefinitionDto,
    rootPath = '',
  ): ContentFieldsMapping[] {
    return this.getFieldsFromType(def as ContentTypeDefinitionDto, rootPath)
  }

  public getFieldsFromType(
    typeDef: ContentTypeDefinitionDto,
    parentPath = '',
  ): ContentFieldsMapping[] {
    const cols: ContentFieldsMapping[] = []
    if (!!parentPath && !parentPath.endsWith('.')) {
      parentPath = parentPath + '.'
    }
    const dataPath = parentPath
    typeDef.parts?.forEach((x) => {
      if (x.partDefinition.name == 'TitlePart') {
        cols.push({
          displayName: t('显示名称'),
          partName: 'TitlePart',
          fieldType: ContentFiledType.TitlePart,
          editable: false,
          visable: false,
          filedName: 'DisplayText',
          keyPath: dataPath + 'TitlePart.Title',
          fieldSettings: x.partDefinition.settings,
          buildFrom: 'ContentTypeDefinition',
        })
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
      const fieldType = x.fieldDefinition.name as ContentFiledType
      const valuePath = this.buildPath(fieldType)

      const col: ContentFieldsMapping = {
        displayName: x.displayName || '',
        buildFrom: 'ContentTypeDefinition',
        partName: partDef.name || '',
        filedName: x.name || '',
        editable: true,
        visable: true,
        keyPath: `${dataPath}${x.name}.${valuePath}`,
        fieldSettings: x.settings,
        fieldType: fieldType,
      }
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

      const valuePath = this.buildPath(
        x.fieldDefinition.name as ContentFiledType,
      )

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
      let valuePath = this.buildPath(x.fieldDefinition.name as ContentFiledType)
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

  public buildPath(fieldName: ContentFiledType | string) {
    let valuePath = 'Value'
    switch (fieldName) {
      case ContentFiledType.TextField:
        valuePath = 'Text'
        break
      case ContentFiledType.BooleanField:
        valuePath = 'Value'
        break
      case ContentFiledType.DateField:
        valuePath = 'Value'
        break
      case ContentFiledType.TimeField:
        valuePath = 'Value'
        break
      case ContentFiledType.DateTimefield:
        valuePath = 'Value'
        break
      case ContentFiledType.NumericField:
        valuePath = 'Value'
        break
      case ContentFiledType.ContentPickerField:
      case ContentFiledType.UserPickerField:
        valuePath = 'DisplayText'
        break
    }
    return valuePath
  }
}
