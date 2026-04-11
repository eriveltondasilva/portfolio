'use client'

import { CheckIcon, Link2Icon, ShareIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icon'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
  title: string
  url: string
}

export function ShareButton({ title, url }: Props) {
  const [copied, setCopied] = useState(false)
  const [hasNativeShare, setHasNativeShare] = useState(false)

  useEffect(() => {
    // Verifica se o navegador suporta a API de compartilhamento nativo
    ;(() => setHasNativeShare(!!navigator.share))()
  }, [])

  const handleShare = async () => {
    if (hasNativeShare) {
      try {
        await navigator.share({ title, url })
      } catch {
        console.error('[ShareButton] Failed to share:', url)
      }
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 3_000)
    } catch (err) {
      console.error('[ShareButton] Failed to copy to clipboard:', err)
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          disabled={copied}
          onClick={handleShare}
          aria-label={copied ? 'Link copiado!' : 'Compartilhar post'}
          className='shrink-0 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200'
        >
          {copied && <Icon iconNode={CheckIcon} className='text-green-500' />}
          {!copied && <Icon iconNode={hasNativeShare ? ShareIcon : Link2Icon} />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? 'Link copiado!' : 'Compartilhar post'}</TooltipContent>
    </Tooltip>
  )
}
