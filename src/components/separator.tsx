import { Separator as SeparatorBase } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

export function Separator({ className, ...props }: ComponentProps<typeof SeparatorBase>) {
  return <SeparatorBase className={cn('my-8 dark:bg-zinc-700/60', className)} {...props} />
}
