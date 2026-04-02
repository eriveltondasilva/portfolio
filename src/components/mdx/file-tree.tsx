import { cloneElement, isValidElement, Children } from 'react'
import { FileIcon, FolderIcon, FolderOpenIcon } from 'lucide-react'
import clsx from 'clsx'

import type { ComponentProps, ReactNode } from 'react'

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

function File({
  name,
  highlighted = false,
  depth = 0,
}: {
  name: string
  highlighted?: boolean
  depth?: number
}) {
  return (
    <div className='flex items-stretch px-2 py-0.5'>
      <IndentGuides depth={depth} />
      <div
        className={clsx(
          'flex min-w-0 flex-1 items-center gap-1.5 rounded px-1 text-sm',
          highlighted ?
            'bg-primary/10 font-medium text-primary'
          : 'text-muted-foreground',
        )}
      >
        <FileIcon
          className={clsx(
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

function Folder({
  name,
  open = false,
  highlighted = false,
  depth = 0,
  children,
}: {
  name: string
  open?: boolean
  highlighted?: boolean
  depth?: number
  children?: ReactNode
}) {
  const Icon = open ? FolderOpenIcon : FolderIcon

  return (
    <>
      <div className='flex items-stretch px-2 py-0.5'>
        <IndentGuides depth={depth} />
        <div
          className={clsx(
            'flex min-w-0 flex-1 items-center gap-1.5 rounded px-1 text-sm',
            highlighted ?
              'bg-primary/10 font-medium text-primary'
            : 'text-muted-foreground',
          )}
        >
          <Icon
            className={clsx(
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

function injectDepth(children: ReactNode, depth: number): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child

    return cloneElement(child as React.ReactElement<{ depth?: number }>, {
      depth,
    })
  })
}

export function FileTree({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
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
