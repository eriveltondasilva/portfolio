export const parseFrontmatterOptions = {
  properties: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    tags: {
      type: 'array',
      minItems: 1,
      maxItems: 5,
      uniqueItems: true,
      items: { type: 'string' },
    },
    published: { type: 'boolean', required: true },
    createdAt: { type: 'string', format: 'date', required: true },
    updatedAt: { type: 'string', format: 'date' },
    author: { type: 'string' },
  },
}

export const gfmOptions = { singleTilde: false }

export const highlightOptions = {}

export const highlightCodeLinesOptions = { showLineNumbers: true }

export const tocOptions = {
  headings: 'contents',
  maxDepth: 3,
  ordered: true,
}
