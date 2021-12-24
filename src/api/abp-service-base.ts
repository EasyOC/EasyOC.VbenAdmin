import { AxiosResponse } from 'axios'
import  { otherHttp } from "/@/utils/http/axios/index";

export class AbpServiceBase {
  public ajax = otherHttp.getAxios();
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
