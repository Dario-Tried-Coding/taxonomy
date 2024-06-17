import { PATH as BLOG_PATH } from '@/app/[locale]/(marketing)/blog/page.info'
import { PATH as HOME_PATH, Route as HomeRoute } from '@/app/[locale]/(marketing)/page.info'
import { PATH as PRICING_PATH } from '@/app/[locale]/(marketing)/pricing/page.info'
import { PATH as DOCS_PATH, Route as DocsRoute } from '@/app/[locale]/docs/[[...slugs]]/page.info'
import { Locale } from '@/lib/next-intl/config'
import { Blog, Docs, Home, Pricing } from '@/routes'
import { RouteBuilder } from '@/routes/makeRoute'
import { I18nKeys } from '@/types/utils'
import { useLocale } from 'next-intl'
import { z } from 'zod'

const featuresKey: I18nKeys = 'Components.MainNav.Links.features'
const pricingKey: I18nKeys = 'Components.MainNav.Links.pricing'
const blogKey: I18nKeys = 'Components.MainNav.Links.blog'
const docsKey: I18nKeys = 'Components.MainNav.Links.documentation'

const FeaturesHomeLink: RouteBuilder<(typeof HomeRoute)['params'], never>['Link'] = (props) => <Home.Link {...props} targetHTML='#features' />

const { shape: { lang, ...rest } } = DocsRoute.params
const DocsParams = z.object(rest)
const LangDocsLink: RouteBuilder<typeof DocsParams, never > ['Link'] = ({ lang, ...props }) => {
  const locale = useLocale() as Locale
  return <Docs.Link {...props} lang={locale} />
}

export const mainNav_Links = [
  {
    key: featuresKey,
    href: HOME_PATH,
    Link: FeaturesHomeLink,
  },
  {
    key: pricingKey,
    href: PRICING_PATH,
    Link: Pricing.Link,
  },
  {
    key: blogKey,
    href: BLOG_PATH,
    Link: Blog.Link,
  },
  {
    key: docsKey,
    href: DOCS_PATH,
    Link: LangDocsLink,
  },
] as const