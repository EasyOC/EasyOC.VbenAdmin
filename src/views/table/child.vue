<template>
  <label>
    {{ aaa }}
  </label>
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


    // setUp(){
    //   // setTimeout(()=>{
    //   //   console.log('value: ', this.aaa);
    //   // },4000)
    //   console.log('value: ', 1111);
    // }

    public get aaaModel(): string{
      return this.aaa;
    }

    public set aaaModel(value: string) {
      console.log('value: ', value);
      this.$emit('update:aaa', value);
    }


    btnClick() {
      this.aaaModel = '1111111111111111111';
    }
  }
</script>
