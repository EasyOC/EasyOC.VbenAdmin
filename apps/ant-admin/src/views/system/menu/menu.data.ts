import { BasicColumn } from '@/components/table'
import { FormSchema } from '@/components/table'
import { h } from 'vue'
import { Icon } from '@components/common'
import { Tag, TreeSelectProps } from 'ant-design-vue'

export const columns: BasicColumn[] = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    width: 200,
    align: 'left',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 50,
    customRender: ({ record }) => {
      return h(Icon, { icon: record.icon })
    },
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
    width: 180,
  },
  {
    title: '组件',
    dataIndex: 'component',
  },
  {
    title: '路径',
    dataIndex: 'routePath'
  },
  {
    title: '排序',
    dataIndex: 'orderNo',
    width: 50,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status
      const enable = ~~status === 0
      const color = enable ? 'green' : 'red'
      const text = enable ? '启用' : '停用'
      return h(Tag, { color: color }, () => text)
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdUtc',
    format: "date|utc|YYYY-MM-DD HH:mm",
    width: 180,
  },
]

const isDir = (type: string) => type === '0'
const isMenu = (type: string) => type === '1'
const isButton = (type: string) => type === '2'

export const searchFormSchema: FormSchema[] = [
  {
    field: 'menuName',
    label: '菜单名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ],
    },
    colProps: { span: 8 },
  },
]

export const formSchema: FormSchema[] = [
  {
    field: 'menuType',
    label: '菜单类型',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '目录', value: '0' },
        { label: '菜单', value: '1' },
        { label: '按钮', value: '2' },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'menuName',
    label: '菜单名称',
    component: 'Input',
    required: true,
  },
  // {
  //   field: 'parentMenu.contentItemIds[0]',
  //   // valueField:"parentMenu.contentItemIds[0]",
  //   label: '上级菜单',
  //   component: 'Input',
  //   required: true,
  // },
  {
    // field: 'parentMenu.firstValue',
    // valueField: 'parentMenu.firstValue',
    field: 'parentMenu',
    label: '上级菜单',
    component: 'TreeSelect',
    componentProps: {
      // multiple: true,
      // maxTagCount: 1,
      fieldNames: {
        label: 'displayText',
        key: "contentItemId",
        value: 'contentItemId',
      },

    } as TreeSelectProps
  },
  // {
  //   field: 'parentMenu.contentItemIds[0]',
  //   // valueField: ["parentMenu", "contentItemIds",0]  ,
  //   // field: 'parentMenu',
  //   // valueField: 'parentMenu.contentItemIds[0]',
  //   // valueField: 'parentMenu',
  //   label: '上级菜单',
  //   component: 'TreeSelect',
  //   itemProps: {
  //     // name: 'parentMenu.contentItemIds[0]'
  //     // name: ["parentMenu", "contentItemIds",0]    
  //   }, 
  //   componentProps: {
  //     // multiple: true,
  //     // maxTagCount:1, 
  //     // labelField: 'displayText',
  //     // valueField: 'contentItemId',
  //     fieldNames: {
  //       label: 'menuName',
  //       key: "contentItemId",
  //       value: 'contentItemId',
  //     },
  //     // onChange: (a, b, c) => {
  //     //   console.log('a,b,c: ', a, b, c);
  //     // },
  //     getPopupContainer: () => document.body
  //   } //as ApiTreeSelectProps
  // }, 
  {
    field: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
    required: true,
    ifShow: ({ values }) => !isButton(values.menuType),
  },

  {
    field: 'routePath',
    label: '路由地址',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => !isButton(values.menuType),
  },
  {
    field: 'component',
    label: '组件路径',
    component: 'Input',
    ifShow: ({ values }) => isMenu(values.menuType),
  },
  {
    field: 'permission',
    label: '权限标识',
    component: 'Input',
    ifShow: ({ values }) => !isDir(values.menuType),
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '禁用', value: '1' },
      ],
    },
  },
  {
    field: 'isExt',
    label: '是否外链',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '否', value: '0' },
        { label: '是', value: '1' },
      ],
    },
    ifShow: ({ values }) => !isButton(values.menuType),
  },

  {
    field: 'keepalive',
    label: '是否缓存',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '否', value: '0' },
        { label: '是', value: '1' },
      ],
    },
    ifShow: ({ values }) => isMenu(values.menuType),
  },

  {
    field: 'show',
    label: '是否显示',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '是', value: '0' },
        { label: '否', value: '1' },
      ],
    },
    ifShow: ({ values }) => !isButton(values.menuType),
  },
]
