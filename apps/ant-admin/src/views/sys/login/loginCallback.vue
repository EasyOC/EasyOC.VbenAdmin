<template>
  <div>正在登陆...
  </div>
</template>
<script lang='ts' setup>
import authService from '@/api/authService'
// import { useGo } from '@/hooks/web/usePage'
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user'
import { onBeforeMount } from 'vue'
    
onBeforeMount(async()=>{
    await authService.completeLogin()
    const userStore = useUserStore()
    await userStore.oidclogin()
    // // const go = useGo()
    // go('/') 
    const router = useRouter()
    router.push('/')
})
</script>
