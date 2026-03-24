import React from 'react'
import { FileIcon, FolderIcon, FolderOpenIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { ComponentProps } from 'react'

// ─── Indent guides ────────────────────────────────────────────────────────────

function IndentGuides({ depth }: { depth: number }) {
  if (depth === 0) return null

  return (
    <>
      {Array.from({ length: depth }).map((_, i) => (
        <span key={i} className='flex w-4 shrink-0 justify-center' aria-hidden>
          <span className='w-px bg-border' />
        </span>
      ))}
    </>
  )
}

// ─── File ─────────────────────────────────────────────────────────────────────

interface FileProps {
  name: string
  highlighted?: boolean
  depth?: number
}

function File({ name, highlighted = false, depth = 0 }: FileProps) {
  return (
    <div className='flex items-stretch px-2 py-0.5'>
      <IndentGuides depth={depth} />
      <div
        className={cn(
          'flex min-w-0 flex-1 items-center gap-1.5 rounded px-1 text-sm',
          highlighted ?
            'bg-primary/10 font-medium text-primary'
          : 'text-muted-foreground',
        )}
      >
        <FileIcon
          className={cn(
            'size-4 shrink-0',
            highlighted ? 'text-primary' : 'text-blue-400/80',
          )}
          aria-hidden
        />
        <span className='truncate'>{name}</span>
      </div>
    </div>
  )
}

// ─── Folder ───────────────────────────────────────────────────────────────────

interface FolderProps {
  name: string
  open?: boolean
  highlighted?: boolean
  depth?: number
  children?: React.ReactNode
}

function Folder({
  name,
  open = false,
  highlighted = false,
  depth = 0,
  children,
}: FolderProps) {
  const Icon = open ? FolderOpenIcon : FolderIcon

  return (
    <>
      <div className='flex items-stretch px-2 py-0.5'>
        <IndentGuides depth={depth} />
        <div
          className={cn(
            'flex min-w-0 flex-1 items-center gap-1.5 rounded px-1 text-sm',
            highlighted ?
              'bg-primary/10 font-medium text-primary'
            : 'text-muted-foreground',
          )}
        >
          <Icon
            className={cn(
              'size-4 shrink-0',
              highlighted ? 'text-primary' : (
                'text-yellow-500/80 dark:text-yellow-400/80'
              ),
            )}
            aria-hidden
          />
          <span className='truncate'>{name}</span>
        </div>
      </div>

      {children && <div>{injectDepth(children, depth + 1)}</div>}
    </>
  )
}

// ─── Depth injection ──────────────────────────────────────────────────────────

function injectDepth(
  children: React.ReactNode,
  depth: number,
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child

    return React.cloneElement(child as React.ReactElement<{ depth?: number }>, {
      depth,
    })
  })
}

// ─── FileTree ─────────────────────────────────────────────────────────────────

interface FileTreeProps extends Omit<ComponentProps<'div'>, 'children'> {
  children: React.ReactNode
}

export function FileTree({ children, className, ...props }: FileTreeProps) {
  return (
    <div
      className={cn(
        'not-prose my-6 rounded-lg border border-border bg-muted/30 py-3 font-mono',
        className,
      )}
      {...props}
    >
      {injectDepth(children, 0)}
    </div>
  )
}

FileTree.File = File
FileTree.Folder = Folder
