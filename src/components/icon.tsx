import { cn } from '#/lib/utils'

import type { LucideIcon, LucideProps } from 'lucide-react'

interface Props extends LucideProps {
  iconNode: LucideIcon
  label?: string
}

export function Icon({ iconNode, className, label, ...props }: Props) {
  const Comp = iconNode

  return (
    <>
      <Comp className={cn('size-4', className)} {...props} />
      {label && <span className='sr-only'>{label}</span>}
    </>
  )
}
