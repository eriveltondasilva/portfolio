import { describe, expect, it, vi } from 'vitest';

import { redis } from '@/lib/redis';

import { GET } from './route';

vi.mock('@/lib/redis', () => ({
  redis: { set: vi.fn() },
  namespaceKey: (key: string) => `test:${key}`,
}));

const URL = 'http://localhost/api/keepalive';

describe('GET /api/keepalive', () => {
  it('should return 401 when CRON_SECRET is not configured', async () => {
    vi.stubEnv('CRON_SECRET', '');
    const request = new Request(URL, { headers: { authorization: 'Bearer ' } });

    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it('should return 401 when the authorization header is missing', async () => {
    vi.stubEnv('CRON_SECRET', 'secret');

    const response = await GET(new Request(URL));

    expect(response.status).toBe(401);
  });

  it('should return 401 when the secret is wrong', async () => {
    vi.stubEnv('CRON_SECRET', 'secret');
    const request = new Request(URL, { headers: { authorization: 'Bearer wrong!' } });

    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it('should return 401 when the secret has a different length', async () => {
    vi.stubEnv('CRON_SECRET', 'secret');
    const request = new Request(URL, { headers: { authorization: 'Bearer s' } });

    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it('should not write to redis when unauthorized', async () => {
    vi.stubEnv('CRON_SECRET', 'secret');

    await GET(new Request(URL));

    expect(redis.set).not.toHaveBeenCalled();
  });

  it('should store the current timestamp under the namespaced key when authorized', async () => {
    vi.stubEnv('CRON_SECRET', 'secret');
    const request = new Request(URL, { headers: { authorization: 'Bearer secret' } });

    const response = await GET(request);
    const body = await response.json();

    expect(body.key).toBe('test:keepalive:last_run');
    expect(redis.set).toHaveBeenCalledWith('test:keepalive:last_run', body.value);
  });

  it('should return 500 when redis fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('CRON_SECRET', 'secret');
    vi.mocked(redis.set).mockRejectedValue(new Error('redis down'));
    const request = new Request(URL, { headers: { authorization: 'Bearer secret' } });

    const response = await GET(request);

    expect(response.status).toBe(500);
  });
});
