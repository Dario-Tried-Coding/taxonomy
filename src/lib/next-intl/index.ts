import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import { I18N_CONFIG } from '@/lib/next-intl/config'
import { unstable_setRequestLocale as setRequestLocale } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  if (!I18N_CONFIG.locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`../../i18n/${locale}.json`)).default,
  }
})

export { setRequestLocale }