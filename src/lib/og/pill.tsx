// Same reason as layout.tsx: Satori calls these components directly.
'use no memo';

import type { ReactNode } from 'react';

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
