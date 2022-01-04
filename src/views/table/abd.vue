<template>
  <a-button type="primary" @click="handleClick">
    212121
  </a-button><br/>
  <!-- <a-button type="primary" @click="btnClick">
    2323232
  </a-button> -->
  <input type="text" :value="bbd" @input="$emit('update:bbd', $event.target.value)">
  <label>
    {{ bbd }}
  </label>
</template>
<script lang="ts">
import { Options, Vue, Prop, Emit, Ref } from 'vue-property-decorator'

import { reactive, toRef } from 'vue'

  @Options({
    name: 'abd',
    emits: ['click','update:bbd'],
    // data() {
    //   return {
    //     bbd: '123'
    //   }
    // },
  })
  export default class abd extends Vue {
    @Prop({ default: ""}) public bbd!: string;
    

  //   @Emit('update:bbd')
  //  set updatebbd(value: string) {
  //     // this.$emit('update:bbd', value);
  //     // return value;
  //     // this.$emit('bbd', value);
  //   }

    handleClick() {
      this.$emit('click', '500');
      // this.updatebbd = '22';

      const ret = reactive({bbd: '123'});
      this.bbd = toRef(ret, 'bbd')

    }

    

  }
</script>
