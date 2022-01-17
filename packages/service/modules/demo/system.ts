import type {
  AccountParams,
  DeptListItem,
  MenuParams,
  RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  DeptListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel,
} from '../model'
import { defaultRequest } from '../../request'
import { RolesServiceProxy, UsersServiceProxy } from '../app-service-proxies'

enum Api {
  AccountList = '/system/getAccountList',
  IsAccountExist = '/system/accountExist',
  DeptList = '/system/getDeptList',
  setRoleStatus = '/system/setRoleStatus',
  MenuList = '/system/getMenuList',
  RolePageList = '/system/getRoleListByPage',
  GetAllRoleList = '/system/getAllRoleList',
}
const userService = new UsersServiceProxy()

export async function getAccountList(params: AccountParams) {
  const data = await userService.getAll(params)
  return data
}
// defaultRequest.get<AccountListGetResultModel>({
//   url: Api.AccountList,
//   params,
// })
export const getUserDetails = (id: string) => userService.getUser(id)
export const getAllRoleList = async () => {
  const roles = await new RolesServiceProxy().getRoles()
  return roles
  // defHttp.get<RoleListGetResultModel>({ url: Api.GetAllRoleList, params });
}
export const getDeptList = (params?: DeptListItem) =>
  defaultRequest.get<DeptListGetResultModel>({ url: Api.DeptList, params })

export const getMenuList = (params?: MenuParams) =>
  defaultRequest.get<MenuListGetResultModel>({ url: Api.MenuList, params })

export const getRoleListByPage = (params?: RolePageParams) =>
  defaultRequest.get<RolePageListGetResultModel>({
    url: Api.RolePageList,
    params,
  })

export const setRoleStatus = (id: number, status: string) =>
  defaultRequest.post({ url: Api.setRoleStatus, params: { id, status } })

export const isAccountExist = (account: string) =>
  defaultRequest.post(
    { url: Api.IsAccountExist, params: { account } },
    { errorMessageMode: 'none' },
  )
