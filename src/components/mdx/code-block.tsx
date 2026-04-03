'use client'

import { CheckIcon, CopyIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import clsx from 'clsx'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icon'

import type { ComponentProps } from 'react'

export function CodeBlock({ children, ...props }: ComponentProps<'pre'>) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = preRef.current?.querySelector('code')?.textContent

    if (!text) return

    await navigator.clipboard.writeText(text)

    setCopied(true)
    setTimeout(() => setCopied(false), 3_000)
  }

  const icon = copied ? CheckIcon : CopyIcon

  return (
    <>
      <pre
        ref={preRef}
        className={clsx(props.className, 'group relative')}
        {...props}
      >
        {children}

        <Button
          variant='outline'
          size='icon-sm'
          onClick={handleCopy}
          disabled={copied}
          className={clsx(
            'absolute top-2 right-3 border border-white/10 bg-white/5 text-white/50 opacity-0 backdrop-blur-sm transition-all',
            'hover:border-white/20 hover:bg-white/10 hover:text-white/90',
            'group-hover:opacity-100',
            copied &&
              'border-green-500/30 bg-green-500/10 text-green-400 opacity-100',
          )}
        >
          <Icon iconNode={icon} label={copied ? 'Copiado!' : 'Copiar código'} />
        </Button>
      </pre>
    </>
  )
}
