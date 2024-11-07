import type { MDXComponents } from 'mdx/types'
import { highlight } from 'sugar-high'

// import { Code } from '@/components/mdx'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Code({ children, ...props }: { children: string; props: any }) {
  const codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // h1: ({ children }) => (
    //   <h1 className="text-3xl font-bold">{children}</h1>
    // ),
    code: Code,
    ...components,
  }
}
