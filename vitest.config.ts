/// <reference types="vitest" />
import type { AliasOptions } from 'vite'

import { defineConfig } from 'vite'
import { resolve } from 'path'

const _resolve = (p: string) => resolve(__dirname, p)

const alias: AliasOptions = {
  '@admin/admin': _resolve('./admin/src/'),
  '@admin/directives': _resolve('./packages/directives/src'),
  '@admin/locale': _resolve('./packages/locale/src'),
  '@admin/service': _resolve('./packages/service'),
  '@admin/setting': _resolve('./packages/setting/src'),
  '@admin/tokens': _resolve('./packages/tokens/src'),
  '@admin/types': _resolve('./packages/types/src'),
  '@admin/use': _resolve('./packages/use/src'),
  '@admin/utils': _resolve('./packages/utils/src'),
}

export default defineConfig({
  test: {
    environment: 'jsdom',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi'],
    },
  },
  resolve: {
    alias,
  },
})
