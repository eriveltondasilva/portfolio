import { createHmac } from 'node:crypto';

import { describe, expect, it, vi } from 'vitest';

import { createVisitorId, getVisitorId } from './visitor';

const cookieStore = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn() }));

vi.mock('next/headers', () => ({ cookies: async () => cookieStore }));

const VISITOR_ID = '3b241101-e2bb-4255-8caf-4136c566a962';
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const signature = (value: string, secret = 'test-secret') =>
  createHmac('sha256', secret).update(value).digest('hex');

describe('getVisitorId', () => {
  it('should return null when the cookie is absent', async () => {
    cookieStore.get.mockReturnValue(undefined);

    expect(await getVisitorId()).toBeNull();
  });

  it('should return the visitor id when the signature is valid', async () => {
    cookieStore.get.mockReturnValue({ value: `${VISITOR_ID}.${signature(VISITOR_ID)}` });

    expect(await getVisitorId()).toBe(VISITOR_ID);
  });

  it('should return null when the cookie has no signature', async () => {
    cookieStore.get.mockReturnValue({ value: VISITOR_ID });

    expect(await getVisitorId()).toBeNull();
  });

  it('should return null when the signature was made with another secret', async () => {
    const forged = signature(VISITOR_ID, 'other-secret');
    cookieStore.get.mockReturnValue({ value: `${VISITOR_ID}.${forged}` });

    expect(await getVisitorId()).toBeNull();
  });

  it('should return null when the signature has a different length', async () => {
    cookieStore.get.mockReturnValue({ value: `${VISITOR_ID}.abc` });

    expect(await getVisitorId()).toBeNull();
  });

  it('should return null when the id is not a UUID v4 even if correctly signed', async () => {
    cookieStore.get.mockReturnValue({ value: `not-a-uuid.${signature('not-a-uuid')}` });

    expect(await getVisitorId()).toBeNull();
  });

  it('should reject when RATE_LIMIT_SECRET is not set', async () => {
    vi.stubEnv('RATE_LIMIT_SECRET', '');
    cookieStore.get.mockReturnValue({ value: `${VISITOR_ID}.${signature(VISITOR_ID)}` });

    await expect(getVisitorId()).rejects.toThrow('RATE_LIMIT_SECRET is not set.');
  });
});

describe('createVisitorId', () => {
  it('should return a UUID v4', async () => {
    expect(await createVisitorId()).toMatch(UUID_V4_REGEX);
  });

  it('should store the id and its signature in a hardened cookie', async () => {
    const visitorId = await createVisitorId();

    expect(cookieStore.set).toHaveBeenCalledWith(
      'visitor_id',
      `${visitorId}.${signature(visitorId)}`,
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      }),
    );
  });

  it('should mark the cookie as secure in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    await createVisitorId();

    expect(cookieStore.set).toHaveBeenCalledWith(
      'visitor_id',
      expect.any(String),
      expect.objectContaining({ secure: true }),
    );
  });

  it('should not mark the cookie as secure outside production', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    await createVisitorId();

    expect(cookieStore.set).toHaveBeenCalledWith(
      'visitor_id',
      expect.any(String),
      expect.objectContaining({ secure: false }),
    );
  });

  it('should produce a cookie that getVisitorId accepts', async () => {
    const visitorId = await createVisitorId();
    const [, cookieValue] = cookieStore.set.mock.calls[0]!;
    cookieStore.get.mockReturnValue({ value: cookieValue });

    expect(await getVisitorId()).toBe(visitorId);
  });
});
