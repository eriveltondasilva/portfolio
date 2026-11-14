import { DotIcon } from 'lucide-react';

import { Icon } from '@/components/icon';
import { SectionSeparator } from '@/components/section-separator';
import { TagLink } from '@/components/tag-link';
import { formatDate } from '@/lib/format';

import { PostAuthors } from './post-authors';
import { PostCover } from './post-cover';

import type { Author, PostIndex } from '@/types';

interface Props {
  post: PostIndex;
  authors: Author[];
}

export function PostHeader({ post, authors }: Props) {
  const { title, tags, publishedAt, updatedAt, readingTime } = post;

  return (
    <header>
      <div className='flex flex-wrap gap-1.5'>
        {tags.map((tag) => (
          <TagLink key={tag} tag={tag} />
        ))}
      </div>

      <h1 className='mt-1 font-mono text-2xl leading-tight font-bold tracking-tight text-pretty wrap-break-word text-foreground sm:text-3xl md:text-4xl'>
        {title}
      </h1>

      <div className='mt-2 space-y-1 text-sm text-muted-foreground'>
        <ul className='flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-center'>
          <li>
            Publicado em{' '}
            <time dateTime={publishedAt}>
              {formatDate(publishedAt, { dateStyle: 'long' })}
            </time>
          </li>

          {updatedAt && (
            <li className='flex items-center'>
              <Icon iconNode={DotIcon} className='hidden sm:block' />
              <span>
                Atualizado em{' '}
                <time dateTime={updatedAt}>
                  {formatDate(updatedAt, { dateStyle: 'long' })}
                </time>
              </span>
            </li>
          )}

          <li className='flex items-center'>
            <Icon iconNode={DotIcon} className='hidden sm:block' />
            <span>{readingTime} min de leitura</span>
          </li>
        </ul>

        {authors.length > 0 && (
          <p>
            Por <PostAuthors authors={authors} />
          </p>
        )}
      </div>

      {post.coverFile && (
        <PostCover folder={post.folder} coverFile={post.coverFile} />
      )}

      <SectionSeparator className='my-10' />
    </header>
  );
}
