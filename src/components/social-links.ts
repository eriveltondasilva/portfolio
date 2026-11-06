import Github from '@/assets/github.svg';
import Linkedin from '@/assets/linkedin.svg';
import TwitterX from '@/assets/twitter-x.svg';

import type { Author } from '@/types';
import type { StaticImageData } from 'next/image';

// Next types every *.svg import as `any`, so this annotation is the only check on `icon`.
export const SOCIAL_LINKS = [
  { key: 'github', label: 'GitHub', icon: Github },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'twitter', label: 'Twitter', icon: TwitterX },
] as const satisfies ReadonlyArray<{
  key: keyof Author['socials'];
  label: string;
  icon: string | StaticImageData;
}>;
