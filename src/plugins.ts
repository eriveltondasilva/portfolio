export const parseFrontmatterOptions = {
  properties: {
    title: { type: 'string', minLength: 5, maxLength: 150, required: true },
    description: {
      type: 'string',
      minLength: 5,
      maxLength: 250,
      required: true,
    },
    isPublished: { type: 'boolean', required: true },
    createdAt: { type: 'string', format: 'date', required: true },
    updatedAt: { type: 'string', format: 'date' },
    tags: {
      type: 'array',
      minItems: 1,
      maxItems: 5,
      uniqueItems: true,
      items: { type: 'string', alowEmpty: false },
    },
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
