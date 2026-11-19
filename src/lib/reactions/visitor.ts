import { createHmac, timingSafeEqual } from 'node:crypto';

import { cookies } from 'next/headers';

const VISITOR_COOKIE_NAME = 'visitor_id';
const VISITOR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function sign(visitorId: string): string {
  const secret = process.env['RATE_LIMIT_SECRET'];

  if (!secret) throw new Error('RATE_LIMIT_SECRET is not set.');

  return createHmac('sha256', secret).update(visitorId).digest('hex');
}

function hasValidSignature(visitorId: string, signature: string): boolean {
  const expected = Buffer.from(sign(visitorId));
  const received = Buffer.from(signature);

  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function getVisitorId(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(VISITOR_COOKIE_NAME)?.value;

  if (!value) return null;

  const [visitorId, signature] = value.split('.');

  if (!visitorId || !signature) return null;
  if (!UUID_V4_REGEX.test(visitorId)) return null;

  return hasValidSignature(visitorId, signature) ? visitorId : null;
}

export async function createVisitorId(): Promise<string> {
  const visitorId = crypto.randomUUID();
  const cookieStore = await cookies();

  cookieStore.set(VISITOR_COOKIE_NAME, `${visitorId}.${sign(visitorId)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: VISITOR_COOKIE_MAX_AGE_SECONDS,
  });

  return visitorId;
}
