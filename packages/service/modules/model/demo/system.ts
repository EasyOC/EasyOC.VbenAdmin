import { BasicPageParams, BasicFetchResult } from '../basic'

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
