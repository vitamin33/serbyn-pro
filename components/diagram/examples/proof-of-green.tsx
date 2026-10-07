import type { ReactNode } from 'react';
import {
  Arrow,
  Boundary,
  Box,
  Diagram,
  Divider,
  Note,
  SectionLabel,
} from '../primitives';
import { SwimlaneDiagram } from '../presets/swimlane';

// The three diagrams from the proof-of-green reference explainer, rebuilt with
// the diagram system as proof that it reproduces the reference. Diagrams 1 and
// 3 are hand-placed with primitives at the reference's own coordinates;
// diagram 2 is the SwimlaneDiagram preset.

/** 1 · One turn, end to end: hooks write facts, the Stop hook checks. */
export function PogTurnDiagram({ caption }: { caption: ReactNode }) {
  return (
    <Diagram
      height={236}
      caption={caption}
      label="Session events fire hooks that append parsed facts to a ledger; at Stop the check reads the ledger, grades the claim A to D, and in observe mode only records, in warn mode shows one line and asks Claude once to rerun the tests."
    >
      <SectionLabel x={16} y={12}>
        in the session
      </SectionLabel>
      <Box
        x={16}
        y={20}
        w={170}
        h={56}
        title="You send a prompt"
        sub="turn starts"
      />
      <Box
        x={206}
        y={20}
        w={170}
        h={56}
        title="Claude edits code"
        sub="Edit / Write / MultiEdit"
      />
      <Box
        x={396}
        y={20}
        w={170}
        h={56}
        title="Claude runs tests"
        sub="Bash: pytest, flutter test…"
      />
      <Box
        x={586}
        y={20}
        w={170}
        h={56}
        title="Claude replies"
        sub={'"Fixed. All tests pass."'}
      />
      <Arrow
        points={[
          [186, 48],
          [204, 48],
        ]}
      />
      <Arrow
        points={[
          [376, 48],
          [394, 48],
        ]}
      />
      <Arrow
        points={[
          [566, 48],
          [584, 48],
        ]}
      />

      <Arrow
        points={[
          [101, 76],
          [101, 150],
        ]}
        label="UserPromptSubmit"
        labelAt={[108, 118]}
      />
      <Arrow
        points={[
          [291, 76],
          [291, 150],
        ]}
        label="PostToolUse"
        labelAt={[298, 118]}
      />
      <Arrow
        points={[
          [481, 76],
          [481, 150],
        ]}
        label={['PostToolUse', 'or …Failure']}
        labelAt={[488, 110]}
      />
      <Arrow
        points={[
          [671, 76],
          [671, 150],
        ]}
        tone="accent"
        label="Stop"
        labelAt={[678, 118]}
        labelTone="accent"
      />

      <Box x={16} y={152} w={520} h={64} tone="ledger" />
      <SectionLabel x={28} y={170}>
        ledger · one jsonl per session · facts only
      </SectionLabel>
      <Note x={28} y={200} lines="turn 1" tone="fg" />
      <Note x={206} y={200} lines="edit calc.py · code" tone="fg" />
      <Note x={396} y={200} lines="test_run · exit 1" tone="fg" />

      <Box
        x={586}
        y={152}
        w={170}
        h={64}
        tone="accent"
        title="Check the claim"
        sub={['find claim, find last edit,', 'grade evidence A–D']}
      />
      <Arrow
        points={[
          [536, 184],
          [584, 184],
        ]}
        tone="accent"
        label="reads"
        labelAt={[560, 177]}
        labelAnchor="middle"
      />

      <Box
        x={800}
        y={20}
        w={144}
        h={56}
        title="observe (default)"
        sub="verdict saved, silent"
      />
      <Box
        x={800}
        y={152}
        w={144}
        h={64}
        title="warn"
        sub={['one line to you, asks', 'Claude once to rerun']}
      />
      <Arrow
        points={[
          [756, 166],
          [778, 166],
          [778, 48],
          [798, 48],
        ]}
        tone="accent"
      />
      <Arrow
        points={[
          [756, 198],
          [798, 198],
        ]}
        tone="accent"
      />
      <Note x={783} y={110} lines="mode" />
    </Diagram>
  );
}

const SAME_BEFORE = {
  at: 250,
  kind: 'pill' as const,
  label: 'run ✗ 2 failed',
  w: 108,
  muted: true,
};
const EDIT = { at: 440, kind: 'diamond' as const };
const REPLY = { at: 800, kind: 'box' as const, label: '"tests pass"', w: 124 };

/** 2 · The rule: the same claim gets a different tier depending on what ran after the last edit. */
export function PogTierLanes({ caption }: { caption: ReactNode }) {
  return (
    <SwimlaneDiagram
      caption={caption}
      label="Four sessions with the same claim and the same failing run before the last edit. A full passing run after the edit gives A, a partial passing run gives B, no run after the edit gives C, a failed or masked run gives D."
      domain={[130, 870]}
      track={[130, 870]}
      columns={[
        { label: 'before', at: 250 },
        { label: 'after', at: 640 },
        { label: 'reply', at: 800 },
      ]}
      outcomeLabel="tier"
      marker={{ at: 440, label: 'last code edit' }}
      axis="time in the session (ledger seq)"
      lanes={[
        {
          id: 'full',
          label: 'full suite passed',
          events: [
            SAME_BEFORE,
            EDIT,
            { at: 640, label: 'full run ✓ 42', w: 128, tier: 'a' },
            REPLY,
          ],
          outcome: { tier: 'a', label: 'A' },
        },
        {
          id: 'some',
          label: 'only some tests',
          events: [
            SAME_BEFORE,
            EDIT,
            { at: 640, label: '-k login ✓ 3', w: 128, tier: 'b' },
            REPLY,
          ],
          outcome: { tier: 'b', label: 'B' },
        },
        {
          id: 'none',
          label: 'nothing after edit',
          events: [
            SAME_BEFORE,
            EDIT,
            { at: 640, kind: 'text', label: 'no run' },
            REPLY,
          ],
          outcome: { tier: 'c', label: 'C' },
        },
        {
          id: 'failed',
          label: 'failed or masked',
          events: [
            SAME_BEFORE,
            EDIT,
            { at: 640, label: 'run ✗ 1 failed', w: 128, tier: 'd' },
            REPLY,
          ],
          outcome: { tier: 'd', label: 'D' },
        },
      ]}
    />
  );
}

/** 3 · Where it sits: evals before release, the guardrail on every turn. */
export function PogEvalVsGuardrail({ caption }: { caption: ReactNode }) {
  return (
    <Diagram
      height={318}
      caption={caption}
      label="Top row: offline eval pipeline from fixed cases through the agent and graders to a score. Bottom row: inside the Claude Code harness the agent works and replies; proof-of-green's ledger records evidence, the guardrail checks the claim against it, and the gate decides warn now or block later."
    >
      <SectionLabel x={16} y={18}>
        eval · offline · before release · sampled
      </SectionLabel>
      <Box
        x={16}
        y={28}
        w={190}
        h={52}
        title="fixed cases"
        sub="2 trap repos, scripted"
      />
      <Box
        x={256}
        y={28}
        w={190}
        h={52}
        title="agent ± plugin"
        sub="3 runs × 2 arms"
      />
      <Box
        x={496}
        y={28}
        w={210}
        h={52}
        title="graders"
        sub="tool order, regex, LLM rubric"
      />
      <Box
        x={756}
        y={28}
        w={188}
        h={52}
        title="score"
        sub="with vs without plugin"
      />
      <Arrow
        points={[
          [206, 54],
          [254, 54],
        ]}
      />
      <Arrow
        points={[
          [446, 54],
          [494, 54],
        ]}
      />
      <Arrow
        points={[
          [706, 54],
          [754, 54],
        ]}
      />

      <Divider x1={16} x2={944} y={108} />

      <SectionLabel x={16} y={134}>
        guardrail · online · every real turn
      </SectionLabel>
      <Boundary
        x={16}
        y={146}
        w={560}
        h={160}
        label="harness: Claude Code (tools, permissions, hooks)"
      />
      <Box
        x={36}
        y={178}
        w={200}
        h={52}
        title="agent works"
        sub="edits, Bash, tests"
      />
      <Box
        x={356}
        y={178}
        w={200}
        h={52}
        title="agent replies"
        sub={'"done, tests pass"'}
      />
      <Arrow
        points={[
          [236, 204],
          [354, 204],
        ]}
        label="then"
        labelAt={[295, 197]}
        labelAnchor="middle"
      />
      <Box
        x={36}
        y={254}
        w={520}
        h={40}
        tone="accent"
        title="ledger + /report · observability"
      />
      <Arrow
        points={[
          [136, 230],
          [136, 252],
        ]}
        tone="accent"
        label="hooks record"
        labelAt={[144, 246]}
      />

      <Box
        x={616}
        y={178}
        w={150}
        h={52}
        tone="accent"
        title="claim vs trace"
        sub="guardrail, at Stop"
      />
      <Box
        x={806}
        y={178}
        w={138}
        h={52}
        tone="accent"
        title="warn / block"
        sub="gate (block = later)"
      />
      <Arrow
        points={[
          [556, 204],
          [614, 204],
        ]}
        tone="accent"
        label="claim"
        labelAt={[585, 197]}
        labelAnchor="middle"
        halo
      />
      <Arrow
        points={[
          [556, 274],
          [691, 274],
          [691, 232],
        ]}
        tone="accent"
        label="evidence"
        labelAt={[600, 267]}
      />
      <Arrow
        points={[
          [766, 204],
          [804, 204],
        ]}
        tone="accent"
      />
    </Diagram>
  );
}
