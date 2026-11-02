import { NextResponse } from 'next/server';

import { getPostBySlug } from '@/lib/blog/posts';
import { PostStatus } from '@/lib/constants';
import { isReactionType } from '@/lib/reactions/config';
import {
  isNewVisitorRateLimited,
  isReactionRateLimited,
} from '@/lib/reactions/rate-limit';
import {
  readReactions,
  removeReaction,
  setReaction,
} from '@/lib/reactions/store';
import { createVisitorId, getVisitorId } from '@/lib/reactions/visitor';

import type { ReactionState } from '@/lib/reactions/config';

type Context = RouteContext<'/api/reactions/[slug]'>;

type ReactionErrorCode =
  | 'post-not-found'
  | 'post-archived'
  | 'rate-limited'
  | 'invalid-reaction-type'
  | 'store-unavailable';

function errorResponse(code: ReactionErrorCode, status: number) {
  return NextResponse.json({ error: code }, { status });
}

// Drafts are not public, so they behave as if they did not exist
function findVisiblePost(slug: string) {
  const post = getPostBySlug(slug);

  return post && post.status !== PostStatus.DRAFT ? post : null;
}

async function rejectInvalidWrite(request: Request, slug: string) {
  const post = findVisiblePost(slug);

  if (!post) return errorResponse('post-not-found', 404);
  if (post.status === PostStatus.ARCHIVED) {
    return errorResponse('post-archived', 409);
  }
  if (await isReactionRateLimited(request)) {
    return errorResponse('rate-limited', 429);
  }

  return null;
}

async function respondWithState(loadState: () => Promise<ReactionState>) {
  try {
    const state = await loadState();

    // The payload mixes public counts with the visitor's private choice
    return NextResponse.json(state, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('[reactions] Store failure:', error);

    return errorResponse('store-unavailable', 503);
  }
}

// Null means the new-visitor limit was hit; the cookie is only created when it was not
async function registerNewVisitor(request: Request): Promise<string | null> {
  if (await isNewVisitorRateLimited(request)) return null;

  return createVisitorId();
}

export async function GET(_request: Request, { params }: Context) {
  const { slug } = await params;

  if (!findVisiblePost(slug)) return errorResponse('post-not-found', 404);

  return respondWithState(async () =>
    readReactions(slug, await getVisitorId()),
  );
}

export async function PUT(request: Request, { params }: Context) {
  const { slug } = await params;

  const rejection = await rejectInvalidWrite(request, slug);
  if (rejection) return rejection;

  const body: { type?: unknown } | null = await request
    .json()
    .catch(() => null);
  const type = body?.type;

  if (!isReactionType(type)) return errorResponse('invalid-reaction-type', 400);

  const visitorId =
    (await getVisitorId()) ?? (await registerNewVisitor(request));

  if (!visitorId) return errorResponse('rate-limited', 429);

  return respondWithState(() => setReaction(slug, visitorId, type));
}

export async function DELETE(request: Request, { params }: Context) {
  const { slug } = await params;

  const rejection = await rejectInvalidWrite(request, slug);
  if (rejection) return rejection;

  // Without a cookie there is nothing to remove, and no cookie should be created for it
  const visitorId = await getVisitorId();

  return respondWithState(() =>
    visitorId ? removeReaction(slug, visitorId) : readReactions(slug, null),
  );
}
