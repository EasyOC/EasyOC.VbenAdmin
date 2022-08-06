import { AxiosResponse } from 'axios'
import { request as defaultRequest  } from '@pkg/request'

export class AppServiceBase {
  public ajax = defaultRequest
  /**
   * API 响应结果根据 调用的 axios 实例自动配置,
   * 比如如果使用defaultRequest将会 在拦截器中处理结果
   * 如果使用 ocApi 则并不会对结果进行任何处理
   */
  protected transformResult(response: AxiosResponse): Promise<any> {
    // console.log('response', response)
    return Promise.resolve(response)
  }

  protected isNotNull(arg: any): Boolean {
    if (arg != undefined && arg != null && arg !== '') {
      return true
    } else {
      return false
    }
  }

  protected throwException(
    message: string,
    status: number,
    response: string,
    headers: { [key: string]: any },
    result?: any,
  ): any {
    throw new ApiException(message, status, response, headers, result)
  }
}
export class ApiException extends Error {
  message: string
  status: number
  response: string
  headers: { [key: string]: any }
  result: any

  constructor(
    message: string,
    status: number,
    response: string,
    headers: { [key: string]: any },
    result: any,
  ) {
    super()

    this.message = message
    this.status = status
    this.response = response
    this.headers = headers
    this.result = result
  }

  protected isApiException = true

  static isApiException(obj: any): obj is ApiException {
    return obj.isApiException === true
  }
}
