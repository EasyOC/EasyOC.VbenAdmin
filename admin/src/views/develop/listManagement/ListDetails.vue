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
          <div ref="elTypeFields">
            <a-row v-for="item in fields" :key="item.keyPath">
              <a-col>{{ t(item.displayName || '') }} </a-col>
            </a-row>
          </div>
        </div>
        <div class="w-1/3 bg-white p-4">
          <div ref="elListFields">
            <a-row v-for="item in listFields" :key="item.keyPath">
              <a-col>{{ t(item.displayName || '') }} </a-col>
            </a-row>
          </div>
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
  nextTick,
} from 'vue'
import {
  BasicForm,
  FormSchema,
  ApiSelect,
  useForm,
} from '@/components/Form/index'

import { t } from '@admin/locale'
import { useRoute } from 'vue-router'
import { PageWrapper } from '@/components/Page'
import { useGo } from '@/hooks/web/usePage'

import { ContentManagementServiceProxy } from '@service/api/app-service-proxies'
import { getContent, ContentItemUpperCase } from '@service/eoc/contentApi'
import { ContentFieldsMapping } from '@service/eoc/contentApi'
import { ContentHelper, expandContentType } from '@/api/contentHelper'
import Sortable from 'sortablejs'
import CodeMirror from '@/components/CodeEditor/src/codemirror/CodeMirror.vue'
const route = useRoute()
const go = useGo()
const elListFields = ref<ComponentRef>(null)
const elTypeFields = ref<ComponentRef>(null)

const fields = ref<ContentFieldsMapping[]>([])
const listFields = ref<ContentFieldsMapping[]>([])

let listManageFields: ContentFieldsMapping[] = reactive<ContentFieldsMapping[]>(
  [],
)
// 此处可以得到文档ID
const documentId = ref(route.params?.id)
let contentItem: ContentItemUpperCase = reactive({})
const model = ref<any>({})
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
    (x) => x.filedName == 'QueryMethod',
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

async function typeSelectionChanged(value) {
  fields.value = await getAllFileds(value)
  console.log('typeSelectionChanged', fields)
  updateDraggableEl()
}

// let sortable: Sortable

function updateDraggableEl() {
  nextTick(() => {
    const TypeFieldsEl = unref(elTypeFields)
    if (!TypeFieldsEl) return
    const el = TypeFieldsEl as any
    if (!el) return

    new Sortable(unref(el), {
      group: 'shared', // set both lists to same group
      animation: 150,
    })

    const TypeFieldsEl2 = unref(elListFields)
    if (!TypeFieldsEl2) return
    const el2 = TypeFieldsEl2 as any
    if (!el2) return
    new Sortable(unref(el2), {
      group: 'shared', // set both lists to same group
      animation: 150,
    })
  })
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

<style></style>
