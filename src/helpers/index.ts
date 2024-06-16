import { siteConfig } from '@/config/site.config'
import { Locale } from '@/lib/next-intl/config'
import { getTranslations } from 'next-intl/server'

interface Params {
  locale: Locale
}

export async function constructMetadata({ locale }: Params) {
  const t = await getTranslations({ locale, namespace: 'Project'})
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
        url: siteConfig.author.url,
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
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name.full,
      description: t('description'),
      images: [`${siteConfig.url}/og.jpg`],
      creator: siteConfig.twitter.username,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: `${siteConfig.url}/site.webmanifest`,
  }
}
