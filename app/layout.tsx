import type { Metadata } from 'next';
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Manrope,
  Newsreader,
} from 'next/font/google';
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

// Self-hosted by next/font: downloaded at build, served from our origin (T15c).
// The stacks that use these variables live in styles/theme.css.
// Manrope 800 is the display face (headings, numerals), Newsreader italic the
// verdict face, Plex Sans the reading face, Plex Mono labels and data.
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-plex-sans',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--font-manrope',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-newsreader',
  // next/font has no fallback metrics for Newsreader; skip the size-adjusted
  // fallback instead of warning on every build.
  adjustFontFallback: false,
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
