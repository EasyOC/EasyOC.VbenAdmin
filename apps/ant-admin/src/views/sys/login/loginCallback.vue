<template>
  <div>正在登陆...
  </div>
</template>
<script lang='ts' setup>
import authService from '@/api/authService'
// import { useGo } from '@/hooks/web/usePage'
import { useUserStore } from '@/store/user'
import { onBeforeMount } from 'vue'

onBeforeMount(async () => {
  const userStore = useUserStore()
  await authService.completeLogin()
  await userStore.oidclogin()
  // // const go = useGo()
  // go('/') 

})
</script>
