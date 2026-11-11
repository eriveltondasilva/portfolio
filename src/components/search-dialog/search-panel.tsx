import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Icon } from '@/components/icon';

import { SearchResult } from './search-result';

import type { default as Fuse } from 'fuse.js';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { SearchEntry } from '@/types';

const MAX_RESULTS = 8;
const LISTBOX_ID = 'search-results';

const getOptionId = (index: number) => `search-result-${index}`;

function formatResultCount(shown: number, total: number): string {
  if (total > shown) return `${shown} de ${total}`;

  return `${total} ${total === 1 ? 'resultado' : 'resultados'}`;
}

function KeyHint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className='flex items-center gap-1.5'>
      <kbd className='rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'>
        {keys}
      </kbd>
      {label}
    </span>
  );
}

interface Props {
  fuse: Fuse<SearchEntry> | null;
  loadFailed: boolean;
  onNavigate: () => void;
}

export function SearchPanel({ fuse, loadFailed, onNavigate }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const trimmedQuery = query.trim();
  const allResults = fuse && trimmedQuery ? fuse.search(trimmedQuery) : [];
  const results = allResults.slice(0, MAX_RESULTS);
  const hasResults = results.length > 0;

  let message: string | null = null;

  if (!fuse) {
    message =
      loadFailed ?
        'Não foi possível carregar a busca. Feche e tente novamente.'
      : 'Carregando…';
  } else if (!trimmedQuery) {
    message = 'Digite para buscar nos posts.';
  } else if (!hasResults) {
    message = `Nenhum post encontrado para “${trimmedQuery}”.`;
  }

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setActiveIndex(0);
  }

  function moveActiveIndex(step: 1 | -1) {
    const nextIndex = (activeIndex + step + results.length) % results.length;

    setActiveIndex(nextIndex);
    document
      .getElementById(getOptionId(nextIndex))
      ?.scrollIntoView({ block: 'nearest' });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!hasResults) return;

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

  return (
    <>
      <div className='relative'>
        <Icon
          iconNode={SearchIcon}
          aria-hidden='true'
          className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-400'
        />

        <input
          className='w-full border-b border-zinc-200 bg-transparent py-4 pr-12 pl-11 text-sm outline-none placeholder:text-zinc-400 dark:border-zinc-700/60 [&::-webkit-search-cancel-button]:appearance-none'
          type='search'
          role='combobox'
          aria-expanded={hasResults}
          aria-controls={hasResults ? LISTBOX_ID : undefined}
          aria-activedescendant={
            hasResults ? getOptionId(activeIndex) : undefined
          }
          aria-autocomplete='list'
          aria-label='Buscar posts'
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          placeholder='Buscar posts...'
          autoComplete='off'
          spellCheck={false}
        />
      </div>

      <div
        role='status'
        className={
          hasResults ?
            'flex items-center justify-between px-4 pt-3 text-xs text-zinc-400 dark:text-zinc-500'
          : 'sr-only'
        }
      >
        {hasResults && (
          <>
            <span className='font-semibold tracking-widest uppercase'>
              Posts
            </span>
            <span className='tabular-nums'>
              {formatResultCount(results.length, allResults.length)}
            </span>
          </>
        )}
      </div>

      <div className='max-h-80 min-h-48 overflow-y-auto p-2'>
        {message ?
          <p
            role='status'
            className='px-3 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400'
          >
            {message}
          </p>
        : <ul
            id={LISTBOX_ID}
            role='listbox'
            aria-label='Resultados da busca'
            className='divide-y divide-zinc-100 dark:divide-zinc-800'
          >
            {results.map((result, index) => (
              <SearchResult
                key={result.item.slug}
                result={result}
                id={getOptionId(index)}
                isActive={index === activeIndex}
                onNavigate={onNavigate}
                onHover={() => setActiveIndex(index)}
              />
            ))}
          </ul>
        }
      </div>

      {hasResults && (
        <div
          aria-hidden='true'
          className='flex items-center gap-4 border-t border-zinc-200 px-4 py-2 text-xs text-zinc-400 dark:border-zinc-700/60 dark:text-zinc-500 pointer-coarse:hidden'
        >
          <KeyHint keys='↑↓' label='navegar' />
          <KeyHint keys='↵' label='abrir' />
          <KeyHint keys='Esc' label='fechar' />
        </div>
      )}
    </>
  );
}
