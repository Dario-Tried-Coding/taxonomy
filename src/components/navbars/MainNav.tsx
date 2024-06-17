'use client'

import { Icons } from '@/components/Icons'
import MobileNav from '@/components/navbars/MobileNav'
import { buttonVariants } from '@/components/ui/Button'
import { mainNav_Links as links } from '@/config/components/navbars.config'
import { siteConfig } from '@/config/site.config'
import { cn } from '@/lib/utils'
import { Home, SignIn } from '@/routes'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSelectedLayoutSegment } from 'next/navigation'
import { FC, HTMLAttributes, useState } from 'react'

interface MainNavProps extends HTMLAttributes<HTMLDivElement> {}

const MainNav: FC<MainNavProps> = ({ className, children, ...rest }) => {
  const t = useTranslations()
  const segment = useSelectedLayoutSegment()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <header className={cn('container z-40 flex h-20 items-center justify-between bg-background py-6 md:px-8', className)} {...rest}>
      <div className='hidden gap-6 md:flex md:gap-10'>
        <Home.Link targetHTML='' className='flex items-center gap-2'>
          <Icons.logo />
          <span className='hidden font-bold sm:inline-block'>{siteConfig.name.short}</span>
        </Home.Link>
        {links.length > 0 && (
          <nav className='flex items-center gap-6'>
            {links.map((item) => (
              <item.Link
                key={item.href}
                className={cn(
                  'flex items-center text-sm font-medium transition-colors hover:text-foreground/80',
                  item.href.startsWith(`/${segment}`) ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {t(item.key)}
              </item.Link>
            ))}
          </nav>
        )}
      </div>
      <button className='flex items-center gap-2 md:hidden' onClick={() => setShowMobileMenu(!showMobileMenu)}>
        {showMobileMenu ? <X /> : <Icons.logo />}
        <span className='font-bold'>{t('Components.MainNav.menu')}</span>
      </button>
      {showMobileMenu && <MobileNav links={links} closeMenu={() => setShowMobileMenu(false)}>{children}</MobileNav>}
      <nav>
        <SignIn.Link className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'px-4')}>{t('Auth.UI.Login.cta')}</SignIn.Link>
      </nav>
    </header>
  )
}

export default MainNav
