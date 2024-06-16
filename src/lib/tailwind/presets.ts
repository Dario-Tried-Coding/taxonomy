import type { Config } from 'tailwindcss'
import { shadcnPlugin } from './plugins/shadcn-ui'
import { typographyPlugin } from './plugins/typography'

export const themesPreset = {
  content: [],
  plugins: [shadcnPlugin, typographyPlugin, require('tailwindcss-animate')],
} satisfies Config