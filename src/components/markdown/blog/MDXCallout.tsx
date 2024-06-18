import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  icon?: string
  type?: 'default' | 'warning' | 'danger'
}

export function MDXCallout({ children, icon, type = 'default', ...props }: CalloutProps) {
  return (
    <div
      className={cn('my-6 flex items-start rounded-md border border-l-4 p-4', {
        'border-negative-900 bg-negative-50': type === 'danger',
        'border-alert-900 bg-alert-50': type === 'warning',
      })}
      {...props}
    >
      {icon && <span className='mr-4 text-2xl'>{icon}</span>}
      <div>{children}</div>
    </div>
  )
}
