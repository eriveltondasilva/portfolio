import type { ComponentProps } from 'react'

export const DEFAULT_SIZES =
  '(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc(100vw - 4rem), 640px'

export function Figcaption({ children }: ComponentProps<'figcaption'>) {
  return (
    <figcaption className='mt-2 text-center text-sm text-muted-foreground'>
      {children}
    </figcaption>
  )
}
