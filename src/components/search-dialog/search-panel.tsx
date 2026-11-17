import { SearchIcon, XIcon } from 'lucide-react';

import { Icon } from '@/components/icon';
import { DialogClose } from '@/components/ui/dialog';

import { SearchResult } from './search-result';
import { getOptionId, useSearchPanel } from './use-search-panel';

import type { default as Fuse } from 'fuse.js';
import type { SearchEntry } from '@/types';

const LISTBOX_ID = 'search-results';

function formatResultCount(shown: number, total: number): string {
  if (total > shown) return `${shown} de ${total}`;

  return `${total} ${total === 1 ? 'resultado' : 'resultados'}`;
}

function KeyHint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className='flex items-center gap-1.5'>
      <kbd className='rounded-sm border bg-muted px-1.5 py-0.5 font-mono text-2xs text-muted-foreground'>
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
  const {
    query,
    results,
    totalResults,
    activeIndex,
    message,
    setActiveIndex,
    handleQueryChange,
    handleKeyDown,
  } = useSearchPanel({ fuse, loadFailed, onNavigate });

  const hasResults = results.length > 0;

  return (
    <>
      <div className='relative'>
        <Icon
          iconNode={SearchIcon}
          aria-hidden='true'
          className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground'
        />

        <input
          className='w-full border-b bg-transparent py-4 pr-12 pl-11 text-base outline-hidden placeholder:text-muted-foreground focus-visible:border-orange-500 md:text-sm dark:focus-visible:border-orange-400 [&::-webkit-search-cancel-button]:appearance-none'
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

        <DialogClose
          aria-label='Fechar busca'
          className='absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
        >
          <Icon iconNode={XIcon} />
        </DialogClose>
      </div>

      <div
        role='status'
        className={
          hasResults ?
            'flex items-center justify-between px-4 pt-3 text-xs'
          : 'sr-only'
        }
      >
        {hasResults && (
          <>
            <span className='font-semibold tracking-widest uppercase'>
              Posts
            </span>
            <span className='tabular-nums'>
              {formatResultCount(results.length, totalResults)}
            </span>
          </>
        )}
      </div>

      <div className='max-h-80 min-h-48 scroll-py-2 overflow-y-auto p-2'>
        {/* Always mounted so screen readers announce the message when it appears */}
        <p
          role='status'
          className={message ? 'px-3 py-6 text-center text-sm' : 'sr-only'}
        >
          {message}
        </p>

        {!message && (
          <ul
            id={LISTBOX_ID}
            role='listbox'
            aria-label='Resultados da busca'
            className='divide-y divide-border'
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
        )}
      </div>

      {hasResults && (
        <div
          aria-hidden='true'
          className='flex items-center gap-4 border-t px-4 py-2 text-xs text-muted-foreground pointer-coarse:hidden'
        >
          <KeyHint keys='↑↓' label='navegar' />
          <KeyHint keys='↵' label='abrir' />
          <KeyHint keys='Esc' label='fechar' />
        </div>
      )}
    </>
  );
}
