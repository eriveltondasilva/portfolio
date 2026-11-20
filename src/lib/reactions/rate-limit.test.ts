import { createHmac } from 'node:crypto';

import { describe, expect, it, vi } from 'vitest';

import { isNewVisitorRateLimited, isReactionRateLimited } from './rate-limit';

const limit = vi.hoisted(() => vi.fn());

vi.mock('@upstash/ratelimit', () => {
  class Ratelimit {
    static slidingWindow = vi.fn();
    limit = limit;
  }

  return { Ratelimit };
});

vi.mock('@/lib/redis', () => ({
  redis: {},
  namespaceKey: (key: string) => key,
}));

const hash = (ipAddress: string) =>
  createHmac('sha256', 'test-secret').update(ipAddress).digest('hex');

describe('isReactionRateLimited', () => {
  it('should return true when the limiter denies the request', async () => {
    limit.mockResolvedValue({ success: false });
    const request = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '203.0.113.1' },
    });

    expect(await isReactionRateLimited(request)).toBe(true);
  });

  it('should return false when the limiter allows the request', async () => {
    limit.mockResolvedValue({ success: true });
    const request = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '203.0.113.1' },
    });

    expect(await isReactionRateLimited(request)).toBe(false);
  });

  it('should fail open and log when the limiter throws', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    limit.mockRejectedValue(new Error('redis down'));
    const request = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '203.0.113.1' },
    });

    expect(await isReactionRateLimited(request)).toBe(false);
    expect(consoleError).toHaveBeenCalledOnce();
  });

  it('should identify the client by an HMAC of the IP instead of the raw IP', async () => {
    limit.mockResolvedValue({ success: true });
    const request = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '203.0.113.1' },
    });

    await isReactionRateLimited(request);

    expect(limit).toHaveBeenCalledWith(hash('203.0.113.1'));
  });

  it('should use only the first address of x-forwarded-for, trimmed', async () => {
    limit.mockResolvedValue({ success: true });
    const request = new Request('http://localhost', {
      headers: { 'x-forwarded-for': ' 203.0.113.1 , 10.0.0.1' },
    });

    await isReactionRateLimited(request);

    expect(limit).toHaveBeenCalledWith(hash('203.0.113.1'));
  });

  it('should fall back to x-real-ip when x-forwarded-for is absent', async () => {
    limit.mockResolvedValue({ success: true });
    const request = new Request('http://localhost', { headers: { 'x-real-ip': '198.51.100.7' } });

    await isReactionRateLimited(request);

    expect(limit).toHaveBeenCalledWith(hash('198.51.100.7'));
  });

  it('should group requests without any IP header under "unknown"', async () => {
    limit.mockResolvedValue({ success: true });

    await isReactionRateLimited(new Request('http://localhost'));

    expect(limit).toHaveBeenCalledWith(hash('unknown'));
  });

  it('should reject when RATE_LIMIT_SECRET is not set', async () => {
    vi.stubEnv('RATE_LIMIT_SECRET', '');

    await expect(isReactionRateLimited(new Request('http://localhost'))).rejects.toThrow(
      'RATE_LIMIT_SECRET is not set.',
    );
  });
});

describe('isNewVisitorRateLimited', () => {
  it('should return true when the limiter denies the request', async () => {
    limit.mockResolvedValue({ success: false });

    expect(await isNewVisitorRateLimited(new Request('http://localhost'))).toBe(true);
  });

  it('should fail open when the limiter throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    limit.mockRejectedValue(new Error('redis down'));

    expect(await isNewVisitorRateLimited(new Request('http://localhost'))).toBe(false);
  });
});
