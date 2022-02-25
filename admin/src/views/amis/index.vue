<template>
  <div>
    <Amis :amisjson="amisjson" @amisMounted="amisMounted" />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
// import MonacoEditor from '@/components/MonacoEditor/index.vue'
// import { CodeEditor } from '@/components/CodeEditor'
import { Amis } from '@/components/Amis'
// import { parser } from 'xijs'
// window.enableAMISDebug = true
// const editorJson = ref<any>()
// const editor = ref<any>(null)
const amisjson = ref<any>({
  type: 'page',
  title: '动态页管理',
  body: [
    {
      type: 'crud',
      api: '/api/graphql?query={   items: amisSchema(status: LATEST) {     displayText     createdUtc     id: contentItemId     name     description     published     publishedUtc     modifiedUtc     author   } }',
      columns: [
        {
          name: 'displayText',
          label: '显示名称',
          type: 'text',
        },
        {
          type: 'text',
          label: '名称',
          name: 'name',
        },
        {
          type: 'text',
          label: '描述',
          name: 'description',
        },
        {
          type: 'status',
          name: 'published',
          label: '已发布',
        },
        {
          type: 'date',
          label: '发布时间',
          name: 'publishedUtc',
        },
        {
          type: 'date',
          label: '修改时间',
          name: 'modifiedUtc',
        },
        {
          name: 'createdUtc',
          label: '创建时间',
          type: 'date',
        },
        {
          type: 'text',
          name: 'author',
          label: '创建人',
        },
        {
          type: 'operation',
          label: '操作',
          buttons: [
            {
              label: '编辑',
              type: 'button',
              actionType: 'dialog',
              level: 'link',
              dialog: {
                type: 'dialog',
                title: '编辑',
                body: [
                  {
                    type: 'form',
                    api: {
                      method: 'post',
                      url: '/api/content',
                    },
                    body: [
                      {
                        name: 'ContentType',
                        label: 'ContentType',
                        type: 'hidden',
                        value: 'AmisSchema',
                      },
                      {
                        name: 'DisplayText',
                        label: '显示名称',
                        type: 'input-text',
                        required: true,
                      },
                      {
                        type: 'input-text',
                        label: '名称',
                        name: 'AmisSchema.Name.Text',
                        required: true,
                        description: '代码引用的关键字',
                      },
                      {
                        type: 'textarea',
                        label: '描述',
                        name: 'AmisSchema.Description.Text',
                      },
                      {
                        type: 'editor',
                        label: 'JSON Schema',
                        name: 'AmisSchema.Schema.Text',
                      },
                    ],
                    initApi: {
                      method: 'get',
                      url: '/api/content/${id}',
                      data: {},
                      dataType: 'json',
                    },
                  },
                ],
                closeOnEsc: false,
                closeOnOutside: false,
                showCloseButton: true,
                size: 'xl',
              },
              onClick: 'console.log(props)',
            },
            {
              label: '查看',
              type: 'button',
              actionType: 'dialog',
              level: 'link',
              dialog: {
                title: '查看详情',
                body: {
                  type: 'form',
                  api: 'xxx/update',
                  body: [
                    {
                      name: 'id',
                      label: 'ID',
                      type: 'static',
                    },
                    {
                      name: 'engine',
                      label: '渲染引擎',
                      type: 'static',
                    },
                  ],
                },
              },
            },
            {
              type: 'button',
              label: '删除',
              actionType: 'ajax',
              level: 'link',
              className: 'text-danger',
              confirmText: '确定要删除？',
              api: 'POST:',
              onClick: 'console.log(props)',
            },
          ],
        },
      ],
      bulkActions: [],
      itemActions: [],
      features: ['filter', 'create', 'update', 'view', 'delete'],
      headerToolbar: [
        {
          label: '新增',
          type: 'button',
          actionType: 'dialog',
          level: 'primary',
          dialog: {
            title: '新增',
            body: [
              {
                type: 'form',
                api: {
                  method: 'post',
                  url: '/api/content',
                },
                body: [
                  {
                    name: 'DisplayText',
                    label: '显示名称',
                    type: 'input-text',
                    required: true,
                  },
                  {
                    type: 'input-text',
                    label: '名称',
                    name: 'AmisSchema.Name.Text',
                    required: true,
                    description: '代码引用的关键字',
                  },
                  {
                    type: 'textarea',
                    label: '描述',
                    name: 'AmisSchema.Description.Text',
                  },
                  {
                    type: 'editor',
                    label: 'JSON Schema',
                    name: 'AmisSchema.Schema.Text',
                  },
                ],
              },
            ],
            type: 'dialog',
            closeOnEsc: false,
            closeOnOutside: false,
            showCloseButton: true,
            size: 'xl',
          },
        },
        'bulkActions',
        'pagination',
      ],
    },
  ],
})

const amisScoped = ref<any>(null)
function amisMounted(amisScope) {
  amisScoped.value = amisScope
  console.log('amisScoped.value: ', amisScoped.value)
  console.log(JSON.stringify(amisjson))
}
</script>
