<script lang="ts" setup>
import { computed, unref } from 'vue'
import LoginFormTitle from './login-form-title.vue'
import { Button, Divider } from 'ant-design-vue'
import { QrCode } from '@components/common'
import { useI18n } from '@pkg/locale'
import { useLoginState, LoginStateEnum } from './use-login'

const qrCodeUrl = 'https://vvbin.cn/next/login'

const { t } = useI18n()
const { handleBackLogin, getLoginState } = useLoginState()

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.QR_CODE)
</script>

<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <div class="enter-x min-w-64 min-h-64">
      <QrCode
        :value="qrCodeUrl"
        class="flex justify-center enter-x xl:justify-start"
        :width="280"
      />
      <Divider class="enter-x">{{ t('sys.login.scanSign') }}</Divider>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </div>
  </template>
</template>
