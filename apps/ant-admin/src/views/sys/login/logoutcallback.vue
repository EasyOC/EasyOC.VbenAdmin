<template>
  <div>
    正在退出...
  </div>
</template>
<script  lang='ts' setup>
import authService from '@/api/authService'
import { useGo } from '@/hooks/web/usePage'
import { useUserStore } from '@/store/user'
import { onBeforeMount } from 'vue'

onBeforeMount(async () => {
  await authService.completeLogout();
  const userStore = useUserStore();
  //退出后不跳转系统登陆页
  await userStore.logout(false, true);
  // 转到 oidc 登陆页， 因为授权已失效所以会停留在登陆页面
  await authService.login();
})
</script>
