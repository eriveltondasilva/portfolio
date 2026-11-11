import { FileXIcon, LayersIcon, RssIcon } from 'lucide-react';

import { Icon } from '@/components/icon';
import { PostCard } from '@/components/cards/post-card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { getAllPosts } from '@/lib/blog/posts';
import { OG_LOCALE, SITE_NAME, TWITTER_HANDLE } from '@/lib/constants';

import type { Metadata } from 'next';

const meta = {
  title: 'Blog',
  description: 'Todos os posts sobre desenvolvimento frontend.',
};

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: {
    canonical: '/blog',
    types: { 'application/rss+xml': '/feed.xml' },
  },
  openGraph: {
    type: 'website',
    url: '/blog',
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

export default function BlogPage() {
  const posts = getAllPosts();
  const postCount = posts.length;

  return (
    <div className='space-y-6'>
      {/* Page title */}
      <h1 className='sr-only'>Blog</h1>

      {/* Header */}
      <div className='flex items-center justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400'>
        <span className='flex items-center gap-1.5'>
          <Icon iconNode={LayersIcon} className='size-3.5' />
          {postCount} {postCount === 1 ? 'post publicado' : 'posts publicados'}
        </span>

        <a
          href='/feed.xml'
          className='flex items-center gap-1.5 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100'
        >
          <Icon iconNode={RssIcon} className='size-3.5' />
          RSS
        </a>
      </div>

      {/* Posts list */}
      <div className='space-y-6'>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {postCount === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <FileXIcon />
            </EmptyMedia>

            <EmptyTitle>Nenhum post publicado</EmptyTitle>

            <EmptyDescription>
              Os artigos aparecerão aqui assim que forem publicados.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
