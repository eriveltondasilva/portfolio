import { NextResponse } from 'next/server';

import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

const KEEPALIVE_KEY = 'keepalive:last_run';

export async function GET(request: Request) {
  const cronSecret = process.env['CRON_SECRET'];
  const authorizationHeader = request.headers.get('authorization');

  if (!cronSecret || authorizationHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await redis.set(KEEPALIVE_KEY, new Date().toISOString());
    const storedValue = await redis.get<string>(KEEPALIVE_KEY);

    return NextResponse.json({ key: KEEPALIVE_KEY, value: storedValue });
  } catch (error) {
    console.error('Keepalive failed:', error);
    return NextResponse.json(
      { error: 'Keepalive failed. Check the server logs.' },
      { status: 500 },
    );
  }
}
