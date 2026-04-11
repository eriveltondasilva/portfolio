'use client'

import { useEffect, useState, useTransition } from 'react'
import clsx from 'clsx'
import { DotIcon } from 'lucide-react'

import { REACTION_CONFIG, REACTION_TYPES } from '@/lib/reactions'
import { Icon } from '@/components/icon'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import type { ReactionCounts, ReactionType } from '@/lib/reactions'

interface Props {
  slug: string
}

const defaultCounts = (): ReactionCounts =>
  Object.fromEntries(REACTION_TYPES.map((type) => [type, 0])) as ReactionCounts

export function PostReactions({ slug }: Props) {
  const [counts, setCounts] = useState<ReactionCounts>(defaultCounts())
  const [reacted, setReacted] = useState<Set<ReactionType>>(new Set())
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    fetch(`/api/reactions/${slug}`)
      .then((res) => res.json())
      .then((data: ReactionCounts) => setCounts(data))
      .catch(console.error)
  }, [slug])

  function handleReaction(type: ReactionType) {
    if (reacted.has(type) || isPending) return

    startTransition(async () => {
      setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }))
      setReacted((prev) => new Set(prev).add(type))

      try {
        const res = await fetch(`/api/reactions/${slug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type }),
        })

        if (!res.ok) {
          setCounts((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }))
          setReacted((prev) => {
            const next = new Set(prev)
            next.delete(type)
            return next
          })
        }
      } catch {
        setCounts((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }))
        setReacted((prev) => {
          const next = new Set(prev)
          next.delete(type)
          return next
        })
      }
    })
  }

  return (
    <div className='flex items-center gap-1'>
      {REACTION_TYPES.map((type, index) => {
        const { emoji, label } = REACTION_CONFIG[type]
        const hasReacted = reacted.has(type)

        return (
          <span key={type} className='flex items-center'>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleReaction(type)}
                  disabled={hasReacted || isPending}
                  className={clsx(
                    'flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-xs transition-colors disabled:cursor-not-allowed',
                    hasReacted ?
                      'font-extrabold text-zinc-700 dark:text-zinc-200'
                    : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300',
                  )}
                >
                  <span className='text-sm leading-none'>{emoji}</span>
                  <span className='font-mono tabular-nums'>{counts[type]}</span>
                </button>
              </TooltipTrigger>

              <TooltipContent>{label}</TooltipContent>
            </Tooltip>

            {index < REACTION_TYPES.length - 1 && (
              <Icon iconNode={DotIcon} className='text-zinc-400 dark:text-zinc-500' />
            )}
          </span>
        )
      })}
    </div>
  )
}
