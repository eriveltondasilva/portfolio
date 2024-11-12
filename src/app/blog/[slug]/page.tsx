import '@/scss/plugins/highlightjs/monokai.scss'
import '@/scss/plugins/rehype-highlight-code-lines.scss'

import clsx from 'clsx'
import { Calendar } from 'lucide-react'

import { getPost } from '@/services/post-service'
import { formatDate } from '@/utils/date-format'

type PostPageProps = { params: Promise<{ slug: string }> }
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <section>
      <h1 className='title'>{post.title}</h1>
      <div className='text-medium mb-8 mt-2 flex items-center justify-between'>
        <p className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400'>
          <Calendar className='size-4' />
          {formatDate(post.createdAt)}
        </p>
      </div>
      <article className={clsx('prose prose-slate prose-quoteless dark:prose-invert')}>
        <post.content />
      </article>
    </section>
  )
}
