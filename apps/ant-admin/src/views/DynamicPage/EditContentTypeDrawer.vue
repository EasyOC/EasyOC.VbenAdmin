<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" showFooter :title="getTitle" width="500px"
    @ok="handleSubmit" />
</template>
<script lang="ts" setup>
import { ref, computed, unref } from 'vue'
import { useForm } from '@/components/form'
import { BasicDrawer, useDrawerInner } from '@/components/drawer'
import { TreeItem } from '@/components/Tree'
import { getMenuList } from '@pkg/apis/sys/menu'

const emit = defineEmits(['success', 'register'])
// export default defineComponent({
//   name: 'EditContentTypeDrawer',
//   components: { BasicDrawer, BasicForm, BasicTree },
//   emits: ['success', 'register'],
//   setup(_, { emit }) {
const isUpdate = ref(true)
const treeData = ref<TreeItem[]>([])

const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
  labelWidth: 90,
  schemas: [],
  showActionButtonGroup: false,
})

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
  async (data) => {
    resetFields()
    setDrawerProps({ confirmLoading: false })
    // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
    if (unref(treeData).length === 0) {
      treeData.value = (await getMenuList()) as any as TreeItem[]
    }
    isUpdate.value = !!data?.isUpdate

    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      })
    }
  },
)

const getTitle = computed(() =>
  !unref(isUpdate) ? '新增角色' : '编辑角色',
)

async function handleSubmit() {
  try {
    const values = await validate()
    setDrawerProps({ confirmLoading: true })
    // TODO custom api
    console.log(values)
    closeDrawer()
    emit('success')
  } finally {
    setDrawerProps({ confirmLoading: false })
  }
}

//     return {
//       registerDrawer,
//       registerForm,
//       getTitle,
//       handleSubmit,
//       treeData,
//     }
//   },
// })
</script>
