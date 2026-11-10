import { cn } from 'cn';
import NextImage from 'next/image';

import { DEFAULT_IMAGE_SIZES, getPlaceholder } from '@/lib/images';

import { Figure } from '../figure';

import type { ImageProps as NextImageProps } from 'next/image';

// ─────────────────────────────────────

interface ImageProps extends Omit<NextImageProps, 'fill'> {
  caption?: string;
}

export function Image({
  src,
  className,
  caption,
  title,
  sizes,
  ...props
}: ImageProps) {
  // ! Markdown syntax `![alt](src "text")` only exposes `title`, so it doubles as the caption.
  // ! It is intentionally not forwarded to the <img>: the native tooltip is poor for accessibility.
  return (
    <Figure caption={caption ?? title}>
      <NextImage
        src={src}
        className={cn('mx-auto rounded-md', className)}
        sizes={sizes ?? DEFAULT_IMAGE_SIZES}
        placeholder={getPlaceholder(src)}
        {...props}
      />
    </Figure>
  );
}

// ─────────────────────────────────────

interface ImageRatioProps extends Omit<NextImageProps, 'fill'> {
  ratio?: number;
  caption?: string;
}

export function ImageRatio({
  ratio = 16 / 9,
  caption,
  className,
  sizes,
  src,
  ...props
}: ImageRatioProps) {
  return (
    <Figure caption={caption}>
      <div
        className='relative overflow-hidden rounded-md bg-muted'
        style={{ aspectRatio: ratio }}
      >
        <NextImage
          src={src}
          className={cn('object-cover', className)}
          sizes={sizes ?? DEFAULT_IMAGE_SIZES}
          placeholder={getPlaceholder(src)}
          fill
          {...props}
        />
      </div>
    </Figure>
  );
}
