<template>
  <PageWrapper :title="getTitle" contentBackground @back="goBack">
    <template #extra>
      <a-button type="primary"> 保存 </a-button>
      <a-button type="primary" danger> 删除列表</a-button>
    </template>
    <template #footer>
      <a-tabs default-active-key="detail" v-model:activeKey="currentKey">
        <a-tab-pane key="detail" tab="用户资料" />
        <a-tab-pane key="logs" tab="操作日志" />
      </a-tabs>
    </template>
    <div class="pt-4 m-4 desc-wrap">
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
          <a-col :span="3"
            >122232
            <a-row v-for="item in unref(fields)" :key="item.keyPath || ''">
              1111
              <a-col>{{ t(item.displayName || '') }} </a-col>
            </a-row>
            <!-- <VueDraggableNext :list="fields"> </VueDraggableNext> -->
          </a-col>
        </div>
      </template>
      <template v-if="currentKey == 'logs'">
        <div v-for="i in 10" :key="i">
          这是用户{{ contentItem.DisplayText }}操作日志Tab
        </div>
      </template>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, unref } from 'vue'
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
import { useTabs } from '@/hooks/web/useTabs'
import { VueDraggableNext } from 'vue-draggable-next'
import {
  ContentManagementServiceProxy,
  ContentTypeListItemDto,
} from '@service/api/app-service-proxies'
import {
  getContent,
  createOrUpdateContent,
  ContentItemUpperCase,
} from '@service/eoc/contentApi'
import { ContentFieldsMapping } from '@service/eoc/contentApi'
import { ContentHelper } from '@/api/contentHelper'
const route = useRoute()
const go = useGo()

let fields: ContentFieldsMapping[] = []

let listManageFields: ContentFieldsMapping[] = reactive<ContentFieldsMapping[]>(
  [],
)
// 此处可以得到文档ID
const documentId = ref(route.params?.id)
let contentItem: ContentItemUpperCase = reactive<ContentItemUpperCase>({})

const typeManagement = new ContentManagementServiceProxy()
const contentHelper = new ContentHelper()

async function getAllFileds(typeName: string) {
  const typDef = await typeManagement.getTypeDefinition({
    name: typeName,
    withSettings: true,
  })
  console.log(typDef, 'TypeDef')
  return contentHelper.getAllFields(typDef)
}

const schemas = [
  {
    field: 'VbenList.TargetContentType.Text',
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
    field: 'VbenList.QueryMethod.Text',
    component: 'Select',
    label: '查询方式',
    colProps: {
      span: 8,
    },
    defaultValue: 'Graphql',
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
const { setTitle } = useTabs()
// 设置Tab的标题（不会影响页面标题）
onMounted(async () => {
  if (documentId.value) {
    contentItem = await getContent(documentId.value.toString())
    console.log(contentItem, 'contentItem')
  }
  listManageFields = await getAllFileds('VbenList')
  console.log(listManageFields, 'listManageFields')
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
  await setFieldsValue(unref(contentItem))
  setTitle('编辑列表：' + contentItem.DisplayText)
})

async function typeSelectionChanged(value) {
  fields = await getAllFileds(value)
  console.log('typeSelectionChanged', fields)
}

function handleReset() {
  // keyword.value = ''
}
function handleSubmit(values: any) {
  // createMessage.success('click search,values:' + JSON.stringify(values))
}
const getTitle = computed(() => {
  if (unref(contentItem).DisplayTexttItem) {
    return `编辑：${unref(contentItem).DisplayText}`
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
