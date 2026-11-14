import { useEffect, useState } from 'react';

import type { TocItem } from '@/types';

/**
 * Slightly above the 96px of `prose-headings:scroll-mt-24`, so jumping to an
 * anchor activates its own item.
 */
const ACTIVE_OFFSET_PX = 100;

export function useActiveHeading(items: TocItem[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const ids = items.map((item) => item.id);
    const passed = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, boundingClientRect } of entries) {
          if (boundingClientRect.top < ACTIVE_OFFSET_PX) passed.add(target.id);
          else passed.delete(target.id);
        }

        setActiveId(ids.findLast((id) => passed.has(id)) ?? null);
      },
      {
        rootMargin: `-${ACTIVE_OFFSET_PX}px 0px 0px 0px`,
        threshold: [0, 1],
      },
    );

    for (const id of ids) {
      const heading = document.getElementById(id);

      if (heading) observer.observe(heading);
    }

    return () => observer.disconnect();
  }, [items]);

  return activeId;
}
