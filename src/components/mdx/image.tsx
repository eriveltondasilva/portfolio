import { cn } from 'cn';
import ImageNext from 'next/image';

import {
  DEFAULT_IMAGE_SIZES,
  getPlaceholder,
  isStaticImageData,
} from '@/lib/images';

import { Figure } from './figure';
import { ImageZoom } from './image-zoom';

import type { ImageProps as NextImageProps } from 'next/image';

interface ImageProps extends Omit<NextImageProps, 'fill'> {
  caption?: string;
  zoom?: boolean;
}

export function Image({
  src,
  className,
  caption,
  title,
  sizes,
  zoom = true,
  ...props
}: ImageProps) {
  const image = (
    <ImageNext
      src={src}
      className={cn('mx-auto rounded-md', className)}
      sizes={sizes ?? DEFAULT_IMAGE_SIZES}
      placeholder={getPlaceholder(src)}
      {...props}
    />
  );

  return (
    <Figure caption={caption ?? title}>
      {zoom && isStaticImageData(src) ?
        <ImageZoom src={src} alt={props.alt}>
          {image}
        </ImageZoom>
      : image}
    </Figure>
  );
}

interface RatioImageProps extends Omit<NextImageProps, 'fill'> {
  ratio?: number;
  caption?: string;
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
      <div
        className='relative overflow-hidden rounded-md bg-muted'
        style={{ aspectRatio: ratio }}
      >
        <ImageNext
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
