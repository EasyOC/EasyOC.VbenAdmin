import type {
  AccountParams,
  DeptListItem,
  MenuParams,
  // RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  // DeptListGetResultModel,
  // AccountListGetResultModel,
  RolePageListGetResultModel,
  // RoleListGetResultModel,
} from './model'
import { defaultRequest } from '../request'
import { RolesServiceProxy, UsersServiceProxy } from './api/app-service-proxies'
import { excuteGraphqlGetQuery } from './eoc/GraphqlService'

enum Api {
  // AccountList = '/system/getAccountList',
  IsAccountExist = '/system/accountExist',
  DeptList = '/system/getDeptList',
  setRoleStatus = '/system/setRoleStatus',
  MenuList = '/system/getMenuList',
  RolePageList = '/system/getRoleListByPage',
  GetAllRoleList = '/system/getAllRoleList',
}
export const userService = new UsersServiceProxy()

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
export const getDeptList = async (): Promise<DeptListItem[]> => {
  const result = await excuteGraphqlGetQuery({
    query: `query queryDepartment {
    queryDepartment {
      createdUtc
      description
      displayText
      modifiedUtc
      orderIndex
      publishedUtc
      status
      parentDepartmentId {
        contentItemIds
      }
      contentItemId
    }
  }`,
  })
  console.log('queryDepartment', result)
  // const sample = {
  //   createdUtc: '2022-01-10T11:16:08.5105019Z',
  //   description: null,
  //   displayText: '财务部',
  //   modifiedUtc: '2022-01-10T11:16:08.5105019Z',
  //   orderIndex: null,
  //   publishedUtc: '2022-01-10T11:16:08.5142674Z',
  //   status: true,
  // }
  const depList = result.data.queryDepartment.map((x) => {
    const dept = {
      id: x.contentItemId,
      deptName: x.displayText,
      orderNo: x.orderIndex,
      createTime: x.createdUtc,
      remark: x.description,
      status: x.status ? 1 : 0,
    } as DeptListItem
    if (x.parentDepartmentId?.contentItemIds) {
      dept.parentId = x.parentDepartmentId.contentItemIds[0]
    }
    return dept
  })
  console.log(depList, 'depList')
  return depList
  // defaultRequest.get<DeptListGetResultModel>({ url: Api.DeptList, params })
}

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
