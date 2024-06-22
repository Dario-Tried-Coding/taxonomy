'use client'

import { COLOR_MODE_SK, CUSTOM_SEK, DEFAULT_ST, Script_Params, THEMES_CONFIG, THEMES_CONFIG_SK } from '@/theme/config'
import { themes_script } from '@/theme/script'
import { FC, PropsWithChildren } from 'react'

interface ThemeProviderProps extends PropsWithChildren {}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const scriptArgs = JSON.stringify({
    themesConfig_SK: THEMES_CONFIG_SK,
    themesConfig: THEMES_CONFIG,
    default_ST: DEFAULT_ST,
    colorMode_SK: COLOR_MODE_SK,
    custom_SEK: CUSTOM_SEK,
    externalLibrary: {
      colorMode: false,
    },
  } satisfies Script_Params)

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `(${themes_script.toString()})(${scriptArgs})` }} />
      {children}
    </>
  )
}

export default ThemeProvider
