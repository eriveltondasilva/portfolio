import {
  ChevronRightIcon,
  FileCodeIcon,
  FileCogIcon,
  FileIcon,
  FileImageIcon,
  FileJsonIcon,
  FileTerminalIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
} from 'lucide-react';

import { Icon } from '@/components/icon';
import { cn } from '@/lib/utils';

import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

// # File icons

const FILE_ICON_GROUPS: ReadonlyArray<readonly [LucideIcon, string[]]> = [
  [FileImageIcon, ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'svg']],
  [FileCodeIcon, ['ts', 'tsx', 'js', 'jsx', 'php', 'css', 'html']],
  [FileJsonIcon, ['json']],
  [FileTextIcon, ['md', 'mdx', 'txt']],
  [FileCogIcon, ['yml', 'yaml', 'toml', 'env']],
  [FileTerminalIcon, ['sh']],
];

// Map (not a plain object) so an extension like "constructor" cannot hit Object.prototype
const FILE_ICON_BY_EXTENSION = new Map(
  FILE_ICON_GROUPS.flatMap(([icon, extensions]) =>
    extensions.map((extension) => [extension, icon] as const),
  ),
);

function getFileIcon(name: string): LucideIcon {
  // lastIndexOf keeps ".env" working and ignores names without a dot ("Dockerfile", "sh")
  const dotIndex = name.lastIndexOf('.');

  if (dotIndex === -1) return FileIcon;

  const extension = name.slice(dotIndex + 1).toLowerCase();

  return FILE_ICON_BY_EXTENSION.get(extension) ?? FileIcon;
}

// # Folder animation

// Slides the folder content by animating ::details-content from 0 to auto.
// - interpolate-size lets the browser interpolate to "auto" (Chromium only for now).
// - content-visibility is transitioned too, so the content stays visible while closing.
// Browsers without interpolate-size open the folder instantly, like a plain <details>.
// "open:" must come before the pseudo-element variant, or the selector becomes invalid.
const FOLDER_ANIMATION_CLASSES = cn(
  '[interpolate-size:allow-keywords]',
  'details-content:h-0 details-content:overflow-y-clip',
  'details-content:transition-[height,content-visibility] details-content:transition-discrete details-content:duration-200 details-content:ease-out',
  'open:details-content:h-auto',
  'motion-reduce:details-content:transition-none',
);

// ─────────────────────────────────────

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
      <details open={defaultOpen} className={FOLDER_ANIMATION_CLASSES}>
        <summary className='flex cursor-pointer list-none items-center gap-1.5 py-0.5 text-sm text-foreground/80 transition-colors marker:hidden hover:text-foreground [&::-webkit-details-marker]:hidden'>
          {/* The selector targets this folder's own details, so nested folders keep independent states */}
          <Icon
            iconNode={ChevronRightIcon}
            className='size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none [details[open]>summary_&]:rotate-90'
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

interface FileTreeFileProps extends Omit<ComponentProps<'li'>, 'children'> {
  name: string;
  highlight?: boolean;
}

export function FileTreeFile({
  name,
  highlight,
  className,
  ...props
}: FileTreeFileProps) {
  return (
    // pl-3.5 + px-1.5 = 20px: the icon stays in the same column as sibling folder icons
    <li className={cn('pl-3.5', className)} {...props}>
      <div
        className={cn(
          'flex w-fit items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-sm',
          highlight ?
            'bg-zinc-500/10 font-medium text-foreground'
          : 'text-muted-foreground',
        )}
      >
        <Icon iconNode={getFileIcon(name)} className='size-3.5 shrink-0' />
        <span>{name}</span>
        {highlight && <span className='sr-only'>(destacado)</span>}
      </div>
    </li>
  );
}
