<template>
  <PageWrapper title="Ripple示例">
    <div class="demo-box" v-ripple>content</div>
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { ripple } from '@admin/directives'
import { PageWrapper } from '@/components/Page'

export default defineComponent({
  components: { PageWrapper },
  directives: {
    ripple: ripple,
  },
})
</script>

<style lang="less" scoped>
.demo-box {
  display: flex;
  width: 300px;
  height: 300px;
  font-size: 24px;
  color: #fff;
  background-color: #408ede;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
}
</style>
