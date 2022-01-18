import { BasicColumn, FormSchema } from '@/components/Table'
import {
  ContentTypeDefinitionDto,
  ContentPartDefinitionDto,
} from '@service/api/app-service-proxies'

export class ContentHelper {
  public getColumns(
    def: ContentTypeDefinitionDto | ContentPartDefinitionDto | any,
    rootPath = '',
  ): BasicColumn[] {
    if (def instanceof ContentTypeDefinitionDto) {
      return this.getColumnsFromType(def as ContentTypeDefinitionDto, rootPath)
    } else {
      return this.getColumsFromPart(def as ContentPartDefinitionDto, rootPath)
    }
  }

  public getColumsFromPart(
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

      const valuePath = this.buildPath(x.fieldDefinition.name)

      col.dataIndex = `${dataPath}${x.name}.${valuePath}`.split('.')
      cols.push(col)
    })
    return cols
  }

  public getColumnsFromType(
    typeDef: ContentTypeDefinitionDto,
    parentPath = '',
  ): BasicColumn[] {
    const cols: BasicColumn[] = []
    if (!!parentPath && !parentPath.endsWith('.')) {
      parentPath = parentPath + '.'
    }
    const dataPath = parentPath
    typeDef.parts?.forEach((x) => {
      if (x.partDefinition.name == 'TitlePart') {
        cols.push({
          title: 'DisplayName',
          dataIndex: dataPath + 'TitlePart.Title',
        })
      } else {
        cols.push(
          ...this.getColumsFromPart(x.partDefinition, `${dataPath}${x.name}`),
        )
      }
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
      let valuePath = this.buildPath(x.fieldDefinition.name)
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

  public buildPath(fieldName: string | null) {
    let valuePath = 'Value'
    switch (fieldName) {
      case 'TextField':
        valuePath = 'Text'
        break
      case 'BooleanField':
        valuePath = 'Value'
        break
      case 'DateField':
        valuePath = 'Value'
        break
      case 'TimeField':
        valuePath = 'Value'
        break
      case 'Date&Timefield':
        valuePath = 'Value'
        break
      case 'NumericField':
        valuePath = 'Value'
        break
      case 'ContentPickerField':
      case 'UserPickerField':
        valuePath = 'DisplayText'
        break
    }
    return valuePath
  }
}
