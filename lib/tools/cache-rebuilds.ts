// Cache-rebuild analysis for Claude Code session logs (~/.claude/projects).
// A TypeScript port of analyze_cache.py from
// github.com/vitamin33/claude-code-statusline, so this page and the published
// numbers (1,119 rebuilds, 24% of spend, 68,700 requests) use one definition:
//
//   - one record per API request: rows are keyed by requestId and the last row
//     wins, because streaming writes several rows for the same request;
//   - a "rebuild" is a request whose cache_creation_input_tokens is 50,000 or
//     more: a normal turn writes a few thousand tokens, a write that large
//     means the prefix was written again instead of read;
//   - the cost of a rebuild is the cache-write cost of that request;
//   - the cause is judged from the request before it in the same session.
//
// Pure module: no DOM, no network, no storage. The browser component and the
// tests both call it.

/** Prices checked 2026-11-19 against the Claude API price list. */
export const PRICES_CHECKED = '2026-11-19';

type Price = {
  /** substring of the model id; first match wins, so order matters */
  key: string;
  /** base input, USD per million tokens */
  base: number;
  /** cache read as a fraction of base input */
  read: number;
  /** Haiku 5.5 only: base input for prompts above 100k tokens */
  baseOver100k?: number;
};

// Output is 5x base input on every model listed here.
const PRICES: Price[] = [
  { key: 'fable-5-2', base: 8, read: 0.025 },
  { key: 'mythos-5-2', base: 8, read: 0.025 },
  { key: 'fable-5-1', base: 10, read: 0.025 },
  { key: 'mythos-5-1', base: 10, read: 0.025 },
  { key: 'fable', base: 10, read: 0.1 },
  { key: 'mythos', base: 10, read: 0.1 },
  { key: 'opus-5-5', base: 4, read: 0.05 },
  { key: 'opus-4-5', base: 5, read: 0.1 },
  { key: 'opus-4-6', base: 5, read: 0.1 },
  { key: 'opus-4-7', base: 5, read: 0.1 },
  { key: 'opus-4-8', base: 5, read: 0.1 },
  { key: 'opus-5', base: 5, read: 0.1 },
  { key: 'opus', base: 15, read: 0.1 },
  { key: 'sonnet-5-5', base: 2, read: 0.05 },
  { key: 'sonnet-5', base: 2, read: 0.1 },
  { key: 'sonnet', base: 3, read: 0.1 },
  { key: 'haiku-5-5', base: 0.1, read: 0.1, baseOver100k: 0.5 },
  { key: 'haiku-4', base: 1, read: 0.1 },
  { key: 'haiku', base: 0.8, read: 0.1 },
];

const OUTPUT_MULT = 5;
const WRITE_5M = 1.25;
const WRITE_1H = 2;
/** A cache write this big is a prefix rebuild, not new context. */
export const REBUILD_TOKENS = 50_000;

export type Cause = 'start' | 'model' | 'idle1h' | 'idle5m' | 'edited';

export const CAUSE_LABEL: Record<Cause, string> = {
  idle1h: 'Idle over 1 hour (cache expired)',
  idle5m: 'Idle 5 minutes to 1 hour',
  model: 'Model switched mid-session',
  edited: 'Context edited (compaction, tools, rewrite)',
  start: 'Session start or resume',
};

type Rec = {
  t: number;
  seq: number;
  model: string;
  session: string;
  input: number;
  write5m: number;
  write1h: number;
  created: number;
  read: number;
  output: number;
};

export type SessionRow = {
  /** first 8 characters of the session id */
  id: string;
  requests: number;
  rebuilds: number;
  rebuildCost: number;
  cost: number;
};

export type CauseRow = {
  cause: Cause;
  label: string;
  rebuilds: number;
  cost: number;
  avgPrefix: number;
};

export type Analysis = {
  requests: number;
  sessions: number;
  /** estimated spend at list price, USD */
  cost: number;
  rebuilds: number;
  rebuildCost: number;
  /** rebuildCost / cost, 0 when cost is 0 */
  rebuildShare: number;
  /** cache_read / all input tokens */
  hitRatio: number;
  /** requests whose model has no price in the table; counted in tokens only */
  unpricedRequests: number;
  unpricedModels: string[];
  causes: CauseRow[];
  worstSessions: SessionRow[];
  firstDay: string | null;
  lastDay: string | null;
};

function num(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

function priceOf(model: string): Price | null {
  for (const p of PRICES) if (model.includes(p.key)) return p;
  return null;
}

/** (total USD, cache-write USD) for one request; null when the model is unpriced. */
function costOf(r: Rec): { total: number; write: number } | null {
  const p = priceOf(r.model);
  if (!p) return null;
  const prompt = r.input + r.created + r.read;
  const base =
    p.baseOver100k !== undefined && prompt > 100_000 ? p.baseOver100k : p.base;
  const write = ((r.write5m * WRITE_5M + r.write1h * WRITE_1H) * base) / 1e6;
  const total =
    write +
    (r.input * base) / 1e6 +
    (r.read * base * p.read) / 1e6 +
    (r.output * base * OUTPUT_MULT) / 1e6;
  return { total, write };
}

export class Analyzer {
  private byRequest = new Map<string, Rec>();
  private seq = 0;

  /** Feed one JSONL line. Lines that are not assistant usage rows are skipped. */
  addLine(line: string, fileName: string): void {
    if (!line.includes('"usage"')) return;
    let row: Record<string, unknown>;
    try {
      row = JSON.parse(line);
    } catch {
      return;
    }
    if (!row || row.type !== 'assistant') return;
    const msg = row.message as Record<string, unknown> | undefined;
    const u = msg?.usage as Record<string, unknown> | undefined;
    if (!u) return;
    const ts = typeof row.timestamp === 'string' ? row.timestamp : '';
    const t = Date.parse(ts);
    if (!ts || Number.isNaN(t)) return;

    const created = num(u.cache_creation_input_tokens);
    const split = u.cache_creation as Record<string, unknown> | undefined;
    const hasSplit = !!split && Object.keys(split).length > 0;
    const id =
      typeof row.requestId === 'string' && row.requestId
        ? row.requestId
        : `${fileName}:${String(row.uuid)}`;

    this.byRequest.set(id, {
      t,
      seq: this.seq++,
      model: typeof msg?.model === 'string' ? msg.model : '',
      session: typeof row.sessionId === 'string' ? row.sessionId : '',
      input: num(u.input_tokens),
      write5m: hasSplit ? num(split.ephemeral_5m_input_tokens) : 0,
      // Without the per-TTL split the whole write is priced at the 1h rate,
      // as in analyze_cache.py (Claude Code writes its prefix with a 1h TTL).
      write1h: hasSplit ? num(split.ephemeral_1h_input_tokens) : created,
      created,
      read: num(u.cache_read_input_tokens),
      output: num(u.output_tokens),
    });
  }

  result(): Analysis {
    const rows = Array.from(this.byRequest.values()).sort(
      (a, b) => a.t - b.t || a.seq - b.seq
    );

    let cost = 0;
    let rebuilds = 0;
    let rebuildCost = 0;
    let input = 0;
    let created = 0;
    let read = 0;
    let unpricedRequests = 0;
    const unpricedModels = new Set<string>();
    const sessions = new Map<string, SessionRow>();
    const prev = new Map<string, Rec>();
    const causes = new Map<
      Cause,
      { rebuilds: number; cost: number; tokens: number }
    >();

    for (const r of rows) {
      const c = costOf(r);
      const tokens = r.input + r.created + r.read + r.output;
      if (!c && tokens > 0) {
        unpricedRequests += 1;
        unpricedModels.add(r.model || 'unknown model');
      }
      const total = c?.total ?? 0;
      const write = c?.write ?? 0;
      cost += total;
      input += r.input;
      created += r.created;
      read += r.read;

      let s = sessions.get(r.session);
      if (!s) {
        s = {
          id: r.session.slice(0, 8) || 'no id',
          requests: 0,
          rebuilds: 0,
          rebuildCost: 0,
          cost: 0,
        };
        sessions.set(r.session, s);
      }
      s.requests += 1;
      s.cost += total;

      if (r.created >= REBUILD_TOKENS) {
        rebuilds += 1;
        rebuildCost += write;
        s.rebuilds += 1;
        s.rebuildCost += write;

        const p = prev.get(r.session);
        let cause: Cause;
        if (!p) cause = 'start';
        else if (p.model !== r.model) cause = 'model';
        else {
          const gap = (r.t - p.t) / 1000;
          cause = gap > 3600 ? 'idle1h' : gap > 300 ? 'idle5m' : 'edited';
        }
        const b = causes.get(cause) ?? { rebuilds: 0, cost: 0, tokens: 0 };
        b.rebuilds += 1;
        b.cost += write;
        b.tokens += r.created;
        causes.set(cause, b);
      }
      prev.set(r.session, r);
    }

    const allInput = input + created + read;
    const day = (t: number) => new Date(t).toISOString().slice(0, 10);

    return {
      requests: rows.length,
      sessions: sessions.size,
      cost,
      rebuilds,
      rebuildCost,
      rebuildShare: cost > 0 ? rebuildCost / cost : 0,
      hitRatio: allInput > 0 ? read / allInput : 0,
      unpricedRequests,
      unpricedModels: Array.from(unpricedModels).sort(),
      causes: Array.from(causes.entries())
        .map(([cause, b]) => ({
          cause,
          label: CAUSE_LABEL[cause],
          rebuilds: b.rebuilds,
          cost: b.cost,
          avgPrefix: b.tokens / b.rebuilds,
        }))
        .sort((a, b) => b.cost - a.cost || b.rebuilds - a.rebuilds),
      worstSessions: Array.from(sessions.values())
        .filter(s => s.rebuilds > 0)
        .sort((a, b) => b.rebuildCost - a.rebuildCost)
        .slice(0, 8),
      firstDay: rows.length ? day(rows[0].t) : null,
      lastDay: rows.length ? day(rows[rows.length - 1].t) : null,
    };
  }
}

/** The part of a File this module needs, so tests can pass plain objects. */
export type LogFile = {
  name: string;
  size: number;
  stream(): ReadableStream<Uint8Array>;
};

const YIELD_EVERY = 4 * 1024 * 1024;

/**
 * Read .jsonl files chunk by chunk and analyse them. Nothing is kept except one
 * small numeric record per request, and the loop yields to the event loop every
 * few megabytes so a large folder does not freeze the tab.
 */
export async function analyzeFiles(
  files: LogFile[],
  onProgress?: (done: number, total: number) => void
): Promise<Analysis> {
  const analyzer = new Analyzer();
  const total = files.reduce((n, f) => n + f.size, 0);
  let done = 0;
  let sinceYield = 0;

  for (const file of files) {
    const reader = file.stream().getReader();
    const decoder = new TextDecoder();
    let rest = '';
    for (;;) {
      const { value, done: end } = await reader.read();
      if (end) break;
      const text = rest + decoder.decode(value, { stream: true });
      let from = 0;
      for (;;) {
        const nl = text.indexOf('\n', from);
        if (nl === -1) break;
        analyzer.addLine(text.slice(from, nl), file.name);
        from = nl + 1;
      }
      rest = text.slice(from);
      done += value.byteLength;
      sinceYield += value.byteLength;
      if (sinceYield >= YIELD_EVERY) {
        sinceYield = 0;
        onProgress?.(done, total);
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      }
    }
    rest += decoder.decode();
    if (rest) analyzer.addLine(rest, file.name);
  }
  onProgress?.(total, total);
  return analyzer.result();
}

export function analyzeLines(lines: string[], fileName = 'sample'): Analysis {
  const analyzer = new Analyzer();
  for (const line of lines) analyzer.addLine(line, fileName);
  return analyzer.result();
}

/* ── Sample data ────────────────────────────────────────────────────────── */

/**
 * Invented sessions for the "Try with sample data" button. Deterministic, so
 * the result is the same on every click. No real log content is in here.
 */
export function sampleLines(): string[] {
  const lines: string[] = [];
  let n = 0;
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const push = (
    session: string,
    model: string,
    t: number,
    created: number,
    read: number
  ) => {
    n += 1;
    lines.push(
      JSON.stringify({
        type: 'assistant',
        sessionId: session,
        requestId: `req_sample_${n}`,
        timestamp: new Date(t).toISOString(),
        message: {
          model,
          usage: {
            input_tokens: 20 + Math.floor(rand() * 200),
            cache_creation_input_tokens: created,
            cache_read_input_tokens: read,
            cache_creation: {
              ephemeral_5m_input_tokens: 0,
              ephemeral_1h_input_tokens: created,
            },
            output_tokens: 300 + Math.floor(rand() * 1500),
          },
        },
      })
    );
  };

  const MIN = 60_000;
  // [session id, model, start, turns, breaks: turn index -> minutes idle or 'model']
  const plan: [
    string,
    string,
    string,
    number,
    Record<number, number | string>,
  ][] = [
    [
      'a1f4c0de-sample',
      'claude-opus-5-5',
      '2026-11-03T08:10:00Z',
      90,
      { 35: 95, 70: 20 },
    ],
    [
      'b7e21a90-sample',
      'claude-opus-5-5',
      '2026-11-03T13:30:00Z',
      60,
      { 40: 'claude-fable-5-2' },
    ],
    [
      'c93d55f2-sample',
      'claude-fable-5-2',
      '2026-11-04T09:00:00Z',
      70,
      { 25: 130, 55: 75 },
    ],
    ['d0428b6e-sample', 'claude-sonnet-5-5', '2026-11-04T15:20:00Z', 45, {}],
  ];

  for (const [session, startModel, start, turns, breaks] of plan) {
    let t = Date.parse(start);
    let model = startModel;
    let prefix = 0;
    for (let i = 0; i < turns; i++) {
      const step = breaks[i];
      let cold = i === 0;
      if (typeof step === 'number') {
        t += step * MIN;
        // the 1h cache survives a 20-minute pause and expires after an hour
        cold = step > 60;
      } else if (typeof step === 'string') {
        model = step;
        cold = true;
      }
      const added = 1500 + Math.floor(rand() * 4500);
      if (i === 0) {
        prefix = 42_000 + added;
        push(session, model, t, prefix, 0);
      } else if (cold) {
        prefix += added;
        push(session, model, t, prefix, 0);
      } else {
        push(session, model, t, added, prefix);
        prefix += added;
      }
      t += (0.5 + rand() * 2.5) * MIN;
    }
  }
  return lines;
}
