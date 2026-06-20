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
}

export interface BlogPost extends BlogPostMeta {
  content: string;
  url: string;
  readingTime: number;
}

const BLOG_PATH = path.join(process.cwd(), 'content/blog');

export function getAllBlogPosts(): BlogPost[] {
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
  const posts = getAllBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}

export function getFeaturedBlogPosts(): BlogPost[] {
  return getAllBlogPosts().filter(post => post.featured);
}
