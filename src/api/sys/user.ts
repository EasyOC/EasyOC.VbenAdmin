import { defHttp, otherHttp } from '/@/utils/http/axios';
import { AuthenticateResultModel } from '/@/api/abp-service-proxies';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

import { useGlobSetting } from '/@/hooks/setting';

enum Api {
  Login = '/connect/token',
  Logout = '/users/logout',
  GetUserInfo = '/connect/userinfo',
  GetPermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  let { username, password } = params;
  const model = { userNameOrEmailAddress: username, password, rememberClient: true };
  console.log('useGlobSetting().clientId: ', useGlobSetting().clientId);
  return defHttp.removeFilterPost({
    url: Api.Login,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    data: {
      grant_type: 'password',
      // client_id: useGlobSetting().clientId,
      client_id: "vue_client_app",
      username: username,
      password: password,
      scopes: useGlobSetting().scopes,
    },
  });

  // .post<AuthenticateResultModel>(
  //   {
  //     url: Api.Login,
  //     headers:{
  //       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  //     },
  //     data:new URLSearchParams({
  //       grant_type: "password",
  //       client_id: useGlobSetting().clientId,
  //       username: username,
  //       password: password,
  //       scopes: useGlobSetting().scopes,
  //     })
  //   },
  //   {
  //     errorMessageMode: mode,
  //   },
  // );
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
  return defHttp.get({ url: Api.Logout });
}
