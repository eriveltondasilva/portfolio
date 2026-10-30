import { z } from 'zod';

import { PostStatus, ProjectStatus, SeriesStatus } from '@/lib/constants';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugSchema(maxLength: number, label = 'Slug') {
  return z
    .string()
    .min(1, `${label} is required.`)
    .max(maxLength, `${label} must not exceed ${maxLength} characters.`)
    .regex(SLUG_REGEX, `${label} must be in kebab-case.`);
}

function hasUniqueItems(items: readonly string[]): boolean {
  return new Set(items).size === items.length;
}

const socialsSchema = z
  .strictObject({
    //
    github: z
      .url({
        protocol: /^https$/,
        hostname: /^github\.com$/,
      })
      .describe('GitHub profile URL. Example: https://github.com/username'),
    //
    linkedin: z
      .url({
        protocol: /^https$/,
        hostname: /^(www\.)?linkedin\.com$/,
      })
      .optional()
      .describe(
        'LinkedIn profile URL. Example: https://linkedin.com/in/username',
      ),
    //
    twitter: z
      .url({
        protocol: /^https$/,
        hostname: /^(www\.)?(x|twitter)\.com$/,
      })
      .optional()
      .describe('Twitter profile URL. Example: https://twitter.com/username'),
  })
  .describe(
    "Social media profiles of the author. The 'github' field is required, while the other fields are optional.",
  );

export const authorSchema = z
  .strictObject({
    //
    slug: slugSchema(80, 'Author slug').describe(
      'Unique identifier of the author in kebab-case.',
    ),
    //
    name: z
      .string()
      .min(1, 'Author name is required.')
      .max(100)
      .describe('Full name of the author.'),
    //
    bio: z
      .string()
      .min(10, 'Bio must contain at least 10 characters.')
      .max(300)
      .describe('Short summary of the author.'),
    //
    skills: z
      .array(z.string().min(1).describe('Skill name.'))
      .min(1, 'At least one skill is required.')
      .max(20)
      .describe('List of skills or technologies the author is proficient in.'),
    //
    socials: socialsSchema,
  })
  .meta({
    title: 'Author Metadata',
    description: 'Schema for validating metadata of a blog author.',
  });

export const postSchema = z
  .strictObject({
    //
    slug: slugSchema(120, 'Post slug').describe(
      'Unique identifier for the post.',
    ),
    //
    title: z
      .string()
      .min(1, 'Post title is required.')
      .max(160)
      .describe('Human readable title of the post.'),
    //
    description: z
      .string()
      .min(10, 'Description must contain at least 10 characters.')
      .max(300)
      .describe('Short summary of the post.'),
    //
    tags: z
      .array(slugSchema(50, 'Tag').describe('Tag identifier.'))
      .min(1, 'At least one tag is required.')
      .max(10)
      .refine(hasUniqueItems, 'Tags must be unique.')
      .describe('List of tags used to categorize the post.'),
    //
    publishedAt: z.iso
      .date()
      .describe('Publication date in ISO format (YYYY-MM-DD).'),
    //
    updatedAt: z.iso
      .date()
      .optional()
      .describe('Date of the last significant update to the post.'),
    //
    status: z
      .enum(PostStatus)
      .default(PostStatus.DRAFT)
      .describe('Visibility state of the post.'),
    //
    authors: z
      .array(slugSchema(80, 'Author slug').describe('Author slug.'))
      .min(1, 'At least one author is required.')
      .refine(hasUniqueItems, 'Authors must be unique.')
      .describe('List of author slugs associated with this post.'),
    //
    series: slugSchema(80, 'Series slug')
      .optional()
      .describe('Series identifier if the post belongs to a series.'),
    //
    order: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Position of the post inside the series.')
      .meta({
        examples: [1, 2, 3],
      }),
  })
  .superRefine(({ series, order, publishedAt, updatedAt }, ctx) => {
    const hasSeries = series !== undefined;
    const hasOrder = order !== undefined;

    if (hasSeries && !hasOrder) {
      ctx.addIssue({
        code: 'custom',
        message:
          'The "order" field is required when the post belongs to a series.',
        path: ['order'],
      });
    }

    if (hasOrder && !hasSeries) {
      ctx.addIssue({
        code: 'custom',
        message: 'The "series" field is required when "order" is defined.',
        path: ['series'],
      });
    }

    // ISO dates (YYYY-MM-DD) compare correctly as strings.
    if (updatedAt !== undefined && updatedAt < publishedAt) {
      ctx.addIssue({
        code: 'custom',
        message: 'The "updatedAt" date cannot be earlier than "publishedAt".',
        path: ['updatedAt'],
      });
    }
  })
  .meta({
    title: 'Post Frontmatter',
    description:
      'Schema for validating the metadata (meta.yml) of a blog post.',
  });

export const seriesSchema = z
  .strictObject({
    //
    slug: slugSchema(80, 'Series slug').describe(
      'Unique identifier of the series in kebab-case (e.g. nextjs-pro).',
    ),
    //
    title: z
      .string()
      .min(1, 'Series title is required.')
      .max(120, 'Title must not exceed 120 characters.')
      .describe('Human readable title of the series.'),
    //
    description: z
      .string()
      .min(10, 'Description must contain at least 10 characters.')
      .max(300, 'Description must not exceed 300 characters.')
      .describe('Short summary describing the series content.'),
    //
    publishedAt: z.iso
      .date()
      .describe('Publication date in ISO format (YYYY-MM-DD).'),
    //
    status: z
      .enum(SeriesStatus)
      .default(SeriesStatus.PLANNED)
      .describe('Indicates the current state of the series.'),
  })
  .meta({
    title: 'Series Metadata',
    description: 'Schema for validating metadata of a content series.',
  });

export const projectSchema = z
  .strictObject({
    //
    slug: slugSchema(80, 'Project slug').describe(
      'Unique identifier for the project in kebab-case.',
    ),
    //
    name: z.string().min(1).max(100).describe('Display name of the project.'),
    //
    description: z
      .string()
      .min(10)
      .max(500)
      .describe('Short summary of the project.'),
    //
    repository: z
      .url({
        protocol: /^https$/,
        hostname: /^github\.com$/,
      })
      .describe('GitHub repository URL.'),
    //
    url: z.url().optional().describe('Live URL of the project, if deployed.'),
    //
    tags: z
      .array(slugSchema(50, 'Tag'))
      .max(10)
      .refine(hasUniqueItems, 'Tags must be unique.')
      .describe('Technologies or topics related to the project.'),
    //
    status: z
      .enum(ProjectStatus)
      .default(ProjectStatus.ACTIVE)
      .describe('Current state of the project.'),
    //
    featured: z
      .boolean()
      .default(false)
      .describe('Whether the project should be highlighted.'),
  })
  .meta({
    title: 'Project Metadata',
    description: 'Schema for validating metadata of a portfolio project.',
  });
