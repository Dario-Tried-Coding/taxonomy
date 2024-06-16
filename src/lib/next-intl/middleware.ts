import { I18N_CONFIG } from '@/lib/next-intl/config'
import createMiddleware from 'next-intl/middleware'

const { locales, defaultLocale, localePrefix } = I18N_CONFIG

export const i18nMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
})
