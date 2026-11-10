import { redis, namespaceKey } from '@/lib/redis';

import { REACTION_TYPES, isReactionType } from './config';

import type { ReactionCounts, ReactionState, ReactionType } from './config';

/**
 * One script keeps the read-modify-write atomic: changing a reaction depends on
 * the previous choice, which a MULTI/EXEC transaction cannot branch on.
 * An empty desired type removes the reaction.
 */
const applyReactionScript = redis.createScript<unknown[]>(`
  local countsKey = KEYS[1]
  local choicesKey = KEYS[2]
  local visitorId = ARGV[1]
  local desiredType = ARGV[2]

  local previousType = redis.call('HGET', choicesKey, visitorId) or ''

  if previousType ~= desiredType then
    if previousType ~= '' then
      local remaining = redis.call('HINCRBY', countsKey, previousType, -1)

      -- Only reachable if the counts hash was edited by hand
      if remaining < 0 then
        redis.call('HSET', countsKey, previousType, 0)
      end
    end

    if desiredType ~= '' then
      redis.call('HSET', choicesKey, visitorId, desiredType)
      redis.call('HINCRBY', countsKey, desiredType, 1)
    else
      redis.call('HDEL', choicesKey, visitorId)
    end
  end

  return redis.call('HGETALL', countsKey)
`);

function reactionCountsKey(slug: string): string {
  return namespaceKey(`reactions:${slug}:counts`);
}

function reactionChoicesKey(slug: string): string {
  return namespaceKey(`reactions:${slug}:choices`);
}

function toReactionCounts(
  rawCounts: Record<string, unknown> | null,
): ReactionCounts {
  return Object.fromEntries(
    REACTION_TYPES.map((type) => [type, Number(rawCounts?.[type] ?? 0)]),
  ) as ReactionCounts;
}

function flatPairsToRecord(flatPairs: unknown[]): Record<string, unknown> {
  const record: Record<string, unknown> = {};

  for (let index = 0; index < flatPairs.length; index += 2) {
    record[String(flatPairs[index])] = flatPairs[index + 1];
  }

  return record;
}

async function applyReaction(
  slug: string,
  visitorId: string,
  type: ReactionType | null,
): Promise<ReactionState> {
  const flatCounts = await applyReactionScript.exec(
    [reactionCountsKey(slug), reactionChoicesKey(slug)],
    [visitorId, type ?? ''],
  );

  return {
    counts: toReactionCounts(flatPairsToRecord(flatCounts)),
    choice: type,
  };
}

export function setReaction(
  slug: string,
  visitorId: string,
  type: ReactionType,
): Promise<ReactionState> {
  return applyReaction(slug, visitorId, type);
}

export function removeReaction(
  slug: string,
  visitorId: string,
): Promise<ReactionState> {
  return applyReaction(slug, visitorId, null);
}

export async function readReactions(
  slug: string,
  visitorId: string | null,
): Promise<ReactionState> {
  const [rawCounts, rawChoice] = await Promise.all([
    redis.hgetall(reactionCountsKey(slug)),
    visitorId ? redis.hget(reactionChoicesKey(slug), visitorId) : null,
  ]);

  return {
    counts: toReactionCounts(rawCounts),
    choice: isReactionType(rawChoice) ? rawChoice : null,
  };
}
