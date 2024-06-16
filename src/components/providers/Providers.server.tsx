import { Locale } from '@/lib/next-intl/config'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { FC, PropsWithChildren } from 'react'

interface Providers extends PropsWithChildren {
  locale: Locale
}

const Providers: FC<Providers> = async ({ children, locale }) => {
  const messages = await getMessages({ locale })

  return <NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>
}

export default Providers