import clsx from 'clsx'

export function Badge({ children }: { children: string }) {
  const className = clsx(
    'me-2 rounded px-2.5 py-0.5 text-xs font-medium',
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  )

  return <span className={className}>{children}</span>
}
