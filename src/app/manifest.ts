import {
  LOCALE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
} from '@/lib/constants';

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: SITE_DESCRIPTION,
    lang: LOCALE,
    start_url: '/',
    background_color: '#fff',
    theme_color: '#fff',
  };
}
