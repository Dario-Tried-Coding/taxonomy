'use client'

import { Button } from '@/components/ui/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { COLOR_MODE_STORAGE_KEY, Color_Mode } from '@/theme/config'
import { useMounted } from '@mantine/hooks'
import { Laptop, Loader2, LucideIcon, Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC, useEffect, useState } from 'react'

interface ThemesSwitchProps {}

const ThemesSwitch: FC<ThemesSwitchProps> = ({ }) => {
  const t = useTranslations()

  const isMounted = useMounted()
  const [mode, setMode] = useState<Color_Mode | null>(null)

  useEffect(() => {
    if (!isMounted) return

    const colorMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY) as Color_Mode
    setMode(colorMode)
  }, [isMounted])

  useEffect(() => {
    const handler = (e: WindowEventMap['customStorageEvent']) => e.detail.key === COLOR_MODE_STORAGE_KEY && setMode(e.detail.newValue as Color_Mode)

    window.addEventListener('customStorageEvent', handler)
    return () => window.removeEventListener('customStorageEvent', handler)
  }, [])

  const updateMode = (newMode: Color_Mode) => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, newMode)
  }

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
      break;
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
