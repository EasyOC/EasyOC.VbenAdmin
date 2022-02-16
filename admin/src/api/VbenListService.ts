import { camelCase } from '@admin/utils'
import { excuteGraphqlQuery } from '@service/eoc/GraphqlService'
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
    const variables: any = { ...params }
    if (this.listConfig?.enablePage) {
      variables.from = (params.page - 1) * params.pageSize
      variables.skip = params.pageSize
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
    return result.data[camelCase(this.listConfig?.targetContentType) || '']
  }

  public async getListConfig() {
    if (!this.listConfig) {
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
      this.listConfig = result.data.vbenList[0] as VbenListConfigModel
    }
    return this.listConfig
  }
}
