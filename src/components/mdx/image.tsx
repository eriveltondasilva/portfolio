import ImageNext from 'next/image'

import { cn } from '@/lib/utils'

import { DEFAULT_SIZES, Figcaption } from './utils'

import type { ImageProps } from 'next/image'

interface Props extends ImageProps {
  caption?: string
}

export function Image({ className, caption, sizes, ...props }: Props) {
  return (
    <figure className='my-4'>
      <ImageNext
        className={cn('rounded-md', className)}
        sizes={sizes ?? DEFAULT_SIZES}
        {...props}
      />
      {caption && <Figcaption>{caption}</Figcaption>}
    </figure>
  )
}
