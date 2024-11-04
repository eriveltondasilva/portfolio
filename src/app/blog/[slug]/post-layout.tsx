type LayoutProps = {
  frontmatter: {
    title: string
    description: string
    tags: string[]
    published: boolean
    createdAt: string
    updatedAt: string
  }
  children: React.ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PostLayout({ frontmatter, children }: LayoutProps) {
  const { title, description, tags, published, createdAt } = frontmatter

  return (
    <article>
      <h1>title: {title}</h1>
      <p>description: {description}</p>
      <p>tags: {tags}</p>
      <p>published: {published}</p>
      <p>createdAt: {createdAt}</p>
      <br />

      {children}
    </article>
  )
}
