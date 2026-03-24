import ImageNext from 'next/image'

import { cn } from '@/lib/utils'

import { DEFAULT_SIZES, Figcaption } from './utils'

import type { ImageProps } from 'next/image'

interface Props extends ImageProps {
  caption?: string
}

export function Image({
  className,
  caption,
  loading = 'lazy',
  sizes,
  priority,
  ...props
}: Props) {
  return (
    <figure className='my-4'>
      <ImageNext
        className={cn('rounded-lg', className)}
        sizes={sizes || DEFAULT_SIZES}
        loading={priority ? undefined : loading}
        priority={priority}
        {...props}
      />
      {caption && <Figcaption>{caption}</Figcaption>}
    </figure>
  )
}
