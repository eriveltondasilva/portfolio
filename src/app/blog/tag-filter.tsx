import { Badge } from '@/components/badge'
import Link from 'next/link'

type TagFilterProp = {
  allTags: string[]
  tag?: string | undefined
}
export function TagFilter({ allTags, tag }: TagFilterProp) {
  return (
    <div className='mb-4 flex flex-wrap gap-2 uppercase'>
      <Link href='/blog'>
        <Badge size='md' bordered={tag === undefined} pill>
          Todos
        </Badge>
      </Link>
      {allTags.map((currentTag) => (
        <Link key={currentTag} href={`?tag=${currentTag}`}>
          <Badge bordered={tag === currentTag} pill size='md'>
            {currentTag}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
