import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

import { useGlobSetting } from '/@/hooks/setting';

enum Api {
  Login = '/connect/token',
  Logout = '/connect/logout',
  GetUserInfo = '/connect/userinfo',
  GetPermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  const { username, password } = params;
  const model = { userNameOrEmailAddress: username, password, rememberClient: true };
  return defHttp.removeFilterPost({
    url: Api.Login,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    data: {
      grant_type: 'password',
      client_id: useGlobSetting().clientId,
      username: username,
      password: password,
      scopes: useGlobSetting().scopes,
    },
  });
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.removeFilterGet({ url: Api.Logout });
}
