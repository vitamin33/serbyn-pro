import type { ReactNode } from 'react';

// Page elements from the reference explainer, for posts and pages. Server
// components; styles in styles/article.css. Elements marked "wide" break out of
// the 70ch reading column to the 1000px track in the post layout.

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="a-eyebrow">{children}</div>;
}

export function Lede({ children }: { children: ReactNode }) {
  return <p className="a-lede">{children}</p>;
}

/** The short version, with a left accent rule. */
export function Short({ children }: { children: ReactNode }) {
  return <div className="a-short">{children}</div>;
}

export function Tag({ children, now }: { children: ReactNode; now?: boolean }) {
  return (
    <span className="a-tag" data-now={now ? 'true' : undefined}>
      {children}
    </span>
  );
}

export function TierBadge({ tier }: { tier: 'a' | 'b' | 'c' | 'd' }) {
  return (
    <span
      className="a-tier"
      data-tier={tier}
      role="img"
      aria-label={`tier ${tier.toUpperCase()}`}
    >
      {tier.toUpperCase()}
    </span>
  );
}

/** Data table with mono uppercase headers. Cells take any inline content. */
export function DataTable({
  head,
  rows,
  numeric = [],
}: {
  head: string[];
  rows: ReactNode[][];
  numeric?: number[];
}) {
  return (
    <div className="a-tbl wide" tabIndex={0}>
      <table>
        <thead>
          <tr>
            {head.map(h => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td
                  key={j}
                  className={numeric.includes(j) ? 'a-num' : undefined}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Stats({ children }: { children: ReactNode }) {
  return <div className="a-stats wide">{children}</div>;
}

export function Stat({
  value,
  label,
  warn,
  interim,
}: {
  value: ReactNode;
  label: ReactNode;
  warn?: boolean;
  interim?: boolean;
}) {
  return (
    <div className="a-stat" data-warn={warn ? 'true' : undefined}>
      <b className="a-num">
        {value}
        {interim && <InterimTag />}
      </b>
      <span>{label}</span>
    </div>
  );
}

export function Cards({ children }: { children: ReactNode }) {
  return <div className="a-cards wide">{children}</div>;
}

export function Card({
  title,
  when,
  children,
}: {
  title: ReactNode;
  when?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="a-card">
      {when && <div className="a-when">{when}</div>}
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return <div className="a-callout">{children}</div>;
}

function InterimTag() {
  return <span className="a-interim-tag">interim</span>;
}

/** A number that will change when the final data is in: `<Interim>110</Interim>`. */
export function Interim({ children }: { children: ReactNode }) {
  return (
    <span className="a-interim">
      {children}
      <InterimTag />
    </span>
  );
}

/** Banner for a draft post whose numbers are not final. */
export function DraftNote({ children }: { children: ReactNode }) {
  return (
    <aside className="a-draft" aria-label="Draft notice">
      <strong>Draft · interim data</strong>
      <div>{children}</div>
    </aside>
  );
}
