<template>
  <div>
  </div>
</template>
<script>
import authService from '@/api/authService'
import { useGo } from '@/hooks/web/usePage'
import { useUserStore } from '@/store/user'

export default {
  name: 'loginCallback',
  mounted() {
    console.log(333333)
    // authService.completeLogin().then(()=>{

      console.log(2222222222222222)
      const userStore=useUserStore()
      userStore.oidclogin()
      const go = useGo()
      go('/')
    // })
    
  }
}
</script>
