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
import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@/config/site.config'

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
  const t = await getTranslations({ locale, namespace: 'Project' })
  return {
    title: {
      default: siteConfig.name.full,
      template: `%s | ${siteConfig.name.short}`,
    },
    description: t('description'),
    keywords: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Shadcn UI', 'Server Components'],
    authors: [
      {
        name: siteConfig.author.name,
        url: siteConfig.author.website,
      },
    ],
    creator: siteConfig.author.name,
    openGraph: {
      type: 'website',
      locale,
      url: siteConfig.url,
      title: siteConfig.name.short,
      description: t('description'),
      siteName: siteConfig.name.full,
      images: [
        {
          url: `${siteConfig.url}/meta/poster.jpg`,
          width: 1200,
          height: 630,
          alt: siteConfig.name.full,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name.full,
      description: t('description'),
      images: [`${siteConfig.url}/meta/poster.jpg`],
      creator: siteConfig.twitter.username,
    },
    icons: {
      icon: '/meta/favicon.ico',
      shortcut: '/meta/favicon-16x16.png',
      apple: '/meta/apple-touch-icon.png',
    },
    manifest: `/meta/site.webmanifest`,
  }
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
