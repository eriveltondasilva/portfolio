'use client'
import { Post } from '@/types'
import { useState } from 'react'

export async function useTagFilter(posts: (Post | null)[]) {
  const [selectedTag, setSelectedTag] = useState(null)

  const allTags = [...new Set(posts.flatMap((post) => post?.tags))]

  const filteredPosts =
    selectedTag ?
      posts.filter((post) => post?.tags?.includes(selectedTag))
    : posts

  return {
    allTags,
    filteredPosts,
    selectedTag,
    setSelectedTag,
  }
}
