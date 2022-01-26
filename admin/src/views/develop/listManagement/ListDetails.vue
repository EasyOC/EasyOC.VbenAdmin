<template>
  <PageWrapper :title="getTitle" @back="goBack">
    <template #extra>
      <a-button type="primary"> 保存 </a-button>
      <a-button type="primary" danger> 删除列表</a-button>
    </template>
    <div class="pt-4 m-4 bg-white desc-wrap">
      <template v-if="currentKey == 'detail'">
        <div>
          <BasicForm
            @register="register"
            @submit="handleSubmit"
            @reset="handleReset"
          >
            <template #localSearch="{ model, field }">
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
          </BasicForm>
        </div>
      </template>

      <a-row>
        <div class="w-1/3 bg-white p-4">
          <div>类型列表</div>
          <!-- <a-input v-model:value="colFilterText" @input.stop="searchFields" /> -->
          <draggable
            class="dragArea list-group w-full"
            group="fieldsList"
            :list="filteredCols"
            :move="checkMove"
          >
            <div
              class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center"
              v-for="element in filteredCols"
              :key="element.keyPath"
            >
              {{ element.displayName }}
            </div>
          </draggable>
        </div>
        <div class="w-1/3 bg-white p-4">
          <div>
            表字段列表 <a-button @click="addCol">添加自定义字段</a-button>
          </div>

          <draggable
            class="dragArea list-group w-full"
            group="fieldsList"
            :list="listFields"
            @change="draggableChange"
            :move="checkMove"
          >
            <div
              class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center"
              v-for="element in listFields"
              :key="element.keyPath"
            >
              {{ element.displayName }}
            </div>
          </draggable>
        </div>
        <a-row class="w-1/3 bg-white p-4">
          <CodeMirror :value="model.ListMapping" />
        </a-row>
      </a-row>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  onBeforeMount,
  reactive,
  ref,
  unref,
  watchEffect,
} from 'vue'
import {
  BasicForm,
  FormSchema,
  ApiSelect,
  useForm,
} from '@/components/Form/index'

// import { t } from '@admin/locale'
import { useRoute } from 'vue-router'
import { PageWrapper } from '@/components/Page'
import { useGo } from '@/hooks/web/usePage'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { ContentManagementServiceProxy } from '@service/api/app-service-proxies'
import {
  getContent,
  ContentItemUpperCase,
  FieldType,
} from '@service/eoc/contentApi'
import { ContentFieldsMapping } from '@service/eoc/contentApi'
import { ContentHelper, expandContentType } from '@/api/contentHelper'
import CodeMirror from '@/components/CodeEditor/src/codemirror/CodeMirror.vue'
import { BasicColumn } from '@/components/Table'
import { camelCase } from '@admin/utils'
const route = useRoute()
const go = useGo()

const fields = ref<ContentFieldsMapping[]>([])
const listFields = ref<ContentFieldsMapping[]>([])
const model = ref<any>({})

// watchEffect(() => {})

function addField(field: ContentFieldsMapping) {
  const config = unref(model)
  const jobj = JSON.parse(config.ListMapping)
  const newobj: BasicColumn = {
    title: field.displayName,
    dataIndex: field.keyPath.split('.'),
  }
  if (config.QueryMethod == 'Graphql') {
    newobj.dataIndex = camelCase(field.fieldName)
  }
  jobj.push(newobj)
  model.value.ListMapping = JSON.stringify(jobj)
}

const filteredCols = ref<ContentFieldsMapping[]>()

let listManageFields: ContentFieldsMapping[] = reactive<ContentFieldsMapping[]>(
  [],
)
// 此处可以得到文档ID
const documentId = ref(route.params?.id)
let contentItem: ContentItemUpperCase = reactive({})
const typeManagement = new ContentManagementServiceProxy()
const contentHelper = new ContentHelper()

const schemas = [
  {
    field: 'TargetContentType',
    component: 'Input',
    label: '类型',
    helpMessage: ['选择一个类型', '用于加载类型中的字段'],
    required: true,
    slot: 'localSearch',
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
      span: 8,
    },
  },
  {
    field: 'QueryMethod',
    component: 'Select',
    label: '查询方式',
    colProps: {
      span: 8,
    },
  },
] as FormSchema[]

const [register, { setFieldsValue, validate, updateSchema }] = useForm({
  model: contentItem,
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
  const result = typeManagement.getAllTypes({
    stereotype: '',
    page: 1,
    pageSize: 500,
    filter: '',
  })
  return (await result).items || []
}
const currentKey = ref('detail')
onBeforeMount(async () => {
  if (documentId.value) {
    contentItem = await getContent(documentId.value.toString())
    listManageFields = await getAllFileds('VbenList')
    model.value = contentHelper.expandContentType(contentItem, listManageFields)
    console.log('model.value ', model.value)
    typeSelectionChanged(unref(model).TargetContentType)
  }
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
})
let colFilterText = '客'
function searchFields(e) {
  console.log(e.data)
  console.log(colFilterText)
  if (colFilterText) {
    filteredCols.value = fields.value.filter((x) =>
      x.displayName.includes(colFilterText),
    )
  } else {
    filteredCols.value = unref(fields)
  }
}
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
function handleReset() {
  // keyword.value = ''
}
function handleSubmit(values: any) {
  // createMessage.success('click search,values:' + JSON.stringify(values))
}
const getTitle = computed(() => {
  console.log(contentItem, 'getTitle = computed(()')
  if (unref(contentItem).DisplayText) {
    return `编辑：${contentItem.DisplayText}`
  } else {
    return '新建列表'
  }
})

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
</style>
