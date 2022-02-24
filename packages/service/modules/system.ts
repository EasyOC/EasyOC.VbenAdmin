import type {
  AccountParams,
  DeptListItem,
  MenuParams,
  // RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  // DeptListGetResultModel,
  // AccrountListGetResultModel,
  RolePageListGetResultModel,
  // RoleListGetResultModel,
} from './model'
import { defaultRequest } from '../request'
import { RolesServiceProxy, UsersServiceProxy } from './api/app-service-proxies'
import { excuteGraphqlQuery } from './eoc/GraphqlService'
import { listToTree } from '@admin/utils/src/helper/tree'

enum Api {
  // AccountList = '/system/getAccountList',
  IsAccountExist = '/system/accountExist',
  DeptList = '/system/getDeptList',
  setRoleStatus = '/system/setRoleStatus',
  MenuList = '/system/getMenuList',
  RolePageList = '/system/getRoleListByPage',
  GetAllrRoleList = '/system/getrAllRoleList',
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
  const result = await excuteGraphqlQuery({
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

  return listToTree(depList, {
    pid: 'parentId',
  })
}

export const getMenuList = async () => {
  const result = await excuteGraphqlQuery({
    query: `query MyQurery {
          vbenMenu {
            contentItemId
            menuName
            icon
            permission
            component
            orderNo
            status
            modifiedUtc
            createdUtc
            routePath
            parentMenu {
              contentItems {
                contentItemId
              }
            }
          }
        }`,
  })
  const menuList = result.data.vbenMenu as []

  const treeMenu = listToTree(menuList, {
    id: 'contentItemId',
    rootFinder: (node) => !node.parentMenu?.contentItems[0]?.contentItemId,
    parentFinder: (parent, current) => {
      return (
        parent.contentItemId ==
        current.parentMenu?.contentItems[0]?.contentItemId
      )
    },
  })
  console.log('treeMenu: ', treeMenu)
  return treeMenu
}

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
