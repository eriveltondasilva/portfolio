import { meta } from '@/config'
import { getAllPostFiles, getPost } from '@/services/post-service'

type MetadataProps = { params: Promise<{ slug: string[] }> }
export async function generateMetadata({ params }: MetadataProps) {
  const { slug } = await params
  const post = await getPost(slug)

  return {
    metadataBase: new URL(meta.baseUrl),
    //
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      //
      title: post.title,
      description: post.description,
      url: `/blog/${slug.join('/')}`,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
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
