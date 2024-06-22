// ------------------------------------------------------------------------
// CONSTANTS --------------------------------------------------------------

export const THEMES_CONFIG_SK = 'themes-config' as const
export const COLOR_MODE_SK = 'theme' as const
export const CUSTOM_SEK = 'custom-storage-event' as const

export const THEMES_CONFIG = {
  theme: {
    default: 'default',
    opts: ['default'],
  },
  mode: {
    default: 'light',
    preferred: 'system',
    system: 'system',
    opts: ['light', 'dark'],
  },
  radius: {
    default: '0.5',
    opts: ['0', '0.5', '1'],
  },
} as const

export const DEFAULT_ST = {
  theme: 'default',
  mode: 'system',
  radius: '0.5',
} as const

// ------------------------------------------------------------------------
// TYPES ------------------------------------------------------------------

export type ThemesConfig_SK = typeof THEMES_CONFIG_SK
export type ColorMode_SK = typeof COLOR_MODE_SK
export type ThemesConfig = typeof THEMES_CONFIG
export type Default_ST = typeof DEFAULT_ST
export type Custom_SEK = typeof CUSTOM_SEK

export type Script_Params = {
  themesConfig_SK: ThemesConfig_SK
  colorMode_SK: ColorMode_SK
  themesConfig: ThemesConfig
  default_ST: Default_ST
  custom_SEK: Custom_SEK
  externalLibrary?: {
    colorMode: boolean
  }
}

export type TA_Name = keyof ThemesConfig

export type Resolved_CM = ThemesConfig['mode']['opts'][number]
export type Resolved_CMs = [...ThemesConfig['mode']['opts']]
export type System_CM = ThemesConfig['mode']['system']
export type Unresolved_CM = Resolved_CM | System_CM
export type Unresolved_CMs = [...Resolved_CMs, System_CM]

export type StorageTheme = {
  -readonly [key in keyof ThemesConfig]: key extends 'mode' ? Unresolved_CM : ThemesConfig[key]['opts'][number]
}

export type Unsafe_TA = {
  name: TA_Name
  value: string | null | undefined
}
export type Safe_TA = {
  [K in keyof ThemesConfig]: {
    name: K
    value: K extends 'mode' ? Unresolved_CM : ThemesConfig[K]['opts'][number]
  }
}[keyof ThemesConfig]

type ExtractAllOpts<T> = {
  [K in keyof T]: T[K] extends { opts: readonly (infer U)[] } ? U : never
}[keyof T]

export type Theme_Opt = ExtractAllOpts<ThemesConfig> | System_CM

export type Custom_SE = CustomEvent<{
  key: ThemesConfig_SK | ColorMode_SK
  newValue: string | null
  oldValue: string | null
}>

export type Mutation_Changes = {
  -readonly [K in keyof ThemesConfig]: K extends 'mode'
    ? Unresolved_CM
    : ThemesConfig[K]['opts'][number]
}
