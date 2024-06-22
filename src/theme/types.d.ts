import { ColorMode_SK, Custom_SE, CUSTOM_SEK, ThemesConfig_SK } from '@/theme/config'

declare global {
  interface WindowEventMap {
    [CUSTOM_SEK]: Custom_SE<ThemesConfig_SK | ColorMode_SK>
  }
}