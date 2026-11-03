import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { getAuthorsBySlugs } from '@/lib/blog/authors';
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog/posts';
import { BASE_URL, SITE_NAME } from '@/lib/constants';
import { createListFormatter, formatDate } from '@/lib/format';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = SITE_NAME;

const MAX_TAGS = 4;
const FONTS_DIR = join(process.cwd(), 'src', 'assets', 'fonts');

export function generateStaticParams() {
  return getAllPostSlugs();
}

export default async function OGImage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(<div>Not found</div>, { ...size, status: 404 });
  }

  const [regularFont, semiBoldFont] = await Promise.all([
    readFile(join(FONTS_DIR, 'Geist-Regular.otf')),
    readFile(join(FONTS_DIR, 'Geist-SemiBold.otf')),
  ]);

  const authorNames = createListFormatter().format(
    getAuthorsBySlugs(post.authors).map(
      (author) => author.name.split(/\s+/).at(0) ?? '',
    ),
  );
  const displayDate = formatDate(post.updatedAt ?? post.publishedAt, {
    dateStyle: 'medium',
  });

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
            {post.title}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 32,
              lineHeight: 1.4,
              color: '#6b7280',
            }}
          >
            {post.description}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {post.tags.slice(0, MAX_TAGS).map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  padding: '6px 18px',
                  borderRadius: 999,
                  border: '2px solid #fed7aa',
                  background: '#fff7ed',
                  color: '#ea580c',
                  fontSize: 28,
                }}
              >
                {`#${tag}`}
              </div>
            ))}
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
          <span>{`Por ${authorNames}`}</span>
          <span>{`${displayDate} · ${post.readingTime} min de leitura`}</span>
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
