// import { Vue } from 'vue'

export default function isReactComponent(component) {
  return true
  // if (typeof component === 'object' && !isReactForwardReference(component)) {
  //   return false
  // }

  // return !(
  //   typeof component === 'function' &&
  //   component.config.globalProperties &&
  //   ((component.config.globalProperties.constructor.super &&
  //     component.config.globalProperties.constructor.super.isVue) ||
  //     component.config.globalProperties instanceof Vue)
  // )
}

// function isReactForwardReference(component) {
//   return (
//     component.$$typeof &&
//     component.$$typeof.toString() === 'Symbol(react.forward_ref)'
//   )
// }
