<template>
  <PageWrapper title="表单基础示例" contentFullHeight>
    <CollapseContainer title="基础示例">
      <a-form ref="formRef" name="dynamic_form_item" :model="contentItem">
        <draggable :list="typeFields">
          <a-form-item
            v-for="(field, index) in typeFields"
            :key="field.keyPath"
            :label="field.displayName"
            :name="field.keyPath"
            v-bind="formItemLayout"
            :rules="{
              required: true,//读取字段配置
              message: 'domain can not be null',
              trigger: 'change',
            }"
          >
            <a-input
              v-model:value="
                contentItem[field.partName][field.fieldName][field.lastValueKey]
              "
              placeholder="please input domain"
            />
            <!-- <MinusCircleOutlined
        v-if="dynamicValidateForm.domains.length > 1"
        class="dynamic-delete-button"
        :disabled="dynamicValidateForm.domains.length === 1"
        @click="removeDomain(domain)"
            />-->
          </a-form-item>
          <a-form-item v-bind="formItemLayoutWithOutLabel">
            <a-button type="dashed" style="width: 60%" @click="addDomain">
              <PlusOutlined />Add field
            </a-button>
          </a-form-item>
          <a-form-item v-bind="formItemLayoutWithOutLabel">
            <a-button type="primary" html-type="submit" @click="submitForm">Submit</a-button>
            <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
          </a-form-item>
        </draggable>
      </a-form>
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts">
import { CollapseContainer } from '@/components/Container'
import { PageWrapper } from '@/components/Page'

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import {
  ContentFieldsMapping,
  ContentItemUpperCase,
} from '@service/eoc/contentApi'
import { ContentTypeService } from '@/api/ContentTypeService'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

interface Domain {
  value: string
  key: number
}
export default defineComponent({
  components: {
    MinusCircleOutlined,
    PlusOutlined,
    draggable,
    CollapseContainer,
    PageWrapper,
  },
  setup() {
    const typeName = 'Customer'
    const typeFields = ref<ContentFieldsMapping[]>([])
    const contentItem = ref<ContentItemUpperCase>({ ContentType: typeName })
    const contentTypeService = new ContentTypeService(typeName)
    onBeforeMount(async () => {
      contentItem.value = await contentTypeService.getContent(
        '4vjsa6e801dcgs1sm0h47118my',
      )
      typeFields.value = (await contentTypeService.getAllFields()).filter(
        (x) => x.partName,
      )
    })
    const formRef = ref<FormInstance>()
    const formItemLayout = {
      labelCol: {
        // xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        // xs: { span: 24 },
        sm: { span: 20 },
      },
    }
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    }
    const dynamicValidateForm = reactive<{ domains: Domain[] }>({
      domains: [],
    })
    const submitForm = () => {
      formRef.value
        .validate()
        .then(() => {
          console.log('values', dynamicValidateForm.domains)
        })
        .catch((error) => {
          console.log('error', error)
        })
    }
    const resetForm = () => {
      formRef.value.resetFields()
    }
    const removeDomain = (item: Domain) => {
      let index = dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        dynamicValidateForm.domains.splice(index, 1)
      }
    }
    const addDomain = () => {
      dynamicValidateForm.domains.push({
        value: '',
        key: Date.now(),
      })
    }
    return {
      formRef,
      formItemLayout,
      formItemLayoutWithOutLabel,
      dynamicValidateForm,
      submitForm,
      resetForm,
      removeDomain,
      typeFields,
      contentItem,
      addDomain,
    }
  },
})
</script>
