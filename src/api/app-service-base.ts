import { AxiosResponse } from 'axios'
import  { defHttp } from "/@/utils/http/axios/index";

export class AppServiceBase {
  public ajax = defHttp.getAxios();
  protected transformResult(url: string, response: AxiosResponse, processor: (response: AxiosResponse) => Promise<any>): Promise<any> {
    return processor(response)
  }

  protected isNotNull(arg: any): Boolean {
    if (arg != undefined && arg != null && arg !== '') {
      return true
    } else {
      return false
    }
  }
}
