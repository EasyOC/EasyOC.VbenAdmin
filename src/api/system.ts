import { RolesServiceProxy, UsersServiceProxy } from './app-service-proxies';
import {
  AccountParams,
  DeptListItem,
  MenuParams,
  // RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  DeptListGetResultModel,
  // AccountListGetResultModel,
  RolePageListGetResultModel,
  // RoleListGetResultModel,
} from './demo/model/systemModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  // AccountList = '/api/User/GetAll',
  IsAccountExist = '/system/accountExist',
  DeptList = '/system/getDeptList',
  setRoleStatus = '/system/setRoleStatus',
  MenuList = '/system/getMenuList',
  RolePageList = '/system/getRoleListByPage',
  // GetAllRoleList = '/system/getAllRoleList',
}
export const userService = new UsersServiceProxy();
export async function getAccountList(params: any) {
  // params.searchText = '';
  console.log('param:', params);

  const data = await userService.getAll(params);
  console.log(data, 'userList');
  return data;
}

export const getUserDetails = (id: string) => userService.getUser(id);

export const getDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.DeptList, params });

export const getMenuList = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });

export const getRoleListByPage = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.RolePageList, params });

// export const getAllRoleList = async (params?: RoleParams) => {
export const getAllRoleList = async () => {
  const roles = await new RolesServiceProxy().getRoles();
  return roles;
  // defHttp.get<RoleListGetResultModel>({ url: Api.GetAllRoleList, params });
};

export const setRoleStatus = (id: number, status: string) =>
  defHttp.post({ url: Api.setRoleStatus, params: { id, status } });

export const isAccountExist = (account: string) =>
  defHttp.post({ url: Api.IsAccountExist, params: { account } }, { errorMessageMode: 'none' });
