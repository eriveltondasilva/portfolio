import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

export function Alert({ children, icon: Icon }: { children: React.ReactNode; icon?: LucideIcon }) {
  return (
    <div
      className={clsx(
        'mb-4 flex items-center rounded-lg text-sm',
        'bg-blue-50 p-4 text-blue-800',
        'dark:bg-gray-800 dark:text-blue-400',
      )}
      role='alert'
    >
      {Icon && <Icon className='me-3 inline size-5 flex-shrink-0' />}
      <span className='sr-only'>alert</span>
      <div>{children}</div>
    </div>
  )
}
