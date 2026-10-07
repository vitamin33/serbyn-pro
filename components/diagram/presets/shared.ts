import type { ReactNode } from 'react';
import type { Encoding, LegendItem, Tone } from '../primitives';

/** Props every preset takes. */
export type PresetBase = {
  /** aria-label: what the picture shows, in a sentence. */
  label: string;
  /** The claim the diagram supports. */
  caption: ReactNode;
  /** ids of the 1–3 nodes or edges the post is about; drawn in the accent. */
  emphasis?: string[];
  /** Shown only for encodings drawn 2+ times. */
  legend?: LegendItem[];
  /** Minimum viewBox width (default 960). Content wider than this widens it. */
  width?: number;
};

export type NodeData = {
  id: string;
  title: string;
  /** One string per line. */
  sub?: string | string[];
  tone?: Tone;
  /** Title in mono (technical names). */
  mono?: boolean;
};

export type EdgeData = {
  from: string;
  to: string;
  label?: string | string[];
  /** Defaults to `from->to`. */
  id?: string;
  dashed?: boolean;
  tone?: 'default' | 'accent' | 'muted';
};

export const edgeId = (e: EdgeData) => e.id ?? `${e.from}->${e.to}`;

export function isEmph(emphasis: string[] | undefined, id: string) {
  return !!emphasis && emphasis.includes(id);
}

export function nodeTone(n: NodeData, emphasis?: string[]): Tone {
  return isEmph(emphasis, n.id) ? 'accent' : (n.tone ?? 'default');
}

export function edgeTone(
  e: EdgeData,
  emphasis?: string[]
): 'default' | 'accent' | 'muted' {
  return isEmph(emphasis, edgeId(e)) ? 'accent' : (e.tone ?? 'default');
}

/** Counts drawn encodings so the legend can drop one-off items. */
export class Usage {
  counts: Partial<Record<Encoding, number>> = {};
  add(enc: Encoding | undefined) {
    if (!enc || enc === 'default') return;
    this.counts[enc] = (this.counts[enc] ?? 0) + 1;
  }
  tone(t: Tone) {
    this.add(
      t === 'accent'
        ? 'accent'
        : t === 'muted' || t === 'ledger'
          ? 'muted'
          : undefined
    );
  }
  edge(t: 'default' | 'accent' | 'muted', dashed?: boolean) {
    if (t === 'accent') this.add('edge-accent');
    if (dashed) this.add('edge-dashed');
  }
}

export const MARGIN = 16;
export const minW = (w: number) => Math.round(w * 0.79);
