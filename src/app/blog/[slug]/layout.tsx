import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { meta } from '@/config'
import { getPost, getSlugs } from '@/services/post-service'

type MetadataProps = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

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
      authors: meta?.author,
    },
  }
}

export async function generateStaticParams() {
  const slugs = await getSlugs()
  return slugs.map((slug) => ({ slug }))
}

type LayoutProps = { children: React.ReactNode }
export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>
}
