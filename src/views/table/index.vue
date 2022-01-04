<template>
  <div>
  <label>
    {{ aaa }}
    <abd :bbd="aaa" @click="adbClick"></abd>
  </label>
  <br>
  3333
  <br>
  <a-button type="primary" @click="btnClick">22222222222222222</a-button>

  <Suspense>
			<template v-slot:default>
				<child v-model:aaa="aaa"></child> 
			</template>
			<template v-slot:fallback>
				<h3>加载中.....</h3>
			</template>
	</Suspense>
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
    

    btnClick() {
      this.aaa = '22222222222222222';
    }

    
  }
</script>
