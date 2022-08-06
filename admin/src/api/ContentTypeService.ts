import { BasicColumn, FormSchema } from '@/components/Table'
import { useAppStore } from '@/store/app'
import { parser } from 'xijs'
import {
  ContentTypeDefinitionDto,
  ContentPartDefinitionDto,
  ContentManagementServiceProxy,
  ContentFieldsMappingDto,
} from '@service/api/app-service-proxies'
import {
  ContentFieldsMapping,
  ContentItemUpperCase,
  createOrUpdateContent,
} from '@service/eoc/contentApi'
import { deepMerge } from '@admin/utils'
export class GraphqlQuery {
  public query!: string
  public hasTotal = true
}

export class ContentTypeService {
  constructor(contentType: string) {
    this.ContentType = contentType
    this.ContentManagementService = new ContentManagementServiceProxy()
  }
  public ContentType: string
  public ContentTypeDefinitionDto!: ContentTypeDefinitionDto

  public async loadType() {
    this.ContentTypeDefinitionDto =
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

  public ContentManagementService: ContentManagementServiceProxy

  private fields: ContentFieldsMapping[] = []

  public async getAllFields(typeName: string, reload = false) {
    //字段全局缓存
    const appStore = useAppStore()
    this.fields = appStore.typeFieldCache[typeName]

    if (reload || !this.fields || this.fields.length == 0) {
      this.fields = (
        await new ContentManagementServiceProxy().getFields(typeName)
      ).map((x) => deepMerge(new ContentFieldsMapping(), x))
      appStore.typeFieldCache[typeName] = this.fields
      console.log(`typeName:${typeName},缓存已更新`, this.fields)
      // appStore.updateTypeFieldCache(typeName, this.fields)
    } else {
      console.log(`typeName:${typeName},已从缓存读取`, this.fields)
    }
    return this.fields
  }

  public expandContentType(
    _contentItem: ContentItemUpperCase,
    fields: ContentFieldsMapping[] | ContentFieldsMappingDto[],
    // toCamelCase = false,
  ) {
    const expandedContentItem: any = {}
    fields.forEach((f) => {
      expandedContentItem[f.fieldName] = eval(`_contentItem.${f.keyPath}`)
    })
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
}
