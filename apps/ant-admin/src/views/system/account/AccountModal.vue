<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @cancel="cancel" @ok="handleSubmit">
    <Amis :amisjson="amisjson" @amisMounted="amisMounted" @eventTrackerEvent="eventTrackerEvent" />
  </BasicModal>
</template>
<script lang="ts" setup>
import { computed, defineEmits, reactive, onBeforeMount, ref } from 'vue'
import { BasicModal, useModalInner } from '@/components/modal'

import { getDeptList } from '@pkg/apis/system'
import {
  ContentTypeDefinitionDto,
  UserDetailsDto,
  UsersServiceProxy,
} from '@pkg/apis/eoc/app-service-proxies'

import { Amis } from '@/components/Amis'
import { TrackerEventArgs } from '@/components/Amis/src/types'
import schema from './editAccount.json'
// import { createAsyncComponent } from '@/internal'
// export default defineComponent({
// export const Amis = createAsyncComponent(() => import('@/components/Amis'))
//   name: 'AccountModal',
//   components: { BasicModal, Amis },
const emit = defineEmits(['success', 'register'])
// setup(_, { emit }) {
const model = reactive<{
  isUpdate: boolean
  rowId: string
  userInfo: UserDetailsDto | null
  userCustomSettings: ContentTypeDefinitionDto[]
}>({
  isUpdate: true,
  rowId: '',
  userInfo: null,
  userCustomSettings: [],
})
const amisjson = ref<any>(schema)

onBeforeMount(async () => {
  const treeData = await getDeptList()
  console.log('treeData: ', treeData);
  const deptlist = getRecurDeptList(treeData)
  const options = { "options": deptlist };
  console.log('options: ', options);
  amisjson.value.definitions = {
    deptSource: options
  }
})

async function eventTrackerEvent(params: TrackerEventArgs) {
  console.log('该信息来自于Vue事件监听：', params)
  if (params.tracker?.eventData && params.tracker?.eventData?.id)
    switch (params.tracker.eventData.id) {
      case 'submit':
        model.userInfo = params.eventProps.data;
        await handleSubmit()
        break;
      case 'cancel':
        closeModal();
        break;
    }
}
let amisScoped  
function amisMounted(amisScope) {
  amisScoped = amisScope
  console.log('amisScoped: ', amisScoped)

}

const userService = new UsersServiceProxy()

const [registerModal, { setModalProps, closeModal }] = useModalInner(
  async (data) => {
    const form = amisScoped.getComponentByName('page1.form1');
    form.reset();
    setModalProps({ confirmLoading: false })
    model.isUpdate = !!data?.isUpdate

    if (model.isUpdate && data.record.userId) {
      model.userInfo = await userService.getUser(data.record.userId)
    }
    else {
      model.userInfo = null
    }
    // 可以通过 amisScoped.getComponentByName('form1').setValues({'name1': 'othername'}) 来修改表单中的值。 
    form.setValues(model.userInfo) // 设置表单值

  },
)


function getRecurDeptList(deptlist: any[]) {
  let list: any[] = [];
  if (deptlist.length > 0) {
    list = deptlist.map(o => {
      const { deptName, id, children } = o;
      const dept = {
        label: deptName,
        value: id,
        children: children
      }
      if (children && children.length > 0) {
        dept.children = getRecurDeptList(children)
      };

      return dept;
    })
  }
  return list;
}

const getTitle = computed(() => (!model.isUpdate ? '新增账号' : '编辑账号'))

async function handleSubmit() {
  // 可以通过 amisScoped.getComponentByName('page1.form1').getValues() 来获取到所有表单的值，需要注意 page 和 form 都需要有 name 属性。

  const form = amisScoped.getComponentByName('page1.form1');
  console.log('amisScoped.getComponentByName(\'form1\'): ', form);
 
  try { 
    form.validate().then(async isValidated => {
      console.log('isValidated: ', isValidated);
      if (!isValidated) {
        console.log('表单验证失败！');

      } else {
    
        model.userInfo = form.getValues()
        console.log('model.isUpdate: ', model);
        if (model.isUpdate) {
          await userService.update(model.userInfo as UserDetailsDto)
        } else {
          await userService.newUser(model.userInfo as UserDetailsDto);
        }
        emit("success", {
          isUpdate: model.isUpdate,
          record: model.userInfo,
        })
        closeModal()
      }
    }) 
  } catch (error) {
    console.log('error: ', error);
  }


}

  //   return { registerModal, getTitle, handleSubmit, amisjson, eventTrackerEvent, amisMounted }
  // },
// })
</script>
