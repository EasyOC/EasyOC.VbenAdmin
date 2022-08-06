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
  access_token: string
  expires_in: number
  token_type: string
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
