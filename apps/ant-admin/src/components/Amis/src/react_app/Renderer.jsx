import * as React from 'react'
import { render as renderAmis } from 'amis'
import getEnv from '../amisEnv'

export default class AMISRendererComponent extends React.Component {
  // <
  // {
  //     schema: any
  //     amisMounted: (amisScoped) => void
  //     trackerFn: (tracker: any) => void | undefined
  //   },
  //   any
  // >
  constructor(props) {
    super(props)
    const { schema, amisMounted, scopeRef, trackerFn } = props
    this.state = {
      schema,
      trackerFn,
      scopeRef,
      amisMounted,
    }
  }
  setSchema(schema) {
    this.setState({ schema })
  }

  state = {
    trackerFn: null,
    amisMounted: (ref) => {
      console.log(ref, 'onAmisMounted')
    },
    mobile: false,
    scopeRef: null,
    schema: {
      type: 'page',
      regions: ['body', 'toolbar', 'header'],
    },
  }
  render() {
    let locale = 'zh-CN'
    const amisEnv = getEnv()

    // 请勿使用 React.StrictMode，目前还不支持
    const result = renderAmis(
      this.state.schema,
      {
        // props...
        // locale: 'en-US' // 请参考「多语言」的文档
        locale,
        scopeRef: (ref) => {
          console.log('scopeRef: ', ref)
          this.setState({ scopeRef: ref })
          this.state.amisMounted(ref) // 功能和前面 SDK 的 amisScoped 一样
        },
      },
      {
        ...amisEnv,
        tracker: (tracker, eventProps) => {
          if (this.state?.trackerFn) {
            this.state?.trackerFn({ tracker, eventProps })
          }
          // emit('eventTrackerEvent', { tracker, eventProps })
        },
      },
    )
    // this.props.amisMounted(result)
    return result
  }
}
