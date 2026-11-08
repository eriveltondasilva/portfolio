// Satori calls these components directly, outside React's render cycle,
// so memoization from the React Compiler (useMemoCache) would throw.
'use no memo';

import { BASE_URL } from '@/lib/base-url';

import type { ReactNode } from 'react';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const HOSTNAME = new URL(BASE_URL).hostname;

const TITLE_STYLES = {
  default: { fontSize: 52, letterSpacing: '-2px' },
  hero: { fontSize: 76, letterSpacing: '-3px' },
} as const;

export interface OgPillColors {
  color: string;
  border: string;
  background: string;
}

const DEFAULT_PILL_COLORS: OgPillColors = {
  color: '#ea580c',
  border: '#fed7aa',
  background: '#fff7ed',
};

// ─────────────────────────────────────

interface OgLayoutProps {
  title: string;
  description: string;
  footerStart: string;
  footerEnd: string;
  titleVariant?: keyof typeof TITLE_STYLES;
  children?: ReactNode;
}

export function OgLayout({
  title,
  description,
  footerStart,
  footerEnd,
  titleVariant = 'default',
  children,
}: OgLayoutProps) {
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
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            fontWeight: 600,
            color: '#f97316',
          }}
        >
          {HOSTNAME}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              display: 'flex',
              ...TITLE_STYLES[titleVariant],
              fontWeight: 600,
              lineHeight: 1.1,
              color: '#111827',
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 32,
              lineHeight: 1.4,
              color: '#6b7280',
            }}
          >
            {description}
          </div>

          {children}
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
          <span>{footerStart}</span>
          <span>{footerEnd}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────

export function OgPillRow({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex', gap: 12 }}>{children}</div>;
}

interface OgPillProps {
  label: string;
  colors?: OgPillColors;
  showDot?: boolean;
}

export function OgPill({
  label,
  colors = DEFAULT_PILL_COLORS,
  showDot = false,
}: OgPillProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '6px 18px',
        borderRadius: 999,
        border: `2px solid ${colors.border}`,
        background: colors.background,
        color: colors.color,
        fontSize: 28,
      }}
    >
      {showDot && (
        <div
          style={{
            display: 'flex',
            width: 12,
            height: 12,
            borderRadius: 999,
            background: colors.color,
          }}
        />
      )}
      {label}
    </div>
  );
}
