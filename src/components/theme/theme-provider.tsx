'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import type { ComponentProps } from 'react';

export function ThemeProvider({ children }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute={['class', 'data-theme']}
      defaultTheme='system'
      disableTransitionOnChange
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}
