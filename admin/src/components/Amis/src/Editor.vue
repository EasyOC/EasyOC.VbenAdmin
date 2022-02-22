<template>
  <div><Editor :value="testJson" :theme="theme" /></div>
</template>

<script>
import { Editor } from 'amis-editor'

export default {
  /* data, methods, etc */
  components: { Editor },
  data() {
    return {
      theme: 'antd',
      testJson: {
        type: 'page',
        body: {
          type: 'form',
          mode: 'horizontal',
          api: '/amis/api/mock2/form/saveForm',
          debug: true,
          body: [
            {
              type: 'input-date',
              name: 'date',
              label: '日期',
            },
          ],
        },
      },
    }
  },
  methds: {
    change(e) {
      console.log('e: ', e)
    },
  },
}

// import { Editor } from 'amis-editor'
// import ReactDOM from 'react-dom'
// import { ref, onMounted } from 'vue'
// const props = ref<any>({})

// onMounted(() => {
//   ReactDOM.render(() => <Editor {...props.value} />)
// })
</script>
