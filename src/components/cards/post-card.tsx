import { DotIcon, FileTextIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from 'cn';

import { formatDate } from '@/lib/format';
import { Icon } from '@/components/icon';
import { TagLink } from '@/components/tag-link';
import { getPostDisplayDate } from '@/lib/blog';

import { ContentCard } from './content-card';

import type { CardHeadingLevel } from './content-card';
import type { PostIndex } from '@/types';
import type { ComponentProps } from 'react';

interface Props extends ComponentProps<'article'> {
  post: PostIndex;
  headingLevel?: CardHeadingLevel;
}

export function PostCard({ post, headingLevel: Heading = 'h2', className, ...props }: Props) {
  const displayDate = getPostDisplayDate(post);

  return (
    <ContentCard className={cn('@container', className)} {...props}>
      {/* Tags */}
      <ul aria-label='Tags' className='mb-2 flex flex-wrap gap-2'>
        {post.tags.map((tag) => (
          <li key={tag}>
            <TagLink tag={tag} />
          </li>
        ))}
      </ul>

      {/* Header */}
      <div className='flex items-start gap-2 text-blue-600 dark:text-blue-400'>
        <Icon iconNode={FileTextIcon} className='mt-1 shrink-0' />

        <Heading className='min-w-0 font-semibold wrap-break-word'>
          <Link
            href={`/blog/${post.slug}`}
            className='hover:underline hover:decoration-dashed hover:decoration-2 hover:underline-offset-2'
          >
            {post.title}
          </Link>
        </Heading>
      </div>

      {/* Description */}
      <p className='mt-2 text-sm text-muted-foreground'>{post.description}</p>

      {/* Meta */}
      <ul className='mt-2 flex flex-col gap-0.5 text-xs text-muted-foreground @sm:flex-row @sm:flex-wrap @sm:items-center'>
        <li>
          {post.updatedAt ? 'Atualizado em ' : 'Publicado em '}
          <time dateTime={displayDate}>{formatDate(displayDate, { dateStyle: 'long' })}</time>
        </li>

        <li className='flex items-center'>
          <Icon iconNode={DotIcon} className='hidden @sm:block' />
          <span>{post.readingTime} min de leitura</span>
        </li>
      </ul>
    </ContentCard>
  );
}
