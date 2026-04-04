// src/app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

import { getAllPostSlugs, getPostBySlug } from '@/lib/blog/posts'
import { getAuthorsBySlugs } from '@/lib/blog/authors'
import { formatDate, getInitials } from '@/lib'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  // Includes archived posts to generate their OG images as well.
  return getAllPostSlugs()
}

export default async function OGImage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) return new ImageResponse(<div>Not found</div>, size)

  const authors = getAuthorsBySlugs(post.authors)
  const tags = post.tags.slice(0, 4)
  const displayDate = formatDate(post.updatedAt ?? post.publishedAt, {
    dateStyle: 'long',
  })

  return new ImageResponse(
    <div
      style={{
        background: '#ffffff',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          display: 'flex',
          height: 5,
          width: '100%',
          background: 'linear-gradient(to right, #f97316, #fbbf24, #ea580c)',
        }}
      />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 64px 52px',
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 16,
            fontFamily: 'monospace',
          }}
        >
          <span style={{ color: '#f97316', fontWeight: 600 }}>erivelton.dev</span>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ color: '#9ca3af' }}>blog</span>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ color: '#9ca3af' }}>{slug}</span>
        </div>

        {/* Middle: title + description + tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title */}
          <div
            style={{
              display: 'flex',
              color: '#111827',
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-1px',
              maxWidth: 980,
            }}
          >
            {post.title}
          </div>

          {/* Description */}
          <div
            style={{
              display: 'flex',
              color: '#6b7280',
              fontSize: 22,
              lineHeight: 1.5,
              maxWidth: 860,
            }}
          >
            {post.description}
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: 999,
                  padding: '5px 14px',
                  color: '#ea580c',
                  fontSize: 14,
                  fontFamily: 'monospace',
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #e5e7eb',
            paddingTop: 24,
          }}
        >
          {/* Authors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {authors.map((author) => (
              <div key={author.slug} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    display: 'flex',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  {getInitials(author.name)}
                </div>
                <span style={{ color: '#374151', fontSize: 15, fontWeight: 600 }}>
                  {author.name}
                </span>
              </div>
            ))}
          </div>

          {/* Date + reading time */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#9ca3af',
              fontSize: 15,
              fontFamily: 'monospace',
            }}
          >
            <span>{displayDate}</span>
            <span style={{ color: '#d1d5db' }}>·</span>
            <span>{post.readingTime} min de leitura</span>
          </div>
        </div>
      </div>
    </div>,
    size,
  )
}
