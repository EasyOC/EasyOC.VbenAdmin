import { BasicColumn, FormSchema } from '@/components/Table'
import { Tag } from 'ant-design-vue'
import { h } from 'vue'
//import { Switch } from 'ant-design-vue';
//import { setRoleStatus } from '../../../api/system';
//import { useMessage } from '/@/hooks/web/useMessage';
//import { InputProps } from 'ant-design-vue/lib/input/inputProps';

export const columns: BasicColumn[] = [
  {
    title: '列表名称',
    dataIndex: 'DisplayText',
    width: 200,
    align: 'left',
  },
  {
    title: '发布状态',
    dataIndex: 'published',
    width: 180,
    customRender: ({ record }: any) => {
      console.log(record, 'Row:Type')
      if (record.published) {
        return h(Tag, { color: 'green' }, () => 'Published')
      } else {
        return h(Tag, { color: 'yellow' }, () => 'Draft')
      }
    },
    align: 'left',
  },
  {
    title: '绑定模块',
    dataIndex: 'targetContentType',
    width: 180,
    align: 'left',
  },
  {
    title: '查询方式',
    dataIndex: 'queryMethod',
    width: 180,
    align: 'left',
  },
  {
    title: '修改时间',
    dataIndex: 'modifiedUtc',
    width: 180,
    align: 'left',
  },
  {
    title: '创建时间',
    dataIndex: 'createdUtc',
    width: 180,
    align: 'left',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'filter',
    label: '关键字',
    component: 'Input',
    colProps: { span: 12 },
  },
]

export const formSchema = [
  {
    field: 'displayText',
    valueField: 'displayText',
    component: 'Input',
    label: '列表名称',
    required: true,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'TargetContentType',
    component: 'Input',
    label: '类型',
    helpMessage: ['选择一个类型', '用于加载类型中的字段'],
    required: true,
    slot: 'contentTypeSearch',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'QueryName',
    component: 'Select',
    label: '查询名称',
    required: true,
    slot: 'queryName',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'QueryMethod',
    component: 'Select',
    label: '查询方式',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'EnablePage',
    component: 'Switch',
    label: '包含分页',
    componentProps: {
      disabled: true,
    },
    colProps: {
      span: 12,
    },
  },
] as FormSchema[]
