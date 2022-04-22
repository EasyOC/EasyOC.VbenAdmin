import { camelCase } from '@pkg/utils'
import { excuteGraphqlQuery } from '@pkg/apis/eoc/GraphqlService'
export interface VbenListConfigModel {
  enablePage: boolean
  fieldList: []
  graphQL: string
  listMapping: string
  queryMethod: string
  queryName: string
  targetContentType: string
  pageTitle: string
  displayText: string
}

export default class VbenListService {
  private listConfigName: string

  constructor(listConfigName: string) {
    this.listConfigName = listConfigName
  }
  private listConfig?: VbenListConfigModel

  public async getListData(params) {
    if (!this.listConfig) {
      this.listConfig = await this.getListConfig()
    }
    const variables: any = {}
    if (this.listConfig?.enablePage) {
      params.from = (params.page - 1) * params.pageSize
      params.skip = params.pageSize
      params.page = params.pageSize = undefined
    }
    if (params) {
      variables.params = JSON.stringify(params)
    }
    console.log('variables: ', variables)
    const result = await excuteGraphqlQuery({
      variables,
      query: `query MyQuery($params:String) {
              ${this.listConfig?.queryName}(parameters:$params) {
                  ${
                    this.listConfig?.enablePage
                      ? `total
                         items`
                      : ''
                  }
                  ${this.listConfig?.graphQL} 
                }
              }`,
    })
    return result.data[this.listConfig?.queryName]
  }

  public async getListConfig() {
    const result = await excuteGraphqlQuery({
      query: `query MyQuery {
                vbenList(first: 1, where: {displayText: "${this.listConfigName}"}) {
                  displayText
                  enablePage
                  fieldList
                  graphQL
                  listMapping
                  queryMethod
                  queryName
                  targetContentType
                }
              }`,
    })
    return (this.listConfig = result.data.vbenList[0] as VbenListConfigModel)
  }
}
