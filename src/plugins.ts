export const parseFrontmatterOptions = {
  properties: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    tags: {
      type: 'array',
      maxItems: 5,
      items: { type: 'string' },
      required: true,
    },
    published: { type: 'boolean', required: true },
    createdAt: { type: 'string', format: 'date', required: true },
    updatedAt: { type: 'string', format: 'date', required: true },
  },
}

export const remarkGfmOptions = { singleTilde: false }
