<script lang="ts" setup>
import { reactive, ref, unref, computed } from 'vue'

import {
  Checkbox,
  Form,
  Input,
  Row,
  Col,
  Button,
  Divider,
} from 'ant-design-vue'
import {
  GithubFilled,
  WechatFilled,
  AlipayCircleFilled,
  GoogleCircleFilled,
  TwitterCircleFilled,
} from '@ant-design/icons-vue'
import LoginFormTitle from './login-form-title.vue'

import { useI18n } from '@pkg/locale'
import { useMessage } from '@/hooks/web/useMessage'
import { useUserStore } from '@/store/user'
import {
  LoginStateEnum,
  useLoginState,
  useFormRules,
  useFormValid,
} from './use-login'
import { useDesign } from '@/hooks/web/useDesign'

const ACol = Col
const ARow = Row
const FormItem = Form.Item
const InputPassword = Input.Password
const { t } = useI18n()
const { notification, createErrorModal } = useMessage()
const { prefixCls } = useDesign('login')
const userStore = useUserStore()

const { setLoginState, getLoginState } = useLoginState()
const { getFormRules } = useFormRules()

const formRef = ref()
const loading = ref(false)
const rememberMe = ref(false)

const formData = reactive({
  account: 'vben',
  password: '123456',
})

const { validForm } = useFormValid(formRef)

//onKeyStroke('Enter', handleLogin);

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)

async function handleLogin() {
  const data = await validForm()
  if (!data) return
  try {
    loading.value = true
    const userInfo = await userStore.login({
      password: data.password,
      username: data.account,
      mode: 'none', //不要默认的错误提示
    })
    if (userInfo) {
      notification.success({
        message: t('sys.login.loginSuccessTitle'),
        description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
        duration: 3,
      })
    }
  } catch (error) {
    createErrorModal({
      title: t('sys.api.errorTip'),
      content:
        (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
      getContainer: () =>
        document.body.querySelector(`.${prefixCls}`) || document.body,
    })
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >


    <FormItem class="enter-x">
      <Button
        type="primary"
        size="large"
        block
        @click="handleLogin"
        :loading="loading"
      >
        {{ t('sys.login.loginButton') }}
      </Button>
      <!-- <Button size="large" class="mt-4 enter-x" block @click="handleRegister">
        {{ t('sys.login.registerButton') }}
      </Button> -->
    </FormItem>
    <!-- <ARow class="enter-x">
      <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.MOBILE)">
          {{ t('sys.login.mobileSignInFormTitle') }}
        </Button>
      </ACol>
      <ACol :md="8" :xs="24" class="!my-2 md:!my-0 xs:mx-0 md:mx-2">
        <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">
          {{ t('sys.login.qrSignInFormTitle') }}
        </Button>
      </ACol>
      <ACol :md="7" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.REGISTER)">
          {{ t('sys.login.registerButton') }}
        </Button>
      </ACol>
    </ARow> -->

   <!--  <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider>

    <div
      class="flex justify-evenly enter-x"
      :class="`${prefixCls}-sign-in-way`"
    >
      <GithubFilled />
      <WechatFilled />
      <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled />
    </div> -->
  </Form>
</template>
