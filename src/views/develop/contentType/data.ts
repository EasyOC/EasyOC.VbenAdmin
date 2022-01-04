import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//import { h } from 'vue';
//import { Switch } from 'ant-design-vue';
//import { setRoleStatus } from '../../../api/system';
//import { useMessage } from '/@/hooks/web/useMessage';
//import { InputProps } from 'ant-design-vue/lib/input/inputProps';

export const columns: BasicColumn[] = [
  {
    title: '显示名称',
    dataIndex: 'displayName',
    width: 200,
    align: 'left',
  },
  {
    title: '技术名称',
    dataIndex: 'name',
    width: 180,
    align: 'left',
  },
  {
    title: '构造类型',
    dataIndex: 'stereotype',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'displayName',
    label: '关键字',
    component: 'Input',
    colProps: { span: 12 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'roleName',
    label: '角色名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'roleDescription',
    label: '角色描述',
    required: true,
    component: 'Input',
  },
  // {
  //   field: 'status',
  //   label: '状态',
  //   component: 'RadioButtonGroup',
  //   defaultValue: '0',
  //   componentProps: {
  //     options: [
  //       { label: '启用', value: '0' },
  //       { label: '停用', value: '1' },
  //     ],
  //   },
  // // },
  // {
  //   label: '备注',
  //   field: 'remark',
  //   component: 'InputTextArea',
  // },
  // {
  //   label: ' ',
  //   field: 'menu',
  //   slot: 'menu',
  //   component: 'Input',
  //},
];
