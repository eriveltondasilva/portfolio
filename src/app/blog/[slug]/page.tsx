import '@/scss/plugins/highlightjs/monokai.scss'
import '@/scss/plugins/rehype-highlight-code-lines.scss'

import { Calendar, Timer } from 'lucide-react'

import { getPost } from '@/services/post-service'
import { formatDate } from '@/utils/date-format'
import { getReadingTime } from '@/utils/reading-time'

type PostPageProps = { params: Promise<{ slug: string }> }
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) return null

  return (
    <section>
      <h1 className='title'>{post.title}</h1>
      <div className='text-medium mb-8 mt-2 flex items-center justify-between'>
        <p className='flex flex-wrap items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400'>
          <span className='flex gap-2'>
            <Calendar className='size-4' />
            {formatDate(post.createdAt)}
          </span>
          <span className='hidden sm:flex'>|</span>
          <span className='flex gap-2'>
            <Timer className='size-4' /> {getReadingTime(post)} de leitura
          </span>
        </p>
      </div>
      <article className='prose prose-slate prose-quoteless dark:prose-invert'>
        <post.content />
      </article>
    </section>
  )
}
