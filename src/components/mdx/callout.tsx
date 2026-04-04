import { cva } from 'class-variance-authority'
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, XCircleIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'
import type { VariantProps } from 'class-variance-authority'

const calloutVariants = cva('not-prose my-6 flex gap-3 rounded-lg border p-4 text-sm', {
  variants: {
    variant: {
      info: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300',
      tip: 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300',
      warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
      danger: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

const iconMap = {
  info: InfoIcon,
  tip: CheckCircleIcon,
  warning: AlertTriangleIcon,
  danger: XCircleIcon,
}

interface Props extends ComponentProps<'div'>, VariantProps<typeof calloutVariants> {
  title?: string
}

export function Callout({ variant, title, className, children, ...props }: Props) {
  const Icon = iconMap[variant ?? 'info']
  const hasTitle = !!title

  return (
    <div className={cn(calloutVariants({ variant }), className)} {...props}>
      <Icon
        className='mt-0.5 size-4 shrink-0'
        aria-hidden={hasTitle}
        aria-label={!hasTitle ? (variant ?? 'info') : undefined}
      />
      <div className='flex flex-col gap-1'>
        {title && <p className='font-semibold'>{title}</p>}
        <div className='[&_p]:leading-relaxed'>{children}</div>
      </div>
    </div>
  )
}
