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
  <br>
  <!-- <child v-model:aaa="aaa"></child> -->
  </div>
</template>
<script lang="ts">
  import { Vue,Options } from 'vue-property-decorator';
  import { defineAsyncComponent } from 'vue'
  // import child from '/@/views/table/child.vue';

  const child = defineAsyncComponent(()=>import('/@/views/table/child1.vue'));

  @Options({
    name: 'tables',
    components: {
       child
    }
  })
  export default class tables extends Vue {
    private aaa = '21';
    private obbb = {
      bbb: '22',
      ccc: 33
    }
    

    btnClick() {
      this.aaa = '22222222222222222';
      this.obbb.bbb = '3333333333333333333';

      
    }

    
  }
</script>
