export const I18N_CONFIG = {
  defaultLocale: 'it',
  locales: ['en', 'it'],
  localePrefix: 'never',
  cookie: 'NEXT_LOCALE'
} as const

export type Locale = (typeof I18N_CONFIG.locales)[number]