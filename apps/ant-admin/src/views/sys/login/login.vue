<template>
  <div>
  </div>
</template>
<script>
import authService from '@/api/authService'
import { useGo } from '@/hooks/web/usePage'
export default {
  name: 'Login',
  mounted() {
    const go = useGo()
    authService.login()
      .then((redirectPath) => {
        go(redirectPath||'/')
      })
      .catch((err) => {
        this.toastNotification.error(err.message)
      })
  }
}
</script>
