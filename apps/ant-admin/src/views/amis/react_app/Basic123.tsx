// import React, { useRef } from 'react'
import * as React from 'react'
export default class Basic1 extends React.Component<any, any> {
  render() {
    const style =React. useRef({
      background: '#91e7fc',
      width: 500,
      margin: 'auto',
      padding: 10,
    })
    return (
      <div style={style.current}>
        This is the React Component
        <h3>received foo's value: {this.props.foo}</h3>
        {/* {this.props.children} */}
      </div>
    )
    // return (
    //     <div  >aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    // )
  }
}
