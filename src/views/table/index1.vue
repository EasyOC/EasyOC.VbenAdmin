<template>
    <div>
  <label>
   aaa: {{ aaa }}
  </label>
  <br>
  <label>obbb:{{ obbb.bbb }} {{ obbb.ccc}} </label>
  <br>
  <a-button type="primary" @click="btnClick">22222222222222222</a-button>
  <br>
  <Suspense>
			<template v-slot:default>
				<child v-model:aaa="aaa" v-model="obbb"></child> 
			</template>
			<template v-slot:fallback>
				<h3>加载中.....</h3>
			</template>
		</Suspense>
    </div>

</template>
<script lang='ts'>
import { defineAsyncComponent, defineComponent, reactive, ref } from 'vue'

 // import child from '/@/views/table/child.vue';

const child = defineAsyncComponent(()=>import('/@/views/table/child1.vue'));

export default defineComponent({
  name: 'tables',
  components: {
    child
  },
  setup() {
    // return child
    let aaa=ref('21');

    let obbb = reactive( {
      bbb: '22',
      ccc: 33
    })
    return {
      aaa,
      obbb
    }
  },methods:{
    btnClick(){
      this.aaa = '22222222222222222';
      this.obbb.bbb = '3333333333333333333';
    }
  }
})
</script>
