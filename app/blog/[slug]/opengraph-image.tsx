import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';
import { getAllBlogPosts, getBlogPostBySlug, isoDate } from '@/lib/blog-posts';

export const alt = 'Article — Vitalii Serbyn';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllBlogPosts().map(post => ({ slug: post.slug }));
}

// Darkroom card; posts with a keyNumber: frontmatter show it beside the title.
export default async function Image({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);
  const kn = post?.keyNumber;
  return ogCard({
    kind: 'post',
    meta: post ? `${isoDate(post.date)} · ${post.category}` : 'Article',
    title: post?.title ?? 'Article',
    keyNumber: kn
      ? {
          value: kn.value,
          unit: kn.unit,
          caption: kn.caption,
          bars: kn.bars.map(b => ({ fraction: b.k / b.n, series: b.series })),
        }
      : undefined,
    strip: post
      ? ['Field report', `${post.readingTime} min read`]
      : ['Field report'],
  });
}
