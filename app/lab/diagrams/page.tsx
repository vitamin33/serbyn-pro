import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  ArchitectureDiagram,
  ComparisonDiagram,
  FlowDiagram,
  GraphDiagram,
  LoopDiagram,
  ObjectiveTree,
  RegionsDiagram,
  StateMachine,
  SwimlaneDiagram,
} from '@/components/diagram';
import {
  PogEvalVsGuardrail,
  PogTierLanes,
  PogTurnDiagram,
} from '@/components/diagram/examples/proof-of-green';
import { Eyebrow } from '@/components/article';

// Internal gallery for the diagram system (docs/design/diagram-system.md).
// Not linked from the site, not in the sitemap, noindex.
export const metadata: Metadata = {
  title: 'Diagram gallery',
  robots: { index: false, follow: false },
};

function Both({
  id,
  name,
  note,
  children,
}: {
  id: string;
  name: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="grid gap-4" data-preset={id}>
      <div className="grid gap-1.5">
        <Eyebrow>{id}</Eyebrow>
        <h2 className="text-[1.65rem]">{name}</h2>
        <p className="text-muted-foreground">{note}</p>
      </div>
      {(['light', 'dark'] as const).map(theme => (
        <div
          key={theme}
          data-theme={theme}
          className="grid gap-2 rounded-lg border border-border p-4"
          data-gallery-theme={theme}
        >
          <span className="label-caps text-muted-foreground">{theme}</span>
          {children}
        </div>
      ))}
    </section>
  );
}

export default function DiagramGallery() {
  return (
    <div className="mx-auto grid max-w-wide gap-14 px-4 py-10 sm:px-5">
      <header className="grid max-w-measure gap-3">
        <Eyebrow>lab · diagram system</Eyebrow>
        <h1>Diagram gallery</h1>
        <p className="text-muted-foreground">
          Every preset with sample data, each in the light and the dark theme.
          The last three are the diagrams from the proof-of-green explainer,
          rebuilt with the same components. Source:{' '}
          <code>components/diagram</code>, decision record:{' '}
          <code>docs/design/diagram-system.md</code>.
        </p>
      </header>

      <Both
        id="flow"
        name="FlowDiagram"
        note="Pipeline, left to right. The retry edge is not adjacent, so it loops underneath."
      >
        <FlowDiagram
          title="dev loop · one spec"
          label="A spec goes from the decomposer to the dev-lead agent, the walker parses its result, the merge gate asks one question and the ledger records the outcome. A parse failure sends the slice back to the agent."
          caption="The merge gate is the only point where a human answers. Everything before it is the agent's own report, so that is where a false green would slip through."
          emphasis={['gate']}
          steps={[
            {
              id: 'decompose',
              title: 'Decomposer',
              sub: 'machine-validated specs',
            },
            {
              id: 'agent',
              title: 'Dev-lead agent',
              sub: 'plan, code, review, QA',
            },
            { id: 'walker', title: 'Walker', sub: 'parses the result' },
            { id: 'gate', title: 'Merge gate', sub: 'single y/N' },
            { id: 'ledger', title: 'Ledger', sub: 'append-only', mono: false },
          ]}
          edges={[
            { from: 'decompose', to: 'agent', label: 'spec' },
            { from: 'agent', to: 'walker', label: 'result' },
            { from: 'walker', to: 'gate' },
            { from: 'gate', to: 'ledger', label: 'verified' },
            {
              from: 'walker',
              to: 'agent',
              label: 'parse fail → retry',
              dashed: true,
            },
          ]}
        />
      </Both>

      <Both
        id="loop"
        name="LoopDiagram"
        note="Feedback loop with a single way out."
      >
        <LoopDiagram
          label="The agent edits code, runs the tests and reads the failures, then edits again, until the tests pass and it can claim done."
          caption="The only exit from the loop is a passing run after the last edit. A claim made from anywhere else in the loop is unproven."
          center="until green"
          emphasis={['run', 'exit']}
          nodes={[
            { id: 'edit', title: 'Edit code', sub: 'Edit / Write' },
            { id: 'run', title: 'Run tests', sub: 'Bash: pytest' },
            { id: 'read', title: 'Read failures', sub: 'exit code, counts' },
          ]}
          edges={[
            { from: 'edit', to: 'run', label: 'then' },
            { from: 'run', to: 'read', label: 'exit 1' },
            { from: 'read', to: 'edit', label: 'fix' },
          ]}
          exit={{
            from: 'run',
            title: 'Claim done',
            sub: 'proof: tier A',
            label: 'exit 0',
          }}
        />
      </Both>

      <Both
        id="architecture"
        name="ArchitectureDiagram"
        note="Grid placement, nested dashed boundaries, orthogonal edges routed automatically."
      >
        <ArchitectureDiagram
          label="Inside the developer's machine, the Claude Code harness contains the agent and the plugin's hooks. The hooks write a ledger on local disk; the Stop check reads it. Nothing crosses to the network."
          caption="Everything the plugin needs is already inside the harness boundary. The ledger never leaves the machine."
          emphasis={['check', 'ledger']}
          legend={[
            { encoding: 'accent', label: 'proof-of-green' },
            { encoding: 'dashed', label: 'boundary' },
          ]}
          sections={[{ label: 'local machine', row: 0 }]}
          nodes={[
            {
              id: 'agent',
              title: 'agent',
              sub: 'edits, Bash, tests',
              col: 0,
              row: 0,
              span: 3,
            },
            {
              id: 'hooks',
              title: 'hooks',
              sub: 'PostToolUse, Stop',
              col: 4,
              row: 0,
              span: 3,
              mono: true,
            },
            {
              id: 'check',
              title: 'Stop check',
              sub: 'claim vs trace',
              col: 4,
              row: 1,
              span: 3,
            },
            {
              id: 'ledger',
              title: 'ledger.jsonl',
              sub: 'facts only',
              col: 9,
              row: 1,
              span: 3,
              mono: true,
            },
          ]}
          boundaries={[
            {
              id: 'harness',
              label: 'harness: Claude Code',
              contains: ['agent', 'hooks', 'check'],
            },
            {
              id: 'disk',
              label: 'local disk',
              contains: ['ledger'],
              tone: 'muted',
            },
          ]}
          edges={[
            { from: 'agent', to: 'hooks', label: 'events' },
            { from: 'hooks', to: 'ledger', label: 'append' },
            { from: 'hooks', to: 'check', label: 'at Stop' },
            { from: 'ledger', to: 'check', label: 'reads' },
          ]}
        />
      </Both>

      <Both
        id="swimlane"
        name="SwimlaneDiagram"
        note="Several lanes against one time axis, with a marker line across all of them."
      >
        <SwimlaneDiagram
          label="Three canary stages of a model rollout over 60 minutes. The first two pass their SLO check before the eval gate; the third fails after it and is rolled back."
          caption="The eval gate splits each stage. Only a check that ran after the gate says anything about the new model."
          domain={[0, 60]}
          columns={[
            { label: 'old model', at: 12 },
            { label: 'new model', at: 42 },
          ]}
          outcomeLabel="result"
          marker={{ at: 26, label: 'eval gate' }}
          axis="minutes since deploy"
          emphasis={['full']}
          lanes={[
            {
              id: 'c5',
              label: 'canary 5%',
              events: [
                { at: 12, label: 'SLO ✓', muted: true },
                { at: 26, kind: 'diamond' },
                { at: 42, label: 'SLO ✓ p95', tier: 'a' },
              ],
              outcome: { tier: 'a', label: 'A' },
            },
            {
              id: 'c25',
              label: 'canary 25%',
              events: [
                { at: 12, label: 'SLO ✓', muted: true },
                { at: 26, kind: 'diamond' },
                { at: 42, label: 'SLO ✓ p95', tier: 'a' },
              ],
              outcome: { tier: 'a', label: 'A' },
            },
            {
              id: 'full',
              label: 'full rollout',
              events: [
                { at: 12, label: 'SLO ✓', muted: true },
                { at: 26, kind: 'diamond' },
                {
                  id: 'full-check',
                  at: 42,
                  label: 'error budget ✗',
                  tier: 'd',
                },
                { at: 54, kind: 'box', label: 'rollback' },
              ],
              outcome: { tier: 'd', label: 'D' },
            },
          ]}
          legend={[
            { encoding: 'tier-a', label: 'passed after the gate' },
            { encoding: 'tier-d', label: 'failed after the gate' },
          ]}
        />
      </Both>

      <Both
        id="comparison"
        name="ComparisonDiagram"
        note="Same nodes, same positions. The edge that changes is the only thing in the accent."
      >
        <ComparisonDiagram
          label="Before: the agent's claim of done goes straight to merge. After: the claim goes to a verify step on main, and only a verified claim reaches merge."
          caption="One edge moved. The claim no longer reaches merge on its own word; it has to pass through verify first."
          legend={[
            { encoding: 'edge-accent', label: 'new edge' },
            { encoding: 'edge-dashed', label: 'removed edge' },
          ]}
          nodes={[
            { id: 'agent', title: 'agent', sub: 'implements slice' },
            { id: 'claim', title: 'claim', sub: '"done, tests pass"' },
            { id: 'verify', title: 'verify', sub: 'rerun on main' },
            { id: 'merge', title: 'merge' },
          ]}
          before={{
            title: 'before',
            edges: [
              { from: 'agent', to: 'claim' },
              { from: 'claim', to: 'merge', label: 'trusted' },
            ],
          }}
          after={{
            title: 'after',
            edges: [
              { from: 'agent', to: 'claim' },
              { from: 'claim', to: 'verify', label: 'checked' },
              { from: 'verify', to: 'merge', label: 'green' },
            ],
          }}
        />
      </Both>

      <Both
        id="objective-tree"
        name="ObjectiveTree"
        note="Objective, sub-objectives in columns, key results stacked under each."
      >
        <ObjectiveTree
          label="The objective, agent claims backed by evidence, splits into measuring the problem, showing the effect, and never annoying the user, each with two key results."
          caption="Two halves make the value claim: the size of the problem and the effect of asking for proof. The third column keeps the tool installed."
          emphasis={['effect']}
          legend={[
            { encoding: 'tier-a', label: 'collecting' },
            { encoding: 'tier-c', label: 'not started' },
          ]}
          root={{
            id: 'root',
            title: 'Agent claims are backed by evidence',
            sub: 'objective',
            children: [
              {
                id: 'size',
                title: 'Measure the problem',
                sub: 'observe mode',
                children: [
                  { id: 'k1', title: 'unsupported-claim rate', status: 'a' },
                  { id: 'k2', title: 'confirmed false greens', status: 'a' },
                ],
              },
              {
                id: 'effect',
                title: 'Show the effect',
                sub: 'warn mode, evals',
                children: [
                  {
                    id: 'k3',
                    title: 'caught failures',
                    sub: 'with vs without',
                    status: 'c',
                  },
                  { id: 'k4', title: 'verification rate', status: 'c' },
                ],
              },
              {
                id: 'quiet',
                title: 'Never annoy',
                sub: 'warn mode',
                children: [
                  {
                    id: 'k5',
                    title: 'warning precision',
                    sub: 'labeled by hand',
                    status: 'c',
                  },
                  { id: 'k6', title: 'hook time per event', status: 'a' },
                ],
              },
            ],
          }}
        />
      </Both>

      <Both
        id="regions"
        name="RegionsDiagram"
        note="Zones and overlaps. Fills are translucent, so the overlap reads darker."
      >
        <RegionsDiagram
          label="Two overlapping zones inside a Claude Code session. Left: file edits the agent makes. Right: what the ledger records. The overlap holds Edit and Write calls. Edits made through Bash, such as sed -i or cat into a file, sit only in the left zone. Prompt text and the transcript sit outside both."
          caption="Edits made through Bash are the blind spot: the agent changed a file, and the ledger has no edit to measure from."
          emphasis={['sed', 'cat']}
          legend={[
            { encoding: 'accent', label: 'edits the ledger cannot see' },
          ]}
          regions={[
            {
              id: 'session',
              label: 'Claude Code session',
              x: 0,
              y: 0,
              w: 12,
              h: 6,
            },
            {
              id: 'edits',
              label: 'file edits by the agent',
              x: 0.4,
              y: 1.1,
              w: 6.5,
              h: 4.6,
              shape: 'ellipse',
              tone: 'muted',
            },
            {
              id: 'ledger',
              label: 'recorded in the ledger',
              x: 5.1,
              y: 1.1,
              w: 6.5,
              h: 4.6,
              shape: 'ellipse',
              tone: 'tier-a',
            },
          ]}
          items={[
            { id: 'sed', label: 'sed -i', x: 2.4, y: 3.0 },
            { id: 'cat', label: 'cat > file', x: 2.4, y: 3.9 },
            { id: 'edit', label: 'Edit / Write', x: 6.0, y: 3.45 },
            { id: 'tests', label: 'test runs', x: 9.4, y: 3.0 },
            { id: 'stop', label: 'claims at Stop', x: 9.4, y: 3.9 },
            { id: 'prompt', label: 'prompt text, transcript', x: 9.9, y: 0.55 },
          ]}
        />
      </Both>

      <Both
        id="graph"
        name="GraphDiagram"
        note="Generic nodes and edges, laid out by dagre on the server."
      >
        <GraphDiagram
          label="A slice moves from spec to plan to code to review to QA to merge. Review can send it back to code with changes requested, QA can send it back on a failing test."
          caption="Two back edges, both into code. Every path to merge passes QA, which is why QA's coverage decides how honest the green is."
          emphasis={['qa', 'qa->merge']}
          nodes={[
            { id: 'spec', title: 'spec' },
            { id: 'plan', title: 'plan' },
            { id: 'code', title: 'code' },
            { id: 'review', title: 'review' },
            { id: 'qa', title: 'QA', sub: 'tests + checks' },
            { id: 'merge', title: 'merge' },
          ]}
          edges={[
            { from: 'spec', to: 'plan' },
            { from: 'plan', to: 'code' },
            { from: 'code', to: 'review' },
            { from: 'review', to: 'qa', label: 'approved' },
            { from: 'review', to: 'code', label: 'changes' },
            { from: 'qa', to: 'code', label: 'fail' },
            { from: 'qa', to: 'merge', label: 'pass' },
          ]}
        />
      </Both>

      <Both
        id="state-machine"
        name="StateMachine"
        note="States as pills, labeled transitions, a self-loop, an initial dot and double-ringed final states."
      >
        <StateMachine
          label="In warn mode a turn starts idle. A turn without a code edit stays idle. At Stop, a C or D claim moves to warned; if the agent reruns the tests and they pass the claim ends verified, otherwise it ends unproven."
          caption="Warn mode speaks once per claim. Verified and unproven are the only two ways out."
          emphasis={['warned']}
          states={[
            { id: 'idle', label: 'idle', initial: true },
            { id: 'warned', label: 'warned' },
            { id: 'verified', label: 'verified', final: true },
            { id: 'unproven', label: 'unproven', final: true },
          ]}
          transitions={[
            { from: 'idle', to: 'idle', label: 'no code edit' },
            { from: 'idle', to: 'warned', label: 'Stop: C or D' },
            { from: 'warned', to: 'verified', label: 'rerun ✓' },
            { from: 'warned', to: 'unproven', label: 'no rerun' },
          ]}
        />
      </Both>

      <header className="grid max-w-measure gap-3 border-t border-border pt-10">
        <Eyebrow>reference rebuild</Eyebrow>
        <h2 className="text-[1.65rem]">The proof-of-green diagrams</h2>
        <p className="text-muted-foreground">
          Rebuilt from the reference explainer. One and three are hand-placed
          primitives at the reference coordinates; two is the swimlane preset.
        </p>
      </header>

      <Both
        id="ref-turn"
        name="One turn, end to end"
        note="Primitives, hand-placed."
      >
        <PogTurnDiagram caption="Three hooks append parsed facts (file path, exit code, pass and fail counts) to a per-session ledger. At Stop the check reads the ledger, grades the claim, and the mode decides whether anyone sees the result." />
      </Both>
      <Both
        id="ref-tiers"
        name="Everything is measured from the last code edit"
        note="SwimlaneDiagram preset."
      >
        <PogTierLanes caption="Same claim, same failing run before the edit, four outcomes. C and D are false-green candidates." />
      </Both>
      <Both
        id="ref-eval"
        name="Evals before release, guardrails on every turn"
        note="Primitives, hand-placed."
      >
        <PogEvalVsGuardrail caption="The green boxes are proof-of-green. It plugs into the hooks the harness already exposes." />
      </Both>
    </div>
  );
}
