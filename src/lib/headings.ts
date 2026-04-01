// import { readFileSync } from 'node:fs'
// import { basename, dirname, join } from 'node:path'

// import { POSTS_DIR } from '#/lib/constants'

// export interface Heading {
//   id: string
//   text: string
//   level: 2 | 3
// }

// function slugify(text: string): string {
//   return text
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, '')
//     .replace(/[\s_-]+/g, '-')
//   // .replace(/^-+|-+$/g, '')
// }

// function extractHeadings(content: string): Heading[] {
//   const headingRegex = /^(#{2,3})\s+(.+)$/gm
//   const headings: Heading[] = []
//   let match

//   while ((match = headingRegex.exec(content)) !== null) {
//     const level = match[1].length as 2 | 3
//     const text = match[2].replace(/`[^`]*`/g, (m) => m.slice(1, -1)).trim()
//     headings.push({ id: slugify(text), text, level })
//   }

//   return headings
// }

// export function getPostHeadings(filePath: string): Heading[] {
//   const mdxPath = join(POSTS_DIR, basename(dirname(filePath)), 'index.mdx')
//   const content = readFileSync(mdxPath, 'utf-8')
//   return extractHeadings(content)
// }
