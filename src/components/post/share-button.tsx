'use client';

import { CheckIcon, Link2Icon, Share2Icon } from 'lucide-react';
import { useSyncExternalStore } from 'react';

import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface Props {
  title: string;
  url: string;
}

const subscribeNothing = () => () => {};
const getCanNativeShare = () => typeof navigator.share === 'function';
const getServerCanNativeShare = () => false;

export function ShareButton({ title, url }: Props) {
  const { copied, copy } = useCopyToClipboard();
  const canNativeShare = useSyncExternalStore(
    subscribeNothing,
    getCanNativeShare,
    getServerCanNativeShare,
  );

  async function handleShare() {
    if (canNativeShare) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.error('[ShareButton] Failed to share:', error);
      }
      return;
    }

    await copy(url);
  }

  const idleLabel =
    canNativeShare ? 'Compartilhar post' : 'Copiar link do post';
  const label = copied ? 'Link copiado!' : idleLabel;
  const shareIcon = canNativeShare ? Share2Icon : Link2Icon;
  const icon = copied ? CheckIcon : shareIcon;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            onClick={handleShare}
            aria-label={label}
            className='shrink-0 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200'
          >
            <Icon
              iconNode={icon}
              className={copied ? 'text-green-500' : undefined}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>

      {/* Announces the copy to screen readers without moving focus */}
      <span role='status' className='sr-only'>
        {copied ? 'Link copiado' : ''}
      </span>
    </>
  );
}
