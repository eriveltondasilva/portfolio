import { timingSafeEqual } from 'node:crypto';

import { redis, namespaceKey } from '@/lib/redis';

export const dynamic = 'force-dynamic';

const KEEPALIVE_KEY = namespaceKey('keepalive:last_run');

function isAuthorized(request: Request): boolean {
  const cronSecret = process.env['CRON_SECRET'];

  if (!cronSecret) return false;

  const expected = Buffer.from(`Bearer ${cronSecret}`);
  const received = Buffer.from(request.headers.get('authorization') ?? '');

  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const value = new Date().toISOString();

    await redis.set(KEEPALIVE_KEY, value);

    return Response.json({ key: KEEPALIVE_KEY, value });
  } catch (error) {
    console.error('Keepalive failed:', error);

    return Response.json(
      { error: 'Keepalive failed. Check the server logs.' },
      { status: 500 },
    );
  }
}
