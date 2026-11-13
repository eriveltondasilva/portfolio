import { ChevronDownIcon, ListIcon } from 'lucide-react';

import { Icon } from '@/components/icon';

import type { TocItem } from '@/types';

interface Props {
  items: TocItem[];
}

const INDENT_REM = 0.75;

export function PostTocMobile({ items }: Props) {
  const baseDepth = Math.min(...items.map((item) => item.depth));

  return (
    <details className='group mb-6 rounded-md border border-zinc-200 xl:hidden dark:border-zinc-700/60'>
      <summary className='flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-zinc-900 select-none dark:text-zinc-50 [&::-webkit-details-marker]:hidden'>
        <Icon iconNode={ListIcon} className='text-orange-500' />
        Neste post
        <Icon
          iconNode={ChevronDownIcon}
          className='ml-auto text-zinc-400 transition-transform group-open:rotate-180'
        />
      </summary>

      <ul className='space-y-0.5 border-t border-zinc-100 px-4 py-3 dark:border-zinc-700/60'>
        {items.map(({ id, title, depth }) => (
          <li
            key={id}
            style={{ paddingLeft: `${(depth - baseDepth) * INDENT_REM}rem` }}
          >
            <a
              href={`#${id}`}
              className='block py-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
