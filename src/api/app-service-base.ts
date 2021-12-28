import { AxiosResponse } from 'axios';
import { defHttp } from '/@/utils/http/axios/index';

export class AppServiceBase {
  public ajax = defHttp.getAxios();

  protected transformResult(response: AxiosResponse): Promise<any> {
    console.log('response.data.result', response);
    const { status } = response;
    // return Promise.resolve(response.data.result);
    if (status === 200) {
      return response.data.result;
    } else {
      const _responseText = response.data.result;
      return this.throwException(
        'An unexpected server error occurred.',
        status,
        _responseText,
        response.headers,
      );
    }
  }

  protected isNotNull(arg: any): Boolean {
    if (arg != undefined && arg != null && arg !== '') {
      return true;
    } else {
      return false;
    }
  }

  protected throwException(
    message: string,
    status: number,
    response: string,
    headers: { [key: string]: any },
    result?: any,
  ): any {
    throw new ApiException(message, status, response, headers, result);
  }
}
export class ApiException extends Error {
  message: string;
  status: number;
  response: string;
  headers: { [key: string]: any };
  result: any;

  constructor(
    message: string,
    status: number,
    response: string,
    headers: { [key: string]: any },
    result: any,
  ) {
    super();

    this.message = message;
    this.status = status;
    this.response = response;
    this.headers = headers;
    this.result = result;
  }

  protected isApiException = true;

  static isApiException(obj: any): obj is ApiException {
    return obj.isApiException === true;
  }
}
