import { withInstall } from '@pkg/utils'
//SDK方式集成
import AmisSdk from './src/index.vue'

// veaury React 集成
import veauryAMISRenderer from './src/veauryAMISRenderer.vue'
export const AmisRA = withInstall(veauryAMISRenderer)
// export const Amis = withInstall(AmisSdk)

export const Amis = withInstall(veauryAMISRenderer)
