'use client'

import {
  COLOR_MODE_SK,
  CUSTOM_SEK,
  ColorMode_SK,
  Custom_SE,
  Custom_SEK,
  DEFAULT_ST,
  Script_Params,
  THEMES_CONFIG,
  THEMES_CONFIG_SK,
  ThemesConfig_SK,
  Unresolved_CM,
} from '@/theme/config'
import { themes_script } from '@/theme/script'
import { useMounted } from '@mantine/hooks'
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from 'react'

interface ThemeContext {
  mode: Unresolved_CM | undefined
  updateMode: (newMode: Unresolved_CM) => void
}
const ThemeContext = createContext<ThemeContext | null>(null)

interface ThemeProviderProps extends PropsWithChildren {}
const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const isMounted = useMounted()
  const [mode, setMode] = useState<Unresolved_CM | undefined>(undefined)

  useEffect(() => {
    if (!isMounted) return

    const colorMode = localStorage.getItem(COLOR_MODE_SK) as Unresolved_CM
    setMode(colorMode)
  }, [isMounted])

  useEffect(() => {
    const handler = (e: WindowEventMap[Custom_SEK]) => e.detail.key === COLOR_MODE_SK && setMode(e.detail.newValue as Unresolved_CM)

    window.addEventListener(CUSTOM_SEK, handler)
    return () => window.removeEventListener(CUSTOM_SEK, handler)
  }, [])

  const dispatch_CustomSE = useCallback(
    function({ key, newValue, oldValue }: { key: ThemesConfig_SK | ColorMode_SK; newValue: string; oldValue: string }) {
      const customStorageEvent = new CustomEvent<Custom_SE['detail']>(CUSTOM_SEK, {
        detail: { key, newValue, oldValue },
      })
      window.dispatchEvent(customStorageEvent)
    },
    []
  )

  const updateMode = (newMode: Unresolved_CM) => {
    localStorage.setItem(COLOR_MODE_SK, newMode)
    dispatch_CustomSE({ key: COLOR_MODE_SK, newValue: newMode, oldValue: mode! })
  }

  const scriptArgs = JSON.stringify({
    themesConfig_SK: THEMES_CONFIG_SK,
    themesConfig: THEMES_CONFIG,
    default_ST: DEFAULT_ST,
    colorMode_SK: COLOR_MODE_SK,
    custom_SEK: CUSTOM_SEK,
    externalLibrary: {
      colorMode: false,
    }
  } satisfies Script_Params)

  return (
    <ThemeContext.Provider value={{ mode, updateMode }}>
      <script dangerouslySetInnerHTML={{ __html: `(${themes_script.toString()})(${scriptArgs})` }} />
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider

export function useTheme() {
  const themeCTX = useContext(ThemeContext)

  if (!themeCTX) throw new Error('useTheme must be used within a ThemeProvider')

  return themeCTX
}
