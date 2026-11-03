import { getAllPosts } from '@/lib/blog/posts';
import { BASE_URL, LOCALE, SITE_NAME } from '@/lib/constants';

export const dynamic = 'force-static';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function GET() {
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      const url = `${BASE_URL}/blog/${post.slug}`;
      const categories = post.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join('');

      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <description>${escapeXml(post.description)}</description>
  <pubDate>${new Date(post.updatedAt ?? post.publishedAt).toUTCString()}</pubDate>
  ${categories}
</item>`;
    })
    .join('\n');

  const lastBuildDate = new Date(
    posts[0]?.updatedAt ?? posts[0]?.publishedAt ?? Date.now(),
  ).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(SITE_NAME)}</title>
  <link>${BASE_URL}</link>
  <description>Artigos sobre frontend moderno e boas práticas.</description>
  <language>${LOCALE}</language>
  <lastBuildDate>${lastBuildDate}</lastBuildDate>
  <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
