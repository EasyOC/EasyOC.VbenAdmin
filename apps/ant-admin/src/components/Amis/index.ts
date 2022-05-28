import { useAppStore } from '@/store/app'
import { withInstall } from '@pkg/utils'
const appStore = useAppStore()

import AmisSdk from './src/index.vue'
import veauryAMISRenderer from './src/veauryAMISRenderer.vue'
const mode = appStore.projectConfig?.amisRenderMode != "react" ? "sdk" : "react"
console.warn(`Amis 当前正在使用${mode}渲染器`)
export const Amis = mode != "react" ? withInstall(AmisSdk) : withInstall(veauryAMISRenderer)
// export const Amis = withInstall(veauryAMISRenderer)
