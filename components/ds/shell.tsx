'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CONTACT } from '@/lib/facts';
import { BookingCta } from './cta';
import { NAV_OFFERS, NAV_SITE, PALETTE_BASE, type PaletteItem } from './nav';
import { Eyebrow, Wordmark } from './primitives';
import { ReadingProgress } from './reading';
import { THEME_KEY } from './theme-script';

// Site chrome: sticky header (wordmark, id line, nav with an Offers menu,
// theme switch, ⌘K, Contact), the mobile menu, and the command palette.
// The Offers menu and the mobile menu are CSS / <details>, so navigation works
// with JavaScript off; the theme switch and ⌘K need JavaScript.

/* ── Theme ──────────────────────────────────────────────────────────────── */

export type ThemeChoice = 'light' | 'dark' | 'system';

function readTheme(): ThemeChoice {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === 'light' || t === 'dark' ? t : 'system';
  } catch {
    return 'system';
  }
}

function applyTheme(t: ThemeChoice) {
  const d = document.documentElement;
  if (t === 'system') d.removeAttribute('data-theme');
  else d.setAttribute('data-theme', t);
  try {
    if (t === 'system') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, t);
  } catch {
    /* private mode: the choice lasts for this page only */
  }
}

/**
 * Darkroom switch: a View Transition whose new frame is revealed as a circle
 * growing from the pressed button (420ms, settle). No View Transitions: plain
 * swap. Reduced motion: 120ms cross-fade (styles/ds.css).
 */
export function setThemeAnimated(t: ThemeChoice, origin?: HTMLElement | null) {
  type VTDoc = Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void> };
  };
  const doc = document as VTDoc;
  if (!doc.startViewTransition) return applyTheme(t);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vt = doc.startViewTransition(() => applyTheme(t));
  if (reduced || !origin) return;
  const r = origin.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const radius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );
  vt.ready
    .then(() =>
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 420,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      )
    )
    .catch(() => undefined);
}

const Sun = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);
const Moon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);
const Monitor = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

export function ThemeSwitch({
  size,
  system = true,
}: {
  size?: 'lg';
  system?: boolean;
}) {
  const [theme, setTheme] = useState<ThemeChoice>('system');
  useEffect(() => setTheme(readTheme()), []);
  useEffect(() => {
    const onChange = () => setTheme(readTheme());
    window.addEventListener('ds-theme', onChange);
    return () => window.removeEventListener('ds-theme', onChange);
  }, []);
  const choose =
    (t: ThemeChoice) => (e: React.MouseEvent<HTMLButtonElement>) => {
      setThemeAnimated(t, e.currentTarget);
      setTheme(t);
      window.dispatchEvent(new Event('ds-theme'));
    };
  const options: [ThemeChoice, string, JSX.Element][] = [
    ['light', 'Light theme', <Sun key="s" />],
    ['dark', 'Dark theme', <Moon key="m" />],
    ...(system
      ? ([['system', 'System theme', <Monitor key="c" />]] as [
          ThemeChoice,
          string,
          JSX.Element,
        ][])
      : []),
  ];
  return (
    <div
      className="ds-seg"
      role="group"
      aria-label="Color theme"
      data-size={size}
    >
      {options.map(([t, label, icon]) => (
        <button
          key={t}
          type="button"
          aria-pressed={theme === t}
          aria-label={label}
          onClick={choose(t)}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

/* ── Command palette ────────────────────────────────────────────────────── */

export function CommandPalette({
  open,
  onClose,
  extra = [],
}: {
  open: boolean;
  onClose: () => void;
  /** posts and anything page-specific */
  extra?: PaletteItem[];
}) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<Element | null>(null);

  const items = useMemo(() => {
    const all = [
      ...PALETTE_BASE.filter(i => i.kind !== 'Action'),
      ...extra,
      ...PALETTE_BASE.filter(i => i.kind === 'Action'),
    ];
    const s = q.trim().toLowerCase();
    return s
      ? all.filter(
          i =>
            i.label.toLowerCase().includes(s) ||
            i.hint.toLowerCase().includes(s)
        )
      : all;
  }, [q, extra]);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    setQ('');
    setSel(0);
    requestAnimationFrame(() => input.current?.focus());
    return () => (opener.current as HTMLElement | null)?.focus?.();
  }, [open]);

  const run = (it: PaletteItem) => {
    if (it.action === 'copy-email')
      navigator.clipboard?.writeText(CONTACT.email).catch(() => undefined);
    else if (it.action === 'toggle-theme') {
      const dark =
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        (!document.documentElement.hasAttribute('data-theme') &&
          matchMedia('(prefers-color-scheme: dark)').matches);
      setThemeAnimated(dark ? 'light' : 'dark');
      window.dispatchEvent(new Event('ds-theme'));
    } else if (it.href) {
      if (/^https?:/.test(it.href)) window.open(it.href, '_blank', 'noopener');
      else window.location.href = it.href;
    }
    onClose();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel(s => Math.min(items.length - 1, s + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel(s => Math.max(0, s - 1));
    } else if (e.key === 'Enter' && items[sel]) {
      e.preventDefault();
      run(items[sel]);
    }
  };

  if (!open) return null;
  return (
    <div className="ds-pal-back" onClick={onClose}>
      <div
        className="ds-pal"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={e => e.stopPropagation()}
        onKeyDown={onKey}
      >
        <label htmlFor="ds-pal-q" className="sr-only">
          Search pages, posts and actions
        </label>
        <input
          ref={input}
          id="ds-pal-q"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls="ds-pal-list"
          aria-activedescendant={items[sel] ? `ds-pal-${sel}` : undefined}
          placeholder="Jump to a page, post or action…"
          value={q}
          onChange={e => {
            setQ(e.target.value);
            setSel(0);
          }}
        />
        <ul className="ds-pal-list" id="ds-pal-list" role="listbox">
          {items.map((it, i) => (
            <li
              key={`${it.kind}${it.label}`}
              id={`ds-pal-${i}`}
              role="option"
              aria-selected={i === sel}
              className="ds-pal-item"
              onMouseEnter={() => setSel(i)}
              onClick={() => run(it)}
            >
              <span className="ds-eyebrow" data-size="xs">
                {it.kind}
              </span>
              <span>{it.label}</span>
              <span>{it.hint}</span>
            </li>
          ))}
          {!items.length && (
            <li
              className="ds-note"
              style={{ padding: '14px 20px', fontSize: 13 }}
            >
              No match.
            </li>
          )}
        </ul>
        <div className="ds-pal-foot">
          <span>
            <kbd className="ds-kbd">↑↓</kbd> move
          </span>
          <span>
            <kbd className="ds-kbd">↵</kbd> open
          </span>
          <span>
            <kbd className="ds-kbd">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Header ─────────────────────────────────────────────────────────────── */

const Chev = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2 }}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const isCurrent = (path: string | undefined, href: string) =>
  !!path && (path === href || path.startsWith(`${href}/`));

export function SiteHeader({
  path,
  palette,
  reading,
}: {
  /** current pathname, for aria-current */
  path?: string;
  /** posts for the command palette */
  palette?: PaletteItem[];
  /** post variant: compact header with "N min left" and a progress rule */
  reading?: { minutes: number };
}) {
  const [pal, setPal] = useState(false);
  const close = useCallback(() => setPal(false), []);
  const offersCurrent = NAV_OFFERS.some(o => isCurrent(path, o.href));

  useEffect(() => {
    if (reading) return; // the reading header has no palette
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPal(p => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reading]);

  if (reading) {
    return (
      <header className="ds-header">
        <div className="ds-wrap ds-header-in" style={{ height: 56 }}>
          <Wordmark size={24} />
          <ReadingProgress minutes={reading.minutes} />
          <BookingCta
            location="sidebar"
            label="Contact"
            size="sm"
            arrow={false}
          />
        </div>
      </header>
    );
  }

  return (
    <header className="ds-header">
      <div className="ds-wrap ds-header-in">
        <Wordmark />
        <Eyebrow className="ds-idline">
          {CONTACT.name} · {CONTACT.role}
        </Eyebrow>
        <nav className="ds-nav" aria-label="Primary">
          <div className="ds-dd">
            <button
              type="button"
              className="ds-nav-a"
              aria-haspopup="true"
              aria-current={offersCurrent ? 'page' : undefined}
            >
              Offers <Chev />
            </button>
            <div className="ds-dd-menu ds-card">
              {NAV_OFFERS.map(o => (
                <a
                  key={o.href}
                  className="ds-dd-item"
                  href={o.href}
                  aria-current={isCurrent(path, o.href) ? 'page' : undefined}
                >
                  <span>{o.label}</span>
                  <Eyebrow>{o.hint}</Eyebrow>
                </a>
              ))}
            </div>
          </div>
          {NAV_SITE.map(n => (
            <a
              key={n.href}
              className="ds-nav-a"
              href={n.href}
              aria-current={isCurrent(path, n.href) ? 'page' : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="ds-tools">
          <ThemeSwitch />
          <button
            type="button"
            className="ds-kbtn"
            onClick={() => setPal(true)}
            aria-label="Open command palette"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <kbd>⌘K</kbd>
          </button>
          <BookingCta
            location="sidebar"
            label="Contact"
            size="sm"
            arrow={false}
          />
        </div>
        <details className="ds-mnav">
          <summary aria-label="Menu" />
          <nav className="ds-mnav-panel" aria-label="Mobile">
            <Eyebrow as="p" className="!mb-1 !mt-3">
              Offers
            </Eyebrow>
            {NAV_OFFERS.map(o => (
              <a key={o.href} className="ds-mlink" href={o.href}>
                {o.label} <span>{o.hint}</span>
              </a>
            ))}
            <Eyebrow as="p" className="!mb-1 !mt-6">
              Site
            </Eyebrow>
            {NAV_SITE.map(n => (
              <a key={n.href} className="ds-mlink" href={n.href}>
                {n.label}
              </a>
            ))}
            <div className="ds-mnav-tools">
              <ThemeSwitch size="lg" system={false} />
              <BookingCta location="sidebar" label="Contact" arrow={false} />
            </div>
            <p className="ds-note" style={{ marginTop: 28, fontSize: 12 }}>
              {CONTACT.email} · Remote from {CONTACT.location}
            </p>
          </nav>
        </details>
      </div>
      <CommandPalette open={pal} onClose={close} extra={palette} />
    </header>
  );
}
