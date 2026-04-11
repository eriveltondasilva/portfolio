// src/app/(main)/series/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

import { getAllSeries, getSeriesBySlug } from '@/lib/blog/series'
import { getPostsBySeries } from '@/lib/blog/posts'
import { SeriesStatus } from '@/lib/constants'
import { formatDate } from '@/lib'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return  getAllSeries().map(({ slug }) => ({ slug }))
}

const statusLabel: Record<SeriesStatus, string> = {
  [SeriesStatus.PLANNED]: 'Planejada',
  [SeriesStatus.IN_PROGRESS]: 'Em andamento',
  [SeriesStatus.COMPLETE]: 'Completa',
}

const statusStyle: Record<SeriesStatus, { color: string; border: string; bg: string }> = {
  [SeriesStatus.PLANNED]: {
    bg: '#f9fafb',
    border: '#e5e7eb',
    color: '#6b7280',
  },
  [SeriesStatus.IN_PROGRESS]: {
    bg: '#fffbeb',
    border: '#fde68a',
    color: '#d97706',
  },
  [SeriesStatus.COMPLETE]: {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    color: '#16a34a',
  },
}

export default async function OGImage({ params }: PageProps<'/series/[slug]'>) {
  const { slug } = await params
  const series = getSeriesBySlug(slug)

  if (!series) return new ImageResponse(<div>Not found</div>, size)

  const posts = getPostsBySeries(slug)
  const postCount = posts.length
  const style = statusStyle[series.status]
  const label = statusLabel[series.status]
  const displayDate = formatDate(series.publishedAt, { dateStyle: 'long' })

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
          <span style={{ color: '#9ca3af' }}>series</span>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ color: '#9ca3af' }}>{slug}</span>
        </div>

        {/* Middle: title + description + status */}
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
            {series.title}
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
            {series.description}
          </div>

          {/* Status badge */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: 999,
                padding: '5px 14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: style.color,
                }}
              />
              <span
                style={{
                  color: style.color,
                  fontSize: 14,
                  fontFamily: 'monospace',
                  fontWeight: 600,
                }}
              >
                {label}
              </span>
            </div>
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
          {/* Post count */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#374151',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                color: '#ea580c',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {postCount}
            </div>
            <span style={{ color: '#6b7280', fontSize: 15 }}>
              {postCount > 1 ? 'posts nesta série' : 'post nesta série'}
            </span>
          </div>

          {/* Date */}
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
          </div>
        </div>
      </div>
    </div>,
    size,
  )
}
