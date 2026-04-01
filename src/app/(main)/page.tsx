import {
  ArrowRightIcon,
  BookMarkedIcon,
  BookOpenIcon,
  SparklesIcon,
} from 'lucide-react'
import Link from 'next/link'

import { Icon } from '#/components/icon'
import { PostCard } from '#/components/post-card'
import { SeriesCard } from '#/components/series-card'
import { getRecentPosts } from '#/lib/blog/posts'
import { getRecentSeries } from '#/lib/blog/series'

export default function HomePage() {
  const recentPosts = getRecentPosts()
  const recentSeries = getRecentSeries()

  return (
    <div className='space-y-10'>
      {/* Hero README block */}
      <section className='rounded-md border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-700/60 dark:bg-zinc-800/20'>
        <div className='mb-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500'>
          <span className='font-mono'>eriveltondasilva</span>
          <span>/</span>
          <span className='font-mono font-semibold text-zinc-700 dark:text-zinc-300'>
            README.md
          </span>
        </div>
        <div className='space-y-3'>
          <h2 className='flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-50'>
            <Icon iconNode={SparklesIcon} className='h-5 w-5 text-orange-500' />
            Olá, mundo! Sou o Erivelton 👋
          </h2>
          <p className='text-sm leading-relaxed text-zinc-600 dark:text-zinc-400'>
            Desenvolvedor Frontend focado em criar interfaces modernas com{' '}
            <code className='rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'>
              React
            </code>{' '}
            e{' '}
            <code className='rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'>
              Next.js
            </code>
            . Aqui compartilho o que aprendo sobre desenvolvimento web, boas
            práticas e tecnologias que uso no dia a dia.
          </p>
          <div className='font-mono text-xs text-zinc-500 dark:text-zinc-500'>
            <span className='text-green-600 dark:text-green-400'>✓</span> Sempre
            aprendendo, sempre entregando
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50'>
              <Icon iconNode={BookOpenIcon} className='text-blue-500' />
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
          <div className='grid gap-3 sm:grid-cols-2'>
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Active Series */}
      {recentSeries.length > 0 && (
        <section>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50'>
              <Icon iconNode={BookMarkedIcon} className='text-orange-500' />
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
          <div className='grid gap-3 sm:grid-cols-2'>
            {recentSeries.map((series) => (
              <SeriesCard key={series.slug} series={series} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
