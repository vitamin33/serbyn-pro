import type { Metadata } from 'next';
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Condensed,
} from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '../styles/globals.css';
import { AppShell } from '@/components/lab/app-shell';
import { PostHogProvider } from '@/components/analytics/posthog-provider';
import {
  pageMetadata,
  generatePersonSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from '@/lib/seo';

// IBM Plex, downloaded by next/font at build and served from our origin (T15c).
// The stacks that use these variables live in styles/theme.css.
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-plex-sans',
});

const plexCondensed = IBM_Plex_Sans_Condensed({
  subsets: ['latin'],
  weight: ['500', '600'],
  display: 'swap',
  variable: '--font-plex-condensed',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
});

export const metadata: Metadata = pageMetadata.home();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${plexSans.variable} ${plexCondensed.variable} ${plexMono.variable}`}
    >
      <head>
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
        <a
          href="#main"
          className="skip-to-content"
          aria-label="Skip to main content"
        >
          Skip to content
        </a>
        <AppShell>{children}</AppShell>
        <PostHogProvider />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
