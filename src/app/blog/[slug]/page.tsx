import { ArrowLeftIcon, DotIcon, HashIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Icon } from '@/components/icon'
import { PostAuthors } from '@/components/post-authors'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/separator'
import { PostCover } from '@/components/post-cover'
import { formatDate } from '@/lib'
import { GITHUB_REPO, PostStatus, BASE_URL } from '@/lib/constants'
import { getAuthorsBySlugs } from '@/lib/blog/authors'
import { RelatedPosts } from '@/components/related-posts'
import { ReadingProgress } from '@/components/reading-progress'
import { ShareButton } from '@/components/share-button'
import { BackToTop } from '@/components/back-to-top'
import { PostSeriesBanner } from '@/components/post-series-banner'
import { ArchivedBanner } from '@/components/archived-banner'
import { PostFooterActions } from '@/components/post-footer-actions'
import { PostNavigation } from '@/components/post-navigation'
import {
  getAdjacentPosts,
  getAllPostSlugs,
  getPostBySlug,
  getPostWithContent,
} from '@/lib/blog/posts'

import type { Metadata } from 'next'

export const dynamicParams = false

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) return notFound()

  const authors = getAuthorsBySlugs(post.authors)
  const siteName = "Erivelton's Portfolio"

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: authors.map((author) => ({ name: author.name, url: author.socials.github })),
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      siteName: siteName,
      url: `/blog/${slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      authors: authors.map((author) => author.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      site: siteName,
      creator: '@erivelton_silv4',
    },
  }
}

export function generateStaticParams() {
  return getAllPostSlugs()
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = await getPostWithContent(slug)

  if (!post) return notFound()

  const { meta, Content } = post
  // console.log(headings)

  const { prevPost, nextPost } = getAdjacentPosts(slug)
  const isArchived = meta.status === PostStatus.ARCHIVED
  const authors = getAuthorsBySlugs(meta.authors)

  const postUrl = `${BASE_URL}/blog/${slug}`
  const editUrl = `${GITHUB_REPO}/edit/main/content/posts/${meta.folder}/index.mdx`

  return (
    <div>
      <ReadingProgress />
      <BackToTop />

      <Link
        href='/blog'
        className='mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
      >
        <Icon iconNode={ArrowLeftIcon} />
        Voltar ao blog
      </Link>

      {isArchived && <ArchivedBanner />}

      {/* Post header */}
      <header>
        {/* Tags */}
        {meta.tags.length > 0 && (
          <div className='flex flex-wrap gap-1.5'>
            {meta.tags.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`}>
                <Badge
                  variant='secondary'
                  className='rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 hover:bg-blue-50 hover:text-blue-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300'
                >
                  <Icon iconNode={HashIcon} />
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Title + share button */}
        <div className='mt-2 flex items-start justify-between gap-3'>
          <h1 className='font-mono text-3xl leading-tight font-bold tracking-tight text-balance text-zinc-900 dark:text-zinc-50'>
            {meta.title}
          </h1>
          <ShareButton title={meta.title} url={postUrl} />
        </div>

        {/* Description — lead text */}
        <p className='mt-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-400'>
          {meta.description}
        </p>

        {/* Meta info */}
        <div className='mt-2 flex flex-wrap items-center gap-y-1.5 text-sm text-zinc-400 dark:text-zinc-500'>
          <span>
            {meta.updatedAt ? 'Atualizado em ' : 'Publicado em '}
            <time dateTime={meta.updatedAt ?? meta.publishedAt}>
              {formatDate(meta.updatedAt ?? meta.publishedAt, { dateStyle: 'long' })}
            </time>

            {authors.length > 0 && (
              <span>
                {' '}
                por <PostAuthors authors={authors} />
              </span>
            )}
          </span>

          <Icon iconNode={DotIcon} className='size-5' />

          <span>{meta.readingTime} min de leitura</span>
        </div>

        <Separator className='my-6' />

        {meta.coverFile && (
          <PostCover
            className='mb-10'
            folder={meta.folder}
            coverFile={meta.coverFile}
            title={meta.title}
          />
        )}
      </header>

      {/* Article content */}
      <article className='prose max-w-none prose-zinc dark:prose-invert prose-hr:my-10'>
        <Content />
      </article>

      <Separator />

      <PostFooterActions slug={slug} editUrl={editUrl} />

      <PostSeriesBanner slug={meta.series} order={meta.order} />

      {!isArchived && (
        <>
          <RelatedPosts slug={slug} />
          <PostNavigation prevPost={prevPost} nextPost={nextPost} />
        </>
      )}
    </div>
  )
}
