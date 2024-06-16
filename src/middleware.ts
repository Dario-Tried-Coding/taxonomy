import { Locale, I18N_CONFIG } from '@/lib/next-intl/config'
import { i18nMiddleware } from '@/lib/next-intl/middleware'
import { NextFetchEvent, NextRequest } from 'next/server'
// import { createI18nMiddleware } from 'fumadocs-core/middleware'

const { locales } = I18N_CONFIG

// const docsMiddleware = createI18nMiddleware({
//   languages: locales as unknown as Locale[],
//   defaultLanguage: defaultLocale,
// })

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const originUrl = req.headers.get('referer')
  const { pathname } = req.nextUrl

  const isChangingLocaleFromDocs = locales.some((locale) => pathname.startsWith(`/${locale}`)) && originUrl?.includes('/docs')
  if (isChangingLocaleFromDocs) {
    const [newLocale, ...restOfUrl] = pathname.split('/').filter((part) => part.length > 0)
    const sanitizedRestOfUrl = restOfUrl.filter((slug) => !locales.some((locale) => locale === slug))

    const wasIndexPage = restOfUrl.length === 0
    const newUrl = wasIndexPage ? `/${newLocale}/docs` : `/${newLocale}/docs/${newLocale}/${sanitizedRestOfUrl.join('/')}`

    req.nextUrl.pathname = newUrl
  }

  return i18nMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
