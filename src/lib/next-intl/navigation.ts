import { I18N_CONFIG } from '@/lib/next-intl/config'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'

const { locales, localePrefix } = I18N_CONFIG

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales, localePrefix })
