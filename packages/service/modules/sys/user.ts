import type { ErrorMessageMode } from '@admin/types'
import type { LoginParams, LoginResultModel, GetUserInfoModel } from '../model'
import { ContentTypeEnum } from '@admin/tokens'
import { defaultRequest, ocApi } from '../../request'
import { context } from '../../_bridge'

enum Api {
  Login = '/connect/token',
  Logout = '/connect/logout',
  GetUserInfo = '/connect/userinfo',
  GetPermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export async function loginApi(
  params: LoginParams,
  mode: ErrorMessageMode = 'modal',
) {
  const { username, password } = params
  const result = await ocApi.post(
    {
      url: Api.Login,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: {
        grant_type: 'password',
        client_id: context.clientId,
        username: username,
        password: password,
        scopes: context.scopes,
      },
    },
    {
      errorMessageMode: mode,
    },
  )
  return result.data
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return ocApi.get<GetUserInfoModel>(
    { url: Api.GetUserInfo },
    { errorMessageMode: 'none' },
  )
}

export function getPermCode() {
  return defaultRequest.get<string[]>({ url: Api.GetPermCode })
}

export function doLogout() {
  return ocApi.get({ url: Api.Logout })
}
