import ImageNext from 'next/image'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/lib/utils'

import { DEFAULT_SIZES, Figcaption } from './utils'

import type { ImageProps } from 'next/image'

interface Props extends Omit<ImageProps, 'fill'> {
  ratio?: number
  caption?: string
}

export function RatioImage({
  ratio = 16 / 9,
  caption,
  className,
  sizes,
  ...props
}: Props) {
  return (
    <figure className='not-prose'>
      <AspectRatio
        ratio={ratio}
        className='overflow-hidden rounded-lg bg-muted'
      >
        <ImageNext
          className={cn('rounded-lg object-cover', className)}
          sizes={sizes || DEFAULT_SIZES}
          fill
          {...props}
        />
      </AspectRatio>
      {caption && <Figcaption>{caption}</Figcaption>}
    </figure>
  )
}
