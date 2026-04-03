'use client'

import { useState } from 'react'
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from 'lucide-react'
import clsx from 'clsx'

import { cn } from '@/lib/utils'
import { Icon } from '@/components/icon'

import type { ComponentProps } from 'react'

interface FileTreeFileProps {
  name: string
  highlight?: boolean
  className?: string
}

export function FileTreeFile({
  name,
  highlight,
  className,
}: FileTreeFileProps) {
  return (
    <li
      className={cn(
        'flex items-center gap-1.5 py-0.5 pl-5 text-sm',
        highlight ?
          'rounded-sm bg-zinc-500/10 font-medium text-foreground'
        : 'text-muted-foreground',
        className,
      )}
    >
      <Icon iconNode={FileIcon} className='size-3.5 shrink-0' />
      <span>{name}</span>
    </li>
  )
}

interface FileTreeFolderProps extends ComponentProps<'li'> {
  name: string
  defaultOpen?: boolean
}

export function FileTreeFolder({
  name,
  defaultOpen = false,
  children,
  className,
}: FileTreeFolderProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <li className={className}>
      <button
        type='button'
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className='flex w-full items-center gap-1.5 py-0.5 text-left text-sm text-foreground/80 transition-colors hover:text-foreground'
      >
        <ChevronRightIcon
          className={clsx(
            'size-3.5 shrink-0 text-muted-foreground transition-transform duration-150',
            open && 'rotate-90',
          )}
        />
        {open && <Icon iconNode={FolderOpenIcon} className='size-3.5 shrink-0 text-blue-400' />}
        {!open && <Icon iconNode={FolderIcon} className='size-3.5 shrink-0 text-blue-400' />}
        <span className='font-medium'>{name}</span>
      </button>

      {open && children && (
        <ul className='ml-1.5 border-l border-border/50 pl-3'>{children}</ul>
      )}
    </li>
  )
}

export function FileTree({ className, children }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'not-prose my-8 rounded-lg border border-border bg-muted/40 px-4 py-5 font-mono',
        className,
      )}
    >
      <ul className='flex flex-col'>{children}</ul>
    </div>
  )
}
