import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArchivedBanner } from '@/components/post/archived-banner';
import { BackToTop } from '@/components/post/back-to-top';
import { JsonLd } from '@/components/json-ld';
import { PostComments } from '@/components/post/post-comments';
import { PostFooter } from '@/components/post/post-footer';
import { PostNavigation } from '@/components/post/post-navigation';
import { PostSeriesBanner } from '@/components/post/post-series-banner';
import { PostToc } from '@/components/post/post-toc';
import { PostTocMobile } from '@/components/post/post-toc/mobile';
import { ReadingProgress } from '@/components/post/reading-progress';
import { RelatedPosts } from '@/components/post/related-posts';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getAuthorsBySlugs } from '@/lib/blog/authors';
import { getPostWithContent } from '@/lib/blog/post-content';
import {
  getAdjacentPosts,
  getAllPostSlugs,
  getPostBySlug,
} from '@/lib/blog/posts';
import { buildPostJsonLd } from '@/lib/blog/structured-data';
import { flattenToc } from '@/lib/blog/toc';
import {
  GITHUB_REPO,
  OG_LOCALE,
  PostStatus,
  SITE_NAME,
  TWITTER_HANDLE,
} from '@/lib/constants';
import { PostHeader } from '@/components/post/post-header';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { ShareButton } from '@/components/post/share-button';
import { BASE_URL } from '@/lib/base-url';

import type { Metadata } from 'next';

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const authors = getAuthorsBySlugs(post.authors);
  const isArchived = post.status === PostStatus.ARCHIVED;

  return {
    title: post.title,
    description: post.description,
    authors: authors.map((author) => ({
      name: author.name,
      url: author.socials.github,
    })),
    alternates: {
      canonical: `/blog/${slug}`,
      types: { 'application/rss+xml': '/feed.xml' },
    },
    ...(isArchived && { robots: { index: false, follow: true } }),
    openGraph: {
      type: 'article',
      url: `/blog/${slug}`,
      locale: OG_LOCALE,
      siteName: SITE_NAME,
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

  const authors = getAuthorsBySlugs(meta.authors);
  const { prevPost, nextPost } = getAdjacentPosts(slug);
  const tocItems = flattenToc(toc);

  const isArchived = meta.status === PostStatus.ARCHIVED;
  const editUrl = `${GITHUB_REPO}/edit/main/content/posts/${meta.folder}/index.mdx`;

  return (
    <main className='mx-auto max-w-3xl px-4 py-8 md:px-8'>
      <JsonLd data={buildPostJsonLd(meta, authors)} />
      <ReadingProgress />
      <BackToTop />

      <div className='mb-6 flex items-center justify-between gap-3'>
        <Breadcrumb aria-label='Trilha de navegação' className='min-w-0'>
          <BreadcrumbList className='flex-nowrap'>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/blog'>Blog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator>/</BreadcrumbSeparator>

            <BreadcrumbItem className='min-w-0'>
              <BreadcrumbPage className='truncate'>{meta.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className='flex shrink-0 items-center gap-2'>
          <ShareButton title={meta.title} url={`${BASE_URL}/blog/${slug}`} />
          <ThemeToggle />
        </div>
      </div>

      {isArchived && <ArchivedBanner />}

      {/* Anchors the sticky TOC, which sits outside the article column */}
      <div className='relative'>
        <article>
          <PostHeader post={meta} authors={authors} />

          {tocItems.length > 1 && <PostTocMobile items={tocItems} />}

          {/* Article Content */}
          <div className='prose max-w-none prose-zinc dark:prose-invert prose-headings:scroll-mt-24 prose-hr:my-8'>
            <Content />
          </div>

          <PostFooter slug={slug} editUrl={editUrl} isArchived={isArchived} />
        </article>

        {tocItems.length > 1 && <PostToc items={tocItems} />}
      </div>

      <PostSeriesBanner slug={meta.series} order={meta.order} />

      {!isArchived && (
        <>
          <RelatedPosts slug={slug} />
          <PostNavigation prevPost={prevPost} nextPost={nextPost} />
          <PostComments slug={slug} />
        </>
      )}
    </main>
  );
}
