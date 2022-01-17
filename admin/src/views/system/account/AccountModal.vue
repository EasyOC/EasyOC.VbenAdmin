<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed, unref, reactive, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './account.data';
  import { getAllRoleList, userService } from '../../../api/system';
  import { ContentTypeDefinitionDto, UserDetailsDto } from '/@/api/app-service-proxies';
  import { ContentHelper } from '/@/api/EOC/ContentHelper';

  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      // const isUpdate = ref(true);
      // const rowId = ref('');
      // const userInfo = ref({});
      const model = reactive<{
        isUpdate: boolean;
        rowId: string;
        userInfo: UserDetailsDto | null;
        userCustomSettings: ContentTypeDefinitionDto[];
      }>({
        isUpdate: true,
        rowId: '',
        userInfo: null,
        userCustomSettings: [],
      });

      let finalFormSchema = [];
      onMounted(async () => {
        const helper = new ContentHelper();
        const customPropCols = helper.getFormSchemaFromUserProperties(model.userCustomSettings);
        finalFormSchema = [...accountFormSchema, ...customPropCols];
        console.log(finalFormSchema, 'getFormSchemaFromUserProperties');
      });

      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: finalFormSchema,
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

      const getTitle = computed(() => (!model.isUpdate ? '新增账号' : '编辑账号'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          // TODO custom api
          if (model.isUpdate) {
            const userInfo = Object.assign(model.userInfo, values);
            await userService.update(userInfo);
          } else {
            const userInfo = new UserDetailsDto();
            userInfo.init(values);
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
