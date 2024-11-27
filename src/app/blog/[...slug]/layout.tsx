import { meta } from '@/config'
import { getAllPostFiles, getPost } from '@/services/post-service'
import { Post } from '@/types'
import { formatDate } from '@/utils/date-format'
import { getReadingTime } from '@/utils/reading-time'
import { Metadata } from 'next'

type MetadataProps = { params: Promise<{ slug: string[] }> }
export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { slug } = await params
  const post: Post = await getPost(slug)
  const author = post.author || meta.author
  const createdAt = formatDate(post.createdAt)
  const readingTime = getReadingTime(post.readingTime)

  const ogImage = `${meta.baseUrl}/api/post-og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description)}&author=${encodeURIComponent(author)}&created-at=${encodeURIComponent(createdAt)}&reading-time=${encodeURIComponent(readingTime)}`

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      //
      title: post.title,
      description: post.description,
      url: `${meta.baseUrl}/blog/${slug.join('/')}`,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: [
        {
          url: ogImage,
        },
      ],
    },
  }
}

export async function generateStaticParams() {
  const slugs: string[][] = await getAllPostFiles()
  return slugs.map((slug) => ({ slug }))
}

type LayoutProps = { children: React.ReactNode }
export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>
}
