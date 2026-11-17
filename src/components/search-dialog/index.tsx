'use client';

import { SearchIcon } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';

import { Icon } from '@/components/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

import { SearchPanel } from './search-panel';
import { preloadSearchIndex, useSearchIndex } from './use-search-index';
import { useSearchShortcut } from './use-search-shortcut';

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

  useSearchShortcut(() => setIsOpen((current) => !current));

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        onPointerEnter={preloadSearchIndex}
        onFocus={preloadSearchIndex}
        aria-keyshortcuts='Control+K Meta+K'
        className='flex h-8 shrink-0 items-center gap-2 rounded-md border bg-muted/50 px-2 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground xl:pr-1.5 xl:pl-3'
      >
        <Icon iconNode={SearchIcon} />

        <span className='max-xl:sr-only'>Buscar posts</span>

        <kbd className='rounded-sm border bg-background px-1.5 py-0.5 font-mono text-2xs text-muted-foreground max-xl:hidden pointer-coarse:hidden'>
          {isMac ? '⌘K' : 'Ctrl+K'}
        </kbd>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='gap-0 p-0' showCloseButton={false}>
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
