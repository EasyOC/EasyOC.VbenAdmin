import { ContentTypeEnum } from '@admin/tokens'
import { ocApi } from '../../request'
import { BasicFetchResult } from '../model'

export const GraphqlServiceAPI = '/api/graphql'

export const excuteGraphqlPostQuery = async (data: {
  operationName: string
  query: string
  variables: any
}) => {
  return await ocApi.post({ url: GraphqlServiceAPI, data: data })
}

export const excuteGraphqlGetQuery = async (params: { query: string }) => {
  const result = await ocApi.get({
    url: GraphqlServiceAPI,
    params: params,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  })
  return result.data
}

export const excuteGraphqlGetPagedQuery = async (params: {
  query: string
}): Promise<BasicFetchResult<any>> => {
  const result = await ocApi.get({
    url: GraphqlServiceAPI,
    params: params,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  })
  if (result.headers['query_total'] && result.data.data) {
    const resultDescription = JSON.parse(result.headers['query_total'])
    return {
      items: result.data.data[resultDescription.queryName],
      total: resultDescription.total,
    } as BasicFetchResult<any>
  }
  throw '返回结果错误'
}
