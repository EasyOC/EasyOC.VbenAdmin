import { defHttp, otherHttp } from '/@/utils/http/axios';
import { AuthenticateResultModel } from '/@/api/abp-service-proxies'
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/api/TokenAuth/Authenticate',
  Logout = '/users/logout',
  GetUserInfo = '/api/services/app/Session/GetCurrentLoginInformations',
  GetPermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  let { username, password } = params;
  const model = { userNameOrEmailAddress: username, password, rememberClient: true }
  return otherHttp.post<AuthenticateResultModel>(
    {
      url: Api.Login,
      params:model,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return otherHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return otherHttp.get({ url: Api.Logout });
}
