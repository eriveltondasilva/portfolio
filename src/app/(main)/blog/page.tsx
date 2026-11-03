import { FileXIcon, LayersIcon, RssIcon } from 'lucide-react';

import { Icon } from '@/components/icon';
import { PostCard } from '@/components/post-card';
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
    card: 'summary',
    title: meta.title,
    description: meta.description,
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const hasPosts = posts.length > 0;
  const postCount = posts.length;

  return (
    <div className='space-y-6'>
      {/* Header */}
      {hasPosts && (
        <div className='flex items-center justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400'>
          <span className='flex items-center gap-1.5'>
            <Icon iconNode={LayersIcon} className='size-3.5' />
            {postCount} {postCount > 1 ? 'posts publicados' : 'post publicado'}
          </span>

          <a
            href='/feed.xml'
            className='flex items-center gap-1.5 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100'
          >
            <Icon iconNode={RssIcon} className='size-3.5' />
            RSS
          </a>
        </div>
      )}

      {/* Posts list */}
      {hasPosts && (
        <div className='space-y-3'>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {!hasPosts && (
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
