import { getAllTags } from '@/lib/posts'

export default function TagsPage() {
  const tags = getAllTags()
  return (
    <div>
      <h1>Tags</h1>
      <br />
      <ul>
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  )
}
