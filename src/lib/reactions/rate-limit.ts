import { Ratelimit } from '@upstash/ratelimit';
import { createHmac } from 'node:crypto';

import { redis, namespaceKey } from '@/lib/redis';

const REACTION_WRITES_PER_MINUTE = 20;
const NEW_VISITORS_PER_HOUR = 10;

const reactionWriteLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(REACTION_WRITES_PER_MINUTE, '1 m'),
  prefix: namespaceKey('rate-limit:reactions'),
});

// Without a cookie every write creates a new identity, so limiting the request
// rate alone does not cap how far a script can inflate the counts
const newVisitorLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(NEW_VISITORS_PER_HOUR, '1 h'),
  prefix: namespaceKey('rate-limit:new-visitors'),
});

// Vercel overwrites x-forwarded-for, so the client cannot spoof its first entry
function getClientIpAddress(request: Request): string {
  const forwardedFor = request.headers
    .get('x-forwarded-for')
    ?.split(',')[0]
    ?.trim();

  return forwardedFor || request.headers.get('x-real-ip') || 'unknown';
}

// Only a keyed hash reaches Redis, never the raw IP address
function hashIpAddress(ipAddress: string): string {
  const secret = process.env['RATE_LIMIT_SECRET'];

  if (!secret) throw new Error('RATE_LIMIT_SECRET is not set.');

  return createHmac('sha256', secret).update(ipAddress).digest('hex');
}

async function isRateLimited(
  limiter: Ratelimit,
  request: Request,
): Promise<boolean> {
  const identifier = hashIpAddress(getClientIpAddress(request));

  try {
    const { success } = await limiter.limit(identifier);

    return !success;
  } catch (error) {
    // Fail open: with Redis down, the write that follows fails on its own
    console.error('[rate-limit] Failed to check the limit:', error);

    return false;
  }
}

export function isReactionRateLimited(request: Request): Promise<boolean> {
  return isRateLimited(reactionWriteLimiter, request);
}

export function isNewVisitorRateLimited(request: Request): Promise<boolean> {
  return isRateLimited(newVisitorLimiter, request);
}
