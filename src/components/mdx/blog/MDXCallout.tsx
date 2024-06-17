import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  icon?: string
  type?: 'default' | 'warning' | 'danger'
}

// TODO: Implement warning color

export function Callout({ children, icon, type = 'default', ...props }: CalloutProps) {
  return (
    <div
      className={cn('my-6 flex items-start rounded-md border border-l-4 p-4', {
        'border-negative-900 bg-negative-50': type === 'danger',
        'border-yellow-900 bg-yellow-50': type === 'warning',
      })}
      {...props}
    >
      {icon && <span className='mr-4 text-2xl'>{icon}</span>}
      <div>{children}</div>
    </div>
  )
}
