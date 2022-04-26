<template>
  <div>
  </div>
</template>
<script>
import authService from '@/api/authService'
export default {
  name: 'login',
  created () {

    authService.login()
      .then((redirectPath) => {
        this.$router.push('/')
      })
      .catch((err) => {
        this.toastNotification.error(err.message)
      })
  }
}
</script>
