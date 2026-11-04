import { BASE_URL, LOCALE, SITE_DESCRIPTION, SITE_NAME } from '@/lib/constants';

import type { Author, PostIndex } from '@/types';

export function buildPostJsonLd(post: PostIndex, authors: Author[]) {
  const postUrl = `${BASE_URL}/blog/${post.slug}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${postUrl}#article`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
        url: postUrl,
        headline: post.title,
        description: post.description,
        keywords: post.tags,
        inLanguage: LOCALE,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt ?? post.publishedAt,
        author: authors.map((author) => ({
          '@type': 'Person',
          name: author.name,
          url: author.socials.github,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Blog',
            item: `${BASE_URL}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: post.title,
            item: postUrl,
          },
        ],
      },
    ],
  };
}

export function buildHomeJsonLd(author: Author) {
  const personId = `${BASE_URL}/#person`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: LOCALE,
        publisher: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: author.name,
        url: BASE_URL,
        description: author.bio,
        knowsAbout: author.skills,
        sameAs: Object.values(author.socials),
      },
    ],
  };
}
