import { ImageResponse } from 'next/og';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog-posts';

export const alt = 'Article — Vitalii Serbyn';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllBlogPosts().map(post => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);
  const title = post?.title ?? 'Article';
  const kicker = post?.category ?? 'Blog';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A0C10',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            color: '#0A85FF',
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}
        >
          {kicker.toUpperCase()}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            color: '#E6E9EF',
            maxWidth: '1000px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 28,
            color: '#8B93A1',
          }}
        >
          <div style={{ display: 'flex' }}>serbyn.pro/blog</div>
          <div style={{ display: 'flex', color: '#E6E9EF' }}>
            Vitalii Serbyn · AI Systems Architect
          </div>
        </div>
      </div>
    ),
    size
  );
}
