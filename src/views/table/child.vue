<template>
  <label>
  aaa:  {{ aaa }}
  </label><br>
  <label>
  obbb:{{ model.bbb }} {{ model.ccc}}
  </label><br>
  <a-button type="primary" @click="btnClick">1111111111111111111</a-button>
</template>
<script lang="ts">
  import { Vue, Prop,Options  } from 'vue-property-decorator';

  @Options({
    name: 'Child',
    components:{},
    setUp(_, props, ctx) {
      console.log('props: ', props);
      console.log('ctx: ', ctx);
      // setTimeout(()=>{
      //   console.log('value: ', this.aaa);
      // },4000)
      console.log('value: ', 1111);
    }
  })
  export default class Child extends Vue {
    @Prop({ default: ""}) public aaa:string;
    @Prop({ default: null }) public modelValue:any;


    // setUp(){
    //   // setTimeout(()=>{
    //   //   console.log('value: ', this.aaa);
    //   // },4000)
    //   console.log('value: ', 1111);
    // }

    public get model():any{
      return this.modelValue;
    }

    public set model(value:any){
      this.$emit('update:modelValue', value);
    }

    public get aaaModel(): string{
      return this.aaa;
    }

    public set aaaModel(value: string) {
      this.$emit('update:aaa', value);
    }


    btnClick() {
      this.aaaModel = '1111111111111111111';

      this.model.bbb = '444444444444444444';
    }
  }
</script>
