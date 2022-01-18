import { ContentTypeEnum } from '@admin/tokens'
import { ocApi } from '../../request'

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
