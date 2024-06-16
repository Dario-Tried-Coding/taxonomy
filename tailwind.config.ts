import { createPreset } from 'fumadocs-ui/tailwind-plugin'
import { themesPreset } from './src/lib/tailwind/presets'
import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['selector', '.dark'],
  content: [
    './node_modules/fumadocs-ui/dist/**/*.js',
    './src/**/*.{ts,tsx}',
    './content/**/*.mdx',
    './mdx-components.tsx',
  ],
  presets: [createPreset(), themesPreset],
} satisfies Config

export default config
