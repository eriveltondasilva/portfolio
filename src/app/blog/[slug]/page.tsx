import { ArrowLeftIcon, DotIcon, FilePenIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AdjacentPostCard } from '@/components/adjacent-post-card'
import { Icon } from '@/components/icon'
import { PostAuthors } from '@/components/post-authors'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  const ogImageUrl = `${BASE_URL}/blog/${slug}/opengraph-image`

  return {
    title: post.title,
    description: post.description,
    authors: authors.map((author) => ({
      name: author.name,
      url: author.socials.github,
    })),
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      url: `blog/${slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      authors: authors.map((author) => author.name),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImageUrl + '?w=1200&h=630'],
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
  const hasAdjacentPosts = prevPost !== null || nextPost !== null
  const isArchived = meta.status === PostStatus.ARCHIVED

  const authors = getAuthorsBySlugs(meta.authors)

  const postUrl = `${BASE_URL}/blog/${slug}`
  const editUrl = `${GITHUB_REPO}/edit/main/content/posts/${meta.folder}/index.mdx`

  return (
    <div>
      <ReadingProgress />
      <BackToTop />

      {/* Back link */}
      <Link
        href='/blog'
        className='mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
      >
        <Icon iconNode={ArrowLeftIcon} />
        Voltar ao blog{BASE_URL}
      </Link>

      {/* Archived banner */}
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
        <p className='mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400'>
          {meta.description}
        </p>

        {/* Meta info */}
        <div className='mt-4 flex flex-wrap items-center gap-y-1.5 text-sm text-zinc-400 dark:text-zinc-500'>
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

        <Separator className='my-8' />

        {/* Cover image — hero após os metadados */}
        {meta.coverFile && (
          <PostCover
            folder={meta.folder}
            coverFile={meta.coverFile}
            title={meta.title}
            className='mb-8'
          />
        )}
      </header>

      {/* Article content */}
      <article className='prose max-w-none prose-zinc dark:prose-invert prose-hr:my-10'>
        <Content />
      </article>

      {/* Footer actions */}
      <div className='mt-4 flex justify-end'>
        <Button variant='link' asChild>
          <a href={editUrl} target='_blank' rel='noopener noreferrer'>
            <Icon iconNode={FilePenIcon} />
            Sugerir alterações
          </a>
        </Button>
      </div>

      {/* Series banner */}
      <PostSeriesBanner slug={meta.series} order={meta.order} />

      {/* Related posts */}
      {!isArchived && <RelatedPosts slug={slug} />}

      {/* Prev / Next navigation */}
      {!isArchived && hasAdjacentPosts && (
        <>
          <Separator />

          <nav aria-label='Navegação entre posts' className='flex flex-col gap-3 sm:flex-row'>
            {prevPost && <AdjacentPostCard post={prevPost} direction='prev' />}
            {!prevPost && <div className='flex-1' />}
            {nextPost && <AdjacentPostCard post={nextPost} direction='next' />}
          </nav>
        </>
      )}
    </div>
  )
}
