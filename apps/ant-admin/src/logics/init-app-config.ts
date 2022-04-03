/**
 * Application configuration
 */
import { projectSetting, primaryColor } from '@pkg/setting'

import {
  updateHeaderBgColor,
  updateSidebarBgColor,
} from '@/logics/theme/update-background'

import { updateColorWeak } from '@/logics/theme/update-color-weak'
import { updateGrayMode } from '@/logics/theme/update-gray-mode'
import { updateDarkTheme } from '@/logics/theme/dark'
import { changeTheme } from '@/logics/theme'
import { useAppStore } from '@/store/app'
import { createStorageKeyPrefix, createStorageName } from '@/internal'
import { deepMerge } from '@pkg/utils'
import { ThemeEnum } from '@pkg/tokens'

// Initial project configuration
export function initAppConfigStore() {
  const appStore = useAppStore()
  const projectConfig = appStore.getProjectConfig
  const projCfg = deepMerge(projectSetting, projectConfig || {})
  const darkMode = appStore.getDarkMode
  const {
    colorWeak,
    grayMode,
    themeColor,

    headerSetting: { bgColor: headerBgColor = '' } = {},
    menuSetting: { bgColor = '' } = {},
  } = projCfg
  try {
    if (themeColor && themeColor !== primaryColor) {
      changeTheme(themeColor)
    }

    grayMode && updateGrayMode(grayMode)
    colorWeak && updateColorWeak(colorWeak)
  } catch (error) {
    console.log(error)
  }
  appStore.setProjectConfig(projCfg)

  // init dark mode
  updateDarkTheme(darkMode)
  if (darkMode === ThemeEnum.DARK) {
    updateHeaderBgColor()
    updateSidebarBgColor()
  } else {
    headerBgColor && updateHeaderBgColor(headerBgColor)
    bgColor && updateSidebarBgColor(bgColor)
  }

  setTimeout(() => {
    clearObsoleteStorage()
  }, 16)
}

/**
 * As the version continues to iterate, there will be more and more cache keys stored in localStorage.
 * This method is used to delete useless keys
 */
export function clearObsoleteStorage() {
  const storageKeyPrefix = createStorageKeyPrefix()
  const shortNamePrefix = createStorageName()
  ;[localStorage, sessionStorage].forEach((item: Storage) => {
    Object.keys(item).forEach((key) => {
      if (
        key &&
        key.startsWith(storageKeyPrefix) &&
        !key.startsWith(shortNamePrefix)
      ) {
        item.removeItem(key)
      }
    })
  })
}
