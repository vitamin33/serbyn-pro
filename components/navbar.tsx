'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navigationLinks = [
  {
    name: 'Work',
    href: '/work' as const,
    description: 'Projects and case studies',
  },
  {
    name: 'About',
    href: '/about' as const,
    description: 'Background and principles',
  },
  {
    name: 'Resume',
    href: '/resume' as const,
    description: 'Full work history',
  },
  { name: 'Blog', href: '/blog' as const, description: 'Technical writing' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('mobile-menu-open', !isMobileMenuOpen);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
      aria-label="Main navigation"
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={'/' as any}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md p-1"
              aria-label="Serbyn.pro - Home"
            >
              <Image
                src="/logo.svg"
                alt="Serbyn.pro Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <div className="flex items-center space-x-1">
                <span className="font-bold text-xl">serbyn</span>
                <span className="font-mono text-primary">.pro</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex items-center space-x-1" role="menubar">
              {navigationLinks.map(link => (
                <li key={link.name} role="none">
                  <Link
                    href={link.href as any}
                    className="btn btn-ghost px-3 py-2 text-sm"
                    role="menuitem"
                    aria-label={link.description}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="btn btn-ghost p-2"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">
                {isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              </span>
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="border-t border-border bg-background px-4 py-2 shadow-lg">
          <ul className="space-y-1" role="menu">
            {navigationLinks.map(link => (
              <li key={link.name} role="none">
                <Link
                  href={link.href as any}
                  className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  role="menuitem"
                  aria-label={link.description}
                  onClick={closeMobileMenu}
                >
                  <div>
                    <div className="font-medium">{link.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {link.description}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
