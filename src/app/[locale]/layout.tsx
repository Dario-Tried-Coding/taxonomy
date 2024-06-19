import { constructMetadata } from '@/helpers'
import { setRequestLocale } from '@/lib/next-intl'
import { I18N_CONFIG, Locale } from '@/lib/next-intl/config'
import type { Metadata } from 'next'
import Providers from '@/components/providers/Providers.server'
import { Inter as FontSans } from 'next/font/google'
import localFont from 'next/font/local'
import { cn } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/styles/globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontHeading = localFont({
  src: '../../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
})

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
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('min-h-screen font-sans antialiased', fontSans.variable, fontHeading.variable)}>
        <Providers locale={locale}>
          <Analytics />
          <SpeedInsights />
          {children}
        </Providers>
      </body>
    </html>
  )
}
