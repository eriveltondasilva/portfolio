import { getAuthorsBySlugs } from '@/lib/blog/authors';
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog/posts';
import { SITE_NAME } from '@/lib/constants';
import { createListFormatter, formatDate } from '@/lib/format';
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgLayout,
  OgPill,
  OgPillRow,
} from '@/lib/og/layout';
import { renderOgImage, renderOgNotFound } from '@/lib/og/response';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = SITE_NAME;

const MAX_TAGS = 4;

export function generateStaticParams() {
  return getAllPostSlugs();
}

export default async function OGImage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return renderOgNotFound();

  const authorNames = createListFormatter().format(
    getAuthorsBySlugs(post.authors).map(
      (author) => author.name.split(/\s+/).at(0) ?? '',
    ),
  );
  const displayDate = formatDate(post.updatedAt ?? post.publishedAt, {
    dateStyle: 'medium',
  });

  return renderOgImage(
    <OgLayout
      title={post.title}
      description={post.description}
      footerStart={`Por ${authorNames}`}
      footerEnd={`${displayDate} · ${post.readingTime} min de leitura`}
    >
      <OgPillRow>
        {post.tags.slice(0, MAX_TAGS).map((tag) => (
          <OgPill key={tag} label={`#${tag}`} />
        ))}
      </OgPillRow>
    </OgLayout>,
  );
}
