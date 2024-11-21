import '@/styles/plugins/highlightjs/monokai.scss'
import '@/styles/plugins/rehype-highlight-code-lines.scss'

import { PencilLine } from 'lucide-react'

import { Badge } from '@/components/badge'
import { Metadata } from '@/components/metadata'
import { getPost } from '@/services/post-service'
import { meta } from '@/config'
import { Separator } from '@/components/separator'

type PostPageProps = { params: Promise<{ slug: string }> }
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) return null

  return (
    <article>
      <header>
        <h1 className='title'>{post.title}</h1>

        <Metadata
          createdAt={post.createdAt}
          readingTime={post.readingTime}
        />

        <div className='mt-3 flex flex-wrap gap-2'>
          {post.tags?.map((tag) => <Badge key={tag}>{tag}</Badge>)}
          {!post.tags?.length && <Badge>no tags</Badge>}
        </div>
      </header>

      <Separator />

      <div className='mdx prose prose-slate prose-quoteless dark:prose-invert'>
        <post.content />
      </div>

      <Separator />

      <footer className='flex text-sm italic text-neutral-600 dark:text-neutral-400'>
        <PencilLine className='mr-2 size-4' />
        <p>Artigo escrito por {post.author || meta.author}</p>
      </footer>
    </article>
  )
}
