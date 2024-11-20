import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

export function Alert({
  children,
  icon: Icon,
}: {
  children: React.ReactNode
  icon?: LucideIcon
}) {
  return (
    <div
      className={clsx(
        'flex items-center rounded-lg px-4 py-5 mb-4 text-sm',
        'bg-blue-50 dark:bg-gray-800',
      )}
      role='alert'
    >
      {Icon && <Icon className='me-3 inline size-5 flex-shrink-0' />}
      <span className='sr-only'>alert</span>
      <div>{children}</div>
    </div>
  )
}
