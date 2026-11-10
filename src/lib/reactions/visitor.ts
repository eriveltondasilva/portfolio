import { cookies } from 'next/headers';

const VISITOR_COOKIE_NAME = 'visitor_id';
const VISITOR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getVisitorId(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(VISITOR_COOKIE_NAME)?.value;

  return value && UUID_V4_REGEX.test(value) ? value : null;
}

export async function createVisitorId(): Promise<string> {
  const visitorId = crypto.randomUUID();
  const cookieStore = await cookies();

  cookieStore.set(VISITOR_COOKIE_NAME, visitorId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: VISITOR_COOKIE_MAX_AGE_SECONDS,
  });

  return visitorId;
}
