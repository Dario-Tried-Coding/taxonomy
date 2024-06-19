import { siteConfig } from '@/config/site.config'
import { Locale } from '@/lib/next-intl/config'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

interface Params {
  locale: Locale
}

export async function constructMetadata({ locale }: Params):Promise<Metadata> {
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
