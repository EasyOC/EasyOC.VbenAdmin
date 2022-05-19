import * as React from 'react'
import { render as renderAmis } from 'amis'
import getEnv from '../amisEnv'

export default class AMISRendererComponent extends React.Component
// <
// {
//     schema: any
//     amisMounted: (amisScoped) => void
//     trackerFn: (tracker: any) => void | undefined
//   },
//   any
// >
{
  render() {
    let locale = 'zh-CN'
    const amisEnv = getEnv()

    // 请勿使用 React.StrictMode，目前还不支持
    const result = renderAmis(
      this.props.schema || { type: 'page' },
      {
        // props...
        // locale: 'en-US' // 请参考「多语言」的文档
        locale,
        scopeRef: (ref, a, b, c) => {
          console.log('scopeRef: ', ref)
          this.props.amisMounted(ref) // 功能和前面 SDK 的 amisScoped 一样
        },
      },
      {
        ...amisEnv,
        tracker: (tracker, eventProps) => {
          if (this.props?.trackerFn) {
            this.props?.trackerFn({ tracker, eventProps })
          }
          // emit('eventTrackerEvent', { tracker, eventProps })
        },
      },
    )
    // this.props.amisMounted(result)
    return result
  }
}
