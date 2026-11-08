import { getPrimaryAuthor } from '@/lib/blog/authors';
import { SITE_DESCRIPTION, SITE_NAME, TWITTER_HANDLE } from '@/lib/constants';
import { OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og/config';
import {
  OgBrand,
  OgContent,
  OgDescription,
  OgFooter,
  OgFrame,
  OgTitle,
} from '@/lib/og/layout';
import { OgPill, OgPillRow } from '@/lib/og/pill';
import { renderOgImage } from '@/lib/og/response';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = SITE_NAME;

const MAX_SKILLS = 4;

export default async function OGImage() {
  const author = getPrimaryAuthor();

  return renderOgImage(
    <OgFrame>
      <OgBrand />

      <OgContent>
        <OgTitle variant='hero'>{author.name}</OgTitle>

        <OgDescription>{SITE_DESCRIPTION}</OgDescription>

        <OgPillRow>
          {author.skills.slice(0, MAX_SKILLS).map((skill) => (
            <OgPill key={skill} label={skill} />
          ))}
        </OgPillRow>
      </OgContent>

      <OgFooter>
        <span>{TWITTER_HANDLE}</span>
        <span>Blog · Séries · Projetos</span>
      </OgFooter>
    </OgFrame>,
  );
}
