import { AdjacentPostCard } from '@/components/adjacent-post-card';
import { Separator } from '@/components/separator';

import type { PostIndex } from '@/types';

interface Props {
  prevPost: PostIndex | null;
  nextPost: PostIndex | null;
}

export function PostNavigation({ prevPost, nextPost }: Props) {
  if (!prevPost && !nextPost) return null;

  return (
    <>
      <Separator />

      <nav
        aria-label='Navegação entre posts'
        className='grid gap-3 sm:grid-cols-2'
      >
        {prevPost && <AdjacentPostCard post={prevPost} direction='prev' />}
        {nextPost && (
          <AdjacentPostCard
            post={nextPost}
            direction='next'
            className={prevPost ? undefined : 'sm:col-start-2'}
          />
        )}
      </nav>
    </>
  );
}
