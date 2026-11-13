import type { ReactionState, ReactionType } from './config';

function getReactionsUrl(slug: string): string {
  return `/api/reactions/${slug}`;
}

async function parseReactionState(response: Response): Promise<ReactionState> {
  if (!response.ok) {
    const body: { error?: string } | null = await response
      .json()
      .catch(() => null);

    throw new Error(body?.error ?? `status-${response.status}`);
  }

  return response.json();
}

export async function fetchReactions(
  slug: string,
  signal: AbortSignal,
): Promise<ReactionState> {
  return parseReactionState(await fetch(getReactionsUrl(slug), { signal }));
}

/** A null choice removes the visitor's reaction. */
export async function sendReaction(
  slug: string,
  choice: ReactionType | null,
): Promise<ReactionState> {
  const response = await fetch(
    getReactionsUrl(slug),
    choice ?
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: choice }),
      }
    : { method: 'DELETE' },
  );

  return parseReactionState(response);
}
