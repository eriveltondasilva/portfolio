import { z } from 'zod'

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const setRegexChecks = (schema: z.ZodString) =>
  schema.regex(slugRegex, 'O slug deve estar em kebab-case')

export const seriesSchema = z.object({
  slug: z
    .string()
    .min(1, 'O slug da série é obrigatório.')
    .apply(setRegexChecks),
  title: z.string().min(1, 'O título da série é obrigatório.'),
  description: z.string().min(1, 'A descrição da série é obrigatória.'),
  date: z.iso.date(),
  cover: z.string().optional(),
})

export const postFrontmatterSchema = z
  .object({
    slug: z
      .string()
      .min(1, 'O slug do post é obrigatório.')
      .apply(setRegexChecks),
    title: z.string().min(1, 'O título do post é obrigatório.'),
    description: z.string().min(1, 'A descrição do post é obrigatória.'),
    tags: z.array(z.string()).min(1, 'Adicione pelo menos uma tag.'),
    date: z.iso.date(),
    published: z.boolean().default(false),
    cover: z.string().optional(),
    series: z.string().apply(setRegexChecks).optional(),
    order: z.number().int().positive().optional(),
  })
  .superRefine(({ series, order }, ctx) => {
    const hasSeries = series !== undefined
    const hasOrder = order !== undefined

    if (hasSeries && !hasOrder) {
      ctx.addIssue({
        code: 'custom',
        message:
          'O campo "order" é obrigatório quando o post pertence a uma série.',
        path: ['order'],
      })
    }

    if (hasOrder && !hasSeries) {
      ctx.addIssue({
        code: 'custom',
        message: 'O campo "series" é obrigatório quando o post define "order".',
        path: ['series'],
      })
    }
  })
