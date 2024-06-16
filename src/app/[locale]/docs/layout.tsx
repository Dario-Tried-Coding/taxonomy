import { Locale } from '@/lib/next-intl/config'
import { pageTree } from '@/lib/fumadocs/source'
import { DocsLayout } from 'fumadocs-ui/layout'
import { unstable_setRequestLocale as setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'
import { siteConfig } from '@/config/site.config'

export default function RootDocsLayout({ children, params: { locale } }: { children: ReactNode; params: { locale: Locale } }) {
  setRequestLocale(locale)

  return (
    <DocsLayout
      tree={pageTree[locale]}
      nav={{ title: siteConfig.name.short }}
      i18n
    >
      {children}
    </DocsLayout>
  )
}
