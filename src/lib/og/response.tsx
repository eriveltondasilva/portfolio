import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { OG_SIZE } from './config';

import type { ReactElement } from 'react';

type OgFonts = NonNullable<
  NonNullable<ConstructorParameters<typeof ImageResponse>[1]>['fonts']
>;

const FONTS_DIR = join(process.cwd(), 'src', 'assets', 'fonts');

async function loadFonts(): Promise<OgFonts> {
  const [regular, semiBold] = await Promise.all([
    readFile(join(FONTS_DIR, 'Geist-Regular.otf')),
    readFile(join(FONTS_DIR, 'Geist-SemiBold.otf')),
  ]);

  return [
    { name: 'Geist', data: regular, weight: 400, style: 'normal' },
    { name: 'Geist', data: semiBold, weight: 600, style: 'normal' },
  ];
}

let fontsPromise: Promise<OgFonts> | undefined;

function getFonts(): Promise<OgFonts> {
  fontsPromise ??= loadFonts().catch((error: unknown) => {
    fontsPromise = undefined;
    throw error;
  });

  return fontsPromise;
}

export async function renderOgImage(element: ReactElement) {
  return new ImageResponse(element, { ...OG_SIZE, fonts: await getFonts() });
}

export function renderOgNotFound() {
  return new ImageResponse(<div>Not found</div>, { ...OG_SIZE, status: 404 });
}
