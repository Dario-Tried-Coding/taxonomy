import { setRequestLocale } from '@/lib/next-intl'
import { Locale } from '@/lib/next-intl/config'
import { Docs } from '@/routes'
import { FC } from 'react'

interface pageProps {
  params: {
    locale: Locale
  }
}

const page: FC<pageProps> = ({ params: { locale } }) => {
  setRequestLocale(locale)
  
  return <div><Docs.Link lang={locale}>Docs</Docs.Link></div>
}

export default page
