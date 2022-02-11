<template>
  <PageWrapper :title="getTitle" @back="goBack">
    <template #extra>
      <a-button type="primary" @click="save" :loading="loading">
        保存
      </a-button>
      <a-button type="primary" :loading="loading" danger> 删除列表</a-button>
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
          <a-col class="w-1/4">
            <h3></h3>
            <a-card title="GraphQL" :bordered="false" size="small">
              <MonacoEditor
                :value="model.GraphQL"
                language="GraphQL"
                height="500"
              />
            </a-card>
          </a-col>
          <a-col class="w-1/4">
            <a-card title="字段列表" :bordered="false" size="small">
              <template #extra>
                <a-button size="small">添加</a-button>
                <a-button size="small">刷新架构</a-button>
              </template>
              <div class="dragArea list-group w-full">
                <div
                  class="list-group-item borderGray m-1 p-2 rounded-md"
                  v-for="(element, index) in filteredCols"
                  :key="element.keyPath"
                >
                  <div>
                    <!-- <a-button @click="delCol(index)" type="link">
                      <DeleteOutlined style="color: #ed6f6f" />
                    </a-button> -->
                    <b>
                      {{ element.displayName }}
                      <a-button @click="addField(element)" type="link">
                        <swap-right-outlined
                          style="color: rgb(50, 150, 231); font-size: large"
                        /> </a-button
                    ></b>

                    <!-- <span><swap-right-outlined /></span> -->
                  </div>

                  <p style="padding-left: 5px; color: gray">
                    {{ element.partName }} | {{ element.fieldName }} |
                    {{ element.fieldType }}
                  </p>
                </div>
              </div>
            </a-card>
          </a-col>

          <a-col class="w-2/4">
            <a-card title="字段映射" :bordered="false" size="small">
              <template #extra>
                <a-button
                  size="small"
                  @click="
                    monacoEditor?.value
                      .getAction(['editor.action.formatDocument'])
                      ._run()
                  "
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
  <!-- <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle">
    <list-Preview></list-Preview>
  </BasicModal> -->
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeMount,
  onMounted,
  reactive,
  ref,
  toRefs,
  unref,
} from 'vue'
import {
  BasicForm,
  FormSchema,
  ApiSelect,
  useForm,
} from '@/components/Form/index'
import { BasicModal, useModalInner } from '@/components/Modal'

// import { t } from '@admin/locale'
import { useRoute } from 'vue-router'
import { PageWrapper } from '@/components/Page'
import { useGo } from '@/hooks/web/usePage'
import { SwapRightOutlined } from '@ant-design/icons-vue'
// import { VueDraggableNext as draggable } from 'vue-draggable-next'
import {
  ContentManagementServiceProxy,
  QueryDefDto,
} from '@service/api/app-service-proxies'
import {
  getContent,
  ContentItemUpperCase,
  FieldType,
  createOrUpdateContent,
} from '@service/eoc/contentApi'
import { ContentFieldsMapping } from '@service/eoc/contentApi'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import { ContentHelper } from '@/api/contentHelper'
import { BasicColumn } from '@/components/Table'
import { camelCase, deepMerge } from '@admin/utils'
const route = useRoute()
const loading = ref<boolean>(false)
const go = useGo()

const schemas = [
  {
    field: 'TargetContentType',
    component: 'Input',
    label: '类型',
    helpMessage: ['选择一个类型', '用于加载类型中的字段'],
    required: true,
    slot: 'contentTypeSearch',
    componentProps: ({ schema, formModel }) => {
      console.log('form:', schema)
      console.log('formModel:', formModel)
      return {
        onChange: (e: any) => {
          console.log(e, '11111111111111111111111')
        },
      }
    },
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
    label: '启用分页',
    colProps: {
      span: 12,
    },
  },
] as FormSchema[]

const fields = ref<ContentFieldsMapping[]>([])
const listFields = ref<ContentFieldsMapping[]>([])
const model = ref<any>({})

function addField(field: ContentFieldsMapping) {
  console.log(model, 'modelmodelmodelmodelmodel')
  const jobj = JSON.parse(model.value.ListMapping || '[]')
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
      default:
        newobj.dataIndex = camelCase(field.fieldName)
    }
  }
  jobj.push(newobj)
  model.value.ListMapping = JSON.stringify(jobj)
  monacoEditor.value.getAction(['editor.action.formatDocument'])._run()
}

const filteredCols = ref<ContentFieldsMapping[]>()

let listManageFields: ContentFieldsMapping[] = reactive<ContentFieldsMapping[]>(
  [],
)
// 此处可以得到文档ID
const documentId = ref(route.params?.id)
let contentItem = ref<ContentItemUpperCase>({})
const typeManagement = new ContentManagementServiceProxy()
const contentHelper = new ContentHelper()

const [register, { setFieldsValue, updateSchema, getFieldsValue }] = useForm({
  model: model,
  labelWidth: 100,
  schemas: schemas,
  showActionButtonGroup: false,
})

function draggableChange(event) {
  const { moved, added } = event
  console.log(event)
  if (moved) {
    console.log('moved', moved)
  }
  if (added) {
    console.log('added', added, added.element)
    addField(added.element)
  }
}

function checkMove(event) {
  console.log('checkMove', event.draggedContext)
  var elment = event.draggedContext.element as ContentFieldsMapping
  if (elment && elment.fieldType == FieldType.CustomField) {
    return false
  }
  console.log('Future index: ' + event.draggedContext.futureIndex)
}

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
  console.log(queryNames.value, 'queryNamesqueryNamesqueryNamesqueryNames')
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
  if (documentId.value) {
    contentItem.value = await getContent(documentId.value.toString())
    listManageFields = await getAllFileds(contentItem.value.ContentType || '')
    model.value = contentHelper.expandContentType(
      contentItem.value,
      listManageFields,
    )
    if (model.value.FieldList) {
      listFields.value = JSON.parse(model.value.FieldList)
    }

    console.log('model.value expandContentType', model.value)
    typeSelectionChanged(unref(model).TargetContentType)
  }

  queryNames.value = await typeManagement.listLuceneQueries()
  const queryMethodField = listManageFields.find(
    (x) => x.fieldName == 'QueryMethod',
  )
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
function addCol() {
  const field = {
    displayName: '自定义字段',
    fieldType: FieldType.CustomField,
    fieldName: 'CustomField',
  } as ContentFieldsMapping
  listFields.value.push(field)
  addField(field)
}

async function typeSelectionChanged(value) {
  fields.value = await getAllFileds(value)
  filteredCols.value = unref(fields)
  console.log('typeSelectionChanged', filteredCols)
}

async function getAllFileds(typeName: string) {
  const typDef = await typeManagement.getTypeDefinition({
    name: typeName,
    withSettings: true,
  })
  console.log(typDef, 'TypeDef')
  return contentHelper.getAllFields(typDef)
}

function handleSubmit(values: any) {
  // createMessage.success('click search,values:' + JSON.stringify(values))
}
const getTitle = computed(() => {
  console.log(contentItem, 'getTitle = computed(()')
  if (unref(contentItem).DisplayText) {
    return `编辑：${contentItem.value.DisplayText}`
  } else {
    return '新建列表'
  }
})

let monacoEditor: any = reactive<any>({})
function editorDidMounted(editor) {
  monacoEditor.value = editor
  monacoEditor.value.getAction(['editor.action.formatDocument'])._run()
}
function editorUpdated(value) {
  try {
    model.value.ListMapping = value
    console.log(
      model.value.ListMapping,
      'ListMappingListMappingListMappingListMapping',
    )
  } catch (error) {
    console.log(error)
  }
}
function delCol(index) {
  filteredCols.value?.splice(index, 1)
}
function showAdd() {}
async function save() {
  const result = getFieldsValue()
  loading.value = true
  deepMerge(model.value, result)
  model.value.FieldList = JSON.stringify(listFields.value)
  contentHelper.updateContentItem(
    model.value,
    contentItem.value,
    listManageFields,
  )
  console.log(contentItem.value, 'Saved content')
  await createOrUpdateContent(contentItem.value)
  loading.value = false
}
// 页面左侧点击返回链接时的操作
function goBack() {
  // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
  go(route.meta.currentActiveMenu)
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
