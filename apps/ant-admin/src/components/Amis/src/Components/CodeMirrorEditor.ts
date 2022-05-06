import { Renderer } from 'amis'
import { CodeEditor } from '@/components/CodeEditor'
import { Button } from '@/components/Button'
export Renderer({
  type: 'CodeMirror-Editor',
})(CodeEditor)

export Renderer({
  type: 'vue-button',
})(Button)
