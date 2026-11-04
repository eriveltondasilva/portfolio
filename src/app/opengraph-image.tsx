import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { getPrimaryAuthor } from '@/lib/blog/authors';
import {
  BASE_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  TWITTER_HANDLE,
} from '@/lib/constants';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = SITE_NAME;

const MAX_SKILLS = 4;
const FONTS_DIR = join(process.cwd(), 'src', 'assets', 'fonts');

export default async function OGImage() {
  const author = getPrimaryAuthor();

  const [regularFont, semiBoldFont] = await Promise.all([
    readFile(join(FONTS_DIR, 'Geist-Regular.otf')),
    readFile(join(FONTS_DIR, 'Geist-SemiBold.otf')),
  ]);

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
              fontSize: 76,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-3px',
              color: '#111827',
            }}
          >
            {author.name}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 32,
              lineHeight: 1.4,
              color: '#6b7280',
            }}
          >
            {SITE_DESCRIPTION}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {author.skills.slice(0, MAX_SKILLS).map((skill) => (
              <div
                key={skill}
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
                {skill}
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
          <span>{TWITTER_HANDLE}</span>
          <span>Blog · Séries · Projetos</span>
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
