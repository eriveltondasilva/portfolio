import Github from '@/assets/github.svg';
import Linkedin from '@/assets/linkedin.svg';
import TwitterX from '@/assets/twitter-x.svg';

import type { Author } from '@/types';
import type { StaticImageData } from 'next/image';

type SocialLink = {
  key: keyof Author['socials'];
  label: string;
  icon: string | StaticImageData;
};

const SOCIAL_LINKS: ReadonlyArray<SocialLink> = [
  { key: 'github', label: 'GitHub', icon: Github },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'twitter', label: 'Twitter', icon: TwitterX },
];

export function getAuthorSocialLinks(author: Author) {
  return SOCIAL_LINKS.flatMap((link) => {
    const href = author.socials[link.key];

    return href ? [{ ...link, href }] : [];
  });
}
