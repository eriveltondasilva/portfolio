'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { cn } from 'cn';

import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

import type { MouseEvent } from 'react';

export function CopyButton() {
  const { copied, copy } = useCopyToClipboard();

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

    await copy(text);
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
          'absolute top-3.5 right-3 size-7 rounded-sm border-white/10 bg-[#282c34] text-muted-foreground transition-all',
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
