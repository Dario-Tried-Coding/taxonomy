import { setRequestLocale } from '@/lib/next-intl'
import { Locale } from '@/lib/next-intl/config'
import { FC } from 'react'

interface pageProps {
  params: {
    locale: Locale
  }
}

const page: FC<pageProps> = ({ params: { locale } }) => {
  setRequestLocale(locale)
  
  return <div>page</div>
}

export default page
