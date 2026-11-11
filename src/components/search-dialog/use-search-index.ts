import { useEffect, useState } from 'react';

import type { default as Fuse, IFuseOptions } from 'fuse.js';
import type { SearchEntry } from '@/types';

const FUSE_OPTIONS: IFuseOptions<SearchEntry> = {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'tags', weight: 2 },
    { name: 'description', weight: 1 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
  ignoreDiacritics: true,
  includeMatches: true,
  minMatchCharLength: 2,
};

async function fetchSearchIndex(): Promise<Fuse<SearchEntry>> {
  const [{ default: FuseClass }, response] = await Promise.all([
    import('fuse.js'),
    fetch('/api/search'),
  ]);

  if (!response.ok) throw new Error(`status-${response.status}`);

  const entries: SearchEntry[] = await response.json();

  return new FuseClass(entries, FUSE_OPTIONS);
}

let searchIndexPromise: Promise<Fuse<SearchEntry>> | null = null;

function loadSearchIndex(): Promise<Fuse<SearchEntry>> {
  searchIndexPromise ??= fetchSearchIndex().catch((error: unknown) => {
    searchIndexPromise = null;
    throw error;
  });

  return searchIndexPromise;
}

export function preloadSearchIndex() {
  void loadSearchIndex().catch(() => undefined);
}

export function useSearchIndex(isOpen: boolean) {
  const [fuse, setFuse] = useState<Fuse<SearchEntry> | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!isOpen || fuse) return;

    let isCurrent = true;

    loadSearchIndex().then(setFuse, (error: unknown) => {
      if (!isCurrent) return;

      console.error('[SearchDialog] Failed to load the search index:', error);
      setLoadFailed(true);
    });

    return () => {
      isCurrent = false;
      setLoadFailed(false);
    };
  }, [isOpen, fuse]);

  return { fuse, loadFailed };
}
