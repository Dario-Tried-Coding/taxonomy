import type { Metadata } from 'next'
import { DocsPage, DocsBody } from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'
import { getPage, getPages } from '@/lib/fumadocs/source'
import { Locale, I18N_CONFIG } from '@/lib/next-intl/config'
import { unstable_setRequestLocale as setRequestLocale } from 'next-intl/server'
import { filterOutLocales } from '@/lib/helpers/fumadocs'

const { locales } = I18N_CONFIG

export default async function Page({ params }: { params: { slugs?: string[]; locale: Locale } }) {
  setRequestLocale(params.locale)

  const page = getPage(filterOutLocales(params.slugs), params.locale)

  if (page == null) {
    notFound()
  }

  const MDX = page.data.exports.default

  return (
    <DocsPage toc={page.data.exports.toc}>
      <DocsBody>
        <h1>{page.data.title}</h1>
        <MDX />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams(): Promise<{ slug: string[]; locale: Locale }[]> {
  return locales.flatMap((locale) =>
    getPages(locale)!.map((page) => ({
      slug: page.slugs,
      locale,
    }))
  )
}

export function generateMetadata({ params }: { params: { slugs?: string[]; locale: Locale } }) {
  const page = getPage(filterOutLocales(params.slugs), params.locale)

  if (page == null) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata
}
