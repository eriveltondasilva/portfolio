export function Badge({ children }: { children: string }) {
  return (
    <span className='me-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300'>
      {children}
    </span>
  )
}
