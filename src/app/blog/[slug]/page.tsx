import { DotIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArchivedBanner } from '@/components/archived-banner';
import { BackToTop } from '@/components/back-to-top';
import { Icon } from '@/components/icon';
import { PostAuthors } from '@/components/post-authors';
import { PostCover } from '@/components/post-cover';
import { PostFooter } from '@/components/post-footer';
import { PostNavigation } from '@/components/post-navigation';
import { PostSeriesBanner } from '@/components/post-series-banner';
import { PostToc } from '@/components/post-toc';
import { ReadingProgress } from '@/components/reading-progress';
import { RelatedPosts } from '@/components/related-posts';
import { Separator } from '@/components/separator';
import { ShareButton } from '@/components/share-button';
import { formatDate } from '@/lib';
import { getAuthorsBySlugs } from '@/lib/blog/authors';
import { getPostWithContent } from '@/lib/blog/post-content';
import {
  getAdjacentPosts,
  getAllPostSlugs,
  getPostBySlug,
} from '@/lib/blog/posts';
import { flattenToc } from '@/lib/blog/toc';
import {
  BASE_URL,
  GITHUB_REPO,
  PostStatus,
  SITE_NAME,
  TWITTER_HANDLE,
} from '@/lib/constants';

import { TagLink } from '@/components/tag-link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { Metadata } from 'next';

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const authors = getAuthorsBySlugs(post.authors);

  return {
    title: post.title,
    description: post.description,
    authors: authors.map((author) => ({
      name: author.name,
      url: author.socials.github,
    })),
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      siteName: SITE_NAME,
      url: `/blog/${slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      authors: authors.map((author) => author.socials.github),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
  };
}

export function generateStaticParams() {
  return getAllPostSlugs();
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const post = await getPostWithContent(slug);

  if (!post) notFound();

  const { meta, Content, toc } = post;

  console.log(meta);

  const authors = getAuthorsBySlugs(meta.authors);
  const { prevPost, nextPost } = getAdjacentPosts(slug);
  const tocItems = flattenToc(toc);

  const isArchived = meta.status === PostStatus.ARCHIVED;

  const postUrl = `${BASE_URL}/blog/${slug}`;
  const editUrl = `${GITHUB_REPO}/edit/main/content/posts/${meta.folder}/index.mdx`;

  return (
    <>
      <ReadingProgress />
      <BackToTop />

      <Breadcrumb aria-label='Trilha de navegação' className='mb-6'>
        <BreadcrumbList className='flex-nowrap'>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/blog'>Blog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem className='min-w-0'>
            <BreadcrumbPage className='truncate'>{meta.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isArchived && <ArchivedBanner />}

      {/* Anchors the sticky TOC, which sits outside the article column */}
      <div className='relative'>
        <article>
          {/* Post header */}
          <header>
            {/* Tags */}
            {meta.tags.length > 0 && (
              <div className='flex flex-wrap gap-1.5'>
                {meta.tags.map((tag) => (
                  <TagLink key={tag} tag={tag} />
                ))}
              </div>
            )}

            {/* Title + share button */}
            <div className='mt-1 flex items-start justify-between gap-3'>
              <h1 className='font-mono text-xl leading-tight font-bold tracking-tight text-balance text-zinc-900 sm:text-3xl dark:text-zinc-50'>
                {meta.title}
              </h1>
              <ShareButton title={meta.title} url={postUrl} />
            </div>

            {/* Meta info */}
            <div className='mt-1 flex flex-wrap items-center gap-y-1.5 text-sm text-zinc-400 dark:text-zinc-500'>
              <span>
                {meta.updatedAt ? 'Atualizado em ' : 'Publicado em '}
                <time dateTime={meta.updatedAt ?? meta.publishedAt}>
                  {formatDate(meta.updatedAt ?? meta.publishedAt, {
                    dateStyle: 'medium',
                  })}
                </time>

                {authors.length > 0 && (
                  <span>
                    &nbsp;por <PostAuthors authors={authors} />
                  </span>
                )}
              </span>

              <Icon iconNode={DotIcon} />

              <span>{meta.readingTime} min de leitura</span>
            </div>

            {meta.coverFile && (
              <PostCover
                className='mb-10'
                folder={meta.folder}
                coverFile={meta.coverFile}
              />
            )}

            <Separator className='my-6' />
          </header>

          {/* Article content */}
          <div className='prose max-w-none prose-zinc dark:prose-invert prose-headings:scroll-mt-24 prose-hr:my-10'>
            <Content />
          </div>

          <Separator />

          <PostFooter slug={slug} editUrl={editUrl} isArchived={isArchived} />
        </article>

        {tocItems.length > 1 && <PostToc items={tocItems} />}
      </div>

      <PostSeriesBanner slug={meta.series} order={meta.order} />

      {!isArchived && (
        <>
          <RelatedPosts slug={slug} />
          <PostNavigation prevPost={prevPost} nextPost={nextPost} />
        </>
      )}
    </>
  );
}
