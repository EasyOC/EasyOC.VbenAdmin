<template>
  <Basic :foo="foo">
    <div>
      children内容
    </div>
  </Basic>
</template>
<script>
import {applyReactInVue} from 'veaury'
// 这是一个React组件
import BasicReactComponent from './react_app/Basic.jsx'
import {ref} from 'vue'

export default {
  components: {
    // 使用高阶组件 'applyReactInVue'
    Basic: applyReactInVue(BasicReactComponent)
  },
  setup() {
    return {
      foo: ref('Hello!')
    }
  }
}
</script>