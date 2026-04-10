import { FilePenIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icon'
import { PostReactions } from '@/components/post-reactions'

interface Props {
  slug: string
  editUrl: string
}

export function PostFooterActions({ slug, editUrl }: Props) {
  return (
    <footer className='flex items-center justify-between'>
      <PostReactions slug={slug} />

      <Button variant='link' asChild>
        <a href={editUrl} target='_blank' rel='noopener noreferrer'>
          <Icon iconNode={FilePenIcon} />
          Sugerir alterações
        </a>
      </Button>
    </footer>
  )
}
