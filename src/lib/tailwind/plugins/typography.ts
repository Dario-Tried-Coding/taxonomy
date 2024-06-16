import plugin from "tailwindcss/plugin";
import { fontFamily } from 'tailwindcss/defaultTheme'

export const typographyPlugin = plugin(
  function ({ }) { },
  {
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-sans)', ...fontFamily.sans],
          heading: ['var(--font-heading)', ...fontFamily.sans],
        }
      }
    }
  }
)