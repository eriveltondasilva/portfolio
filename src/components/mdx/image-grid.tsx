import { cva } from 'class-variance-authority'
import Image from 'next/image'

import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'
import type { VariantProps } from 'class-variance-authority'
import type { ImageProps } from 'next/image'

const imageGridVariants = cva('my-8 grid gap-4', {
  variants: {
    columns: {
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-6',
    },
  },
  defaultVariants: {
    columns: 3,
  },
})

const sizesForColumns = {
  2: '(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc((100vw - 4rem - 1rem) / 2), 312px',
  3: '(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc((100vw - 4rem - 1rem) / 2), 203px',
  4: '(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc((100vw - 4rem - 1rem) / 2), 148px',
  5: '(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc((100vw - 4rem - 1rem) / 2), 115px',
  6: '(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc((100vw - 4rem - 1rem) / 2), 93px',
}

interface Props extends Omit<ImageProps, 'fill' | 'sizes'> {
  caption?: string
}

interface ImageGridProps
  extends ComponentProps<'div'>, VariantProps<typeof imageGridVariants> {
  images: Props[]
  classNameImages?: string
}

export function ImageGrid({
  images,
  columns = 3,
  className,
  classNameImages,
}: ImageGridProps) {
  const sizes =
    sizesForColumns[columns as keyof typeof sizesForColumns] ??
    sizesForColumns[3]

  return (
    <div className={imageGridVariants({ columns, className })}>
      {images.map(
        ({ className: classNameImage, caption, alt, ...props }, i) => (
          <figure key={i} className='not-prose'>
            <div className='relative aspect-square overflow-hidden rounded-lg bg-muted'>
              <Image
                className={cn('object-cover', classNameImages, classNameImage)}
                sizes={sizes}
                loading='lazy'
                alt={alt || ''}
                fill
                {...props}
              />
            </div>
            {caption && (
              <figcaption className='mt-2 text-center text-sm text-muted-foreground'>
                {caption}
              </figcaption>
            )}
          </figure>
        ),
      )}
    </div>
  )
}
