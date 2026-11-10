'use client';

import { useEffect, useOptimistic, useState, useTransition } from 'react';
import { cn } from 'cn';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { REACTION_CONFIG, REACTION_TYPES } from '@/lib/reactions/config';

import type { ReactionState, ReactionType } from '@/lib/reactions/config';

interface Props {
  slug: string;
  readOnly?: boolean;
}

const RATE_LIMITED_MESSAGE =
  'Muitas reações em pouco tempo. Tente novamente em instantes.';
const GENERIC_ERROR_MESSAGE = 'Não foi possível salvar sua reação.';

// Idempotent on purpose: it is also applied over the server state, which may already hold the choice
function withChoice(
  current: ReactionState,
  choice: ReactionType | null,
): ReactionState {
  if (current.choice === choice) return current;

  const counts = { ...current.counts };

  if (current.choice) {
    counts[current.choice] = Math.max(0, counts[current.choice] - 1);
  }
  if (choice) counts[choice] += 1;

  return { counts, choice };
}

async function sendReaction(
  slug: string,
  choice: ReactionType | null,
): Promise<ReactionState> {
  const response = await fetch(
    `/api/reactions/${slug}`,
    choice ?
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: choice }),
      }
    : { method: 'DELETE' },
  );

  if (!response.ok) {
    const body: { error?: string } | null = await response
      .json()
      .catch(() => null);

    throw new Error(body?.error ?? `status-${response.status}`);
  }

  return response.json();
}

// Zero and the loading phase render nothing, so a new post does not read as "0 0 0"
// and a skeleton would not flash and vanish on posts without reactions
function ReactionCount({
  value,
  loadFailed,
}: {
  value: number | undefined;
  loadFailed: boolean;
}) {
  if (value === undefined) {
    return loadFailed ? <span className='font-mono'>–</span> : null;
  }

  if (value === 0) return null;

  return <span className='font-mono tabular-nums'>{value}</span>;
}

export function PostReactions({ slug, readOnly = false }: Props) {
  const [state, setState] = useState<ReactionState | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reverts by itself when the transition ends, so a failed request needs no manual rollback
  const [visibleState, applyOptimisticChoice] = useOptimistic(
    state,
    (current, choice: ReactionType | null) =>
      current && withChoice(current, choice),
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadReactions() {
      try {
        const response = await fetch(`/api/reactions/${slug}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`status-${response.status}`);

        setState(await response.json());
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error('[PostReactions] Failed to load reactions:', error);
        setLoadFailed(true);
      }
    }

    loadReactions();

    return () => controller.abort();
  }, [slug]);

  function handleReaction(type: ReactionType) {
    // Clicks during a request are dropped instead of queued
    if (!state || readOnly || isPending) return;

    const nextChoice = state.choice === type ? null : type;

    setErrorMessage(null);

    startTransition(async () => {
      applyOptimisticChoice(nextChoice);

      try {
        setState(await sendReaction(slug, nextChoice));
      } catch (error) {
        console.error('[PostReactions] Failed to save reaction:', error);
        setErrorMessage(
          error instanceof Error && error.message === 'rate-limited' ?
            RATE_LIMITED_MESSAGE
          : GENERIC_ERROR_MESSAGE,
        );
      }
    });
  }

  return (
    <div>
      <div
        role='group'
        aria-label='Reações'
        className='flex items-center gap-1'
      >
        {REACTION_TYPES.map((type) => {
          const { emoji, label } = REACTION_CONFIG[type];
          const count = visibleState?.counts[type];
          const isSelected = visibleState?.choice === type;

          return (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleReaction(type)}
                  disabled={readOnly}
                  aria-disabled={!state}
                  aria-pressed={isSelected}
                  aria-label={
                    count === undefined ? label : `${label} (${count})`
                  }
                  className={cn(
                    'h-8 gap-1.5 px-2 text-xs',
                    isSelected ?
                      'bg-zinc-100 font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                    : 'text-zinc-500 dark:text-zinc-400',
                  )}
                >
                  <span className='text-sm leading-none' aria-hidden='true'>
                    {emoji}
                  </span>
                  <span className='md:hidden'>{label}</span>
                  <ReactionCount value={count} loadFailed={loadFailed} />
                </Button>
              </TooltipTrigger>

              {/* The label is already visible on mobile */}
              <TooltipContent className='max-md:hidden'>{label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Always mounted so screen readers announce the message when it appears */}
      <p
        role='status'
        className={cn(
          'text-xs text-red-600 dark:text-red-400',
          errorMessage ? 'mt-1' : 'sr-only',
        )}
      >
        {errorMessage}
      </p>
    </div>
  );
}
