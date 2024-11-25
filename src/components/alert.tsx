import clsx from 'clsx'
import { LucideIcon } from 'lucide-react'

const COLORS = {
  info: clsx('bg-blue-50 text-blue-800 dark:bg-gray-800 dark:text-blue-400'),
  danger: clsx('bg-red-50 text-red-800 dark:bg-gray-800 dark:text-red-400'),
  success: clsx(
    'bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400',
  ),
  warning: clsx(
    'bg-yellow-50 text-yellow-800 dark:bg-gray-800 dark:text-yellow-300',
  ),
  default: clsx('bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-300'),
}

type AlertProps = {
  type?: keyof typeof COLORS
  icon?: LucideIcon
  children: React.ReactNode
}
export function Alert({ type, children, icon: Icon }: AlertProps) {
  return (
    <div
      className={clsx(
        'flex items-center rounded-lg text-sm',
        'mb-4 px-4 py-5',
        COLORS[type || 'default'],
      )}
      role='alert'
    >
      {Icon && <Icon className='me-3 inline size-5 flex-shrink-0' />}
      <div>{children}</div>
    </div>
  )
}
