import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

export function Kbd({ className, children, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5',
        'font-mono text-[0.75em] font-medium text-foreground shadow-[0_2px_0_0_hsl(var(--border))]',
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}
