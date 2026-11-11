'use client';

import { SearchIcon } from 'lucide-react';
import { useEffect, useState, useSyncExternalStore } from 'react';

import { Icon } from '@/components/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

import { SearchPanel } from './search-panel';
import { preloadSearchIndex, useSearchIndex } from './use-search-index';

const subscribeNothing = () => () => {};
const getIsMac = () => /Mac/.test(navigator.userAgent);
const getServerIsMac = () => false;

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
