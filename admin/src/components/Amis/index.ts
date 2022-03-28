import { withInstall } from '@admin/utils'
// import FrameRenderer from './src/AMISFrameRenderer.vue'
import AmisSdk from './src/index.vue'
import AMISReactRenderer from './src/AMISRendererSetup.vue'
// export const AMISFrameRenderer = withInstall(FrameRenderer)
export const Amis = withInstall(AmisSdk)
export const AmisRenderer = withInstall(AMISReactRenderer)
