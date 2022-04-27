<template>
  <div>
  </div>
</template>
<script  lang='ts' setup>
import authService from '@/api/authService'
import { useGo } from '@/hooks/web/usePage'
import { useUserStore } from '@/store/user'
import { onBeforeMount } from 'vue'
    
onBeforeMount(async()=>{
    await authService.completeLogout();
    const userStore = useUserStore();
    await userStore.logout(true,true);
})
</script>
