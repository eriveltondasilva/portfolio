'use client';

import { ListIcon } from 'lucide-react';
import { cn } from 'cn';

import { Icon } from '@/components/icon';

import { TocRail, getRailX } from './toc-rail';
import { useActiveHeading } from './use-active-heading';
import { ITEM_PADDING_Y_PX, useRailGeometry } from './use-rail-geometry';

import type { TocItem } from '@/types';

interface Props {
  items: TocItem[];
}

const TEXT_GAP_PX = 14;

export function PostToc({ items }: Props) {
  const activeId = useActiveHeading(items);
  const { listRef, geometry } = useRailGeometry(items);

  const baseDepth = Math.min(...items.map((item) => item.depth));
  const levels = items.map((item) => item.depth - baseDepth);
  const activeIndex = items.findIndex((item) => item.id === activeId);

  return (
    <aside className='absolute inset-y-0 left-full hidden w-60 pl-8 xl:block'>
      <nav
        aria-labelledby='post-toc-title'
        className='sticky top-8 max-h-[calc(100dvh-4rem)] overflow-y-auto'
      >
        <h2
          id='post-toc-title'
          className='mb-3 flex items-center gap-2 text-sm font-semibold text-foreground'
        >
          <Icon iconNode={ListIcon} className='text-orange-500' />
          Neste post
        </h2>

        <div className='relative'>
          {geometry && (
            <TocRail
              levels={levels}
              geometry={geometry}
              activeIndex={activeIndex}
            />
          )}

          <ul ref={listRef}>
            {items.map(({ id, title }, index) => {
              const isActive = id === activeId;

              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? 'location' : undefined}
                    style={{
                      paddingBlock: ITEM_PADDING_Y_PX,
                      paddingLeft: getRailX(levels[index] ?? 0) + TEXT_GAP_PX,
                    }}
                    className={cn(
                      'block text-sm leading-snug transition-colors',
                      isActive ?
                        'text-orange-600 dark:text-orange-400'
                      : 'text-zinc-500 hover:text-foreground dark:text-zinc-400',
                    )}
                  >
                    {title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
