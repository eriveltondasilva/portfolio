export const REACTION_TYPES = ['like', 'fire', 'mind_blown'] as const
export const RATE_LIMIT_TTL = 60 * 60 * 24 // 24h

export type ReactionType = (typeof REACTION_TYPES)[number]
type ReactionConfig = Record<ReactionType, { emoji: string; label: string }>

export const REACTION_CONFIG = {
  like: { emoji: '❤️', label: 'Curtir' },
  fire: { emoji: '🔥', label: 'Incrível' },
  mind_blown: { emoji: '🤯', label: 'Surpreendente' },
} as const satisfies ReactionConfig

export type ReactionCounts = Record<ReactionType, number>

export function reactionCountKey(slug: string, type: ReactionType) {
  return `reactions::${slug}::${type}`
}

export function reactionRateLimitKey(ip: string, slug: string, type: ReactionType) {
  return `reactions::rate-limit::${ip}::${slug}::${type}`
}
