import { getPrimaryAuthor } from '@/lib/blog/authors';
import { SITE_DESCRIPTION, SITE_NAME, TWITTER_HANDLE } from '@/lib/constants';
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgLayout,
  OgPill,
  OgPillRow,
} from '@/lib/og/layout';
import { renderOgImage } from '@/lib/og/response';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = SITE_NAME;

const MAX_SKILLS = 4;

export default async function OGImage() {
  const author = getPrimaryAuthor();

  return renderOgImage(
    <OgLayout
      title={author.name}
      titleVariant='hero'
      description={SITE_DESCRIPTION}
      footerStart={TWITTER_HANDLE}
      footerEnd='Blog · Séries · Projetos'
    >
      <OgPillRow>
        {author.skills.slice(0, MAX_SKILLS).map((skill) => (
          <OgPill key={skill} label={skill} />
        ))}
      </OgPillRow>
    </OgLayout>,
  );
}
