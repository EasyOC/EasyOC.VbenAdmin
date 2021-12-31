<template>
  <label>
    {{ aaa }}
    <abd :bbd="aaa" @click="adbClick"></abd>
  </label>
</template>
<script lang="ts">
  import { Vue, Options } from 'vue-property-decorator';

  import abd from './abd.vue';

  @Options({
    name: 'tables',
    components: {
      abd
    },
  })
  export default class tables extends Vue {
    private aaa = '21';

    adbClick(value) {
      // console.log('this.aaa: ', this.aaa);
      // console.log('value: ', value);
      this.aaa = value;
      // this.$forceUpdate();
    }
    // setup() {
    //   this.aaa = '22';

    //   return this.aaa;
    // }


  }
</script>
