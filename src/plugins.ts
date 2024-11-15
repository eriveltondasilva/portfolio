export const parseFrontmatterOptions = {
  properties: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    author: { type: 'string' },
    tags: {
      type: 'array',
      maxItems: 5,
      items: { type: 'string' },
      required: true,
    },
    published: { type: 'boolean', required: true },
    createdAt: { type: 'string', format: 'date', required: true },
    updatedAt: { type: 'string', format: 'date' },
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
