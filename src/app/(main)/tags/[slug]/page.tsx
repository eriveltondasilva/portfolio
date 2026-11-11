import { ArrowLeftIcon, HashIcon, LayersIcon } from 'lucide-react';
import Link from 'next/link';

import { Icon } from '@/components/icon';
import { PostCard } from '@/components/cards/post-card';
import { getPostsByTag } from '@/lib/blog/posts';
import { getAllTags } from '@/lib/blog/tags';
import { OG_LOCALE, SITE_NAME, TWITTER_HANDLE } from '@/lib/constants';

import type { Metadata } from 'next';

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<'/tags/[slug]'>): Promise<Metadata> {
  const { slug } = await params;

  const meta = {
    title: `#${slug}`,
    description: `Posts sobre ${slug}.`,
  };

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/tags/${slug}` },
    openGraph: {
      type: 'website',
      url: `/tags/${slug}`,
      locale: OG_LOCALE,
      siteName: SITE_NAME,
      title: meta.title,
      description: meta.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
  };
}

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ slug: tag }));
}

export default async function TagPage({ params }: PageProps<'/tags/[slug]'>) {
  const { slug } = await params;

  const posts = getPostsByTag(slug);
  const postCount = posts.length;

  return (
    <div className='space-y-6'>
      {/* Back link */}
      <Link
        href='/tags'
        className='inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
      >
        <Icon iconNode={ArrowLeftIcon} />
        Todas as tags
      </Link>

      {/* Header */}
      <header className='space-y-2'>
        <h1 className='flex items-start gap-2 text-xl font-bold text-zinc-900 dark:text-zinc-50'>
          <Icon
            iconNode={HashIcon}
            className='mt-1 size-5 shrink-0 text-zinc-400'
          />
          <span className='min-w-0 wrap-break-word'>{slug}</span>
        </h1>

        <p className='flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400'>
          <Icon iconNode={LayersIcon} className='size-3.5' />
          {postCount} {postCount === 1 ? 'post' : 'posts'}
        </p>
      </header>

      {/* Posts list */}
      <div className='space-y-3'>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
