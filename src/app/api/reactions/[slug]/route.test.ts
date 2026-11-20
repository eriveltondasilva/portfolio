import { describe, expect, it, vi } from 'vitest';

import { getPostBySlug } from '@/lib/blog/posts';
import { PostStatus } from '@/lib/constants';
import { isNewVisitorRateLimited, isReactionRateLimited } from '@/lib/reactions/rate-limit';
import { readReactions, removeReaction, setReaction } from '@/lib/reactions/store';
import { createVisitorId, getVisitorId } from '@/lib/reactions/visitor';

import { DELETE, GET, PUT } from './route';

import type { PostIndex } from '@/types';

vi.mock('@/lib/blog/posts', () => ({ getPostBySlug: vi.fn() }));
vi.mock('@/lib/reactions/rate-limit', () => ({
  isNewVisitorRateLimited: vi.fn(),
  isReactionRateLimited: vi.fn(),
}));
vi.mock('@/lib/reactions/store', () => ({
  readReactions: vi.fn(),
  removeReaction: vi.fn(),
  setReaction: vi.fn(),
}));
vi.mock('@/lib/reactions/visitor', () => ({
  createVisitorId: vi.fn(),
  getVisitorId: vi.fn(),
}));

const URL = 'http://localhost/api/reactions/my-post';
const context = { params: Promise.resolve({ slug: 'my-post' }) } as Parameters<typeof GET>[1];
const state = { counts: { like: 1, learned: 0, thanks: 0 }, choice: 'like' } as const;

const publishedPost = { status: PostStatus.PUBLISHED } as PostIndex;
const archivedPost = { status: PostStatus.ARCHIVED } as PostIndex;
const draftPost = { status: PostStatus.DRAFT } as PostIndex;

describe('GET /api/reactions/[slug]', () => {
  it('should return 404 when the post does not exist', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(null);

    const response = await GET(new Request(URL), context);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'post-not-found' });
  });

  it('should return 404 when the post is a draft', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(draftPost);

    const response = await GET(new Request(URL), context);

    expect(response.status).toBe(404);
  });

  it('should return the reaction state without caching', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(publishedPost);
    vi.mocked(getVisitorId).mockResolvedValue('visitor-1');
    vi.mocked(readReactions).mockResolvedValue(state);

    const response = await GET(new Request(URL), context);

    expect(await response.json()).toEqual(state);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('should read the state using the current visitor id', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(publishedPost);
    vi.mocked(getVisitorId).mockResolvedValue('visitor-1');
    vi.mocked(readReactions).mockResolvedValue(state);

    await GET(new Request(URL), context);

    expect(readReactions).toHaveBeenCalledWith('my-post', 'visitor-1');
  });

  it('should still serve reactions of archived posts', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(archivedPost);
    vi.mocked(getVisitorId).mockResolvedValue(null);
    vi.mocked(readReactions).mockResolvedValue(state);

    const response = await GET(new Request(URL), context);

    expect(response.status).toBe(200);
  });

  it('should return 503 when the store fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(getPostBySlug).mockReturnValue(publishedPost);
    vi.mocked(getVisitorId).mockResolvedValue(null);
    vi.mocked(readReactions).mockRejectedValue(new Error('redis down'));

    const response = await GET(new Request(URL), context);

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'store-unavailable' });
  });
});

describe('PUT /api/reactions/[slug]', () => {
  it('should return 404 when the post does not exist', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(null);
    const request = new Request(URL, { method: 'PUT', body: JSON.stringify({ type: 'like' }) });

    const response = await PUT(request, context);

    expect(response.status).toBe(404);
  });

  it('should return 409 when the post is archived', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(archivedPost);
    const request = new Request(URL, { method: 'PUT', body: JSON.stringify({ type: 'like' }) });

    const response = await PUT(request, context);

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: 'post-archived' });
  });

  it('should return 429 without touching the store when the write is rate limited', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(publishedPost);
    vi.mocked(isReactionRateLimited).mockResolvedValue(true);
    const request = new Request(URL, { method: 'PUT', body: JSON.stringify({ type: 'like' }) });

    const response = await PUT(request, context);

    expect(response.status).toBe(429);
    expect(setReaction).not.toHaveBeenCalled();
  });

  it('should return 400 when the reaction type is unknown', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(publishedPost);
    const request = new Request(URL, { method: 'PUT', body: JSON.stringify({ type: 'boom' }) });

    const response = await PUT(request, context);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'invalid-reaction-type' });
  });

  it('should return 400 when the body is not valid JSON', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(publishedPost);
    const request = new Request(URL, { method: 'PUT', body: '{not json' });

    const response = await PUT(request, context);

    expect(response.status).toBe(400);
  });

  it('should save the reaction for an existing visitor without creating a new one', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(publishedPost);
    vi.mocked(getVisitorId).mockResolvedValue('visitor-1');
    vi.mocked(setReaction).mockResolvedValue(state);
    const request = new Request(URL, { method: 'PUT', body: JSON.stringify({ type: 'like' }) });

    const response = await PUT(request, context);

    expect(await response.json()).toEqual(state);
    expect(setReaction).toHaveBeenCalledWith('my-post', 'visitor-1', 'like');
    expect(createVisitorId).not.toHaveBeenCalled();
  });

  it('should register a new visitor when there is no valid cookie', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(publishedPost);
    vi.mocked(getVisitorId).mockResolvedValue(null);
    vi.mocked(createVisitorId).mockResolvedValue('new-visitor');
    vi.mocked(setReaction).mockResolvedValue(state);
    const request = new Request(URL, { method: 'PUT', body: JSON.stringify({ type: 'thanks' }) });

    await PUT(request, context);

    expect(setReaction).toHaveBeenCalledWith('my-post', 'new-visitor', 'thanks');
  });

  it('should return 429 when too many new visitors are being registered', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(publishedPost);
    vi.mocked(getVisitorId).mockResolvedValue(null);
    vi.mocked(isNewVisitorRateLimited).mockResolvedValue(true);
    const request = new Request(URL, { method: 'PUT', body: JSON.stringify({ type: 'like' }) });

    const response = await PUT(request, context);

    expect(response.status).toBe(429);
    expect(createVisitorId).not.toHaveBeenCalled();
  });

  it('should return 503 when the store fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(getPostBySlug).mockReturnValue(publishedPost);
    vi.mocked(getVisitorId).mockResolvedValue('visitor-1');
    vi.mocked(setReaction).mockRejectedValue(new Error('redis down'));
    const request = new Request(URL, { method: 'PUT', body: JSON.stringify({ type: 'like' }) });

    const response = await PUT(request, context);

    expect(response.status).toBe(503);
  });
});

describe('DELETE /api/reactions/[slug]', () => {
  it('should return 409 when the post is archived', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(archivedPost);

    const response = await DELETE(new Request(URL, { method: 'DELETE' }), context);

    expect(response.status).toBe(409);
  });

  it('should return 429 when the write is rate limited', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(publishedPost);
    vi.mocked(isReactionRateLimited).mockResolvedValue(true);

    const response = await DELETE(new Request(URL, { method: 'DELETE' }), context);

    expect(response.status).toBe(429);
  });

  it('should remove the reaction of the current visitor', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(publishedPost);
    vi.mocked(getVisitorId).mockResolvedValue('visitor-1');
    vi.mocked(removeReaction).mockResolvedValue({ ...state, choice: null });

    await DELETE(new Request(URL, { method: 'DELETE' }), context);

    expect(removeReaction).toHaveBeenCalledWith('my-post', 'visitor-1');
  });

  it('should only read the counts when the visitor is unknown', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(publishedPost);
    vi.mocked(getVisitorId).mockResolvedValue(null);
    vi.mocked(readReactions).mockResolvedValue({ ...state, choice: null });

    await DELETE(new Request(URL, { method: 'DELETE' }), context);

    expect(readReactions).toHaveBeenCalledWith('my-post', null);
    expect(removeReaction).not.toHaveBeenCalled();
  });
});
