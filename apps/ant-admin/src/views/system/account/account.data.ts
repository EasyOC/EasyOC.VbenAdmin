import { getAllRoleList, isAccountExist } from '@pkg/apis/system'
import { BasicColumn ,FormSchema} from '@/components/table'

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'userName',
    sorter: true,
    resizable: true,
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
    resizable: true,
    sorter: true,
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
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'userName',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
    colProps: { span: 8 },
  },
]

export const accountFormSchema: FormSchema[] = [
  {
    field: 'userName',
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
                reject(err.message || '验证失败')
              })
          })
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
]
