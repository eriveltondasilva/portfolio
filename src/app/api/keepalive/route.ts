import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Prevents Next.js from caching the response, so every cron call really hits Redis
export const dynamic = 'force-dynamic';

const KEEPALIVE_KEY = 'keepalive:last_run';

export async function GET(request: Request) {
  const cronSecret = process.env['CRON_SECRET'];
  const authorizationHeader = request.headers.get('authorization');

  // Fail closed: if the secret is missing, "Bearer undefined" must never authorize anyone
  if (!cronSecret || authorizationHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const redis = Redis.fromEnv();
    const executedAt = new Date().toISOString();

    await redis.set(KEEPALIVE_KEY, executedAt);

    // Read back so the response proves the write was persisted, not just sent
    const storedValue = await redis.get<string>(KEEPALIVE_KEY);

    return NextResponse.json({ key: KEEPALIVE_KEY, value: storedValue });
  } catch (error) {
    // Details stay in the Vercel logs; the client only gets a generic message
    console.error('Keepalive failed:', error);
    return NextResponse.json(
      { error: 'Keepalive failed. Check the server logs.' },
      { status: 500 },
    );
  }
}
