import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Navbar } from '@/components/navbar';
import { FooterLegal } from '@/components/footer-legal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Serbyn.pro - AI/ML Engineering Portfolio',
  description:
    'Professional portfolio of Vitalii Serbyn - Senior AI/ML Engineer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <a
          href="#main"
          className="skip-to-content"
          aria-label="Skip to main content"
        >
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <FooterLegal />
        </div>
      </body>
    </html>
  );
}
