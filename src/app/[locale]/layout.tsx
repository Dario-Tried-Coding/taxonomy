import { constructMetadata } from '@/helpers'
import { setRequestLocale } from '@/lib/next-intl'
import { I18N_CONFIG, Locale } from '@/lib/next-intl/config'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

type Props = {
  children: React.ReactNode
  params: {
    locale: Locale
  }
}

export async function generateMetadata({ params: { locale } }: Omit<Props, 'children'>): Promise<Metadata> {
  return await constructMetadata({ locale })
}

export function generateStaticParams() {
  return I18N_CONFIG.locales.map((locale) => ({ locale }))
}

export default function RootLayout({ children, params: { locale } }: Readonly<Props>) {
  setRequestLocale(locale)

  return (
    <html lang={locale}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
