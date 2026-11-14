import { DotIcon, FileTextIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from 'cn';

import { formatDate } from '@/lib/format';
import { Icon } from '@/components/icon';
import { TagLink } from '@/components/tag-link';
import { getPostDisplayDate } from '@/lib/blog/posts';

import { ContentCard } from './content-card';

import type { CardHeadingLevel } from './content-card';
import type { PostIndex } from '@/types';
import type { ComponentProps } from 'react';

interface Props extends ComponentProps<'article'> {
  post: PostIndex;
  headingLevel?: CardHeadingLevel;
}

export function PostCard({
  post,
  headingLevel: Heading = 'h2',
  className,
  ...props
}: Props) {
  const displayDate = getPostDisplayDate(post);

  return (
    <ContentCard className={cn('@container', className)} {...props}>
      {/* Tags */}
      {post.tags.length > 0 && (
        <div className='mb-2 flex flex-wrap gap-1.5'>
          {post.tags.map((tag) => (
            <TagLink key={tag} tag={tag} />
          ))}
        </div>
      )}

      {/* Header */}
      <div className='flex items-start gap-2 text-blue-500 dark:text-blue-400'>
        <Icon iconNode={FileTextIcon} className='mt-1 shrink-0' />

        <Heading className='min-w-0 font-semibold text-balance'>
          <Link href={`/blog/${post.slug}`} className='hover:underline'>
            {post.title}
          </Link>
        </Heading>
      </div>

      {/* Description */}
      <p className='mt-2 text-sm text-zinc-600 dark:text-zinc-400'>
        {post.description}
      </p>

      {/* Meta */}
      <div className='mt-2 flex flex-col gap-0.5 text-xs text-zinc-400 @sm:flex-row @sm:flex-wrap @sm:items-center dark:text-zinc-500'>
        <span>
          {post.updatedAt ? 'Atualizado em ' : 'Publicado em '}
          <time dateTime={displayDate}>
            {formatDate(displayDate, { dateStyle: 'long' })}
          </time>
        </span>

        <Icon iconNode={DotIcon} className='hidden @sm:block' />

        <span>{post.readingTime} min de leitura</span>
      </div>
    </ContentCard>
  );
}
