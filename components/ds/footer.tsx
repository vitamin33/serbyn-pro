import { CONTACT } from '@/lib/facts';
import { NAV_OFFERS } from './nav';
import { TextLink } from './primitives';

// Footer: company, site, contact, legal columns over a fg rule; mono bottom bar.
// `compact` is the offer-page variant (bottom bar only).

const SITE_LINKS = [
  ...NAV_OFFERS.map(o => ({ href: o.href, label: o.label })),
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/newsletter', label: 'False Green newsletter' },
];

function BottomBar() {
  return (
    <div className="ds-footer-bottom">
      <span>
        © {new Date().getFullYear()} Easelect LTD. All rights reserved.
        Incorporated in England &amp; Wales
      </span>
      <nav aria-label="Elsewhere">
        <TextLink href={CONTACT.github} tone="muted" external>
          GITHUB
        </TextLink>
        <TextLink href={CONTACT.linkedin} tone="muted" external>
          LINKEDIN
        </TextLink>
        <TextLink href="/feed.xml" tone="muted">
          RSS_FEED
        </TextLink>
        <span>| UK LTD</span>
      </nav>
    </div>
  );
}

export function SiteFooter({ variant }: { variant?: 'compact' }) {
  if (variant === 'compact') {
    return (
      <footer className="ds-footer" data-variant="compact">
        <div className="ds-wrap">
          <BottomBar />
        </div>
      </footer>
    );
  }
  return (
    <footer className="ds-footer">
      <div className="ds-wrap">
        <div className="ds-footer-grid">
          <div className="ds-footer-col">
            <p className="ds-fh">Easelect LTD</p>
            <span>Agentic Systems Architecture</span>
            <span>Company Number: 15983917</span>
            <span style={{ marginTop: 8 }}>Registered Office:</span>
            <address>
              Office 12, Initial Business Centre
              <br />
              Wilson Business Park
              <br />
              Manchester, M40 8WN
              <br />
              United Kingdom
            </address>
          </div>
          <nav className="ds-footer-col" aria-label="Site">
            <p className="ds-fh">Site</p>
            {SITE_LINKS.map(l => (
              <TextLink key={l.href} href={l.href} tone="muted">
                {l.label}
              </TextLink>
            ))}
          </nav>
          <div className="ds-footer-col">
            <p className="ds-fh">Contact</p>
            <TextLink href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </TextLink>
            <span>Remote from {CONTACT.location}</span>
            <span>GMT+2 timezone</span>
          </div>
          <nav className="ds-footer-col" aria-label="Legal">
            <p className="ds-fh">Legal</p>
            <TextLink href="/legal/privacy" tone="muted">
              Privacy Policy
            </TextLink>
            <TextLink href="/legal/terms" tone="muted">
              Terms of Service
            </TextLink>
            <span
              className="ds-mono"
              style={{
                fontSize: 12,
                marginTop: 16,
                display: 'flex',
                gap: 6,
                alignItems: 'center',
              }}
            >
              <kbd className="ds-kbd">⌘K</kbd> jump anywhere
            </span>
          </nav>
        </div>
        <BottomBar />
      </div>
    </footer>
  );
}
