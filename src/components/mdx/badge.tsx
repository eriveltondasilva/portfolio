import { cva } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'
import type { VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-lg border font-mono font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border bg-muted text-muted-foreground',
        primary: 'border-primary/50 bg-primary/10 text-primary',
        success: 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400',
        warning: 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400',
        danger: 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400',
        info: 'border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400',
      },
      size: {
        sm: 'px-1 py-px text-[10px]',
        md: 'px-1.5 py-0.5 text-xs',
        lg: 'px-2 py-1 text-sm',
      },
      dashed: {
        true: 'border-dashed',
        false: '',
      },
      borderless: {
        true: 'border-transparent',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      dashed: false,
      borderless: false,
    },
  },
)

interface Props extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

export function Badge({
  variant,
  size,
  dashed,
  borderless,
  className,
  children,
  asChild = false,
  ...props
}: Props) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      className={cn(badgeVariants({ variant, size, dashed, borderless }), className)}
      {...props}
    >
      {children}
    </Comp>
  )
}
