import { cn } from 'cn';
import { HashIcon } from 'lucide-react';
import Link from 'next/link';

import { Icon } from '@/components/icon';

import type { FuseResult } from 'fuse.js';
import type { SearchEntry } from '@/types';

const MAX_VISIBLE_TAGS = 4;

function getMatchedTagIndexes(result: FuseResult<SearchEntry>): Set<number> {
  return new Set(
    result.matches?.flatMap(({ key, refIndex }) =>
      key === 'tags' && refIndex !== undefined ? [refIndex] : [],
    ),
  );
}

function ResultTags({
  tags,
  matchedIndexes,
}: {
  tags: readonly string[];
  matchedIndexes: ReadonlySet<number>;
}) {
  if (tags.length === 0) return null;

  const orderedTags = tags
    .map((tag, index) => ({ tag, isMatch: matchedIndexes.has(index) }))
    .toSorted((a, b) => Number(b.isMatch) - Number(a.isMatch));
  const visibleTags = orderedTags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCount = orderedTags.length - visibleTags.length;

  return (
    <span className='mt-1.5 flex flex-wrap gap-1'>
      {visibleTags.map(({ tag, isMatch }) => (
        <span
          key={tag}
          className={cn(
            'inline-flex items-center rounded-full px-2 py-0.5 text-xs',
            isMatch ?
              'bg-blue-50 font-medium text-blue-700 group-aria-selected:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:group-aria-selected:bg-blue-900/50'
            : 'bg-zinc-100 text-muted-foreground group-aria-selected:bg-zinc-200 dark:bg-zinc-800 dark:group-aria-selected:bg-zinc-700',
          )}
        >
          <Icon iconNode={HashIcon} className='size-3' />
          {tag}
        </span>
      ))}

      {hiddenCount > 0 && (
        <span className='inline-flex items-center px-1 py-0.5 text-xs text-muted-foreground'>
          +{hiddenCount}
        </span>
      )}
    </span>
  );
}

interface Props {
  result: FuseResult<SearchEntry>;
  id: string;
  isActive: boolean;
  onNavigate: () => void;
  onHover: () => void;
}

export function SearchResult({
  result,
  id,
  isActive,
  onNavigate,
  onHover,
}: Props) {
  const { item } = result;

  return (
    <li role='presentation'>
      <Link
        id={id}
        role='option'
        aria-selected={isActive}
        tabIndex={-1}
        prefetch={false}
        href={`/blog/${item.slug}`}
        onClick={onNavigate}
        onMouseMove={onHover}
        className='group block rounded-md px-3 py-2.5 transition-colors aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800'
      >
        <span className='block truncate text-sm font-medium text-foreground'>
          {item.title}
        </span>
        <span className='mt-0.5 line-clamp-1 block text-xs text-muted-foreground'>
          {item.description}
        </span>

        <ResultTags
          tags={item.tags}
          matchedIndexes={getMatchedTagIndexes(result)}
        />
      </Link>
    </li>
  );
}
