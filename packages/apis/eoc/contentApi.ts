import { AxiosRequestConfig } from 'axios'
import { ocApi } from '@pkg/request'
import { ApiServiceProxy } from './app-service-proxies'
import { excuteGraphqlQuery } from './graphqlApi'
import { deepMerge } from '../../utils'
const api = new ApiServiceProxy(ocApi)
/**
 * 创建或更新内容项
 * @param contentItem 内容对象，从 getContentItem 获取对象后更新
 * @param draft 是否作为草稿更新，默认值否，直接发布
 */
export const createOrUpdateContent = async (
  contentItem: ContentItemUpperCase | undefined,
  draft: boolean | undefined = false,
) => {
  let url_ = '/api/content?'

  if (draft !== undefined && draft !== null)
    url_ += 'draft=' + encodeURIComponent('' + draft) + '&'
  url_ = url_.replace(/[?&]$/, '')

  const options_ = <AxiosRequestConfig>{
    data: contentItem,
    method: 'POST',
    url: url_,
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
  }
  const result = await ocApi.request(options_)
  return result
}

export const getGPContentItem = async (contentItemId: string | undefined | null,
  // contentType: string | undefined | null = '',
  additionalFields: string | undefined | null = '',
) => {
  const result = await excuteGraphqlQuery({
    query: `
        {
          contentItem(contentItemId: "${contentItemId}") {
            owner
            author
            contentType
            contentItemId
            contentItemVersionId
            displayText
            modifiedUtc
            published
            publishedUtc
            createdUtc
            latest
            ${additionalFields}
          }
        }
      `})
  console.log("getGPContentItem-contentItem:", result)
  return result.data.contentItem as GpContentItem;
}

/**
 * 根据指定的内容项id 获取内容
 * @param contentItemId 内容项ID
 * @returns 内容项实例
 */
export const getContent = async (contentItemId: string | undefined | null) => {
  let url_ = '/api/content/{contentItemId}'
  if (contentItemId === undefined || contentItemId === null)
    throw new Error("The parameter 'contentItemId' must be defined.")
  url_ = url_.replace('{contentItemId}', encodeURIComponent('' + contentItemId))
  url_ = url_.replace(/[?&]$/, '')
  const options_ = <AxiosRequestConfig>{
    method: 'GET',
    url: url_,
  }
  const result = await ocApi.request(options_)
  return result.data as ContentItemUpperCase
}

/**
 * 根据指定的内容项id 获取内容
 * @param contentItemId 内容项ID
 * @returns 内容项实例
 */
export const deleteContent = async (contentItemId: string) => {
  return await api.contentDelete(contentItemId)
}


export class GpContentItem {
  constructor(contentType: string) {
    this.contentType = contentType
  }
  updateProps(props: any) {
    return deepMerge(this, props)
  }
  owner!: string | null;
  author!: string | null;
  contentType!: string;
  contentItemId!: string | null;
  contentItemVersionId!: string | null;
  displayText!: string | null;
  modifiedUtc!: Date;
  publishedUtc!: Date;
  createdUtc!: Date;
  published!: boolean;
  latest!: boolean;
  [key: string]: any;
}
export class ContentItemUpperCase {
  ContentItemId?: string
  ContentItemVersionId?: string
  ContentType?: string
  DisplayText?: string
  Latest?: boolean
  Published?: boolean
  ModifiedUtc?: string
  PublishedUtc?: string
  CreatedUtc?: string
  Owner?: string
  Author?: string;
  [key: string]: any
}

export enum FieldType {
  TextField = 'TextField',
  BooleanField = 'BooleanField',
  DateField = 'DateField',
  TimeField = 'TimeField',
  DateTimeField = 'DateTimeField',
  NumericField = 'NumericField',
  ContentPickerField = 'ContentPickerField',
  UserPickerField = 'UserPickerField',
  HtmlField = 'HtmlField',
  MediaField = 'MediaField',
  TitlePart = 'TitlePart',
  CustomField = 'CustomField',
  GeoPointField = 'GeoPointField'
}

export function getValuePath(fieldName: FieldType | string) {
  let valuePath = 'Value'
  switch (fieldName) {
    case FieldType.TextField:
      valuePath = 'Text'
      break
    case FieldType.BooleanField:
    case FieldType.DateField:
    case FieldType.TimeField:
    case FieldType.DateTimeField:
    case FieldType.NumericField:
      valuePath = 'Value'
      break
    case FieldType.ContentPickerField:
      valuePath = 'ContentItemIds'
    case FieldType.UserPickerField:
      valuePath = 'DisplayText'
      break
    default:
      return null
  }
  return valuePath
}

export const NormalFields = [
  FieldType.TitlePart,
  FieldType.UserPickerField,
  FieldType.UserPickerField,
]

export class ContentFieldsMapping {
  keyPath!: string
  lastValueKey!: string
  fieldName!: string
  fieldNameCamelCase!: string | null
  displayName!: string
  fieldType!: FieldType
  editable!: boolean
  visible = true
  description!: string
  partName!: string
  fieldSettings: any
  buildFrom!: 'ContentTypeDefinition' | 'GraphQL'
}
