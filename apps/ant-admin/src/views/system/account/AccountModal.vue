<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @cancel="cancel" @ok="handleSubmit">
    <Amis ref="amisRender" :amisjson="amisjson" @amisMounted="amisMounted" @eventTrackerEvent="eventTrackerEvent" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, computed, unref, reactive, onBeforeMount, ref } from 'vue'
import { BasicModal, useModalInner } from '@/components/modal'
import { FormSchema, useForm } from '@/components/form'
import { accountFormSchema } from './account.data'
import { getDeptList } from '@pkg/apis/system'
import {
  ContentTypeDefinitionDto,
  UserDetailsDto,
  UsersServiceProxy,
} from '@pkg/apis/eoc/app-service-proxies'
import { ContentHelper } from '@/api/contentHelper'

import { Amis } from '@/components/Amis'
import { TrackerEventArgs } from '@/components/Amis/src/types'
import schema from './editAccount.json'

export default defineComponent({
  name: 'AccountModal',
  components: { BasicModal, Amis },
  emits: ['success', 'register'],
  setup(_, { emit }) {
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
    const amisScoped = ref<any>(null)
    function amisMounted(amisScope) {
      amisScoped.value = amisScope
      console.log('amisScoped.value: ', amisScoped.value)

    }

    const userService = new UsersServiceProxy()

    const [registerModal, { setModalProps, closeModal }] = useModalInner(
      async (data) => {

        setModalProps({ confirmLoading: false })
        model.isUpdate = !!data?.isUpdate
        if (model.isUpdate && data.record.userId) {

          model.userInfo = await userService.getUser(data.record.userId)
        }
        else {
          model.userInfo = null
        }
        amisScoped.value.updateProps(
          {
            data: { ...model.userInfo }
          }, () => {
            console.log('amisScoped.value: ', amisScoped.value)
          }
        )

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
      console.log('model.isUpdate: ', model);
      if (model.isUpdate) {
        await userService.update(model.userInfo as UserDetailsDto)
      }else {

        await userService.newUser(model.userInfo as UserDetailsDto);
      }
      emit("success", {
        isUpdate: model.isUpdate,
        record: model.userInfo,
      })
      closeModal()
    }

    return { registerModal, getTitle, handleSubmit, amisjson, eventTrackerEvent, amisMounted }
  },
})
</script>
