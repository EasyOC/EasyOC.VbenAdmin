<template>
  <div style="background: green">
    The Vue component will disappear in {{$attrs.disappearTime}}s
  </div>
</template>

<script>
export default {
  name: "AA",
  inheritAttrs: false,
  mounted() {
    // console.log(this.$attrs)
  }
}
</script>

<style scoped>

</style>
