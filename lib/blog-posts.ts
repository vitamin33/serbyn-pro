import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPostMeta {
  title: string;
  slug: string;
  description: string;
  date: string;
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
