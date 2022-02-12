<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle">
    <!-- <BasicForm @register="registerForm" /> -->
    <ContentForm type-name="Customer" :content-item-id="model.rowId" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, computed, unref, reactive, onMounted } from 'vue'
import { BasicModal } from '@/components/Modal'
// import { BasicForm, useForm } from '@/components/Form/index'
import { ContentForm } from '@/components/OrchardCore'

export default defineComponent({
  name: 'EditModal',
  components: { BasicModal, ContentForm },
  setup() {
    const model = reactive<{
      isUpdate: boolean
      rowId: string
    }>({
      isUpdate: true,
      rowId: '',
    })

    onMounted(async () => {})

    const getTitle = computed(() =>
      !model.isUpdate ? '新增客户信息' : '编辑客户信息',
    )

    return { model, getTitle }
  },
})
</script>
