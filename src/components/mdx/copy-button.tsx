'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { MouseEvent } from 'react';

const RESET_DELAY_MS = 3_000;

export function CopyButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeout = setTimeout(() => setCopied(false), RESET_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function handleCopy(event: MouseEvent<HTMLButtonElement>) {
    const code = event.currentTarget
      .closest('[data-code-block]')
      ?.querySelector('code');

    if (!code) return;

    const lines = code.querySelectorAll('[data-line]:not(.remove)');
    const text =
      lines.length > 0 ?
        Array.from(lines, (line) => line.textContent).join('\n')
      : code.textContent;

    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (error) {
      console.error('[CopyButton] Failed to copy to clipboard:', error);
    }
  }

  return (
    <>
      <Button
        type='button'
        variant='outline'
        size='icon-sm'
        aria-label='Copiar código'
        onClick={handleCopy}
        className={cn(
          'absolute top-3.5 right-3 size-7 rounded-sm border-white/10 bg-[#282c34] text-zinc-400 transition-all',
          'opacity-0 focus-visible:opacity-100 pointer-coarse:opacity-100 [figure:hover_&]:opacity-100',
          'hover:border-white/20 hover:bg-[#343a45] hover:text-zinc-100',
          copied &&
            'border-green-500/50 text-green-400 opacity-100 hover:text-green-400',
        )}
      >
        <Icon iconNode={copied ? CheckIcon : CopyIcon} className='size-3.5' />
      </Button>

      <span role='status' className='sr-only'>
        {copied ? 'Código copiado' : ''}
      </span>
    </>
  );
}
