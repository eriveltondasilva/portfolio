import { useEffect, useState } from 'react';

import type { TocItem } from '@/types';

/**
 * Slightly above the 96px of `prose-headings:scroll-mt-24`, so jumping to an
 * anchor activates its own item.
 */
const ACTIVE_OFFSET_PX = 100;

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

export function useActiveHeading(items: TocItem[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

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

  return activeId;
}
