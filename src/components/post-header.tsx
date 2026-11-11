import { DotIcon } from 'lucide-react';

import { PostAuthors } from '@/components/post-authors';
import { PostCover } from '@/components/post-cover';
import { Separator } from '@/components/separator';
import { ShareButton } from '@/components/share-button';
import { TagLink } from '@/components/tag-link';
import { BASE_URL } from '@/lib/base-url';
import { formatDate } from '@/lib/format';
import { Icon } from '@/components/icon';

import type { Author, PostIndex } from '@/types';

interface Props {
  post: PostIndex;
  authors: Author[];
}

export function PostHeader({ post, authors }: Props) {
  const { slug, title, tags, publishedAt, updatedAt, readingTime } = post;

  return (
    <header>
      {tags.length > 0 && (
        <div className='flex flex-wrap gap-1.5'>
          {tags.map((tag) => (
            <TagLink key={tag} tag={tag} />
          ))}
        </div>
      )}

      <div className='mt-1 grid grid-cols-[1fr_auto] items-start gap-x-3'>
        <h1 className='col-span-2 min-w-0 font-mono text-2xl leading-tight font-bold tracking-tight text-balance wrap-break-word text-zinc-900 sm:col-span-1 sm:text-3xl md:text-4xl dark:text-zinc-50'>
          {title}
        </h1>

        <div className='mt-2 min-w-0 space-y-1 text-sm text-zinc-500 sm:col-span-2 sm:row-start-2 dark:text-zinc-400'>
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

        <div className='mt-3 sm:col-start-2 sm:row-start-1 sm:mt-0'>
          <ShareButton title={title} url={`${BASE_URL}/blog/${slug}`} />
        </div>
      </div>

      {post.coverFile && (
        <PostCover folder={post.folder} coverFile={post.coverFile} />
      )}

      <Separator />
    </header>
  );
}
