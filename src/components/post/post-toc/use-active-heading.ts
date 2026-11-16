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
    const headings = items.flatMap(
      ({ id }) => document.getElementById(id) ?? [],
    );

    // Document-relative positions: scrolling becomes plain arithmetic, with no layout reads.
    let headingOffsets: number[] = [];
    let frameId = 0;

    function measureHeadings() {
      const { scrollY } = window;

      headingOffsets = headings.map(
        (heading) => heading.getBoundingClientRect().top + scrollY,
      );
    }

    // ! Derived from the current scroll, not from observer deltas: IntersectionObserver
    // ! skips headings during jumps (anchor link, Home/End, scroll restoration).
    function updateActiveHeading() {
      frameId = 0;

      const index = headingOffsets.findLastIndex(
        (offset) => offset <= window.scrollY + ACTIVE_OFFSET_PX,
      );

      setActiveId(headings[index]?.id ?? null);
    }

    function scheduleUpdate() {
      if (frameId === 0) frameId = requestAnimationFrame(updateActiveHeading);
    }

    // Re-measures when the layout shifts (accordion/tabs, embeds, fonts, window width).
    // It fires once on observe, which also sets the initial state.
    const resizeObserver = new ResizeObserver(() => {
      measureHeadings();
      scheduleUpdate();
    });
    resizeObserver.observe(document.body);

    window.addEventListener('scroll', scheduleUpdate, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
    };
  }, [items]);

  return activeId;
}
