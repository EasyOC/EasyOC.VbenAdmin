// import { BasicColumn, FormSchema } from '@/components/Table'
import { useAppStore } from '@/store/app'
import { parser } from 'xijs'
import {
  ContentTypeDefinitionDto,
  ContentManagementServiceProxy,
  ContentFieldsMappingDto,
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
  public ContentTypeDefinitionDto!: ContentTypeDefinitionDto

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
}
