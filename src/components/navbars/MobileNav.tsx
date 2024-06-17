'use client'

import { Icons } from '@/components/Icons'
import { mainNav_Links as links } from '@/config/components/navbars.config'
import { siteConfig } from '@/config/site.config'
import { cn } from '@/lib/utils'
import { Home } from '@/routes'
import { useLockBodyScroll } from '@uidotdev/usehooks'
import { useTranslations } from 'next-intl'
import { FC, HTMLAttributes } from 'react'

interface MobileNavProps extends HTMLAttributes<HTMLDivElement> {
  links: typeof links
  closeMenu: () => void
}

const MobileNav: FC<MobileNavProps> = ({ className, children, links, closeMenu, ...rest }) => {
  const t = useTranslations()

  useLockBodyScroll()

  return (
    <div
      className={cn(
        'fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden',
        className
      )}
      {...rest}
    >
      <div className='relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md'>
        <Home.Link onClick={() => closeMenu()} className='flex items-center space-x-2'>
          <Icons.logo />
          <span className='font-bold'>{siteConfig.name.short}</span>
        </Home.Link>
        {links.length > 0 && (
          <nav className='grid grid-flow-row auto-rows-max text-sm'>
            {links.map((item) => (
              <item.Link
                key={item.href}
                onClick={() => closeMenu()}
                className='flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline'
              >
                {t(item.key)}
              </item.Link>
            ))}
          </nav>
        )}
        {children}
      </div>
    </div>
  )
}

export default MobileNav
