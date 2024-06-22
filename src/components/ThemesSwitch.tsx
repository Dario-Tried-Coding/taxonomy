'use client'

import { Button } from '@/components/ui/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { COLOR_MODE_SK, CUSTOM_SEK, ColorMode_SK, Unresolved_CM, Custom_SE, Custom_SEK, ThemesConfig_SK, StorageTheme } from '@/theme/config'
import { useMounted } from '@mantine/hooks'
import { Laptop, Loader2, LucideIcon, Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC, useEffect, useState } from 'react'

interface ThemesSwitchProps {}

const ThemesSwitch: FC<ThemesSwitchProps> = ({}) => {
  const t = useTranslations()

  const isMounted = useMounted()
  const [mode, setMode] = useState<Unresolved_CM | null>(null)

  useEffect(() => {
    if (!isMounted) return

    const colorMode = localStorage.getItem(COLOR_MODE_SK) as Unresolved_CM
    setMode(colorMode)
  }, [isMounted])

  useEffect(() => {
    const handler = (e: WindowEventMap[Custom_SEK]) => e.detail.key === COLOR_MODE_SK && setMode(e.detail.newValue as Unresolved_CM)

    window.addEventListener(CUSTOM_SEK, handler)
    return () => window.removeEventListener(CUSTOM_SEK, handler)
  }, [])

  function dispatchCustomStorageEvent({
    key,
    newValue,
    oldValue,
  }:
    | { key: ThemesConfig_SK | ColorMode_SK; newValue: string; oldValue: string }) {
    const customStorageEvent = new CustomEvent<Custom_SE['detail']>(CUSTOM_SEK, {
      detail: { key, newValue, oldValue },
    })
    window.dispatchEvent(customStorageEvent)
  }

  const updateMode = (newMode: Unresolved_CM) => {
    localStorage.setItem(COLOR_MODE_SK, newMode)
    dispatchCustomStorageEvent({key: COLOR_MODE_SK, newValue: newMode, oldValue: mode!})
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
