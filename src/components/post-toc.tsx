'use client';

import { ListIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from 'cn';

import { Icon } from '@/components/icon';

import type { TocItem } from '@/types';

interface Props {
  items: TocItem[];
}

interface Segment {
  top: number;
  bottom: number;
}

interface RailGeometry {
  segments: Segment[];
  height: number;
}

interface RailProps {
  levels: number[];
  geometry: RailGeometry;
  activeIndex: number;
}

const ACTIVE_OFFSET_PX = 100;

const TRACK_STROKE_PX = 1;
const THUMB_STROKE_PX = 2;
const INDENT_PX = 12;
const TEXT_GAP_PX = 14;
const ITEM_PADDING_Y_PX = 5;

function getRailX(level: number): number {
  return THUMB_STROKE_PX / 2 + level * INDENT_PX;
}

function getActiveId(ids: string[]): string | null {
  const isAtBottom =
    window.scrollY > 0 &&
    window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;

  if (isAtBottom) return ids.at(-1) ?? null;

  let activeId: string | null = null;

  for (const id of ids) {
    const heading = document.getElementById(id);

    if (!heading) continue;
    if (heading.getBoundingClientRect().top > ACTIVE_OFFSET_PX) break;

    activeId = id;
  }

  return activeId;
}

function getRailPath(levels: number[], segments: Segment[]): string {
  let path = '';
  let previousX = 0;
  let previousBottom = 0;

  segments.forEach(({ top, bottom }, index) => {
    const x = getRailX(levels[index] ?? 0);

    if (index === 0) {
      path += `M${x} ${top}`;
    } else {
      const middle = (previousBottom + top) / 2;
      path += ` C${previousX} ${middle} ${x} ${middle} ${x} ${top}`;
    }

    path += ` L${x} ${bottom}`;
    previousX = x;
    previousBottom = bottom;
  });

  return path;
}

function TocRail({ levels, geometry, activeIndex }: RailProps) {
  const { segments, height } = geometry;

  const path = getRailPath(levels, segments);
  const width = getRailX(Math.max(...levels)) + THUMB_STROKE_PX / 2;

  const firstTop = segments[0]?.top ?? 0;
  const thumb = segments[activeIndex] ?? { top: firstTop, bottom: firstTop };
  const clipPath = `inset(${thumb.top}px 0 ${height - thumb.bottom}px 0)`;

  return (
    <>
      <svg
        aria-hidden='true'
        width={width}
        height={height}
        className='pointer-events-none absolute top-0 left-0 fill-none stroke-zinc-200 dark:stroke-zinc-700/60'
      >
        <path d={path} strokeWidth={TRACK_STROKE_PX} />
      </svg>

      {/* Same path in the accent color, revealed only over the active item */}
      <svg
        aria-hidden='true'
        width={width}
        height={height}
        style={{ clipPath }}
        className='pointer-events-none absolute top-0 left-0 fill-none stroke-orange-500 transition-[clip-path] duration-300 ease-out motion-reduce:transition-none dark:stroke-orange-400'
      >
        <path d={path} strokeWidth={THUMB_STROKE_PX} />
      </svg>
    </>
  );
}

export function PostToc({ items }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [geometry, setGeometry] = useState<RailGeometry | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const baseDepth = Math.min(...items.map((item) => item.depth));
  const levels = items.map((item) => item.depth - baseDepth);
  const activeIndex = items.findIndex((item) => item.id === activeId);

  useEffect(() => {
    const ids = items.map((item) => item.id);
    let frame = 0;

    function update() {
      frame = 0;
      setActiveId(getActiveId(ids));
    }

    function scheduleUpdate() {
      if (frame) return;
      frame = requestAnimationFrame(update);
    }

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [items]);

  useEffect(() => {
    const list = listRef.current;

    if (!list) return;

    const observer = new ResizeObserver(() => {
      const segments = Array.from(
        list.querySelectorAll('li'),
        ({ offsetTop, offsetHeight }) => ({
          top: offsetTop + ITEM_PADDING_Y_PX,
          bottom: offsetTop + offsetHeight - ITEM_PADDING_Y_PX,
        }),
      );

      setGeometry({ segments, height: list.offsetHeight });
    });

    observer.observe(list);

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className='absolute inset-y-0 left-full hidden w-60 pl-8 xl:block'>
      <nav
        aria-labelledby='post-toc-title'
        className='sticky top-8 max-h-[calc(100dvh-4rem)] overflow-y-auto'
      >
        <h2
          id='post-toc-title'
          className='mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50'
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
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
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
