import { useEffect, useRef, useState } from 'react';

import type { TocItem } from '@/types';

export interface Segment {
  top: number;
  bottom: number;
}

export interface RailGeometry {
  segments: Segment[];
  height: number;
}

export const ITEM_PADDING_Y_PX = 5;

export function useRailGeometry(items: TocItem[]) {
  const [geometry, setGeometry] = useState<RailGeometry | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

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

  return { listRef, geometry };
}
