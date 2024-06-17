import Footer from '@/components/Footer'
import MainNav from '@/components/navbars/MainNav'
import { Locale } from '@/lib/next-intl/config'
import { unstable_setRequestLocale as setRequestLocale } from 'next-intl/server'
import { FC, PropsWithChildren } from 'react'

interface layoutProps extends PropsWithChildren {
  params: {
    locale: Locale
  }
}

const layout: FC<layoutProps> = ({ children, params: { locale } }) => {
  setRequestLocale(locale)

  return (
    <div className='flex min-h-screen flex-col'>
      <MainNav />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  )
}

export default layout
