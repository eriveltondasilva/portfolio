import { z } from 'zod'

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const imageRegex = /\.(png|jpg|jpeg|webp|avif)$/i

const setRegexChecks = (schema: z.ZodString) =>
  schema.regex(slugRegex, 'Slug must be in kebab-case.')

export const seriesSchema = z
  .object({
    //
    slug: z
      .string()
      .min(1, 'Series slug is required.')
      .max(80, 'Slug must not exceed 80 characters.')
      .apply(setRegexChecks)
      .describe(
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
    date: z.iso
      .date()
      .describe('Publication date in ISO format (YYYY-MM-DD).')
      .meta({
        examples: ['2026-01-01'],
      }),
    //
    cover: z
      .string()
      .startsWith('./', 'Cover path must be an absolute path.')
      .regex(imageRegex, 'Cover must be a valid image file.')
      .optional()
      .describe('Path to the cover image used for the series.'),
  })
  .strict()
  .meta({
    title: 'Series Metadata',
    description: 'Schema for validating metadata of a content series.',
  })

export const postFrontmatterSchema = z
  .object({
    //
    slug: z
      .string()
      .min(1, 'Post slug is required.')
      .max(120)
      .apply(setRegexChecks)
      .describe('Unique identifier for the post.'),
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
      .array(z.string().min(1).describe('Tag identifier.'))
      .min(1, 'At least one tag is required.')
      .max(10)
      .describe('List of tags used to categorize the post.'),
    //
    date: z.iso
      .date()
      .describe('Publication date in ISO format (YYYY-MM-DD).')
      .meta({
        examples: ['2026-01-01'],
      }),
    //
    published: z
      .boolean()
      .default(false)
      .describe('Indicates whether the post is publicly visible.'),
    //
    cover: z
      .string()
      .startsWith('./', 'Cover path must be absolute.')
      .optional()
      .describe('Path to the cover image of the post.'),
    //
    series: z
      .string()
      .apply(setRegexChecks)
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
  .superRefine(({ series, order }, ctx) => {
    const hasSeries = series !== undefined
    const hasOrder = order !== undefined

    if (hasSeries && !hasOrder) {
      ctx.addIssue({
        code: 'custom',
        message:
          'The "order" field is required when the post belongs to a series.',
        path: ['order'],
      })
    }

    if (hasOrder && !hasSeries) {
      ctx.addIssue({
        code: 'custom',
        message: 'The "series" field is required when "order" is defined.',
        path: ['series'],
      })
    }
  })
  .strict()
  .meta({
    title: 'Post Frontmatter',
    description: 'Schema for validating frontmatter metadata of a blog post.',
  })

export const authorSchema = z
  .object({
    //
    slug: z
      .string()
      .min(1, 'Author slug is required.')
      .max(80, 'Slug must not exceed 80 characters.')
      .apply(setRegexChecks)
      .describe('Unique identifier of the author in kebab-case.'),
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
    avatar: z
      .url()
      .optional()
      .describe('Path to the avatar image of the author.'),
    //
    socials: z
      .object({
        github: z.url().optional().describe('GitHub profile URL.'),
        linkedin: z.url().optional().describe('LinkedIn profile URL.'),
        twitter: z.url().optional().describe('Twitter profile URL.'),
      })
      .describe('Social media profiles of the author.'),
  })
  .strict()
  .meta({
    title: 'Author Metadata',
    description: 'Schema for validating metadata of a blog author.',
  })
