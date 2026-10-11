import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Primitives of the "Claim vs. proof" design system (docs/design/design-system.md).
// Server components: no hooks, no client JavaScript.

type Tone = 'muted' | 'fg' | 'accent' | 'claim';

/* ── Mark ───────────────────────────────────────────────────────────────── */

/** The proven tick: a tick whose vertex lands on a ledger rule. */
export function Mark({
  size = 26,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={cn('ds-mark', className)}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      aria-hidden="true"
    >
      <path className="ds-mark-rule" d="M2 23h24" />
      <path className="ds-mark-tick" d="M6.5 14.5 11 23 23 5" />
    </svg>
  );
}

/** Manrope 800 "serbyn" + mono ".io". Pass href to make it the home link. */
export function Wordmark({
  href = '/',
  size = 26,
  className,
}: {
  href?: string | null;
  size?: number;
  className?: string;
}) {
  const inner = (
    <>
      <Mark size={size} />
      <span>
        serbyn<span className="ds-tld">.io</span>
      </span>
    </>
  );
  return href ? (
    <a
      href={href}
      aria-label="serbyn.io home"
      className={cn('ds-wordmark', className)}
    >
      {inner}
    </a>
  ) : (
    <span className={cn('ds-wordmark', className)}>{inner}</span>
  );
}

/* ── Type ───────────────────────────────────────────────────────────────── */

export function Eyebrow({
  children,
  tone,
  size,
  as: Tag = 'span',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  size?: 'sm' | 'xs';
  as?: 'span' | 'p' | 'h2' | 'dt';
  className?: string;
}) {
  return (
    <Tag
      className={cn('ds-eyebrow', className)}
      data-tone={tone}
      data-size={size}
    >
      {children}
    </Tag>
  );
}

/** "01 · Systems I designed and built" + H2 + optional intro and aside. */
export function SectionHeader({
  id,
  eyebrow,
  title,
  intro,
  aside,
}: {
  id?: string;
  eyebrow: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
}) {
  const head = (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="ds-h2">
        {title}
      </h2>
      {intro && <p className="ds-intro">{intro}</p>}
    </div>
  );
  if (!aside) return head;
  return (
    <div className="ds-sec-head">
      {head}
      {aside}
    </div>
  );
}

/** Newsreader italic: verdicts in words. */
export function Verdict({
  children,
  tone,
  className,
  as: Tag = 'p',
}: {
  children: ReactNode;
  tone?: 'muted';
  className?: string;
  as?: 'p' | 'span';
}) {
  return (
    <Tag className={cn('ds-verdict', className)} data-tone={tone}>
      {children}
    </Tag>
  );
}

/** Manrope 800 numeral with an optional muted unit ("0 of 40"). */
export function GiantNumber({
  value,
  unit,
  className,
}: {
  value: ReactNode;
  unit?: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('ds-giant', className)}>
      {value}
      {unit && <small> {unit}</small>}
    </span>
  );
}

/* ── Controls ───────────────────────────────────────────────────────────── */

export type ButtonVariant = 'primary' | 'secondary' | 'inverse';

/** Class and data attributes for a button-styled element (a, button, Link). */
export function buttonProps({
  variant = 'primary',
  size,
  className,
}: {
  variant?: ButtonVariant;
  size?: 'sm';
  className?: string;
} = {}) {
  return {
    className: cn('ds-btn', className),
    'data-variant': variant === 'primary' ? undefined : variant,
    'data-size': size,
  };
}

/** ↗ for outbound, → for internal. Moves 2px up-right on hover. */
export function Arrow({ dir = 'out' }: { dir?: 'out' | 'right' }) {
  return (
    <svg
      className="ds-arr"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2 }}
    >
      {dir === 'out' ? (
        <path d="M7 7h10v10M7 17 17 7" />
      ) : (
        <path d="M5 12h14M13 6l6 6-6 6" />
      )}
    </svg>
  );
}

export function TextLink({
  href,
  children,
  tone,
  strong,
  external,
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: 'muted';
  strong?: boolean;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn('ds-link', className)}
      data-tone={tone}
      data-weight={strong ? 'strong' : undefined}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

/** "↗ proof": the link from a number to the evidence that earned it. */
export function ProofLink({
  href,
  children = 'proof',
  external,
}: {
  href: string;
  children?: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      className="ds-proof"
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      ↗ {children}
    </a>
  );
}

/**
 * neutral: direction ("Lower is better"); claim: topic outline in terracotta;
 * accent: "Proven"; outline: quiet tag; dashed: unchecked state.
 */
export function Chip({
  children,
  variant,
  size,
  className,
}: {
  children: ReactNode;
  variant?: 'claim' | 'accent' | 'outline' | 'dashed';
  size?: 'sm';
  className?: string;
}) {
  return (
    <span
      className={cn('ds-chip', className)}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </span>
  );
}

/** Small "INTERIM" flag after a number that will change. */
export function InterimTag({ children = 'interim' }: { children?: ReactNode }) {
  return <span className="ds-interim">{children}</span>;
}

/* ── Surfaces ───────────────────────────────────────────────────────────── */

export function Card({
  as: Tag = 'div',
  className,
  children,
  ...rest
}: {
  as?: 'div' | 'article' | 'figure' | 'section';
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={cn('ds-card', className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Sign-off strip: "FIXED-SCOPE AUDITS | READ-ONLY BY DEFAULT | …". */
export function SignoffStrip({
  items,
  cols,
  className,
}: {
  items: readonly ReactNode[];
  cols?: 2;
  className?: string;
}) {
  return (
    <ul className={cn('ds-strip', className)} data-cols={cols}>
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

/** "SERBYN.IO · FIELD REPORT" signature line that closes an exhibit. */
export function Signature({
  children = 'serbyn.io · field report',
}: {
  children?: ReactNode;
}) {
  return <p className="ds-signature">{children}</p>;
}

/* ── Provenance ─────────────────────────────────────────────────────────── */

export type Provenance = 'built' | 'own' | 'employed';

/** Reads the provenance from a lib/facts source label. */
export function provenanceOf(label: string): Provenance {
  if (/employed|as engineer/i.test(label)) return 'employed';
  if (/own platform/i.test(label)) return 'own';
  return 'built';
}

export function Tick({ className }: { className?: string }) {
  return (
    <svg
      className={cn('ds-tick', className)}
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path d="M2.5 8.5 6 12l7.5-8" />
    </svg>
  );
}

/**
 * The source label that travels with every number. Systems I built and my own
 * platform get the accent tick; employed-role results get a muted one.
 * `marker="hook"` uses "↳" instead of the tick (cards, captions).
 */
export function SourceLabel({
  children,
  label,
  marker = 'tick',
  provenance,
  className,
  claimLabel = true,
}: {
  /** the label text; defaults to `label` */
  children?: ReactNode;
  label?: string;
  marker?: 'tick' | 'hook' | 'none';
  provenance?: Provenance;
  className?: string;
  /** adds data-claim-label (one per [data-claim], tested on home) */
  claimLabel?: boolean;
}) {
  const p = provenance ?? (label ? provenanceOf(label) : 'built');
  return (
    <span
      className={cn('ds-src', className)}
      data-provenance={p}
      {...(claimLabel ? { 'data-claim-label': '' } : {})}
    >
      {marker === 'tick' && <Tick />}
      {marker === 'hook' && <span className="ds-hook">↳</span>}
      <span>{children ?? label}</span>
    </span>
  );
}

/* ── Verdicts ───────────────────────────────────────────────────────────── */

export type TierLetter = 'A' | 'B' | 'C' | 'D';
export const TIER_NAME: Record<TierLetter, string> = {
  A: 'proven',
  B: 'partial',
  C: 'weak',
  D: 'no proof',
};

/** Stamp-style tier badge (the verdict of a claim check). */
export function TierBadge({
  tier,
  size,
  className,
}: {
  tier: TierLetter;
  size?: 'sm' | 'lg';
  className?: string;
}) {
  return (
    <span
      className={cn('ds-badge', `ds-tier-${tier.toLowerCase()}`, className)}
      data-size={size}
      role="img"
      aria-label={`Tier ${tier}, ${TIER_NAME[tier]}`}
    >
      <span aria-hidden="true">{tier}</span>
    </span>
  );
}

/** Inline tier letter for running text and tables. */
export function Tier({ tier }: { tier: TierLetter }) {
  return (
    <span
      className={cn('ds-tier', `ds-tier-${tier.toLowerCase()}`)}
      role="img"
      aria-label={`Tier ${tier}`}
    >
      <span aria-hidden="true">{tier}</span>
    </span>
  );
}
