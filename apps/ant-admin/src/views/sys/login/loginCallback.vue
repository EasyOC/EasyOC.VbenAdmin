<template>
  <div>
  </div>
</template>
<script>
import authService from '@/api/authService'
import { useRoute } from 'vue-router'
export default {
  name: 'loginCallback',
  created () {
      const go=useRoute()
      go()
  }
}
</script>
