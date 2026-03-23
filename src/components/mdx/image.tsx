import ImageNext from 'next/image'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/lib/utils'

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
    <figure className='not-prose my-4'>
      <ImageNext
        className={cn('rounded-lg', className)}
        sizes={
          sizes ||
          '(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc(100vw - 4rem), 640px'
        }
        loading={priority ? undefined : loading}
        priority={priority}
        {...(props as ImageProps)}
      />
      {caption && (
        <figcaption className='mt-2 text-center text-sm text-muted-foreground'>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

interface RatioImageProps extends Omit<Props, 'fill'> {
  ratio?: number
}

export function RatioImage({
  ratio = 16 / 9,
  loading = 'lazy',
  caption,
  priority,
  className,
  sizes,
  ...props
}: RatioImageProps) {
  return (
    <figure className='not-prose my-4'>
      <AspectRatio
        ratio={ratio}
        className='overflow-hidden rounded-lg bg-muted'
      >
        <ImageNext
          className={cn('rounded-lg object-cover', className)}
          sizes={
            sizes ||
            '(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc(100vw - 4rem), 640px'
          }
          loading={priority ? undefined : loading}
          priority={priority}
          fill
          {...(props as ImageProps)}
        />
        {caption && (
          <figcaption className='mt-2 text-center text-sm text-muted-foreground'>
            {caption}
          </figcaption>
        )}
      </AspectRatio>
    </figure>
  )
}
