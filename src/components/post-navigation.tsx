import { AdjacentPostCard } from '@/components/adjacent-post-card'
import { Separator } from '@/components/separator'

import type { PostIndex } from '@/types'

interface Props {
  prevPost: PostIndex | null
  nextPost: PostIndex | null
}

export function PostNavigation({ prevPost, nextPost }: Props) {
  if (!prevPost && !nextPost) return null

  return (
    <section aria-label='Navegação entre posts'>
      <Separator />

      <nav aria-label='Navegação entre posts' className='flex flex-col gap-3 sm:flex-row'>
        {prevPost && <AdjacentPostCard post={prevPost} direction='prev' />}
        {!prevPost && <div className='flex-1' />}
        {nextPost && <AdjacentPostCard post={nextPost} direction='next' />}
      </nav>
    </section>
  )
}
