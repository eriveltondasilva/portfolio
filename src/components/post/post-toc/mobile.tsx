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
    <details className='group mb-6 rounded-md border xl:hidden'>
      <summary className='flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-foreground select-none [&::-webkit-details-marker]:hidden'>
        <Icon iconNode={ListIcon} className='text-orange-500' />
        Neste post
        <Icon
          iconNode={ChevronDownIcon}
          className='ml-auto text-muted-foreground transition-transform group-open:rotate-180'
        />
      </summary>

      <ul className='space-y-0.5 border-t px-4 py-3'>
        {items.map(({ id, title, depth }) => (
          <li
            key={id}
            style={{ paddingLeft: `${(depth - baseDepth) * INDENT_REM}rem` }}
          >
            <a
              href={`#${id}`}
              className='block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground'
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
