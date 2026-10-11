import { createMetadata, siteConfig } from '@/lib/seo';
import { getAllBlogPosts, groupPostsByMonth } from '@/lib/blog-posts';
import { Eyebrow, Masthead, PostWall } from '@/components/ds';

// /writing — the wall of exhibits (board "/writing"). Posts grouped by month;
// each row shows the post's headline number from its `exhibit:` frontmatter.
// Low motion budget: the mini bars draw once. /blog redirects here.
export const metadata = createMetadata({
  title: 'Writing',
  description:
    'Field notes on agent reliability and LLM cost engineering — false greens, evidence-binding, trajectory evals, and multi-model routing.',
  canonicalUrl: `${siteConfig.url}/writing`,
});

export default function WritingPage() {
  const groups = groupPostsByMonth(getAllBlogPosts());

  return (
    <div style={{ padding: '80px 0 120px' }}>
      <div className="ds-wrap">
        <div className="ds-offer-hero-grid" style={{ marginTop: 0 }}>
          <div className="ds-stack" style={{ gap: 20 }}>
            <Eyebrow>Index / writing</Eyebrow>
            <h1 className="ds-h1" data-size="index">
              Writing on agent reliability and LLM cost
            </h1>
            <p className="ds-lede" style={{ color: 'var(--muted)' }}>
              How I think about making agents trustworthy and affordable in
              production — the same methods behind the audits and teardowns.
            </p>
          </div>
          <Masthead location="writing_index" />
        </div>
        <div style={{ marginTop: 56 }}>
          {groups.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>No posts published yet.</p>
          ) : (
            <PostWall groups={groups} />
          )}
        </div>
      </div>
    </div>
  );
}
