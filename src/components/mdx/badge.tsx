import { cva } from 'class-variance-authority'

import { cn } from '#/lib/utils'

import type { ComponentProps } from 'react'
import type { VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border bg-muted text-muted-foreground',
        primary: 'border-primary/30 bg-primary/10 text-primary',
        success:
          'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400',
        warning:
          'border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
        danger:
          'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
        info: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface Props
  extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {}

export function Badge({ variant, className, children, ...props }: Props) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  )
}
