import { ArrowRightIcon, CheckIcon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';

import { Icon } from '@/components/icon';
import { PostCard } from '@/components/cards/post-card';
import { SeriesCard } from '@/components/cards/series-card';
import { getRecentPosts } from '@/lib/blog/posts';
import { getInProgressSeries } from '@/lib/blog/series';
import { getPrimaryAuthor } from '@/lib/blog/authors';
import { JsonLd } from '@/components/json-ld';
import { buildHomeJsonLd } from '@/lib/blog/structured-data';

import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml' } },
};

function Code({ children }: { children: ReactNode }) {
  return (
    <code className='rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'>
      {children}
    </code>
  );
}

export default function HomePage() {
  const author = getPrimaryAuthor();
  const recentPosts = getRecentPosts();
  const inProgressSeries = getInProgressSeries();

  return (
    <div className='space-y-10'>
      <JsonLd data={buildHomeJsonLd(author)} />

      {/* Hero README block */}
      <section className='rounded-md border bg-muted/50 p-4 sm:p-6 dark:bg-zinc-800/20'>
        <div className='mb-3 flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground'>
          <span className='font-mono'>eriveltondasilva</span>
          <span aria-hidden='true'>/</span>
          <span className='font-mono font-semibold text-foreground/80'>
            README.md
          </span>
        </div>

        <div className='space-y-3'>
          <h1 className='flex items-start gap-2 text-lg leading-snug font-bold text-foreground sm:text-xl'>
            {/* mt-1 centers the 20px icon on the first 28px title line */}
            <Icon
              iconNode={SparklesIcon}
              className='mt-1 size-5 shrink-0 text-emerald-500'
            />
            <span className='min-w-0 text-balance'>
              Olá, mundo! Sou Erivelton
            </span>
          </h1>

          <p className='text-sm leading-relaxed text-muted-foreground'>
            Desenvolvedor Frontend focado em criar interfaces modernas com{' '}
            <Code>React</Code> e <Code>Next.js</Code>. Aqui compartilho o que
            aprendo sobre desenvolvimento web, boas práticas e tecnologias que
            uso no dia a dia.
          </p>

          <div className='flex items-start gap-1.5 font-mono text-xs text-muted-foreground'>
            <Icon iconNode={CheckIcon} className='shrink-0 text-emerald-500' />
            <span className='min-w-0'>
              Sempre aprendendo, sempre entregando
            </span>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section>
          <div className='mb-3 flex items-center justify-between'>
            <h2 className='text-xs font-semibold tracking-widest text-muted-foreground uppercase'>
              Posts recentes
            </h2>

            <Link
              href='/blog'
              className='flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400'
            >
              Ver todos
              <Icon iconNode={ArrowRightIcon} className='size-3.5' />
            </Link>
          </div>

          {/* Post list */}
          <div className='grid gap-3 sm:grid-cols-2'>
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} headingLevel='h3' />
            ))}
          </div>
        </section>
      )}

      {/* In Progress Series */}
      {inProgressSeries.length > 0 && (
        <section>
          <div className='mb-3 flex items-center justify-between'>
            <h2 className='text-xs font-semibold tracking-widest text-muted-foreground uppercase'>
              Séries em andamento
            </h2>

            <Link
              href='/series'
              className='flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400'
            >
              Ver todas
              <Icon iconNode={ArrowRightIcon} className='size-3.5' />
            </Link>
          </div>

          {/* Post list */}
          <div className='grid gap-3 sm:grid-cols-2'>
            {inProgressSeries.map((series) => (
              <SeriesCard key={series.slug} series={series} headingLevel='h3' />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
