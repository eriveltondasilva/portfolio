import { cn } from 'cn';
import NextImage from 'next/image';

import { GRID_IMAGE_SIZES, getPlaceholder } from '@/lib/images';

import { Figure } from '../figure';

import type { GridColumns } from '@/types';
import type { ImageProps as NextImageProps } from 'next/image';
import type { ComponentProps } from 'react';

// ─────────────────────────────────────

const gridCols = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
} as const satisfies Record<GridColumns, string>;

interface GalleryProps extends ComponentProps<'div'> {
  columns?: GridColumns;
}

export function Gallery({
  columns = 3,
  className,
  children,
  ...props
}: GalleryProps) {
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

interface GalleryImageProps extends Omit<NextImageProps, 'fill' | 'sizes'> {
  caption?: string;
}

export function GalleryImage({
  src,
  caption,
  className,
  ...props
}: GalleryImageProps) {
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
