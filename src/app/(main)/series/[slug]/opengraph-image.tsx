import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { getAllSeries, getSeriesBySlug } from '@/lib/blog/series';
import {
  AUTHOR_NAME,
  BASE_URL,
  SERIES_STATUS_LABEL,
  SeriesStatus,
} from '@/lib/constants';
import { formatDate } from '@/lib/format';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${AUTHOR_NAME} — Séries`;

const FONTS_DIR = join(process.cwd(), 'src', 'assets', 'fonts');

const statusStyle: Record<
  SeriesStatus,
  { color: string; border: string; background: string }
> = {
  [SeriesStatus.PLANNED]: {
    background: '#f9fafb',
    border: '#e5e7eb',
    color: '#6b7280',
  },
  [SeriesStatus.IN_PROGRESS]: {
    background: '#fffbeb',
    border: '#fde68a',
    color: '#d97706',
  },
  [SeriesStatus.COMPLETE]: {
    background: '#f0fdf4',
    border: '#bbf7d0',
    color: '#16a34a',
  },
};

export function generateStaticParams() {
  return getAllSeries().map(({ slug }) => ({ slug }));
}

export default async function OGImage({ params }: PageProps<'/series/[slug]'>) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);

  if (!series) {
    return new ImageResponse(<div>Not found</div>, { ...size, status: 404 });
  }

  const [regularFont, semiBoldFont] = await Promise.all([
    readFile(join(FONTS_DIR, 'Geist-Regular.otf')),
    readFile(join(FONTS_DIR, 'Geist-SemiBold.otf')),
  ]);

  const postCount = series.posts.length;
  const style = statusStyle[series.status];
  const displayDate = formatDate(series.publishedAt, { dateStyle: 'medium' });

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: '#ffffff',
        fontFamily: 'Geist',
      }}
    >
      <div
        style={{
          display: 'flex',
          height: 12,
          background: 'linear-gradient(to right, #f97316, #fbbf24, #ea580c)',
        }}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 72px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            fontWeight: 600,
            color: '#f97316',
          }}
        >
          {new URL(BASE_URL).hostname}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 52,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-2px',
              color: '#111827',
            }}
          >
            {series.title}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 32,
              lineHeight: 1.4,
              color: '#6b7280',
            }}
          >
            {series.description}
          </div>

          <div style={{ display: 'flex' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '6px 18px',
                borderRadius: 999,
                border: `2px solid ${style.border}`,
                background: style.background,
                color: style.color,
                fontSize: 28,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: style.color,
                }}
              />
              {SERIES_STATUS_LABEL[series.status]}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 28,
            color: '#4b5563',
            borderTop: '3px solid #e5e7eb',
            paddingTop: 24,
          }}
        >
          <span>{`${postCount} ${postCount === 1 ? 'post' : 'posts'} nesta série`}</span>
          <span>{`Publicada em ${displayDate}`}</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Geist', data: regularFont, weight: 400, style: 'normal' },
        { name: 'Geist', data: semiBoldFont, weight: 600, style: 'normal' },
      ],
    },
  );
}
