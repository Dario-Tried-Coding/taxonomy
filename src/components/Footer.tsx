import { Icons } from '@/components/Icons'
import ThemesSwitch from '@/components/ThemesSwitch'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { FC, HTMLAttributes } from 'react'
import { siteConfig } from '@/config/site.config'

interface FooterProps extends HTMLAttributes<HTMLElement> {}

const Footer: FC<FooterProps> = ({ className, ...props }) => {
  const t = useTranslations()

  return (
    <footer className={cn(className)} {...props}>
      <div className='container flex flex-col items-center justify-between gap-4 px-8 py-10 md:h-24 md:flex-row md:py-0'>
        <div className='flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0'>
          <Icons.logo />
          <p className='text-center text-sm leading-loose md:text-left'>
            {t.rich('Components.Footer.footnote', {
              twitter: () => (
                <a href={siteConfig.twitter.url} target='_blank' rel='noreferrer' className='font-medium underline underline-offset-4'>
                  {siteConfig.twitter.username}
                </a>
              ),
              vercel: (chunk) => (
                <a href='https://vercel.com' target='_blank' rel='noreferrer' className='font-medium underline underline-offset-4'>
                  {chunk}
                </a>
              ),
              popsy: (chunk) => (
                <a href='https://popsy.co' target='_blank' rel='noreferrer' className='font-medium underline underline-offset-4'>
                  {chunk}
                </a>
              ),
              github: (chunk) => (
                <a href={siteConfig.github.url} target='_blank' rel='noreferrer' className='font-medium underline underline-offset-4'>
                  {chunk}
                </a>
              ),
            })}
          </p>
        </div>
        <ThemesSwitch />
      </div>
    </footer>
  )
}

export default Footer
