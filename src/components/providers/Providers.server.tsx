import { Locale } from '@/lib/next-intl/config'
import ThemeProvider from '@/theme/ThemeProvider'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { FC, PropsWithChildren } from 'react'
import { RootProvider } from 'fumadocs-ui/provider'
import { I18nProvider } from 'fumadocs-ui/i18n'

interface Providers extends PropsWithChildren {
  locale: Locale
}

const Providers: FC<Providers> = async ({ children, locale }) => {
  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <I18nProvider translations={{ it: { name: 'Italiano' }, en: { name: 'English' } }} locale={locale}>
          <RootProvider>{children}</RootProvider>
        </I18nProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}

export default Providers
