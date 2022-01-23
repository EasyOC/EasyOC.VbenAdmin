import { AxiosRequestConfig } from 'axios'
import { ocApi } from '../../request'
import { ApiServiceProxy, ContentItem } from '../api/app-service-proxies'
const api = new ApiServiceProxy(ocApi)
/**
 * 创建或更新内容项
 * @param contentItem 内容对象，从 getContentItem 获取对象后更新
 * @param draft 是否作为草稿更新，默认值否，直接发布
 */
export const createOrUpdateContent = async (
  contentItem: ContentItem | undefined,
  draft: boolean | undefined = false,
) => {
  await api.contentPost(draft, contentItem)
}
/**
 * 根据指定的内容项id 获取内容
 * @param contentItemId 内容项ID
 * @returns 内容项实例
 */
export const getContent = async (contentItemId: string) => {
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
export const deletContent = async (contentItemId: string) => {
  return await api.contentDelete(contentItemId)
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

export type ContentFieldsMapping = {
  keyPath: string
  filedName: string
  displayName: string
  fieldType: ContentFiledType
  editable: boolean
  visable: boolean
  partName: string
  fieldSettings: any
  buildFrom: 'ContentTypeDefinition' | 'GraphQL'
}

export enum ContentFiledType {
  TextField = 'TextField',
  BooleanField = 'BooleanField',
  DateField = 'DateField',
  TimeField = 'TimeField',
  DateTimefield = 'Date&Timefield',
  NumericField = 'NumericField',
  ContentPickerField = 'ContentPickerField',
  UserPickerField = 'UserPickerField',
  TitlePart = 'TitlePart',
}
