import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { default as Fuse } from 'fuse.js';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { SearchEntry } from '@/types';

const MAX_RESULTS = 8;

export const getOptionId = (index: number) => `search-result-${index}`;

interface Options {
  fuse: Fuse<SearchEntry> | null;
  loadFailed: boolean;
  onNavigate: () => void;
}

export function useSearchPanel({ fuse, loadFailed, onNavigate }: Options) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const trimmedQuery = query.trim();
  const allResults = fuse && trimmedQuery ? fuse.search(trimmedQuery) : [];
  const results = allResults.slice(0, MAX_RESULTS);

  let message: string | null = null;

  if (!fuse) {
    message =
      loadFailed ? 'Não foi possível carregar a busca. Feche e tente novamente.' : 'Carregando…';
  } else if (!trimmedQuery) {
    message = 'Digite para buscar nos posts.';
  } else if (results.length === 0) {
    message = `Nenhum post encontrado para “${trimmedQuery}”.`;
  }

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setActiveIndex(0);
  }

  function moveActiveIndex(step: 1 | -1) {
    const nextIndex = (activeIndex + step + results.length) % results.length;

    setActiveIndex(nextIndex);
    document.getElementById(getOptionId(nextIndex))?.scrollIntoView({ block: 'nearest' });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveActiveIndex(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    if (event.key === 'Enter') {
      const activeResult = results[activeIndex];

      if (!activeResult) return;

      router.push(`/blog/${activeResult.item.slug}`);
      onNavigate();
    }
  }

  return {
    query,
    results,
    totalResults: allResults.length,
    activeIndex,
    message,
    setActiveIndex,
    handleQueryChange,
    handleKeyDown,
  };
}
