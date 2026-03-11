import { z } from 'zod'

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const seriesSchema = z.object({
  slug: z
    .string()
    .min(1, 'O slug da série é obrigatório.')
    .regex(slugRegex, 'O slug deve estar em kebab-case'),
  title: z.string().min(1, 'O título da série é obrigatório.'),
  description: z.string().min(1, 'A descrição da série é obrigatória.'),
  date: z.iso.date(),
  cover: z.string().optional(),
})

export const postSchema = z.object({
  slug: z
    .string()
    .min(1, 'O slug do post é obrigatório.')
    .regex(slugRegex, 'O slug deve estar em kebab-case'),
  title: z.string().min(1, 'O título do post é obrigatório.'),
  description: z.string().min(1, 'A descrição do post é obrigatória.'),
  tags: z.array(z.string()).min(1, 'Adicione pelo menos uma tag.'),
  date: z.iso.date(),
  cover: z.string().optional(),
  published: z.boolean().default(false),
  series: z.string().regex(slugRegex).optional(),
  order: z.number().int().positive().optional(),
})
