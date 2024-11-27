import { meta } from '@/config'
import { getAllPostFiles, getPost } from '@/services/post-service'

type MetadataProps = { params: Promise<{ slug: string[] }> }
export async function generateMetadata({ params }: MetadataProps) {
  const [year, postSlug] = (await params).slug
  const post = await getPost([year, postSlug])

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
      url: `/blog/${year}/${postSlug}`,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      authors: meta.author,
      // images: [
      //   {
      //     url: `/api/post-og?slug=${encodeURIComponent(year)}&slug=${encodeURIComponent(postSlug)}`,
      //     alt: post.title,
      //     width: 800,
      //     height: 400,
      //   },
      // ],
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
