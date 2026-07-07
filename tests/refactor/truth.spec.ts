import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// T9 — TRUTH REGRESSION GUARD (audit Wave 1 F3/F4/F13/F30, extended in Wave 2).
// Source-grep over the content-bearing dirs: none of these forbidden strings may
// reappear. This is a static scan (no server needed) so it also catches copy that
// lives in components not currently routed onto a rendered page.
const ROOTS = ['app', 'components', 'lib', 'data', 'content'];
const IGNORE = new Set(['node_modules', '.next', '.git']);

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (IGNORE.has(entry)) continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (/\.(tsx?|json|mdx?|css)$/.test(entry)) out.push(p);
  }
  return out;
}

const repoRoot = join(__dirname, '..', '..');
const FILES = ROOTS.flatMap(r => {
  try {
    return walk(join(repoRoot, r));
  } catch {
    return [];
  }
});

// { needle, why, allow? } — allow lists files legitimately containing the needle
// (e.g. this test file itself). Matched case-insensitively.
const FORBIDDEN: { needle: string; why: string; allow?: RegExp }[] = [
  { needle: '15-agent', why: 'stale agent count (canonical: 27 agents / 18 mature)' },
  { needle: '15 agent', why: 'stale agent count (canonical: 27 agents / 18 mature)' },
  { needle: 'XX XXX', why: 'placeholder phone number' },
  { needle: 'MLOps Engineer & LLM Specialist', why: 'stale fabricated resume title' },
  { needle: 'total_business_value', why: 'fabricated unlabeled business-value metric' },
];

test.describe('T9 — no forbidden truth-regression strings in source', () => {
  for (const f of FORBIDDEN) {
    test(`source is free of "${f.needle}" (${f.why})`, () => {
      const hits: string[] = [];
      for (const file of FILES) {
        if (f.allow && f.allow.test(file)) continue;
        if (file.endsWith('truth.spec.ts')) continue; // this file lists the needles
        const text = readFileSync(file, 'utf8').toLowerCase();
        if (text.includes(f.needle.toLowerCase())) hits.push(file.replace(repoRoot, ''));
      }
      expect(hits, `"${f.needle}" found in: ${hits.join(', ')}`).toEqual([]);
    });
  }
});
