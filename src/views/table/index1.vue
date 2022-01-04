<template>
    <div>
      213
  <Suspense>
			<template v-slot:default>
				<child v-model:aaa="aaa"></child> 
			</template>
			<template v-slot:fallback>
				<h3>加载中.....</h3>
			</template>
		</Suspense>
    </div>

</template>
<script lang='ts'>
import { defineAsyncComponent, defineComponent, ref } from 'vue'

const child = defineAsyncComponent(()=>import('/@/views/table/child.vue'));

export default defineComponent({
  name: 'tables',
  components: {
    child
  },
  setup() {
    // return child
    let aaa=ref('21');
    return {
      aaa
    }
  }
})
</script>
