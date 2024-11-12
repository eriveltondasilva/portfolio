import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { meta } from '@/config'
import { getAllPostSlugs, getPostData } from '@/services/post-service'
import { Post } from '@/types'

type MetadataProps = { params: Promise<{ slug: string }> }
export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { slug } = await params
  const post: Post = await getPostData(slug)

  if (!post) return notFound()

  return {
    title: post?.title,
    description: post?.description,
    openGraph: {
      type: 'article',
      //
      title: post?.title,
      description: post?.description,
      url: `/blog/${post?.slug}`,
      publishedTime: post?.createdAt,
      modifiedTime: post?.updatedAt,
      tags: post?.tags,
      authors: [meta?.author],
    },
  }
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

type LayoutProps = { children: React.ReactNode }
export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>
}
