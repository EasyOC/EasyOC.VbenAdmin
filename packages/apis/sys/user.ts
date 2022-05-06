import type { ErrorMessageMode } from '../../types'
import { ocApi, request } from '../../request'
import { ContentTypeEnum } from '../../tokens'
import { context } from '../../request/bridge'

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string
  password: string
  rememberMe: boolean
}

export interface RoleInfo {
  roleName: string
  value: string
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number
  token: string
  role: RoleInfo
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: string[]
  // 用户id
  userId: string | number
  // 用户名
  username: string
  // 真实名字
  realName: string
  // 头像
  avatar: string
  // 介绍
  desc?: string
  email: string
}

enum Api {
  Login = '/connect/token',
  Logout = '/connect/logout',
  GetUserInfo = '/connect/userinfo',
  GetPermCode = '/getPermCode',
}
/**
 * @description: user login api
 */

/**
 * @description: user login api
 */
 export async function loginApi(
  params: LoginParams,
  mode: ErrorMessageMode = 'modal',
) {
  const { username, password, rememberMe } = params
  const result = await ocApi.post(
    {
      url: Api.Login,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data: {
        grant_type: 'password',
        client_id: context.clientId,
        username: username,
        password: password,
        rememberMe: rememberMe,
        scope: 'openid profile roles offline_access',
      },
    },
    {
      // withToken: false,
      // isTransformResponse: false,
      errorMessageMode: mode,
    },
  )
  return result.data
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return request.get<GetUserInfoModel>(
    { url: Api.GetUserInfo },
    { errorMessageMode: 'none' },
  )
}

export function getPermCode() {
  return request.get<string[]>({ url: Api.GetPermCode })
}

export function doLogout() {
  return request.get({ url: Api.Logout })
}
