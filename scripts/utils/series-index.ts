import type { PostIndex, Series, SeriesIndex, SeriesPostRef } from '@/types';

type SeriesPost = PostIndex & { series: string; order: number };

export function sortByDateDesc<T extends { publishedAt: string; slug: string }>(
  items: readonly T[],
): T[] {
  return items.toSorted(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug),
  );
}

export function buildSeriesIndex(
  series: readonly Series[],
  posts: readonly PostIndex[],
): SeriesIndex[] {
  const seriesPosts = posts.filter(
    (post): post is SeriesPost => post.series !== undefined && post.order !== undefined,
  );
  const postsBySeries = Map.groupBy(seriesPosts, (post) => post.series);

  return sortByDateDesc(series).map((item) => {
    const orderedPosts = (postsBySeries.get(item.slug) ?? []).toSorted((a, b) => a.order - b.order);

    return {
      ...item,
      readingTime: orderedPosts.reduce((total, post) => total + post.readingTime, 0),
      posts: orderedPosts.map(({ slug, title, order }): SeriesPostRef => ({
        slug,
        title,
        order,
      })),
    };
  });
}
