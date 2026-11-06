import { cn } from 'cn';
import NextImage from 'next/image';

import { GRID_IMAGE_SIZES, getPlaceholder } from '@/lib/images';

import { Figure } from './figure';

import type { GridColumns } from '@/types';
import type { ImageProps } from 'next/image';
import type { ComponentProps } from 'react';

const gridCols = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
} as const satisfies Record<GridColumns, string>;

// ─────────────────────────────────────

interface ImageGridProps extends ComponentProps<'div'> {
  columns?: GridColumns;
}

export function ImageGrid({
  columns = 3,
  className,
  children,
  ...props
}: ImageGridProps) {
  return (
    <div
      className={cn('not-prose my-6 grid gap-3', gridCols[columns], className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────

interface GridImageProps extends Omit<ImageProps, 'fill' | 'sizes'> {
  caption?: string;
}

export function GridImage({
  src,
  caption,
  className,
  ...props
}: GridImageProps) {
  return (
    <Figure caption={caption} className='m-0'>
      <div className='relative aspect-square overflow-hidden rounded-md'>
        <NextImage
          src={src}
          className={cn('object-cover', className)}
          sizes={GRID_IMAGE_SIZES}
          placeholder={getPlaceholder(src)}
          fill
          {...props}
        />
      </div>
    </Figure>
  );
}
