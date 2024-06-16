import { I18N_CONFIG } from '@/lib/next-intl/config'

const { locales } = I18N_CONFIG

export function filterOutLocales(slugs?: string[]) {
  return slugs?.filter((slug) => !locales.some((locale) => locale === slug))
}
