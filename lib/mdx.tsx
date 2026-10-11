import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import { diagramComponents } from '@/components/diagram/mdx';
import * as Article from '@/components/article';
import { MarginNote, PullQuote } from '@/components/ds/writing';

// Real MDX for posts that set `mdx: true` in frontmatter. Compiled in the
// server component at build time, so diagrams arrive as static SVG and nothing
// here ships to the browser. Older posts keep the markdown converter in
// app/blog/[slug]/page.tsx.

// MarginNote and PullQuote come from the design system (components/ds).
export const mdxComponents = {
  ...diagramComponents,
  ...Article,
  MarginNote,
  PullQuote,
};

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

const textOf = (n: HastNode): string =>
  n.type === 'text' ? (n.value ?? '') : (n.children ?? []).map(textOf).join('');

/** ```mermaid fences become <pre class="mermaid"> for the client renderer. */
function rehypeMermaidFence() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      for (const child of node.children ?? []) {
        const code = child.tagName === 'pre' ? child.children?.[0] : undefined;
        const cls = code?.properties?.className;
        if (
          code?.tagName === 'code' &&
          Array.isArray(cls) &&
          cls.includes('language-mermaid')
        ) {
          child.properties = { className: ['mermaid'] };
          child.children = [{ type: 'text', value: textOf(code) }];
        } else {
          walk(child);
        }
      }
    };
    walk(tree);
  };
}

/** Drops a leading `# Title`; the page already renders the title as its H1. */
function stripLeadingH1(source: string): string {
  return source.replace(/^\s*#\s+[^\n]*\n/, '');
}

export async function renderMdx(source: string) {
  const { default: Content } = await evaluate(stripLeadingH1(source), {
    ...runtime,
    development: false,
    rehypePlugins: [rehypeMermaidFence, rehypeSlug, rehypeHighlight],
  });
  return <Content components={mdxComponents} />;
}
