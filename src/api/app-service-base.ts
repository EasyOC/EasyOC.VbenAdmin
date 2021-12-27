import { AxiosResponse } from 'axios';
import { defHttp } from '/@/utils/http/axios/index';

export class AppServiceBase {
  public ajax = defHttp.getAxios();

  protected transformResult(response: AxiosResponse): Promise<any> {
    console.log('response.data.result', response);

    return response.data.result;
  }

  protected isNotNull(arg: any): Boolean {
    if (arg != undefined && arg != null && arg !== '') {
      return true;
    } else {
      return false;
    }
  }
}
