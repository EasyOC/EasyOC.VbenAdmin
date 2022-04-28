
import { request } from '../request'

import type { BasicPageParams, BasicFetchResult } from './types'
import { RolesServiceProxy, UsersServiceProxy } from './eoc/app-service-proxies'
import { excuteGraphqlQuery } from './eoc/graphqlApi'
import { listToTree } from '../utils'



export type AccountParams = BasicPageParams & {
  selectedRole: string | undefined
  sortField: string | undefined
  sortOrder: string | undefined
  departmentId: string | undefined
  filter: string | undefined
}

export type RoleParams = {
  roleName?: string
  status?: string
}

export type RolePageParams = BasicPageParams & RoleParams

export type DeptParams = {
  deptName?: string
  status?: string
}

export type MenuParams = {
  menuName?: string
  status?: string
}

export interface AccountListItem {
  id: string
  account: string
  email: string
  nickname: string
  role: number
  createTime: string
  remark: string
  status: number
}

export interface DeptListItem {
  id: string
  orderNo: string
  deptName: string
  createTime: string
  remark: string
  status: number
  parentId: string
  children: DeptListItem[] | undefined
}

export interface MenuListItem {
  id: string
  orderNo: string
  createTime: string
  status: number
  icon: string
  component: string
  permission: string
}

export interface RoleListItem {
  id: string
  roleName: string
  roleValue: string
  status: number
  orderNo: string
  createTime: string
}

/**
 * @description: Request list return value
 */
export type AccountListGetResultModel = BasicFetchResult<AccountListItem>

export type DeptListGetResultModel = BasicFetchResult<DeptListItem>

export type MenuListGetResultModel = BasicFetchResult<MenuListItem>

export type RolePageListGetResultModel = BasicFetchResult<RoleListItem>

export type RoleListGetResultModel = RoleListItem[]

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
// request.get<AccountListGetResultModel>({
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
  request.get<RolePageListGetResultModel>({
    url: Api.RolePageList,
    params,
  })

export const setRoleStatus = (id: number, status: string) =>
  request.post({ url: Api.setRoleStatus, params: { id, status } })

export const isAccountExist = (account: string) =>
  request.post(
    { url: Api.IsAccountExist, params: { account } },
    { errorMessageMode: 'none' },
  )
