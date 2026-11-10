'use no memo';

import { BASE_URL } from '@/lib/base-url';

import type { ReactNode } from 'react';

const HOSTNAME = new URL(BASE_URL).hostname;

const TITLE_STYLES = {
  default: { fontSize: 52, letterSpacing: '-2px', lineClamp: 3 },
  hero: { fontSize: 76, letterSpacing: '-3px', lineClamp: 2 },
} as const;

interface WithChildren {
  children: ReactNode;
}

export function OgFrame({ children }: WithChildren) {
  return (
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
        {children}
      </div>
    </div>
  );
}

export function OgBrand({ section }: { section?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: 32,
        fontWeight: 600,
      }}
    >
      <span style={{ color: '#f97316' }}>{HOSTNAME}</span>
      {section && (
        <>
          <span style={{ margin: '0 16px', color: '#d1d5db' }}>/</span>
          <span style={{ color: '#6b7280' }}>{section}</span>
        </>
      )}
    </div>
  );
}

export function OgContent({ children }: WithChildren) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {children}
    </div>
  );
}

export function OgTitle({
  children,
  variant = 'default',
}: WithChildren & { variant?: keyof typeof TITLE_STYLES }) {
  return (
    <div
      style={{
        display: 'flex',
        ...TITLE_STYLES[variant],
        fontWeight: 600,
        lineHeight: 1.1,
        color: '#111827',
      }}
    >
      {children}
    </div>
  );
}

export function OgDescription({ children }: WithChildren) {
  return (
    <div
      style={{
        display: 'flex',
        fontSize: 32,
        lineHeight: 1.4,
        lineClamp: 2,
        color: '#6b7280',
      }}
    >
      {children}
    </div>
  );
}

export function OgFooter({ children }: WithChildren) {
  return (
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
      {children}
    </div>
  );
}
