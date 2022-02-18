<template>
  <PageWrapper :title="getTitle" @back="goBack">
    <template #rightFooter>
      <a-button
        type="primary"
        @click="save"
        :disabled="loading"
        :loading="loading"
      >
        保存
      </a-button>

      <a-button type="primary" :loading="loading" :disabled="loading" danger>
        删除列表</a-button
      >
    </template>
    <template #footer>
      <BasicForm @register="register">
        <template #contentTypeSearch="{ model, field }">
          <ApiSelect
            :api="getTypeList"
            showSearch
            v-model:value="model[field]"
            optionFilterProp="label"
            labelField="displayName"
            valueField="name"
            @change="typeSelectionChanged"
          />
        </template>

        <template #queryName="{ model, field }">
          <ApiSelect
            :api="listQueryNames"
            showSearch
            v-model:value="model[field]"
            optionFilterProp="label"
            labelField="displayName"
            @change="queryNameChanged"
            valueField="name"
          />
        </template>
      </BasicForm>
      <a-tabs default-active-key="detail" v-model:activeKey="currentKey">
        <a-tab-pane key="eidtList" tab="列表定义" />
        <a-tab-pane key="preview" tab="预览" />
      </a-tabs>
    </template>
    <div class="desc-wrap">
      <template v-if="currentKey == 'eidtList'">
        <a-row class="bg-white p-4">
          <a-col style="width: 400px">
            <a-card title="字段列表" :bordered="false" size="small">
              <template #extra>
                <a-button size="small" @click="typeSelectionChanged()"
                  >刷新列表</a-button
                >
                <!-- <a-button size="small" @click="() => 1 + 1">添加字段</a-button> -->
              </template>
              <!--   <a-button @click="delCol(index)" type="link">
                        <DeleteOutlined style="color: #ed6f6f" />
                      </a-button> -->
              <draggable
                class="dragArea list-group w-full"
                style="height: 500px; overflow-y: scroll"
              >
                <div
                  class="list-group-item borderGray m-1 p-2 rounded-md"
                  v-for="(element, index) in listAllFields"
                  :key="element.keyPath || ''"
                >
                  <div>
                    <b>
                      {{ element.displayName }}
                      <a-button @click="addField(element)" type="link">
                        <swap-right-outlined
                          style="color: rgb(50, 150, 231); font-size: large"
                        /> </a-button
                    ></b>
                    <!-- <span
                      ><a-switch v-model="element.visible">显示</a-switch></span
                    > -->
                  </div>
                  <p style="padding-left: 5px; color: gray">
                    {{ element.partName }} | {{ element.fieldName }} |
                    {{ element.fieldType }}
                  </p>
                </div>
              </draggable>
            </a-card>
          </a-col>
          <a-col class="w-3/8">
            <a-card title="字段映射" :bordered="false" size="small">
              <template #extra>
                <a-button
                  size="small"
                  @click="formatSchema"
                  title="快捷键：shift+alt+f"
                  >格式化</a-button
                >
              </template>
              <MonacoEditor
                language="json"
                :value="model.ListMapping"
                @editorDidMount="editorDidMounted"
                @change="editorUpdated"
                height="500"
            /></a-card>
          </a-col>
          <a-col class="w-2/8">
            <a-card title="GraphQL" :bordered="false" size="small">
              <template #extra>
                <a :href="`${apiUrl}/Admin/GraphQL`" target="AdminGraphQL"
                  >在设计器中打开</a
                >
              </template>
              <MonacoEditor
                :value="model.GraphQL"
                language="GraphQL"
                height="500"
                @change="(value) => (model.GraphQL = value)"
              />
            </a-card>
          </a-col>
        </a-row>
      </template>
      <template v-if="currentKey == 'preview'">
        <div class="bg-white p-4">
          <h2>预览</h2>
          <table></table>
        </div>
      </template>
    </div>
  </PageWrapper>
</template>
<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, ref, unref } from 'vue'
import {
  BasicForm,
  FormSchema,
  ApiSelect,
  useForm,
} from '@/components/Form/index'

// import { BasicModal, useModalInner } from '@/components/Modal'

// import { t } from '@admin/locale'
import { useRoute } from 'vue-router'
import { PageWrapper } from '@/components/Page'
import { useGo } from '@/hooks/web/usePage'
import { SwapRightOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import {
  ContentManagementServiceProxy,
  QueryDefDto,
} from '@service/api/app-service-proxies'
import {
  getContent,
  ContentItemUpperCase,
  FieldType,
} from '@service/eoc/contentApi'
import { ContentFieldsMapping } from '@service/eoc/contentApi'
import MonacoEditor from '@/components/MonacoEditor/index.vue'

import { BasicColumn } from '@/components/Table'
import { camelCase, deepMerge } from '@admin/utils'
import { useMessage } from '@/hooks/web/useMessage'
import { formSchema } from './data'
import { getGlobalConfig } from '@/internal'
import { ContentTypeService } from '@/api/ContentTypeService'
const route = useRoute()
const listManageName = 'VbenList'
const contentTypeService = new ContentTypeService(listManageName)
const loading = ref<boolean>(false)
const go = useGo()
const { apiUrl } = getGlobalConfig()
const GraphQLNotSupportFields = ['GeoPointField']
const { createMessage } = useMessage()

//所有字段
const listAllFields = ref<ContentFieldsMapping[]>([])
/**
 * 已添加字段
 */
const listFields = ref<ContentFieldsMapping[]>([])

const VbenListFields = ref<ContentFieldsMapping[]>([])
const model = ref({
  TargetContentType: '',
  QueryMethod: 'Graphql',
  Title: '',
  ListMapping: '',
  FieldList: '',
  GraphQL: '',
  EnablePage: false,
})

// 此处可以得到文档ID
const documentId = ref(route.params?.id.toString())
let contentItem = ref<ContentItemUpperCase>({ ContentType: listManageName })
const typeManagement = new ContentManagementServiceProxy()

const [register, { setFieldsValue, submit, updateSchema, getFieldsValue }] =
  useForm({
    model: contentItem.value,
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
  })

async function getTypeList() {
  const result = await typeManagement.getAllTypes({
    stereotype: '',
    page: 1,
    pageSize: 500,
    filter: '',
  })
  return result.items || []
}

async function listQueryNames() {
  console.log('queryNames.value: ', queryNames.value)
  return queryNames.value?.map((x) => {
    return {
      query: x,
      displayName: x.name,
      name: camelCase(x.name ?? ''),
    }
  })
}
const queryNames = ref<QueryDefDto[]>()
const currentKey = ref('eidtList')
onBeforeMount(async () => {
  loading.value = true
  VbenListFields.value = await contentTypeService.getAllFields()
  if (documentId.value) {
    contentItem.value = await getContent(documentId.value)
    model.value = contentTypeService.expandContentType(contentItem.value)
    listAllFields.value = await contentTypeService.getAllFields()
    console.log('model.value expandContentType', model.value)
  }

  queryNames.value = await typeManagement.listLuceneQueries()
  const queryMethodField = VbenListFields.value.find(
    (x) => x.fieldName == 'QueryMethod',
  )
  console.log('queryMethodField: ', queryMethodField)
  if (queryMethodField) {
    const options =
      queryMethodField.fieldSettings.TextFieldPredefinedListEditorSettings.Options.map(
        (x) => {
          return {
            label: x.name,
            value: x.value,
            key: x.value,
          }
        },
      )
    updateSchema([
      {
        field: 'QueryMethod',
        componentProps: {
          options: options,
        },
      },
    ])
  }
  setFieldsValue(model.value)
  loading.value = false
})
onMounted(() => {
  nextTick(() => {
    monacoEditor?.value.getAction(['editor.action.formatDocument'])._run()
  })
})
// function addCol() {
//   const field = {
//     displayName: '自定义字段',
//     fieldType: FieldType.CustomField,
//     fieldName: 'CustomField',
//   } as ContentFieldsMapping
//   listFields.value.push(field)
//   addField(field)
// }

async function typeSelectionChanged(value?) {
  if (!value) {
    const result = getFieldsValue()
    value = result.TargetContentType
  }
  if (value) {
    listAllFields.value = await contentTypeService.getAllFields(true)
  }
  if (listAllFields.value) {
    console.log('listAllFields.value: ', listAllFields.value)
    listFields.value = unref(listAllFields).filter(
      (x) => !GraphQLNotSupportFields.includes(x.fieldType),
    )
    const jobj = listFields.value.map((field) => buildField(field))
    model.value.ListMapping = JSON.stringify(jobj)
    model.value.GraphQL = buildGraphql(listFields.value)
    monacoEditor.value.getAction(['editor.action.formatDocument'])._run()
  }
}

const getTitle = computed(() => {
  if (unref(contentItem).DisplayText) {
    return `编辑：${unref(contentItem).DisplayText}`
  } else {
    return '新建列表'
  }
})

let monacoEditor = ref<any>({})
function editorDidMounted(editor) {
  monacoEditor.value = editor
  monacoEditor.value.getAction(['editor.action.formatDocument'])._run()
}
function editorUpdated(value) {
  try {
    model.value.ListMapping = value
  } catch (error) {
    console.log(error)
  }
}
async function save() {
  const result = getFieldsValue()
  loading.value = true
  model.value = deepMerge(model.value, result)
  await contentTypeService.saveContentItem(model.value, contentItem.value)
  createMessage.success('保存成功')
  loading.value = false
}
// 页面左侧点击返回链接时的操作
function goBack() {
  // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
  go(route.meta.currentActiveMenu)
}

function buildField(field: ContentFieldsMapping) {
  const newobj: BasicColumn = {
    title: field.displayName,
  }
  if (model.value.QueryMethod == 'Graphql') {
    switch (field.fieldType) {
      case FieldType.ContentPickerField:
        newobj.dataIndex = [
          camelCase(field.fieldName),
          'contentItems',
          0,
          'displayText',
        ]
        break
      case FieldType.UserPickerField:
        newobj.dataIndex = [
          camelCase(field.fieldName),
          'userProfiles',
          0,
          'displayText',
        ]
        break
      case FieldType.DateTimefield:
        newobj.dataIndex = camelCase(field.fieldName)
        newobj.format = 'date|YYYY-MM-DD HH:mm:ss' //[camelCase(field.fieldName), 'displayValue']
        break
      case FieldType.DateField:
        newobj.dataIndex = camelCase(field.fieldName)
        newobj.format = 'date|YYYY-MM-DD' //[camelCase(field.fieldName), 'displayValue']
        break
      default:
        newobj.dataIndex = camelCase(field.fieldName)
    }
    if (field.fieldName.endsWith('Utc') && !field.partName) {
      newobj.format = 'date|utc|YYYY-MM-DD HH:mm:ss'
    }
    const formValue = getFieldsValue()
    let isPart = false
    if (field.partName) {
      isPart = ![formValue.TargetContentType, 'TitlePart'].includes(
        field.partName,
      )
    }
    if (isPart) {
      if (typeof newobj.dataIndex === 'string') {
        newobj.dataIndex = [camelCase(field.partName), newobj.dataIndex]
      } else {
        newobj.dataIndex = [camelCase(field.partName), ...newobj.dataIndex]
      }
    }
    if (!newobj.dataIndex) {
      newobj.dataIndex = camelCase(field.fieldName)
    }
  }
  console.log('newobj: ', newobj)
  return newobj
}
function buildGraphql(fields: ContentFieldsMapping[]) {
  const gfields: { [key: string]: any } = {}
  fields
    // .filter((x) => !GraphQLNotSupportFields.includes(x.fieldType))
    .forEach((field) => {
      const fieldName = camelCase(field.fieldName)
      const formValue = getFieldsValue()
      let isPart = false
      if (field.partName) {
        isPart = ![formValue.TargetContentType, 'TitlePart'].includes(
          field.partName,
        )
      }

      let tempPart = gfields
      if (isPart) {
        if (!gfields[camelCase(field.partName)]) {
          gfields[camelCase(field.partName)] = {}
        }
        tempPart = gfields[camelCase(field.partName)]
      }
      if (model.value.QueryMethod == 'Graphql') {
        switch (field.fieldType) {
          case FieldType.ContentPickerField:
            tempPart[fieldName] = {
              contentItems: {
                contentItemId: false,
                displayText: false,
              },
            }
            break
          case FieldType.UserPickerField:
            tempPart[fieldName] = {
              userIds: false,
              userProfiles: { displayText: false },
            }
            break
          case FieldType.HtmlField:
            break
          default:
            tempPart[fieldName] = false
        }
      }
    })
  console.log('stringify', JSON.stringify(gfields, null, 2))
  const tempGraphqlStr = JSON.stringify(gfields, null, 2).replace(
    /false|'|"|:|,/g,
    '',
  )
  return tempGraphqlStr
}
function formatSchema() {
  monacoEditor?.value.getAction(['editor.action.formatDocument'])._run()
}
async function queryNameChanged(name) {
  model.value.EnablePage = false
  const current = queryNames.value?.find((x) => camelCase(x.name || '') == name)
  if (current && current.schema) {
    var schema = JSON.parse(current.schema)
    model.value.EnablePage = !!schema.hasTotal
  }
  setFieldsValue({ EnablePage: model.value.EnablePage })
}

function addField(field: ContentFieldsMapping) {
  const jobj = JSON.parse(model.value.ListMapping || '[]')
  const newObj = buildField(field)
  jobj.push(newObj)
  model.value.ListMapping = JSON.stringify(jobj)
  monacoEditor.value.getAction(['editor.action.formatDocument'])._run()
}
</script>

<style>
.dragArea {
  border: 1px solid darkgrey;
  min-height: 400px;
}
.borderGray {
  border: 1px solid rgba(209, 213, 219, var(--tw-bg-opacity));
}
</style>
