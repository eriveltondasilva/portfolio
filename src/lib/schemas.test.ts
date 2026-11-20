import { describe, expect, it } from 'vitest';

import { PostStatus, ProjectStatus, SeriesStatus } from '@/lib/constants';
import { authorSchema, postSchema, projectSchema, seriesSchema } from '@/lib/schemas';

const validPost = {
  slug: 'my-first-post',
  title: 'My first post',
  description: 'A short summary of the post.',
  tags: ['react', 'nextjs'],
  publishedAt: '2026-01-10',
  authors: ['erivelton'],
};

const validAuthor = {
  slug: 'erivelton',
  name: 'Erivelton Silva',
  bio: 'Frontend developer who loves React.',
  skills: ['React'],
  socials: { github: 'https://github.com/erivelton' },
};

const validSeries = {
  slug: 'nextjs-pro',
  title: 'Next.js Pro',
  description: 'A series about advanced Next.js.',
  publishedAt: '2026-01-10',
};

const validProject = {
  slug: 'portfolio',
  name: 'Portfolio',
  description: 'Personal portfolio.',
  repository: 'https://github.com/erivelton/portfolio',
  tags: ['nextjs'],
};

const issuePaths = (result: { error?: { issues: { path: PropertyKey[] }[] } }) =>
  (result.error?.issues ?? []).map((issue) => issue.path.join('.'));

describe('postSchema', () => {
  it('should accept a valid post and default its status to draft', () => {
    const result = postSchema.safeParse(validPost);

    expect(result.data?.status).toBe(PostStatus.DRAFT);
  });

  it('should reject a post with a series but no order', () => {
    const result = postSchema.safeParse({ ...validPost, series: 'nextjs-pro' });

    expect(issuePaths(result)).toContain('order');
  });

  it('should reject a post with an order but no series', () => {
    const result = postSchema.safeParse({ ...validPost, order: 1 });

    expect(issuePaths(result)).toContain('series');
  });

  it('should accept a post with both series and order', () => {
    const result = postSchema.safeParse({ ...validPost, series: 'nextjs-pro', order: 2 });

    expect(result.success).toBe(true);
  });

  it('should reject a non-positive order', () => {
    const result = postSchema.safeParse({ ...validPost, series: 'nextjs-pro', order: 0 });

    expect(result.success).toBe(false);
  });

  it('should reject updatedAt equal to publishedAt', () => {
    const result = postSchema.safeParse({ ...validPost, updatedAt: '2026-01-10' });

    expect(issuePaths(result)).toContain('updatedAt');
  });

  it('should reject updatedAt earlier than publishedAt', () => {
    const result = postSchema.safeParse({ ...validPost, updatedAt: '2026-01-01' });

    expect(issuePaths(result)).toContain('updatedAt');
  });

  it('should accept updatedAt later than publishedAt', () => {
    const result = postSchema.safeParse({ ...validPost, updatedAt: '2026-02-01' });

    expect(result.success).toBe(true);
  });

  it('should reject duplicated tags', () => {
    const result = postSchema.safeParse({ ...validPost, tags: ['react', 'react'] });

    expect(issuePaths(result)).toContain('tags');
  });

  it('should reject an empty tag list', () => {
    const result = postSchema.safeParse({ ...validPost, tags: [] });

    expect(result.success).toBe(false);
  });

  it('should reject duplicated authors', () => {
    const result = postSchema.safeParse({ ...validPost, authors: ['erivelton', 'erivelton'] });

    expect(issuePaths(result)).toContain('authors');
  });

  it.each(['My_Post', 'post-', '-post', 'double--dash', 'Upper', 'with space'])(
    'should reject the non kebab-case slug "%s"',
    (slug) => {
      expect(postSchema.safeParse({ ...validPost, slug }).success).toBe(false);
    },
  );

  it('should reject an invalid calendar date', () => {
    const result = postSchema.safeParse({ ...validPost, publishedAt: '2026-13-01' });

    expect(issuePaths(result)).toContain('publishedAt');
  });

  it('should reject a description shorter than 10 characters', () => {
    const result = postSchema.safeParse({ ...validPost, description: 'Too short' });

    expect(issuePaths(result)).toContain('description');
  });

  it('should reject unknown keys', () => {
    const result = postSchema.safeParse({ ...validPost, draft: true });

    expect(result.success).toBe(false);
  });
});

describe('authorSchema', () => {
  it('should accept an author with only the required GitHub profile', () => {
    expect(authorSchema.safeParse(validAuthor).success).toBe(true);
  });

  it('should accept a GitHub profile URL with a trailing slash', () => {
    const socials = { github: 'https://github.com/erivelton/' };

    expect(authorSchema.safeParse({ ...validAuthor, socials }).success).toBe(true);
  });

  it('should reject a GitHub URL that points to a repository', () => {
    const socials = { github: 'https://github.com/erivelton/portfolio' };

    expect(authorSchema.safeParse({ ...validAuthor, socials }).success).toBe(false);
  });

  it('should reject a GitHub URL over http', () => {
    const socials = { github: 'http://github.com/erivelton' };

    expect(authorSchema.safeParse({ ...validAuthor, socials }).success).toBe(false);
  });

  it('should accept a Twitter profile hosted on x.com', () => {
    const socials = { ...validAuthor.socials, twitter: 'https://x.com/erivelton' };

    expect(authorSchema.safeParse({ ...validAuthor, socials }).success).toBe(true);
  });

  it('should reject a LinkedIn URL from another host', () => {
    const socials = { ...validAuthor.socials, linkedin: 'https://example.com/in/erivelton' };

    expect(authorSchema.safeParse({ ...validAuthor, socials }).success).toBe(false);
  });

  it('should reject a bio shorter than 10 characters', () => {
    expect(authorSchema.safeParse({ ...validAuthor, bio: 'Short' }).success).toBe(false);
  });

  it('should reject an author without skills', () => {
    expect(authorSchema.safeParse({ ...validAuthor, skills: [] }).success).toBe(false);
  });
});

describe('seriesSchema', () => {
  it('should default the status to planned', () => {
    const result = seriesSchema.safeParse(validSeries);

    expect(result.data?.status).toBe(SeriesStatus.PLANNED);
  });

  it('should reject an unknown status', () => {
    const result = seriesSchema.safeParse({ ...validSeries, status: 'finished' });

    expect(result.success).toBe(false);
  });
});

describe('projectSchema', () => {
  it('should default status to active and featured to false', () => {
    const result = projectSchema.safeParse(validProject);

    expect(result.data).toMatchObject({ status: ProjectStatus.ACTIVE, featured: false });
  });

  it('should reject a repository that is not hosted on GitHub', () => {
    const repository = 'https://gitlab.com/erivelton/portfolio';

    expect(projectSchema.safeParse({ ...validProject, repository }).success).toBe(false);
  });

  it('should reject a live URL over http', () => {
    const url = 'http://example.com';

    expect(projectSchema.safeParse({ ...validProject, url }).success).toBe(false);
  });

  it('should reject duplicated tags', () => {
    const result = projectSchema.safeParse({ ...validProject, tags: ['nextjs', 'nextjs'] });

    expect(issuePaths(result)).toContain('tags');
  });
});
