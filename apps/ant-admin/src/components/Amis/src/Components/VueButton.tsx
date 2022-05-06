import { Renderer } from 'amis'
import { Button } from '@/components/Button'
import React from 'react'
import { RendererProps } from 'amis/lib/factory'
export interface MyRendererProps extends RendererProps {
  target?: string
}
Renderer({
  type: 'Vbutton',
})(
  class VButtonRenderer extends React.Component<MyRendererProps> {
    static defaultProps = {
      target: 'world',
    }

    render() {
      const { target } = this.props
      return <Button>{target}</Button>
    }
  },
)
