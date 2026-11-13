import { useEffect, useOptimistic, useState, useTransition } from 'react';

import { fetchReactions, sendReaction } from '@/lib/reactions/client';

import type { ReactionState, ReactionType } from '@/lib/reactions/config';

const RATE_LIMITED_MESSAGE =
  'Muitas reações em pouco tempo. Tente novamente em instantes.';
const GENERIC_ERROR_MESSAGE = 'Não foi possível salvar sua reação.';

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

export function useReactions(slug: string) {
  const [state, setState] = useState<ReactionState | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [visibleState, applyOptimisticChoice] = useOptimistic(
    state,
    (current, choice: ReactionType | null) =>
      current && withChoice(current, choice),
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadReactions() {
      try {
        setState(await fetchReactions(slug, controller.signal));
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error('[useReactions] Failed to load reactions:', error);
        setLoadFailed(true);
      }
    }

    loadReactions();

    return () => controller.abort();
  }, [slug]);

  function toggleReaction(type: ReactionType) {
    if (!state || isPending) return;

    const nextChoice = state.choice === type ? null : type;

    setErrorMessage(null);

    startTransition(async () => {
      applyOptimisticChoice(nextChoice);

      try {
        setState(await sendReaction(slug, nextChoice));
      } catch (error) {
        console.error('[useReactions] Failed to save reaction:', error);
        setErrorMessage(
          error instanceof Error && error.message === 'rate-limited' ?
            RATE_LIMITED_MESSAGE
          : GENERIC_ERROR_MESSAGE,
        );
      }
    });
  }

  return {
    visibleState,
    isLoaded: state !== null,
    loadFailed,
    errorMessage,
    toggleReaction,
  };
}
