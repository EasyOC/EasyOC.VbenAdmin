import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//import { h } from 'vue';
//import { Switch } from 'ant-design-vue';
//import { setRoleStatus } from '../../../api/system';
//import { useMessage } from '/@/hooks/web/useMessage';
//import { InputProps } from 'ant-design-vue/lib/input/inputProps';

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    width: 200,
    align: 'left',
  },
  {
    title: '角色描述',
    dataIndex: 'roleDescription',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleNme',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 8 },
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
  // },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
  {
    label: ' ',
    field: 'menu',
    slot: 'menu',
    component: 'Input',
  },
];
