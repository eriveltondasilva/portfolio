import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from 'lucide-react';

import { Icon } from '@/components/icon';
import { cn } from '@/lib/utils';

import type { ComponentProps } from 'react';

interface FileTreeFileProps {
  name: string;
  highlight?: boolean;
  className?: string;
}

export function FileTreeFile({
  name,
  highlight,
  className,
}: FileTreeFileProps) {
  return (
    // pl-3.5 + px-1.5 = 20px: the icon stays in the same column as sibling folder icons
    <li className={cn('pl-3.5', className)}>
      <div
        className={cn(
          'flex w-fit items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-sm',
          highlight ?
            'bg-zinc-500/10 font-medium text-foreground'
          : 'text-muted-foreground',
        )}
      >
        <Icon iconNode={FileIcon} className='size-3.5 shrink-0' />
        <span>{name}</span>
        {highlight && <span className='sr-only'>(destacado)</span>}
      </div>
    </li>
  );
}

interface FileTreeFolderProps extends ComponentProps<'li'> {
  name: string;
  defaultOpen?: boolean;
}

export function FileTreeFolder({
  name,
  defaultOpen = false,
  children,
  ...props
}: FileTreeFolderProps) {
  return (
    <li {...props}>
      <details open={defaultOpen}>
        <summary className='flex cursor-pointer list-none items-center gap-1.5 py-0.5 text-sm text-foreground/80 transition-colors marker:hidden hover:text-foreground [&::-webkit-details-marker]:hidden'>
          {/* The selector targets this folder's own details, so nested folders keep independent states */}
          <Icon
            iconNode={ChevronRightIcon}
            className='size-3.5 shrink-0 text-muted-foreground transition-transform duration-150 [details[open]>summary_&]:rotate-90'
          />
          <Icon
            iconNode={FolderIcon}
            className='size-3.5 shrink-0 text-blue-400 [details[open]>summary_&]:hidden'
          />
          <Icon
            iconNode={FolderOpenIcon}
            className='hidden size-3.5 shrink-0 text-blue-400 [details[open]>summary_&]:block'
          />
          <span className='font-medium'>{name}</span>
        </summary>

        <ul className='ml-1.5 border-l border-border pl-3'>{children}</ul>
      </details>
    </li>
  );
}

export function FileTree({ className, children }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'not-prose my-8 rounded-lg border border-border bg-muted/40 px-4 py-5 font-mono',
        className,
      )}
    >
      <ul className='flex flex-col' aria-label='Estrutura de arquivos'>
        {children}
      </ul>
    </div>
  );
}
