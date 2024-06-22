'use client'

import { Button } from '@/components/ui/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { useTheme } from '@/theme/ThemeProvider'
import { Laptop, Loader2, LucideIcon, Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

interface ThemesSwitchProps {}

const ThemesSwitch: FC<ThemesSwitchProps> = ({}) => {
  const t = useTranslations()
  const {mode, updateMode} = useTheme()

  let Icon: LucideIcon | undefined = undefined
  switch (mode) {
    case 'dark':
      Icon = Moon
      break
    case 'light':
      Icon = Sun
      break
    case 'system':
      Icon = Laptop
      break
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' disabled={!mode} size='icon' className='h-8 w-8'>
          {Icon ? <Icon /> : <Loader2 className='animate-spin' />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => updateMode('light')}>
          <Sun className='mr-2 h-4 w-4' />
          {t('Components.ThemesSwitch.light')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateMode('dark')}>
          <Moon className='mr-2 h-4 w-4' />
          {t('Components.ThemesSwitch.dark')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateMode('system')}>
          <Laptop className='mr-2 h-4 w-4' />
          {t('Components.ThemesSwitch.system')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemesSwitch
