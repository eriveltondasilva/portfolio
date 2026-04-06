'use client'

import NextImage from 'next/image'

import { cn } from '@/lib/utils'
import { useImageGrid, ImageGridProvider } from '@/contexts/image-grid-context'

import { Figure } from './figure'

import type { ComponentProps } from 'react'
import type { ImageProps } from 'next/image'
import type { GridColumns } from '@/types'

const gridColsMap = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
  5: 'grid-cols-2 md:grid-cols-5',
  6: 'grid-cols-3 md:grid-cols-6',
} as const satisfies Record<GridColumns, string>

const sizesMap = {
  2: '(max-width: 640px) calc(50vw - 1rem), (max-width: 768px) calc(50vw - 2.75rem), 328px',
  3: '(max-width: 640px) calc(50vw - 1rem), (max-width: 768px) calc(33vw - 2.5rem), 213px',
  4: '(max-width: 640px) calc(50vw - 1rem), (max-width: 768px) calc(25vw - 2.25rem), 156px',
  5: '(max-width: 640px) calc(50vw - 1rem), (max-width: 768px) calc(20vw - 2.2rem), 122px',
  6: '(max-width: 640px) calc(33vw - 1rem), (max-width: 768px) calc(17vw - 2.1rem), 99px',
} as const satisfies Record<GridColumns, string>

// -------------------------------------

interface ImageGridProps extends ComponentProps<'div'> {
  columns?: GridColumns
}

export function ImageGrid({ columns = 3, className, children, ...props }: ImageGridProps) {
  return (
    <ImageGridProvider columns={columns}>
      <div className={cn('not-prose my-6 grid gap-3', gridColsMap[columns], className)} {...props}>
        {children}
      </div>
    </ImageGridProvider>
  )
}

// -------------------------------------

interface GridImageProps extends Omit<ImageProps, 'fill' | 'sizes'> {
  caption?: string
  columns?: GridColumns
}

export function GridImage({
  src,
  caption,
  className,
  columns: columnsProp,
  ...props
}: GridImageProps) {
  const { columns: contextColumns } = useImageGrid()
  const columns = columnsProp ?? contextColumns

  return (
    <Figure caption={caption} className='m-0'>
      <div className='relative aspect-square overflow-hidden rounded-md'>
        <NextImage
          src={src}
          className={cn('object-cover', className)}
          sizes={sizesMap[columns]}
          placeholder={typeof src === 'string' ? 'empty' : 'blur'}
          fill
          {...props}
        />
      </div>
    </Figure>
  )
}
