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
  sizes,
  placeholder,
  ...props
}: Props) {
  const effectivePlaceholder =
    placeholder ?? (props.blurDataURL ? 'blur' : 'empty')

  return (
    <figure className='my-4'>
      <ImageNext
        className={cn('rounded-md', className)}
        sizes={sizes ?? DEFAULT_SIZES}
        placeholder={effectivePlaceholder}
        {...props}
      />
      {caption && <Figcaption>{caption}</Figcaption>}
    </figure>
  )
}
