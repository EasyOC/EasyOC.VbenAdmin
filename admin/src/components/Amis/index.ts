import { withInstall } from '@admin/utils'
import amis from './src/index.vue'
import editor from './src/Editor.vue'
import amisRenderer from './src/AMISRenderer.vue'

export const Amis = withInstall(amis)
export const Editor = withInstall(editor)
export const AMISRenderer = withInstall(amisRenderer)
