import { SelectProps } from 'ant-design-vue';
import { Filter } from '/@/api/app-service-proxies';
import { getAllRoleList, isAccountExist } from '/@/api/demo/system';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'userName',
    width: 120,
  },
  // {
  //   title: '昵称',
  //   dataIndex: 'nickname',
  //   width: 120,
  // },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 120,
  },
  // ,
  // {
  //   title: '创建时间',
  //   dataIndex: 'createTime',
  //   width: 180,
  // },
  // {
  //   title: '角色',
  //   dataIndex: 'role',
  //   width: 200,
  // },
  // {
  //   title: '备注',
  //   dataIndex: 'remark',
  // },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'searchText',
    label: '关键字',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'filter',
    label: '过滤',
    component: 'Select',
    componentProps: {
      options: [
        { value: Filter.All, label: 'All' },
        { value: Filter.Approved, label: 'Approved' },
        { value: Filter.Pending, label: 'Pending' },
        { value: Filter.EmailPending, label: 'EmailPending' },
        { value: Filter.Enabled, label: 'Enabled' },
        { value: Filter.Disabled, label: 'Disabled' },
      ],
      defaultActiveFirstOption: true,
    } as SelectProps,
    colProps: { span: 8 },
  },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'account',
    label: '用户名',
    component: 'Input',
    helpMessage: ['本字段演示异步验证', '不能输入带有admin的用户名'],
    rules: [
      {
        required: true,
        message: '请输入用户名',
      },
      {
        validator(_, value) {
          return new Promise((resolve, reject) => {
            isAccountExist(value)
              .then(() => resolve())
              .catch((err) => {
                reject(err.message || '验证失败');
              });
          });
        },
      },
    ],
  },
  {
    field: 'pwd',
    label: '密码',
    component: 'InputPassword',
    required: true,
    ifShow: false,
  },
  {
    label: '角色',
    field: 'role',
    component: 'ApiSelect',
    componentProps: {
      api: getAllRoleList,
      labelField: 'roleName',
      valueField: 'roleValue',
    },
    required: true,
  },
  {
    field: 'dept',
    label: '所属部门',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'deptName',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
    required: true,
  },

  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    required: true,
  },

  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
