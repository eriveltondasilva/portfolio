export const REACTION_TYPES = ['like', 'learned', 'thanks'] as const;

export type ReactionType = (typeof REACTION_TYPES)[number];
export type ReactionCounts = Record<ReactionType, number>;

export interface ReactionState {
  counts: ReactionCounts;
  choice: ReactionType | null;
}

export const REACTION_CONFIG = {
  like: { emoji: '❤️', label: 'Gostei' },
  learned: { emoji: '💡', label: 'Aprendi' },
  thanks: { emoji: '☕', label: 'Valeu!' },
} as const satisfies Record<ReactionType, { emoji: string; label: string }>;

export function isReactionType(value: unknown): value is ReactionType {
  return (
    typeof value === 'string' &&
    (REACTION_TYPES as readonly string[]).includes(value)
  );
}
