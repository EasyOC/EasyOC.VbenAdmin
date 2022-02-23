<template>
  <div>
    <Editor :value="testJson" @onChange="change" :preview="false" :theme="theme" />
  </div>
</template>
 
<script>
// import { ReactWrapper } from 'vuera'
import { ReactInVue } from 'vuera'
import { Editor } from 'amis-editor'

export default {
  name: 'AmisEditor',
  components: {
    // react: ReactWrapper,
    Editor: ReactInVue(Editor),
  },
  data() {
    return {
      // component: Editor,
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
</script>
