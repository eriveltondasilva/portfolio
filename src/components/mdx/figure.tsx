import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

interface FigureProps extends ComponentProps<'figure'> {
  caption?: string
}

export function Figure({ caption, className, children, ...props }: FigureProps) {
  return (
    <figure className={cn('not-prose my-6', className)} {...props}>
      {children}
      {caption && (
        <figcaption className='mt-2 text-center text-xs text-muted-foreground italic'>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
