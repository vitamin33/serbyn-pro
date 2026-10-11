import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '../styles/globals.css';
import { PostHogProvider } from '@/components/analytics/posthog-provider';
import { ThemeScript } from '@/components/ds/theme-script';
import { SiteShell } from '@/components/ds/site-shell';
import { SiteFooter } from '@/components/ds/footer';
import type { PaletteItem } from '@/components/ds/nav';
import { getAllBlogPosts } from '@/lib/blog-posts';
import {
  pageMetadata,
  generatePersonSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from '@/lib/seo';

// Self-hosted with next/font/local from app/fonts (latin subsets, all SIL OFL,
// downloaded from Google Fonts): served from our origin, no request to Google
// at runtime (T15c) and none at build either, so builds do not depend on the
// network. The stacks that use these variables live in styles/theme.css.
// Manrope 800 is the display face (headings, numerals), Newsreader italic the
// verdict face, Plex Sans the reading face, Plex Mono labels and data.
const plexSans = localFont({
  src: [
    { path: './fonts/plex-sans.woff2', weight: '100 700', style: 'normal' },
    {
      path: './fonts/plex-sans-italic.woff2',
      weight: '100 700',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-plex-sans',
});

const plexMono = localFont({
  src: [
    { path: './fonts/plex-mono-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/plex-mono-500.woff2', weight: '500', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-plex-mono',
});

const manrope = localFont({
  src: './fonts/manrope.woff2',
  weight: '200 800',
  display: 'swap',
  variable: '--font-manrope',
});

const newsreader = localFont({
  src: [
    { path: './fonts/newsreader.woff2', weight: '200 800', style: 'normal' },
    {
      path: './fonts/newsreader-italic.woff2',
      weight: '200 800',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-newsreader',
});

export const metadata: Metadata = pageMetadata.home();

// Posts for the command palette (⌘K), newest first.
function palettePosts(): PaletteItem[] {
  return getAllBlogPosts().map(p => ({
    kind: 'Post',
    label: p.title,
    hint: p.date.slice(5),
    href: `/blog/${p.slug}`,
  }));
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // ThemeScript adds `js` and the saved data-theme before hydration.
      suppressHydrationWarning
      className={`scroll-smooth ${plexSans.variable} ${plexMono.variable} ${manrope.variable} ${newsreader.variable}`}
    >
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generatePersonSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebsiteSchema()),
          }}
        />
      </head>
      <body className="antialiased">
        <a href="#main" className="ds-skip">
          Skip to content
        </a>
        <SiteShell
          palette={palettePosts()}
          footer={<SiteFooter />}
          compactFooter={<SiteFooter variant="compact" />}
        >
          {children}
        </SiteShell>
        <PostHogProvider />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
