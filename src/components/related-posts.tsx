import { SparklesIcon } from 'lucide-react'

import { PostCard } from '@/components/post-card'
import { Icon } from '@/components/icon'
import { getRelatedPosts } from '@/lib/blog/posts'

interface Props {
  slug: string
}

export function RelatedPosts({ slug }: Props) {
  const posts = getRelatedPosts(slug)

  if (posts.length === 0) return null

  return (
    <section>
      <h2 className='mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50'>
        <Icon iconNode={SparklesIcon} className='text-orange-500' />
        Posts relacionados
      </h2>
      <div className='grid gap-3 sm:grid-cols-2'>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
