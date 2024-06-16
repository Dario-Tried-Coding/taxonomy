// ------------------------------------------------------------------------
// CONSTANTS --------------------------------------------------------------

export const THEMES_CONFIG_STORAGE_KEY = 'themes-config' as const
export const COLOR_MODE_STORAGE_KEY = 'theme' as const

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

export const DEFAULT_STORAGE_THEME = {
  theme: 'default',
  mode: 'system',
  radius: '0.5',
} as const

// ------------------------------------------------------------------------
// TYPES ------------------------------------------------------------------

export type Theme_Config_Storage_Key = typeof THEMES_CONFIG_STORAGE_KEY
export type Color_Mode_Storage_Key = typeof COLOR_MODE_STORAGE_KEY
export type Themes_Config = typeof THEMES_CONFIG
export type Default_Storage_Theme = typeof DEFAULT_STORAGE_THEME

export type Script_Params = {
  themesConfig_StorageKey: Theme_Config_Storage_Key
  colorMode_StorageKey: Color_Mode_Storage_Key
  themesConfig: Themes_Config
  defaultStorageTheme: Default_Storage_Theme
  externalLibrary?: {
    colorMode: boolean
  }
}

export type Theme_Attr_Name = keyof typeof THEMES_CONFIG

export type Resolved_Mode = (typeof THEMES_CONFIG)['mode']['opts'][number]
export type System_Mode = (typeof THEMES_CONFIG)['mode']['system']
export type Color_Mode = Resolved_Mode | System_Mode

export type Storage_Theme = {
  -readonly [key in keyof typeof THEMES_CONFIG]: key extends 'mode' ? Resolved_Mode | System_Mode : (typeof THEMES_CONFIG)[key]['opts'][number]
}

export type Unsafe_Theme_Attr = {
  name: Theme_Attr_Name
  value: string | null | undefined
}
export type Safe_Theme_Attr = {
  [K in keyof typeof THEMES_CONFIG]: {
    name: K
    value: K extends 'mode'
      ? (typeof THEMES_CONFIG)[K]['opts'][number] | (typeof THEMES_CONFIG)[K]['system']
      : (typeof THEMES_CONFIG)[K]['opts'][number]
  }
}[keyof typeof THEMES_CONFIG]

type ExtractAllOpts<T> = {
  [K in keyof T]: T[K] extends { opts: readonly (infer U)[] } ? U : never
}[keyof T]

export type All_Themes_Options = ExtractAllOpts<typeof THEMES_CONFIG> | (typeof THEMES_CONFIG)['mode']['system']

export type Custom_Storage_Event = CustomEvent<{
  key: string | null
  newValue: string | null
  oldValue: string | null
}>

export type Mutation_Changes = {
  -readonly [K in keyof typeof THEMES_CONFIG]: K extends 'mode'
    ? (typeof THEMES_CONFIG)[K]['opts'][number] | (typeof THEMES_CONFIG)[K]['system']
    : (typeof THEMES_CONFIG)[K]['opts'][number]
}