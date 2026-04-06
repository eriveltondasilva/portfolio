import ImageNext from 'next/image'

import { cn } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'

import { Figure } from './figure'

const DEFAULT_SIZES =
  '(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc(100vw - 4rem), 704px'

import type { ImageProps as NextImageProps } from 'next/image'

// -------------------------------------

interface ImageProps extends NextImageProps {
  caption?: string
}

export function Image({ src, className, caption, sizes, ...props }: ImageProps) {
  return (
    <Figure caption={caption}>
      <ImageNext
        src={src}
        className={cn('rounded-md', className)}
        sizes={sizes ?? DEFAULT_SIZES}
        placeholder={typeof src === 'string' ? 'empty' : 'blur'}
        {...props}
      />
    </Figure>
  )
}

// -------------------------------------

interface RatioImageProps extends Omit<NextImageProps, 'fill'> {
  ratio?: number
  caption?: string
}

export function RatioImage({
  ratio = 16 / 9,
  caption,
  className,
  sizes,
  src,
  ...props
}: RatioImageProps) {
  return (
    <Figure caption={caption}>
      <AspectRatio ratio={ratio} className='overflow-hidden rounded-md bg-muted'>
        <ImageNext
          src={src}
          className={cn('object-cover', className)}
          sizes={sizes ?? DEFAULT_SIZES}
          placeholder={typeof src === 'string' ? 'empty' : 'blur'}
          fill
          {...props}
        />
      </AspectRatio>
    </Figure>
  )
}
