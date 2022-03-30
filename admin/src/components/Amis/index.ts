import { withInstall } from '@admin/utils'
// import FrameRenderer from './src/AMISFrameRenderer.vue'
import AmisSdk from './src/index.vue'
import AMISReactRenderer from './src/AMISRendererSetup.vue'
import AMISRenderer from './src/AMISRenderer.vue'
export const AMISRendererSetup = withInstall(AMISReactRenderer)
export const Amis = withInstall(AmisSdk)
export const AmisRenderer = withInstall(AMISRenderer)
