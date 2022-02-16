import { BasicColumn, FormSchema } from '@/components/Table'
import { useAppStore } from '@/store/app'
import { parser } from 'xijs'
import {
  ContentTypeDefinitionDto,
  ContentManagementServiceProxy,
  ContentPartDefinitionDto,
} from '@service/api/app-service-proxies'
import {
  ContentFieldsMapping,
  ContentItemUpperCase,
  createOrUpdateContent,
  deletContent,
  getContent,
} from '@service/eoc/contentApi'
import { deepMerge } from '@admin/utils'
export class GraphqlQuery {
  public query!: string
  public hasTotal = true
}

export class ContentTypeService {
  ContentManagementService = new ContentManagementServiceProxy()
  constructor(contentType: string) {
    this.ContentType = contentType
  }
  public ContentType: string
  public contentTypeDefinition!: ContentTypeDefinitionDto

  public async loadType() {
    this.contentTypeDefinition =
      await this.ContentManagementService.getTypeDefinition({
        name: this.ContentType,
        withSettings: true,
      })
  }

  public async getTableSchema(graphQLQuery: GraphqlQuery) {
    const appStore = useAppStore()
    await appStore.loadGraphQLSchema()
    console.log(appStore.graphqlSchema, 'appStore.graphqlSchema')
    return graphQLQuery
  }

  private fields: ContentFieldsMapping[] = []

  public async getAllFields(reload = false) {
    //字段全局缓存
    const appStore = useAppStore()
    this.fields = appStore.typeFieldCache[this.ContentType]

    if (reload || !this.fields || this.fields.length == 0) {
      this.fields = (
        await new ContentManagementServiceProxy().getFields(this.ContentType)
      ).map((x) => deepMerge(new ContentFieldsMapping(), x))
      appStore.typeFieldCache[this.ContentType] = this.fields
      console.log(`typeName:${this.ContentType},缓存已更新`, this.fields)
      // appStore.updateTypeFieldCache(typeName, this.fields)
    } else {
      console.log(`typeName:${this.ContentType},已从缓存读取`, this.fields)
    }
    return this.fields
  }

  public async getContent(contentItemId: string) {
    return await getContent(contentItemId)
  }
  public async deletContent(contentItemId: string) {
    return await deletContent(contentItemId)
  }

  public expandContentType(
    _contentItem: ContentItemUpperCase,
    // toCamelCase = false,
  ) {
    const expandedContentItem: any = {}
    this.fields.forEach((f) => {
      expandedContentItem[f.fieldName] = eval(`_contentItem.${f.keyPath}`)
    })
    return expandedContentItem
  }

  public async saveContentItem(
    _formModel: any,
    targetContentItem: ContentItemUpperCase = {},
    typeName?: string,
    beforeUpdate?: (contentItem: ContentItemUpperCase) => boolean,
  ) {
    this.fields.forEach((f) => {
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
