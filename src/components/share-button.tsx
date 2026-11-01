'use client';

import { CheckIcon, Link2Icon, Share2Icon } from 'lucide-react';
import { useEffect, useState, useSyncExternalStore } from 'react';

import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
  title: string;
  url: string;
}

const RESET_DELAY_MS = 3_000;

// Reads a browser capability without effect + setState; the server snapshot keeps hydration consistent
const subscribeNothing = () => () => {};
const getCanNativeShare = () => typeof navigator.share === 'function';
const getServerCanNativeShare = () => false;

export function ShareButton({ title, url }: Props) {
  const [copied, setCopied] = useState(false);
  const canNativeShare = useSyncExternalStore(
    subscribeNothing,
    getCanNativeShare,
    getServerCanNativeShare,
  );

  useEffect(() => {
    if (!copied) return;

    const timeout = setTimeout(() => setCopied(false), RESET_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [copied]);

  async function handleShare() {
    if (canNativeShare) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        // Closing the share sheet is not an error
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.error('[ShareButton] Failed to share:', error);
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (error) {
      console.error('[ShareButton] Failed to copy to clipboard:', error);
    }
  }

  const label = copied ? 'Link copiado!' : 'Compartilhar post';
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
