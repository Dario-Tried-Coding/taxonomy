'use client'

import { DEFAULT_STORAGE_THEME, Script_Params, THEMES_CONFIG, THEMES_CONFIG_STORAGE_KEY } from '@/theme/config'
import { themes_script } from '@/theme/script'
import { FC, PropsWithChildren } from 'react'
import { COLOR_MODE_STORAGE_KEY } from '@/theme/config'

interface ThemeProviderProps extends PropsWithChildren {}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const scriptArgs = JSON.stringify({
    themesConfig_StorageKey: THEMES_CONFIG_STORAGE_KEY,
    themesConfig: THEMES_CONFIG,
    defaultStorageTheme: DEFAULT_STORAGE_THEME,
    colorMode_StorageKey: COLOR_MODE_STORAGE_KEY,
    externalLibrary: {
      colorMode: false
    }
  } satisfies Script_Params)

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `(${themes_script.toString()})(${scriptArgs})` }} />
      {children}
    </>
  )
}

export default ThemeProvider
