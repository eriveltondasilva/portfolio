import { NextResponse, type NextRequest } from 'next/server'

import { redis } from '@/lib/redis'
import {
  RATE_LIMIT_TTL,
  REACTION_CONFIG,
  REACTION_TYPES,
  reactionCountKey,
  reactionRateLimitKey,
  type ReactionType,
} from '@/lib/reactions'

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',').at(0)?.trim() ??
    request.headers.get('x-real-ip') ??
    'anonymous'
  )
}

export async function GET(_: NextRequest, ctx: RouteContext<'/api/reactions/[slug]'>) {
  const { slug } = await ctx.params

  const keys = REACTION_TYPES.map((type) => reactionCountKey(slug, type))
  const values = await redis.mget<number[]>(...keys)

  const counts = Object.fromEntries(REACTION_TYPES.map((type, index) => [type, values[index] ?? 0]))

  return NextResponse.json(counts)
}

export async function POST(request: NextRequest, ctx: RouteContext<'/api/reactions/[slug]'>) {
  const { slug } = await ctx.params
  const ip = getClientIp(request)

  const body = await request.json()
  const type = body?.type as ReactionType

  if (!type || !REACTION_CONFIG[type]) {
    return NextResponse.json({ error: 'Tipo de reação inválido.' }, { status: 400 })
  }

  const rateLimitKey = reactionRateLimitKey(ip, slug, type)
  const alreadyReacted = await redis.get(rateLimitKey)

  if (alreadyReacted) {
    return NextResponse.json(
      { error: 'Você já reagiu com esse emoji recentemente.' },
      { status: 429 },
    )
  }

  const countKey = reactionCountKey(slug, type)

  await Promise.all([redis.incr(countKey), redis.set(rateLimitKey, 1, { ex: RATE_LIMIT_TTL })])

  const newCount = await redis.get<number>(countKey)

  return NextResponse.json({ type, count: newCount ?? 1 })
}
