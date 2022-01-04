<template>
  <label>
    {{ aaa }}
  </label>
  <a-button type="primary" @click="btnClick">1111111111111111111</a-button>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

  export default defineComponent({
    name: 'child1',
    components: {},
    emits:['update:aaa'],
    props:{
      aaa:String
    },
    setup(props, { emit}) {
      const aaa  = ref(props.aaa);
      watch(
        () => props.aaa,
        (v) => {
          aaa.value = v;
        },
      );
      async function btnClick() {
        emit('update:aaa', '1111111111111111111');
      }
      return {
        aaa,
        btnClick
      }
    }
  }) 
</script>
