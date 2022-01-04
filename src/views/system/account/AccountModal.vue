<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './account.data';
  import { getAllRoleList, userService } from '../../../api/system';
  import { UserDetailsDto } from '/@/api/app-service-proxies';

  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      // const isUpdate = ref(true);
      // const rowId = ref('');
      // const userInfo = ref({});
      const model = reactive({ isUpdate: true, rowId: '', userInfo: {} });
      const [
        registerForm,
        { setFieldsValue, updateSchema, resetFields, getFieldsValue, validate },
      ] = useForm({
        labelWidth: 100,
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        model.isUpdate = !!data?.isUpdate;
        model.userInfo = data.record;
        console.log('record', data.record);
        if (unref(model.isUpdate)) {
          model.rowId = data.record.userId;
          setFieldsValue(data.record);
        }
        const allRoles = await getAllRoleList();
        let rolesOptions = allRoles.map((x) => {
          return { value: x.roleName, label: x.roleDescription };
        });

        updateSchema([
          {
            field: 'pwd',
            show: !unref(model.isUpdate),
          },
          {
            field: 'roleNames',
            componentProps: { options: rolesOptions },
          },
        ]);
      });

      const getTitle = computed(() => (!unref(model.isUpdate) ? '新增账号' : '编辑账号'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          // TODO custom api
          if (unref(model.isUpdate)) {
            const userInfo = Object.assign(unref(model.userInfo), values);
            console.log(userInfo, 'getFieldsValue');
            await userService.update(userInfo);
          } else {
            const userInfo = new UserDetailsDto();
            userInfo.init(getFieldsValue());
            console.log(getFieldsValue(), ' getFieldsValue()');
            console.log(userInfo, 'userInfo getFieldsValue()');
            console.log(userInfo, 'values getFieldsValue()');
            userInfo.properties = {};
            await userService.newUser(userInfo);
          }
          console.log(values);
          closeModal();
          emit('success', {
            isUpdate: unref(model.isUpdate),
            values: { ...values, id: model.rowId },
          });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, model, handleSubmit };
    },
  });
</script>
