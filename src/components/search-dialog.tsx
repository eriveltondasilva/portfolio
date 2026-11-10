'use client';

import { HashIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';

import { Icon } from '@/components/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import type { default as Fuse, FuseResult, IFuseOptions } from 'fuse.js';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { SearchEntry } from '@/types';

const MAX_RESULTS = 8;
const MAX_VISIBLE_TAGS = 4;
const LISTBOX_ID = 'search-results';

const getOptionId = (index: number) => `search-result-${index}`;

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

const subscribeNothing = () => () => {};
const getIsMac = () => /Mac/.test(navigator.userAgent);
const getServerIsMac = () => false;

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

function preloadSearchIndex() {
  void loadSearchIndex().catch(() => undefined);
}

function useSearchIndex(isOpen: boolean) {
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

function getMatchedTagIndexes(result: FuseResult<SearchEntry>): Set<number> {
  return new Set(
    result.matches?.flatMap(({ key, refIndex }) =>
      key === 'tags' && refIndex !== undefined ? [refIndex] : [],
    ),
  );
}

function formatResultCount(shown: number, total: number): string {
  if (total > shown) return `${shown} de ${total}`;

  return `${total} ${total === 1 ? 'resultado' : 'resultados'}`;
}

function ResultTags({
  tags,
  matchedIndexes,
}: {
  tags: readonly string[];
  matchedIndexes: ReadonlySet<number>;
}) {
  if (tags.length === 0) return null;

  const orderedTags = tags
    .map((tag, index) => ({ tag, isMatch: matchedIndexes.has(index) }))
    .toSorted((a, b) => Number(b.isMatch) - Number(a.isMatch));
  const visibleTags = orderedTags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCount = orderedTags.length - visibleTags.length;

  return (
    <span className='mt-1.5 flex flex-wrap gap-1'>
      {visibleTags.map(({ tag, isMatch }) => (
        <span
          key={tag}
          className={cn(
            'inline-flex items-center rounded-full px-2 py-0.5 text-xs',
            isMatch ?
              'bg-blue-50 font-medium text-blue-700 group-aria-selected:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:group-aria-selected:bg-blue-900/50'
            : 'bg-zinc-100 text-zinc-600 group-aria-selected:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:group-aria-selected:bg-zinc-700',
          )}
        >
          <Icon iconNode={HashIcon} className='size-3' />
          {tag}
        </span>
      ))}

      {hiddenCount > 0 && (
        <span className='inline-flex items-center px-1 py-0.5 text-xs text-zinc-400 dark:text-zinc-500'>
          +{hiddenCount}
        </span>
      )}
    </span>
  );
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

interface PanelProps {
  fuse: Fuse<SearchEntry> | null;
  loadFailed: boolean;
  onNavigate: () => void;
}

function SearchPanel({ fuse, loadFailed, onNavigate }: PanelProps) {
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
            {results.map((result, index) => {
              const { item } = result;

              return (
                <li key={item.slug} role='presentation'>
                  <Link
                    id={getOptionId(index)}
                    role='option'
                    aria-selected={index === activeIndex}
                    tabIndex={-1}
                    prefetch={false}
                    href={`/blog/${item.slug}`}
                    onClick={onNavigate}
                    onMouseMove={() => setActiveIndex(index)}
                    className='group block rounded-md px-3 py-2.5 transition-colors aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800'
                  >
                    <span className='block truncate text-sm font-medium text-zinc-900 dark:text-zinc-50'>
                      {item.title}
                    </span>
                    <span className='mt-0.5 line-clamp-1 block text-xs text-zinc-500 dark:text-zinc-400'>
                      {item.description}
                    </span>

                    <ResultTags
                      tags={item.tags}
                      matchedIndexes={getMatchedTagIndexes(result)}
                    />
                  </Link>
                </li>
              );
            })}
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

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { fuse, loadFailed } = useSearchIndex(isOpen);
  const isMac = useSyncExternalStore(
    subscribeNothing,
    getIsMac,
    getServerIsMac,
  );

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey))
        return;

      event.preventDefault();
      setIsOpen((current) => !current);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        onPointerEnter={preloadSearchIndex}
        onFocus={preloadSearchIndex}
        aria-keyshortcuts='Control+K Meta+K'
        className='flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50/80 px-2 text-sm text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 xl:pr-1.5 xl:pl-3 dark:border-zinc-700/60 dark:bg-zinc-800/40 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200'
      >
        <Icon iconNode={SearchIcon} />
        <span className='max-xl:sr-only'>Buscar posts</span>
        <kbd className='rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 max-xl:hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 pointer-coarse:hidden'>
          {isMac ? '⌘K' : 'Ctrl K'}
        </kbd>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='gap-0 p-0'>
          <DialogTitle className='sr-only'>Buscar posts</DialogTitle>
          <DialogDescription className='sr-only'>
            Busque posts por título, descrição ou tag.
          </DialogDescription>

          <SearchPanel
            fuse={fuse}
            loadFailed={loadFailed}
            onNavigate={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
