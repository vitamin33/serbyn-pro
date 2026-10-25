import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { MiniExhibitData } from '@/components/ds/exhibit';
import type { PostSummary } from '@/components/ds/writing';

export interface BlogPostMeta {
  title: string;
  slug: string;
  description: string;
  date: string;
  /** Last material edit (YYYY-MM-DD). Feeds sitemap lastmod and dateModified. */
  updated?: string;
  keywords: string[];
  category: 'architecture' | 'engineering' | 'operations' | 'strategy';
  author: string;
  featured: boolean;
  seo_keywords?: string[];

  // Redesign (Kinetic Lab) additive fields — see docs/redesign/02_DATA_MODEL_AND_GAPS.md
  cover?: string;
  featured_code?: { lang: string; label?: string; code: string };
  toc?: boolean;

  /** Compile the body as real MDX (components such as <FlowDiagram/>). */
  mdx?: boolean;
  /**
   * Unpublished. Never listed (index, sitemap, RSS, llms.txt, related posts)
   * and never routable in a production build; viewable under `next dev` only.
   */
  draft?: boolean;

  /** The post's headline number as a mini exhibit (writing index, home).
      Every value must appear in the post body. */
  exhibit?: MiniExhibitData;
  /** Screen-reader sentence for the exhibit. */
  exhibitLabel?: string;
  /** Post hero figure: the giant number plus bars with intervals computed
      from k/n. Every value must appear in the post body. */
  keyNumber?: {
    value: string;
    unit?: string;
    caption: string;
    direction?: string;
    bars: {
      label: string;
      k: number;
      n: number;
      series: 'claim' | 'baseline' | 'accent';
    }[];
    note: string;
  };
}

export interface BlogPost extends BlogPostMeta {
  content: string;
  url: string;
  readingTime: number;
}

const BLOG_PATH = path.join(process.cwd(), 'content/blog');

/** Drafts are previewable only on the dev server, never in a production build. */
export const draftsVisible = () => process.env.NODE_ENV === 'development';

/** Published posts only. Every listing, feed and static path uses this. */
export function getAllBlogPosts(): BlogPost[] {
  return readAllPosts().filter(post => !post.draft);
}

function readAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_PATH)) {
    fs.mkdirSync(BLOG_PATH, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(BLOG_PATH);

  const posts = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      try {
        const filePath = path.join(BLOG_PATH, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        const meta = data as BlogPostMeta;

        if (!meta.title || !meta.slug) {
          console.warn(`Skipping invalid blog post: ${file}`);
          return null;
        }

        const wordCount = content ? content.split(' ').length : 0;
        const readingTime = Math.ceil(wordCount / 200);

        return {
          ...meta,
          content: content || '',
          url: `/blog/${meta.slug}`,
          readingTime,
        };
      } catch (error) {
        console.warn(`Error parsing blog post ${file}:`, error);
        return null;
      }
    })
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const post = readAllPosts().find(p => p.slug === slug) ?? null;
  if (post?.draft && !draftsVisible()) return null;
  return post;
}

/** Draft slugs, for the dev-only preview route params. */
export function getDraftSlugs(): string[] {
  return readAllPosts()
    .filter(post => post.draft)
    .map(post => post.slug);
}

export function getFeaturedBlogPosts(): BlogPost[] {
  return getAllBlogPosts().filter(post => post.featured);
}

/** YYYY-MM-DD, whether frontmatter gave a string or a YAML date. */
export function isoDate(date: string | Date): string {
  return typeof date === 'string'
    ? date.slice(0, 10)
    : date.toISOString().slice(0, 10);
}

/** A post as a row on the writing wall. */
export function toPostSummary(post: BlogPost): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    date: isoDate(post.date),
    category: post.category,
    exhibit: post.exhibit,
    exhibitLabel: post.exhibitLabel,
  };
}

/** Posts grouped by month ("September 2026"), newest first. */
export function groupPostsByMonth(posts: BlogPost[]) {
  const groups: { month: string; posts: PostSummary[] }[] = [];
  for (const p of posts) {
    const d = new Date(`${isoDate(p.date)}T00:00:00Z`);
    const month = d.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    const last = groups[groups.length - 1];
    if (last?.month === month) last.posts.push(toPostSummary(p));
    else groups.push({ month, posts: [toPostSummary(p)] });
  }
  return groups;
}
