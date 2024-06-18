import { buttonVariants } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { proPlan } from '@/config/pages/pricing.config'
import { Locale } from '@/lib/next-intl/config'
import { cn } from '@/lib/utils'
import { SignIn } from '@/routes'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from 'next-intl/server'
import { FC } from 'react'

interface Params {
  params: {
    locale: Locale
  }
}

export async function generateMetadata({ params: { locale } }: Params) {
  const t = await getTranslations({ locale })

  return {
    title: t('Pages.Pricing.Metadata.title'),
  }
}

interface pageProps extends Params {}

const Page: FC<pageProps> = ({ params: { locale } }) => {
  setRequestLocale(locale)

  const t = useTranslations()

  return (
    <section className='container flex flex-col gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24'>
      <div className='mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]'>
        <h1 className='font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl'>{t('Pages.Pricing.UI.heading')}</h1>
        <p className='max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7'>{t('Pages.Pricing.UI.sub-heading')}</p>
      </div>
      <div className='grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]'>
        <div className='grid gap-6'>
          <h3 className='text-xl font-bold sm:text-2xl'>{t('Pages.Pricing.UI.ProPlan.heading')}</h3>
          <ul className='grid gap-3 text-sm text-muted-foreground sm:grid-cols-2'>
            {proPlan.map((item, i) => (
              <li key={i} className={cn('flex items-center gap-2', item.disabled && 'opacity-50')}>
                <Check className='h-4 w-4' /> {t(item.label)} {item.disabled && <Badge variant='outline'>{t('Pages.Pricing.UI.ProPlan.Features.soon')}</Badge>}
              </li>
            ))}
          </ul>
        </div>
        <div className='flex flex-col gap-4 text-center'>
          <div>
            <h4 className='text-7xl font-bold'>{t('Pages.Pricing.UI.ProPlan.price', { price: 9 })}</h4>
            <p className='text-sm font-medium text-muted-foreground'>{t('Pages.Pricing.UI.ProPlan.period')}</p>
          </div>
          <SignIn.Link className={cn(buttonVariants({ size: 'lg' }))}>{t('Pages.Pricing.UI.ProPlan.cta')}</SignIn.Link>
        </div>
      </div>
      <div className='mx-auto flex w-full max-w-[58rem] flex-col gap-4'>
        <p className='max-w-[85%] leading-normal text-muted-foreground sm:leading-7'>
          {t.rich('Pages.Pricing.UI.foot-note', { bold: (chunk) => <strong>{chunk}</strong> })}
        </p>
      </div>
    </section>
  )
}

export default Page
