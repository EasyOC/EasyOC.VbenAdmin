import { Button } from '@/components/Button'

// @ts-ignore
const amis = amisRequire('amis/embed')
// @ts-ignore
const amisLib = amisRequire('amis')
// @ts-ignore
const React = amisRequire('react')
import { createApp } from 'vue'
// 自定义组件，props 中可以拿到配置中的所有参数，比如 props.label 是 'Name'
function CustomComponent(props) {
  const dom = React.useRef(null)
  React.useEffect(function () {
    // 从这里开始写自定义代码，dom.current 就是新创建的 dom 节点
    // 可以基于这个 dom 节点对接任意 JavaScript 框架，比如 jQuery/Vue 等
    dom.current.innerHTML = '<div id="my-custom2">{{count}}</div>'
    // 而 props 中能拿到这个
  })
  createApp({
    data() {
      return { count: 1123124123 }
    },
  }).mount('#my-custom2')
  return React.createElement('div', {
    ref: dom,
  })
}

//注册自定义组件，请参考后续对工作原理的介绍
amisLib.Renderer({
  test: /(^|\/)my-custom/,
})(CustomComponent)

amisLib.Renderer({
  test: /(^|\/)my-custom2/,
})((props) => {
  const dom = React.useRef(null)
  React.useEffect(() => {
    dom.current.innerHTML = `
      <div id="my-custom2">{{props.target}}</div>
      `
    // createApp({
    //   data() {
    //     return props.data
    //   },
    // }).mount(dom.current)
  })
})
