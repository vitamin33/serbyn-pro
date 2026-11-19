'use client';

import { useCallback, useRef, useState, type DragEvent } from 'react';
import { Eyebrow, Verdict, buttonProps } from '@/components/ds';
import { track } from '@/lib/analytics';
import {
  analyzeFiles,
  analyzeLines,
  sampleLines,
  REBUILD_TOKENS,
  type Analysis,
  type Cause,
} from '@/lib/tools/cache-rebuilds';

// Everything here runs in the visitor's tab. The files are read with the
// browser's own stream reader and handed to lib/tools/cache-rebuilds; nothing
// derived from them goes to the network or to storage. The one analytics event
// carries the tool name only, and the whole block is marked ph-no-capture so
// PostHog autocapture never reads text rendered from a log.

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const int = new Intl.NumberFormat('en-US');

function share(v: number): string {
  const p = v * 100;
  return p > 0 && p < 10 ? `${p.toFixed(1)}%` : `${Math.round(p)}%`;
}
function kTokens(v: number): string {
  return `${Math.round(v / 1000)}k`;
}

const FIXES: { cause: Cause | 'size'; tag: string; text: string }[] = [
  {
    cause: 'idle1h',
    tag: 'Idle over 1h',
    text: 'The cache lives for one hour after the last request. Before a long break, finish the task and start a fresh session afterwards, or run /compact first so the prefix that gets rebuilt is small. Coming back to a 400k-token session after lunch pays for all 400k again.',
  },
  {
    cause: 'idle5m',
    tag: 'Idle 5m to 1h',
    text: 'A pause of 5 to 60 minutes came before these, so the part of the prompt held in the 5-minute cache had expired. Keep turns closer together while a session is large, or finish it before the break.',
  },
  {
    cause: 'model',
    tag: 'Model switch',
    text: 'A cache belongs to one model. Switching with /model in the middle of a long session writes the whole prefix again at the new rate. Pick the model at the start, and give a cheaper model its own short session or a subagent.',
  },
  {
    cause: 'edited',
    tag: 'Context edited',
    text: 'Something changed early in the prompt: a compaction, an MCP server connecting or dropping, a changed tool list, an edited CLAUDE.md. Set tools up before the session starts and compact at a moment you choose, not at the limit.',
  },
  {
    cause: 'start',
    tag: 'Start or resume',
    text: 'The first request of a session always writes its prefix. It gets expensive when you resume an old, long session. Start a new one from a short summary when the old context is no longer needed.',
  },
  {
    cause: 'size',
    tag: 'Prefix size',
    text: 'The price of a rebuild grows with the prefix. In my own logs 84% of rebuild dollars came from prefixes of 300k tokens or more. Shorter sessions make every other cause cheaper.',
  },
];

type FsEntry = {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
  file?: (ok: (f: File) => void, err: (e: unknown) => void) => void;
  createReader?: () => {
    readEntries: (
      ok: (entries: FsEntry[]) => void,
      err: (e: unknown) => void
    ) => void;
  };
};

/** Collect .jsonl files from a drop, walking dropped folders. */
async function filesFromDrop(e: DragEvent): Promise<File[]> {
  const out: File[] = [];
  const entries: FsEntry[] = [];
  const loose: File[] = [];
  for (const item of Array.from(e.dataTransfer.items)) {
    if (item.kind !== 'file') continue;
    const entry = (
      item as unknown as { webkitGetAsEntry?: () => FsEntry | null }
    ).webkitGetAsEntry?.();
    if (entry) entries.push(entry);
    else {
      const f = item.getAsFile();
      if (f) loose.push(f);
    }
  }
  const walk = async (entry: FsEntry): Promise<void> => {
    if (entry.isFile && entry.file) {
      if (!entry.name.endsWith('.jsonl')) return;
      const f = await new Promise<File>((ok, err) => entry.file!(ok, err));
      out.push(f);
    } else if (entry.isDirectory && entry.createReader) {
      const reader = entry.createReader();
      for (;;) {
        const batch = await new Promise<FsEntry[]>((ok, err) =>
          reader.readEntries(ok, err)
        );
        if (!batch.length) break;
        for (const child of batch) await walk(child);
      }
    }
  };
  for (const entry of entries) await walk(entry);
  return out.concat(loose.filter(f => f.name.endsWith('.jsonl')));
}

type Status =
  | { kind: 'idle' }
  | { kind: 'reading'; done: number; total: number; files: number }
  | { kind: 'error'; text: string };

export function CacheRebuildTool() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [result, setResult] = useState<Analysis | null>(null);
  const [source, setSource] = useState('');
  const [over, setOver] = useState(false);
  const tracked = useRef(false);
  const filesInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);

  const used = () => {
    if (tracked.current) return;
    tracked.current = true;
    track('tool_used', { tool: 'claude-code-cache-rebuilds' });
  };

  const run = useCallback(async (picked: File[]) => {
    const files = picked.filter(f => f.name.endsWith('.jsonl'));
    if (!files.length) {
      setStatus({
        kind: 'error',
        text: 'No .jsonl files in that selection. Claude Code keeps them in ~/.claude/projects.',
      });
      return;
    }
    used();
    setResult(null);
    const total = files.reduce((n, f) => n + f.size, 0);
    setStatus({ kind: 'reading', done: 0, total, files: files.length });
    try {
      const analysis = await analyzeFiles(files, (done, all) =>
        setStatus({ kind: 'reading', done, total: all, files: files.length })
      );
      if (!analysis.requests) {
        setStatus({
          kind: 'error',
          text: 'Those files have no assistant requests with usage data.',
        });
        return;
      }
      setSource(
        `${int.format(files.length)} ${files.length === 1 ? 'file' : 'files'}, ${(total / 1e6).toFixed(1)} MB`
      );
      setResult(analysis);
      setStatus({ kind: 'idle' });
    } catch {
      setStatus({
        kind: 'error',
        text: 'The browser could not read one of the files. Try the folder again.',
      });
    }
  }, []);

  const runSample = () => {
    used();
    setSource('sample data, invented sessions');
    setResult(analyzeLines(sampleLines()));
    setStatus({ kind: 'idle' });
  };

  const onDrop = async (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    run(await filesFromDrop(e));
  };

  const reading = status.kind === 'reading';
  const top = result?.causes[0]?.cause;
  const maxCause = result ? Math.max(...result.causes.map(c => c.cost), 0) : 0;
  const fixes = result
    ? FIXES.filter(
        f => f.cause === 'size' || result.causes.some(c => c.cause === f.cause)
      ).sort((a, b) => Number(b.cause === top) - Number(a.cause === top))
    : [];

  return (
    <div className="ph-no-capture" data-tool="cache-rebuilds">
      <div
        className="ds-tool-drop"
        data-over={over}
        onDragOver={e => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        <p>
          Drop your <code>~/.claude/projects</code> folder here, or any{' '}
          <code>.jsonl</code> session files from it.
        </p>
        <div className="ds-tool-actions">
          <button
            type="button"
            disabled={reading}
            onClick={() => folderInput.current?.click()}
            {...buttonProps()}
          >
            Choose folder
          </button>
          <button
            type="button"
            disabled={reading}
            onClick={() => filesInput.current?.click()}
            {...buttonProps({ variant: 'secondary' })}
          >
            Choose files
          </button>
          <button
            type="button"
            disabled={reading}
            onClick={runSample}
            data-testid="tool-sample"
            {...buttonProps({ variant: 'secondary' })}
          >
            Try with sample data
          </button>
        </div>
        <input
          ref={folderInput}
          className="ds-tool-file"
          type="file"
          multiple
          tabIndex={-1}
          aria-label="Choose the projects folder"
          data-testid="tool-folder-input"
          // not in React's types; Chromium, Safari and Firefox all support it
          {...({ webkitdirectory: '' } as Record<string, string>)}
          onChange={e => {
            run(Array.from(e.target.files ?? []));
            e.target.value = '';
          }}
        />
        <input
          ref={filesInput}
          className="ds-tool-file"
          type="file"
          multiple
          accept=".jsonl"
          tabIndex={-1}
          aria-label="Choose session files"
          data-testid="tool-files-input"
          onChange={e => {
            run(Array.from(e.target.files ?? []));
            e.target.value = '';
          }}
        />
        {reading && (
          <div className="ds-tool-progress" aria-hidden="true">
            <span
              style={{
                width: `${status.total ? (status.done / status.total) * 100 : 0}%`,
              }}
            />
          </div>
        )}
        <p
          className="ds-tool-status"
          role="status"
          data-tone={status.kind === 'error' ? 'claim' : undefined}
        >
          {reading &&
            `Reading ${int.format(status.files)} files, ${(status.done / 1e6).toFixed(0)} of ${(status.total / 1e6).toFixed(0)} MB`}
          {status.kind === 'error' && status.text}
          {status.kind === 'idle' &&
            'On macOS press Cmd+Shift+. in the file dialog to see the hidden .claude folder.'}
        </p>
      </div>

      {result && (
        <div className="ds-tool-result" data-testid="tool-result">
          <div className="ds-tool-headline">
            <div>
              <Eyebrow as="p" tone="claim">
                Spend on cache rebuilds
              </Eyebrow>
              <p className="ds-tool-share" data-testid="tool-share">
                {share(result.rebuildShare)}
              </p>
            </div>
            <div>
              <Verdict>
                {int.format(result.rebuilds)}{' '}
                {result.rebuilds === 1 ? 'rebuild' : 'rebuilds'} cost{' '}
                {usd.format(result.rebuildCost)} of {usd.format(result.cost)}.
              </Verdict>
              <div
                className="ds-tool-bar"
                role="img"
                aria-label={`Rebuilds are ${share(result.rebuildShare)} of estimated spend`}
              >
                <span
                  style={{
                    width: `${Math.min(result.rebuildShare * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="ds-tool-cap" style={{ marginTop: 10 }}>
                {source}
                {result.firstDay &&
                  ` · ${result.firstDay} to ${result.lastDay}`}
              </p>
            </div>
          </div>

          <ul className="ds-tool-tiles" aria-label="Totals">
            <li className="ds-tool-tile">
              <p className="ds-tool-num" data-testid="tool-requests">
                {int.format(result.requests)}
              </p>
              <p className="ds-tool-cap">
                requests in {int.format(result.sessions)}{' '}
                {result.sessions === 1 ? 'session' : 'sessions'}
              </p>
            </li>
            <li className="ds-tool-tile">
              <p className="ds-tool-num" data-testid="tool-total-cost">
                {usd.format(result.cost)}
              </p>
              <p className="ds-tool-cap">estimated spend at list price</p>
            </li>
            <li className="ds-tool-tile">
              <p
                className="ds-tool-num"
                data-tone="claim"
                data-testid="tool-rebuilds"
              >
                {int.format(result.rebuilds)}
              </p>
              <p className="ds-tool-cap">
                rebuilds (cache write of {kTokens(REBUILD_TOKENS)}+ tokens)
              </p>
            </li>
            <li className="ds-tool-tile">
              <p
                className="ds-tool-num"
                data-tone="claim"
                data-testid="tool-rebuild-cost"
              >
                {usd.format(result.rebuildCost)}
              </p>
              <p className="ds-tool-cap">spent on those rebuilds</p>
            </li>
            <li className="ds-tool-tile">
              <p className="ds-tool-num" data-testid="tool-hit">
                {share(result.hitRatio)}
              </p>
              <p className="ds-tool-cap">of input tokens read from cache</p>
            </li>
          </ul>

          {result.unpricedRequests > 0 && (
            <p className="ds-tool-warn" data-testid="tool-unpriced">
              Price unknown, tokens only: {int.format(result.unpricedRequests)}{' '}
              {result.unpricedRequests === 1 ? 'request' : 'requests'} on{' '}
              {result.unpricedModels.join(', ')}. They are counted as requests
              and add nothing to the dollar figures.
            </p>
          )}

          {result.rebuilds === 0 ? (
            <section className="ds-tool-sec">
              <Eyebrow as="p" tone="accent">
                Nothing to fix
              </Eyebrow>
              <h2 className="ds-h2">No rebuilds in these logs</h2>
              <p>
                No request wrote {kTokens(REBUILD_TOKENS)} tokens or more to the
                cache. Short sessions and steady work look like this.
              </p>
            </section>
          ) : (
            <>
              <section className="ds-tool-sec">
                <Eyebrow as="p">Why they happened</Eyebrow>
                <h2 className="ds-h2">What came before each rebuild</h2>
                <ul className="ds-tool-causes">
                  {result.causes.map(c => (
                    <li
                      key={c.cause}
                      className="ds-tool-cause"
                      data-cause={c.cause}
                    >
                      <p>{c.label}</p>
                      <div className="ds-tool-track" aria-hidden="true">
                        <span
                          style={{
                            width: `${maxCause ? (c.cost / maxCause) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <p className="ds-tool-cause-num">
                        {int.format(c.rebuilds)} × {kTokens(c.avgPrefix)} ·{' '}
                        {usd.format(c.cost)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="ds-tool-sec">
                <Eyebrow as="p">Where it hurt most</Eyebrow>
                <h2 className="ds-h2">Sessions with the costliest rebuilds</h2>
                <div className="ds-table-wrap">
                  <table className="ds-table" data-density="compact">
                    <thead>
                      <tr>
                        <th scope="col">Session</th>
                        <th scope="col">Requests</th>
                        <th scope="col">Rebuilds</th>
                        <th scope="col">Rebuild cost</th>
                        <th scope="col">Session cost</th>
                        <th scope="col">Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.worstSessions.map(s => (
                        <tr key={s.id}>
                          <td className="ds-num">{s.id}</td>
                          <td className="ds-num">{int.format(s.requests)}</td>
                          <td className="ds-num">{int.format(s.rebuilds)}</td>
                          <td className="ds-num" data-tone="claim">
                            {usd.format(s.rebuildCost)}
                          </td>
                          <td className="ds-num">{usd.format(s.cost)}</td>
                          <td className="ds-num">
                            {share(s.cost > 0 ? s.rebuildCost / s.cost : 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="ds-tool-sec">
                <Eyebrow as="p" tone="accent">
                  What to change
                </Eyebrow>
                <h2 className="ds-h2">Start with your biggest cause</h2>
                <ul className="ds-tool-fixes">
                  {fixes.map(f => (
                    <li
                      key={f.cause}
                      className="ds-tool-fix"
                      data-top={f.cause === top}
                    >
                      <p className="ds-tool-fix-tag">{f.tag}</p>
                      <p>{f.text}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}
