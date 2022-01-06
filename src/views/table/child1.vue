<template>
  <label>
   aaa: {{ aaa }}
  </label><br>
  <label>
  obbb:{{ modelValue.bbb }} {{ modelValue.ccc}}
  </label><br>
  <a-button type="primary" @click="btnClick">1111111111111111111</a-button>
</template>
<script lang="ts">
import { defineComponent, toRef, toRefs, unref, isRef,isReactive, watch } from 'vue'

  export default defineComponent({
    name: 'child1',
    components: {},
    emits:['update:aaa','update:modelValue'],
    props:{
      aaa:String,
      modelValue:Object
    },
    setup(props, { emit}) {
      const aaa  = toRef(props, 'aaa');
      console.log('aaa: ', isRef(aaa));

      const { modelValue } = unref(props);
      console.log('modelValue: ', isReactive(modelValue));
      // console.log('model: ', model);

      async function btnClick() {
        emit('update:aaa', '1111111111111111111');
        
        modelValue.bbb = '444444444444444444';
        emit('update:modelValue', modelValue);
      }

      return {
        aaa,
        modelValue,
        btnClick
      }
    },
    // methods:{
    //   get model():any{
    //     return this.modelValue;
    //   },
    //   set model(value:any){
    //     this.$emit('update:modelValue', value);
    //   },
    //   async btnClick() {
    //     this.$emit('update:aaa', '1111111111111111111');

    //     this.model.bbb = '444444444444444444';
    //   }
    // }
  }) 
</script>
