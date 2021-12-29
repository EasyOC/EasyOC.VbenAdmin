<template>
  <label>
    {{ aaa }}
  </label>
</template>
<script lang="ts">
  import { Vue } from 'vue-class-component';

  
  export default class tables extends Vue {
    private aaa = '21';


    setup() {
      this.aaa = '22';

      return this.aaa;
    }
  }
</script>
