<template>
  <Amis :amisjson="amisjson" />
</template>
<script lang="ts">
import { computed, defineComponent, unref, ref } from 'vue'
import { BasicForm, FormSchema, ApiSelect } from '@/components/Form/index'
import { CollapseContainer } from '@/components/Container'
import { useMessage } from '@/hooks/web/useMessage'
import { PageWrapper } from '@/components/Page'
import { optionsListApi } from '@service/demo/select'
import { treeOptionsListApi } from '@service/demo/tree'
import { Select } from 'ant-design-vue'
import { cloneDeep } from '@admin/utils'
import { useDebounceFn } from '@admin/use'
import { Amis } from '@/components/Amis'

const valueSelectA = ref<string[]>([])
const valueSelectB = ref<string[]>([])
const options = ref<Recordable[]>([])

for (let i = 1; i < 10; i++)
  options.value.push({ label: '选项' + i, value: `${i}` })

const optionsA = computed(() => {
  return cloneDeep(unref(options)).map((op) => {
    op.disabled = unref(valueSelectB).indexOf(op.value) !== -1
    return op
  })
})
const optionsB = computed(() => {
  return cloneDeep(unref(options)).map((op) => {
    op.disabled = unref(valueSelectA).indexOf(op.value) !== -1
    return op
  })
})

const provincesOptions = [
  {
    id: 'guangdong',
    label: '广东省',
    value: '1',
    key: '1',
  },
  {
    id: 'jiangsu',
    label: '江苏省',
    value: '2',
    key: '2',
  },
]
const citiesOptionsData = {
  guangdong: [
    {
      label: '珠海市',
      value: '1',
      key: '1',
    },
    {
      label: '深圳市',
      value: '2',
      key: '2',
    },
    {
      label: '广州市',
      value: '3',
      key: '3',
    },
  ],
  jiangsu: [
    {
      label: '南京市',
      value: '1',
      key: '1',
    },
    {
      label: '无锡市',
      value: '2',
      key: '2',
    },
    {
      label: '苏州市',
      value: '3',
      key: '3',
    },
  ],
}

const schemas: FormSchema[] = [
  {
    field: 'divider-basic',
    component: 'Divider',
    label: '基础字段',
  },
  {
    field: 'field1',
    component: 'Input',
    label: '字段1',

    colProps: {
      span: 8,
    },
    // componentProps:{},
    // can func
    componentProps: ({ schema, formModel }) => {
      console.log('form:', schema)
      console.log('formModel:', formModel)
      return {
        placeholder: '自定义placeholder',
        onChange: (e: any) => {
          console.log(e)
        },
      }
    },
    renderComponentContent: () => {
      return {
        prefix: () => 'pSlot',
        suffix: () => 'sSlot',
      }
    },
  },
  {
    field: 'field2',
    component: 'Input',
    label: '带后缀',
    defaultValue: '111',
    colProps: {
      span: 8,
    },
    componentProps: {
      onChange: (e: any) => {
        console.log(e)
      },
    },
    suffix: '天',
  },
  {
    field: 'field3',
    component: 'DatePicker',
    label: '字段3',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'field4',
    component: 'Select',
    label: '字段4',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
          key: '1',
        },
        {
          label: '选项2',
          value: '2',
          key: '2',
        },
      ],
    },
  },
  {
    field: 'field5',
    component: 'CheckboxGroup',
    label: '字段5',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'field7',
    component: 'RadioGroup',
    label: '字段7',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'field8',
    component: 'Checkbox',
    label: '字段8',
    colProps: {
      span: 8,
    },
    renderComponentContent: 'Check',
  },
  {
    field: 'field9',
    component: 'Switch',
    label: '字段9',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'field10',
    component: 'RadioButtonGroup',
    label: '字段10',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'field11',
    component: 'Cascader',
    label: '字段11',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake',
                },
              ],
            },
          ],
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    field: 'divider-api-select',
    component: 'Divider',
    label: '远程下拉演示',
  },
  {
    field: 'field30',
    component: 'ApiSelect',
    label: '懒加载远程下拉',
    required: true,
    componentProps: {
      // more details see /src/components/Form/src/components/ApiSelect.vue
      api: optionsListApi,
      params: {
        id: 1,
      },
      resultField: 'list',
      // use name as label
      labelField: 'name',
      // use id as value
      valueField: 'id',
      // not request untill to select
      immediate: false,
      onChange: (e) => {
        console.log('selected:', e)
      },
      // atfer request callback
      onOptionsChange: (options) => {
        console.log('get options', options.length, options)
      },
    },
    colProps: {
      span: 8,
    },
    defaultValue: '0',
  },
  {
    field: 'field31',
    component: 'Input',
    label: '下拉本地搜索',
    helpMessage: [
      'ApiSelect组件',
      '远程数据源本地搜索',
      '只发起一次请求获取所有选项',
    ],
    required: true,
    slot: 'localSearch',
    colProps: {
      span: 8,
    },
    defaultValue: '0',
  },
  {
    field: 'field32',
    component: 'Input',
    label: '下拉远程搜索',
    helpMessage: ['ApiSelect组件', '将关键词发送到接口进行远程搜索'],
    required: true,
    slot: 'remoteSearch',
    colProps: {
      span: 8,
    },
    defaultValue: '0',
  },
  {
    field: 'field33',
    component: 'ApiTreeSelect',
    label: '远程下拉树',
    helpMessage: ['ApiTreeSelect组件', '使用接口提供的数据生成选项'],
    required: true,
    componentProps: {
      api: treeOptionsListApi,
      resultField: 'list',
    },
    colProps: {
      span: 8,
    },
  },
  {
    field: 'field34',
    component: 'ApiRadioGroup',
    label: '远程Radio',
    helpMessage: ['ApiRadioGroup组件', '使用接口提供的数据生成选项'],
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        count: 2,
      },
      resultField: 'list',
      // use name as label
      labelField: 'name',
      // use id as value
      valueField: 'id',
    },
    defaultValue: '1',
    colProps: {
      span: 8,
    },
  },
  {
    field: 'field35',
    component: 'ApiRadioGroup',
    label: '远程Radio',
    helpMessage: ['ApiRadioGroup组件', '使用接口提供的数据生成选项'],
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        count: 2,
      },
      resultField: 'list',
      // use name as label
      labelField: 'name',
      // use id as value
      valueField: 'id',
      isBtn: true,
    },
    colProps: {
      span: 8,
    },
  },
  {
    field: 'divider-linked',
    component: 'Divider',
    label: '字段联动',
  },
  {
    field: 'province',
    component: 'Select',
    label: '省份',
    colProps: {
      span: 8,
    },
    componentProps: ({ formModel, formActionType }) => {
      return {
        options: provincesOptions,
        placeholder: '省份与城市联动',
        onChange: (e: any) => {
          // console.log(e)
          let citiesOptions =
            e == 1
              ? citiesOptionsData[provincesOptions[0].id]
              : citiesOptionsData[provincesOptions[1].id]
          // console.log(citiesOptions)
          if (e === undefined) {
            citiesOptions = []
          }
          formModel.city = undefined //  reset city value
          const { updateSchema } = formActionType
          updateSchema({
            field: 'city',
            componentProps: {
              options: citiesOptions,
            },
          })
        },
      }
    },
  },
  {
    field: 'city',
    component: 'Select',
    label: '城市',
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [], // defalut []
      placeholder: '省份与城市联动',
    },
  },
  {
    field: 'divider-selects',
    component: 'Divider',
    label: '互斥多选',
    helpMessage: ['两个Select共用数据源', '但不可选择对方已选中的项目'],
  },
  {
    field: 'selectA',
    component: 'Select',
    label: '互斥SelectA',
    slot: 'selectA',
    defaultValue: [],
    colProps: {
      span: 8,
    },
  },
  {
    field: 'selectB',
    component: 'Select',
    label: '互斥SelectB',
    slot: 'selectB',
    defaultValue: [],
    colProps: {
      span: 8,
    },
  },
  {
    field: 'divider-others',
    component: 'Divider',
    label: '其它',
  },
  {
    field: 'field20',
    component: 'InputNumber',
    label: '字段20',
    required: true,
    colProps: {
      span: 8,
    },
  },
  {
    field: 'field21',
    component: 'Slider',
    label: '字段21',
    componentProps: {
      min: 0,
      max: 100,
      range: true,
      marks: {
        20: '20°C',
        60: '60°C',
      },
    },
    colProps: {
      span: 8,
    },
  },
  {
    field: 'field22',
    component: 'Rate',
    label: '字段22',
    defaultValue: 3,
    colProps: {
      span: 8,
    },
    componentProps: {
      disabled: false,
      allowHalf: true,
    },
  },
]
export default defineComponent({
  components: {
    BasicForm,
    CollapseContainer,
    PageWrapper,
    ApiSelect,
    ASelect: Select,
    Amis,
  },
  setup() {
    const check = ref(null)
    const { createMessage } = useMessage()
    const keyword = ref<string>('')
    const searchParams = computed<Recordable>(() => {
      return { keyword: unref(keyword) }
    })

    const amisjson = ref({
      title: '表单各种展示模式汇总',
      remark: '展示各种模式的 Form',
      body: [
        {
          type: 'grid',
          columns: [
            {
              type: 'form',
              api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2',
              title: '常规模式',
              mode: 'normal',
              body: [
                {
                  type: 'input-email',
                  name: 'email',
                  required: true,
                  placeholder: '请输入邮箱',
                  label: '邮箱',
                  size: 'full',
                },
                {
                  type: 'input-password',
                  name: 'password',
                  label: '密码',
                  required: true,
                  placeholder: '请输入密码',
                  size: 'full',
                },
                {
                  type: 'checkbox',
                  name: 'rememberMe',
                  label: '记住登录',
                },
                {
                  type: 'submit',
                  label: '登录',
                },
              ],
            },
            {
              type: 'form',
              api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2',
              title: '常规模式 input md 尺寸',
              mode: 'normal',
              body: [
                {
                  type: 'input-email',
                  name: 'email',
                  required: true,
                  placeholder: '请输入邮箱',
                  label: '邮箱',
                  size: 'md',
                  remark: 'xxxx',
                  hint: 'bla bla bla',
                },
                {
                  type: 'input-password',
                  name: 'password',
                  label: '密码',
                  required: true,
                  placeholder: '请输入密码',
                  size: 'md',
                },
                {
                  type: 'checkbox',
                  name: 'rememberMe',
                  label: '记住登录',
                },
                {
                  type: 'submit',
                  label: '登录',
                },
              ],
            },
          ],
        },
        {
          type: 'grid',
          columns: [
            {
              type: 'form',
              api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2',
              title: '水平模式，左右摆放 左右比率分配 ',
              mode: 'horizontal',
              autoFocus: false,
              horizontal: {
                left: 'col-sm-2',
                right: 'col-sm-10',
                offset: 'col-sm-offset-2',
              },
              body: [
                {
                  type: 'input-email',
                  name: 'email',
                  placeholder: '请输入邮箱地址',
                  label: '邮箱',
                  required: true,
                  desc: '表单描述文字',
                },
                {
                  type: 'input-password',
                  name: 'password',
                  label: '密码',
                  placeholder: '输入密码',
                },
                {
                  type: 'checkbox',
                  name: 'rememberMe',
                  label: '记住登录',
                },
                {
                  type: 'control',
                  body: {
                    type: 'submit',
                    label: 'Submit',
                  },
                },
              ],
            },
            {
              type: 'form',
              api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2',
              title: '水平模式，左右摆放 左侧固定宽度 input md 尺寸',
              mode: 'horizontal',
              autoFocus: false,
              horizontal: {
                leftFixed: 'xs',
              },
              body: [
                {
                  type: 'input-email',
                  name: 'email',
                  placeholder: '请输入邮箱地址',
                  label: '邮箱',
                  required: true,
                  desc: '表单描述文字',
                  size: 'md',
                  remark: 'xxxx',
                  hint: 'bla bla bla',
                },
                {
                  type: 'input-password',
                  name: 'password',
                  label: '密码',
                  placeholder: '输入密码',
                  size: 'md',
                },
                {
                  type: 'checkbox',
                  name: 'rememberMe',
                  label: '记住登录',
                },
                {
                  type: 'control',
                  body: {
                    type: 'submit',
                    label: 'Submit',
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'form',
          className: 'm-b',
          body: [
            {
              type: 'property',
              title: '机器配置',
              items: [
                {
                  label: 'cpu',
                  content: {
                    type: 'select',
                    name: 'cpu',
                    value: '1',
                    options: [
                      {
                        label: '1 core',
                        value: '1',
                      },
                      {
                        label: '4 core',
                        value: '4',
                      },
                      {
                        label: '8 core',
                        value: '8',
                      },
                    ],
                  },
                },
                {
                  label: 'memory',
                  content: '4G',
                },
                {
                  label: 'disk',
                  content: '80G',
                },
                {
                  label: 'network',
                  content: '4M',
                  span: 2,
                },
                {
                  label: 'IDC',
                  content: 'beijing',
                },
                {
                  label: 'Note',
                  content: {
                    type: 'textarea',
                    required: true,
                    name: 'note',
                    placeholder: 'Enter...',
                  },
                  span: 3,
                },
              ],
            },
          ],
          actions: [
            {
              type: 'submit',
              label: 'Submit',
            },
          ],
        },
        {
          type: 'form',
          api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2',
          title: '内联模式',
          mode: 'inline',
          autoFocus: false,
          body: [
            {
              type: 'input-email',
              name: 'email',
              placeholder: 'Enter Email',
              label: '邮箱',
            },
            {
              type: 'input-password',
              name: 'password',
              placeholder: '密码',
              remark: 'Bla bla bla',
            },
            {
              type: 'checkbox',
              name: 'rememberMe',
              label: '记住登录',
            },
            {
              type: 'submit',
              label: '登录',
            },
            {
              type: 'button',
              label: '导出',
              url: 'http://www.baidu.com/',
              level: 'success',
            },
          ],
        },
        {
          type: 'form',
          api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2',
          title: '常规模式下用数组包起来还能控制一行显示多个',
          mode: 'normal',
          autoFocus: false,
          body: [
            {
              type: 'input-text',
              name: 'name',
              placeholder: '请输入...',
              label: '名字',
              size: 'full',
            },
            {
              type: 'divider',
            },
            {
              type: 'group',
              body: [
                {
                  type: 'input-email',
                  name: 'email',
                  placeholder: '输入邮箱',
                  label: '邮箱',
                  size: 'full',
                },
                {
                  type: 'input-password',
                  name: 'password',
                  label: '密码',
                  placeholder: '请输入密码',
                  size: 'full',
                },
              ],
            },
            {
              type: 'divider',
            },
            {
              type: 'group',
              body: [
                {
                  type: 'input-email',
                  name: 'email2',
                  mode: 'inline',
                  placeholder: '请输入邮箱地址',
                  label: '邮箱',
                  size: 'full',
                },
                {
                  type: 'input-password',
                  name: 'password2',
                  label: '密码',
                  mode: 'inline',
                  placeholder: '请输入密码',
                  size: 'full',
                },
              ],
            },
            {
              type: 'divider',
            },
            {
              type: 'group',
              body: [
                {
                  type: 'input-email',
                  name: 'email3',
                  mode: 'inline',
                  placeholder: '请输入邮箱地址',
                  label: '邮箱',
                  size: 'full',
                  columnClassName: 'v-bottom',
                },
                {
                  type: 'input-password',
                  name: 'password3',
                  label: '密码',
                  placeholder: '请输入密码',
                  size: 'full',
                },
              ],
            },
            {
              type: 'divider',
            },
            {
              type: 'group',
              body: [
                {
                  type: 'input-email',
                  name: 'email4',
                  placeholder: '请输入邮箱地址',
                  label: '邮箱',
                  size: 'full',
                },
                {
                  type: 'input-password',
                  name: 'password4',
                  label: '密码',
                  placeholder: '请输入密码',
                  mode: 'inline',
                  size: 'full',
                  columnClassName: 'v-bottom',
                },
              ],
            },
            {
              type: 'divider',
            },
            {
              type: 'checkbox',
              name: 'rememberMe',
              label: '记住我',
            },
            {
              type: 'submit',
              label: '提交',
            },
          ],
        },
        {
          type: 'form',
          api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2',
          title: '水平模式用数组包起来也能控制一行显示多个',
          mode: 'horizontal',
          autoFocus: false,
          body: [
            {
              type: 'input-email',
              name: 'email',
              placeholder: '请输入邮箱地址',
              label: '邮箱',
              size: 'full',
            },
            {
              type: 'divider',
            },
            {
              type: 'group',
              body: [
                {
                  type: 'input-email',
                  name: 'email2',
                  placeholder: '请输入邮箱地址',
                  label: '邮箱',
                  size: 'full',
                },
                {
                  type: 'input-password',
                  name: 'password2',
                  label: '密码',
                  placeholder: '请输入密码',
                  size: 'full',
                },
              ],
            },
            {
              type: 'divider',
            },
            {
              type: 'group',
              body: [
                {
                  type: 'input-email',
                  name: 'email3',
                  placeholder: '请输入邮箱地址',
                  label: '邮箱',
                  size: 'full',
                },
                {
                  type: 'input-password',
                  name: 'password3',
                  label: '密码',
                  placeholder: '请输入密码',
                  size: 'full',
                },
                {
                  type: 'input-password',
                  name: 'password3',
                  label: '密码',
                  placeholder: '请输入密码',
                  size: 'full',
                },
              ],
            },
            {
              type: 'divider',
            },
            {
              type: 'group',
              body: [
                {
                  type: 'input-email',
                  name: 'email4',
                  placeholder: '请输入邮箱地址',
                  label: '邮箱',
                  size: 'full',
                  columnClassName: 'col-sm-6',
                  horizontal: {
                    left: 'col-sm-4',
                    right: 'col-sm-8',
                  },
                },
                {
                  type: 'input-password',
                  name: 'password4',
                  label: '密码',
                  placeholder: '请输入密码',
                  mode: 'inline',
                  size: 'full',
                },
              ],
            },
            {
              type: 'divider',
            },
            {
              type: 'group',
              label: '邮箱',
              gap: 'xs',
              body: [
                {
                  label: false,
                  type: 'input-email',
                  name: 'email5',
                  placeholder: '请输入邮箱地址',
                  size: 'full',
                },
                {
                  type: 'input-password',
                  name: 'password5',
                  label: '密码',
                  placeholder: '请输入密码',
                  mode: 'inline',
                  size: 'full',
                },
              ],
            },
            {
              type: 'divider',
            },
            {
              type: 'group',
              label: '邮箱',
              description: 'bla bla',
              gap: 'xs',
              body: [
                {
                  type: 'input-email',
                  name: 'email6',
                  placeholder: '请输入邮箱地址',
                  mode: 'inline',
                },
                {
                  type: 'input-password',
                  name: 'password6',
                  placeholder: '请输入密码',
                  labelClassName: 'w-auto p-r-none',
                  mode: 'inline',
                },
              ],
            },
            {
              type: 'divider',
            },
            {
              type: 'group',
              label: '邮箱',
              description: 'bla bla',
              direction: 'vertical',
              body: [
                {
                  type: 'input-email',
                  name: 'email9',
                  mode: 'normal',
                  placeholder: '请输入邮箱地址',
                  inline: true,
                  description: 'Bla blamfejkf fdjk',
                },
                {
                  type: 'input-password',
                  name: 'password9',
                  mode: 'normal',
                  placeholder: '请输入密码',
                  labelClassName: 'w-auto p-r-none',
                },
              ],
            },
            {
              type: 'divider',
            },
            {
              type: 'checkbox',
              name: 'rememberMe',
              label: '记住我',
            },
            {
              type: 'submit',
              label: 'Submit',
            },
          ],
        },
        {
          type: 'form',
          api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2',
          title: 'Inline form  用数组包起来还能控制一行显示多个',
          mode: 'inline',
          submitText: null,
          autoFocus: false,
          body: [
            {
              type: 'group',
              body: [
                {
                  type: 'input-email',
                  name: 'email',
                  placeholder: 'Enter Email',
                  label: '邮箱',
                  size: 'full',
                },
                {
                  type: 'input-password',
                  name: 'password',
                  placeholder: 'Password',
                  size: 'full',
                },
              ],
            },
            {
              type: 'divider',
            },
            {
              type: 'group',
              body: [
                {
                  type: 'input-email',
                  name: 'email',
                  placeholder: 'Enter Email',
                  label: '邮箱',
                  size: 'full',
                },
                {
                  type: 'checkbox',
                  name: 'rememberMe',
                  label: '记住我',
                  size: 'full',
                },
                {
                  type: 'button-toolbar',
                  buttons: [
                    {
                      type: 'submit',
                      label: '登录',
                    },
                    {
                      type: 'button',
                      label: '导出',
                      url: 'http://www.baidu.com/',
                      level: 'success',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
    function onSearch(value: string) {
      keyword.value = value
    }
    return {
      schemas,
      optionsListApi,
      optionsA,
      amisjson,
      optionsB,
      valueSelectA,
      valueSelectB,
      onSearch: useDebounceFn(onSearch, 300),
      searchParams,
      handleReset: () => {
        keyword.value = ''
      },
      handleSubmit: (values: any) => {
        createMessage.success('click search,values:' + JSON.stringify(values))
      },
      check,
    }
  },
})
</script>
