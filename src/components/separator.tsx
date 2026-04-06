import { Separator as SeparatorBase } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof SeparatorBase>

export function Separator({ className, ...props }: Props) {
  return <SeparatorBase className={cn('my-10 dark:bg-zinc-700/60', className)} {...props} />
}
