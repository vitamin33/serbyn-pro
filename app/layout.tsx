import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';
import { AppShell } from '@/components/lab/app-shell';
import {
  pageMetadata,
  generatePersonSchema,
  generateOrganizationSchema,
} from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-mono',
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
      className={`dark scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}
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
      </head>
      <body className={`${inter.className} antialiased`}>
        <a
          href="#main"
          className="skip-to-content"
          aria-label="Skip to main content"
        >
          Skip to content
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
