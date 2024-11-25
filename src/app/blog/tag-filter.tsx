'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Badge } from '@/components/badge'

export function TagFilter({ allTags }: { allTags: string[] }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const activeTag = searchParams.get('tag')

  const updateTag = (tag?: string) => {
    const params = new URLSearchParams(searchParams)
    if (tag) {
      params.set('tag', tag)
    } else {
      params.delete('tag')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className='mb-4 flex flex-wrap gap-2 uppercase'>
      <Badge
        size='md'
        bordered={!activeTag}
        disabled={!activeTag}
        onClick={() => updateTag()}
        pill
      >
        Todos
      </Badge>
      {allTags.map((tag) => (
        <Badge
          key={tag}
          bordered={activeTag === tag}
          disabled={activeTag === tag}
          onClick={() => updateTag(tag)}
          size='md'
          pill
        >
          {tag}
        </Badge>
      ))}
    </div>
  )
}
