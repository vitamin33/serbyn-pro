import { Eyebrow, SourceLabel, TextLink, Verdict } from '@/components/ds';
import { BookingCta } from '@/components/ds/cta';
import { PrintButton } from '@/components/resume/print-button';
import { CONTACT } from '@/lib/facts';

// Résumé on the "Claim vs. proof" system (design variant B): every line of AI
// work sits next to its source. Content rules: the work history follows the
// LinkedIn timeline in years only, no phone number, clients of an employer are
// described by industry, and only public repositories are linked.

type Source = { label: string; href?: string; muted?: boolean };

const TILES: {
  value: string;
  unit?: string;
  caption: string;
  source: string;
  claim?: boolean;
}[] = [
  { value: '27', caption: 'agents, 18 mature', source: 'Ascend, built by me' },
  { value: '1,178', caption: 'automated tests', source: 'Ascend, built by me' },
  {
    value: '0',
    unit: 'of 40',
    caption: 'silent failures, was 22',
    source: 'published experiment',
  },
  {
    value: '−58%',
    caption: 'LLM bill, $82 to $34 a month',
    source: 'my own platform',
    claim: true,
  },
];

const CERTIFICATIONS: { name: string; level: string; href: string }[] = [
  {
    name: 'Claude Certified Architect',
    level: 'Professional',
    href: 'https://www.credly.com/badges/7eb76008-726e-4a7b-9b73-cf6c4bd48f1b/public_url',
  },
  {
    name: 'Claude Certified Developer',
    level: 'Foundations',
    href: 'https://www.credly.com/org/anthropic/badge/claude-certified-developer-foundations',
  },
];

const AI_WORK: { claim: string; source: Source }[] = [
  {
    claim:
      'Designed and built a multi-agent orchestration daemon: 27 agents (18 mature), trust-tiered L0–L4 execution, policy gates, budget guards, 6-provider LLM fallback, 1,178 automated tests',
    source: {
      label: 'Ascend · repo',
      href: 'https://github.com/vitamin33/ascend-core',
    },
  },
  {
    claim:
      'Built a spec-driven development pipeline where an agent turns a spec into a working change, gated by acceptance checks: 101 logged runs at a 0.94 pass rate',
    source: { label: 'DW · methodology', href: '/methodology' },
  },
  {
    claim:
      'Built an AI content engine with tiered multi-model routing and editorial and fabrication checks: 109 posts published from 1,455 generated (Aug 2026)',
    source: { label: 'Crest · usecrest.io', href: 'https://usecrest.io' },
  },
  {
    claim:
      'Ran controlled experiments on agent self-verification; one checkpoint design took silent failures from 22 of 40 runs to 0 of 40',
    source: {
      label: 'published post',
      href: '/blog/enforced-checkpoint-0-of-40-silent-failures-vs-22-of-40',
    },
  },
  {
    claim:
      'Analysed 68,700 of my own Claude Code requests and traced 24% of spend to 1,119 prompt-cache rebuilds; shipped the status line that warns before one happens',
    source: {
      label: 'claude-code-statusline · repo',
      href: 'https://github.com/vitamin33/claude-code-statusline',
    },
  },
  {
    claim:
      'Shipped a Claude Code plugin that flags a “tests pass” claim made with no test run after the last edit',
    source: {
      label: 'proof-of-green · post',
      href: '/blog/proof-of-green-checks-every-done',
    },
  },
  {
    claim:
      'Cut the LLM bill on my own platform by 58% ($82 to $34 a month) with multi-model routing and caching',
    source: { label: 'cost teardown', href: '/llm-cost-teardown' },
  },
  {
    claim:
      'Largest contributor across 13 repositories on an AI platform; designed and shipped the quality-oracle service that verifies AI-agent quality before payment; production on AWS ECS',
    source: { label: 'contract · assisterr · 2025', muted: true },
  },
  {
    claim:
      'Own release engineering end to end: 26 store builds shipped in 2026, each gated by an end-to-end suite that runs against the shipped binary',
    source: { label: 'contract · Vitelle · 2026 – present', muted: true },
  },
  {
    claim:
      'Built a multimodal pipeline: a vision model captions ad creatives, an LLM analyses copy variants, local inference with a hosted fallback',
    source: { label: 'contract · 2025', muted: true },
  },
];

const EARLIER: { dates: string; role: string; where: string; note?: string }[] =
  [
    {
      dates: '2023 – 2024',
      role: 'Senior Software Engineer',
      where: 'Luxoft',
      note: 'Led a company-wide Flutter UI library for a global dental-technology client: 120+ widgets, used by 6 apps, 40% faster time-to-feature, 90% test coverage.',
    },
    {
      dates: '2023',
      role: 'Senior Full-Stack Engineer (Python and Flutter)',
      where: 'Precision OT Network',
      note: 'AI-medicine startup. Took a fragile MVP to production readiness; wrote the Flask and SQLAlchemy API; unknown crashes down 30%.',
    },
    {
      dates: '2022 – 2023',
      role: 'Lead Software Engineer',
      where: 'DarkstoreApp',
      note: 'Led the Android team on a multi-app logistics service where a branded app is generated per customer by the build pipeline; built its CI/CD.',
    },
    {
      dates: '2017 – 2022',
      role: 'Senior, then Lead Software Engineer',
      where: 'EPAM Systems',
      note: 'Led teams of 3 to 4 from MVP to store launch for clients in US fintech, German sport, UK telecom and Spanish e-commerce. EPAM Management School, 2020.',
    },
    {
      dates: '2015 – 2017',
      role: 'Software Engineer',
      where: 'GlobalLogic',
      note: 'Video-editing app with 100M+ users, Google Play Editors’ Choice, store rating above 4.5; later acquired by Vimeo.',
    },
    {
      dates: '2012 – 2015',
      role: 'Android Developer',
      where: 'QArea, Sloboda Studio',
    },
  ];

const PROJECTS: { name: string; what: string; href: string }[] = [
  {
    name: 'agent-eval-labs',
    what: 'reproducible experiments on how agents verify their own work',
    href: 'https://github.com/vitamin33/agent-eval-labs',
  },
  {
    name: 'RAGline',
    what: 'streaming-first, multi-tenant Python back end with an optional RAG module',
    href: 'https://github.com/vitamin33/ragline',
  },
  {
    name: 'High-load Python starter',
    what: 'FastAPI, Kafka, Postgres and Redis with metrics, tracing and load tests',
    href: 'https://github.com/vitamin33/highload-python-starter-full',
  },
  {
    name: 'Moxy',
    what: 'e-commerce shop for web and mobile, part-time, 2022 – 2023',
    href: 'https://github.com/vitamin33/moxy',
  },
];

const STACK: { title: string; items: string }[] = [
  {
    title: 'Agent reliability',
    items:
      'Trajectory evals, false-green metering, evidence-binding gates, trust-tiered execution, Claude Code hooks and plugins',
  },
  {
    title: 'LLM and cost',
    items:
      'Claude API, Claude Code, MCP, LangGraph, RAG, multi-model routing, prompt and semantic caching',
  },
  {
    title: 'Platform',
    items:
      'Python, FastAPI, Node.js/NestJS, PostgreSQL, Redis, Kafka, Docker, Kubernetes, AWS, GCP, GitHub Actions',
  },
];

function SourceCell({ source }: { source: Source }) {
  const external = source.href?.startsWith('http');
  return (
    <SourceLabel
      className="ds-resume-src"
      provenance={source.muted ? 'employed' : 'built'}
      claimLabel={false}
    >
      {source.href ? (
        <TextLink href={source.href} external={external}>
          {source.label}
        </TextLink>
      ) : (
        source.label
      )}
    </SourceLabel>
  );
}

export default function ResumePage() {
  return (
    <div className="ds-resume">
      <div className="ds-wrap ds-resume-wrap">
        <header className="ds-resume-head">
          <Eyebrow tone="accent">Résumé · every line has a source</Eyebrow>
          <h1 className="ds-h1" data-size="index">
            {CONTACT.name}
          </h1>
          <Verdict>
            I make AI agents reliable enough to run in production.
          </Verdict>
          <div className="ds-resume-actions">
            <PrintButton />
            <BookingCta
              location="resume"
              variant="secondary"
              label="Book a call"
              className="no-print"
            />
            <p className="ds-resume-meta">
              {CONTACT.email} · {CONTACT.location} · remote · UK LTD (
              {CONTACT.company})
            </p>
          </div>
        </header>

        <ul className="ds-resume-tiles" aria-label="Key results">
          {TILES.map(tile => (
            <li key={tile.caption} className="ds-resume-tile">
              <p
                className="ds-resume-num"
                data-claim-tone={tile.claim ? 'claim' : undefined}
              >
                {tile.value}
                {tile.unit && <span> {tile.unit}</span>}
              </p>
              <p className="ds-resume-cap">{tile.caption}</p>
              <SourceLabel claimLabel={false}>{tile.source}</SourceLabel>
            </li>
          ))}
        </ul>

        <section className="ds-resume-sec">
          <Eyebrow as="p">01 · Credentials</Eyebrow>
          <h2 className="ds-h2">Certified by Anthropic</h2>
          {CERTIFICATIONS.map(cert => (
            <div key={cert.name} className="ds-resume-row">
              <p>
                <strong>{cert.name}</strong>, {cert.level}
              </p>
              <SourceCell
                source={{
                  label: 'proctored exam · 2026 · Credly',
                  href: cert.href,
                }}
              />
            </div>
          ))}
        </section>

        <section className="ds-resume-sec">
          <Eyebrow as="p">02 · AI work · 2025 – present</Eyebrow>
          <h2 className="ds-h2">
            Agentic Systems Architect, {CONTACT.company}
          </h2>
          {AI_WORK.map(item => (
            <div key={item.claim} className="ds-resume-row">
              <p>{item.claim}</p>
              <SourceCell source={item.source} />
            </div>
          ))}
        </section>

        <section className="ds-resume-sec">
          <Eyebrow as="p">03 · Before AI · 2012 – 2024</Eyebrow>
          <h2 className="ds-h2">Twelve years of production engineering</h2>
          {EARLIER.map(job => (
            <div key={job.dates + job.where} className="ds-resume-job">
              <p className="ds-resume-yr">{job.dates}</p>
              <div>
                <h3 className="ds-resume-role">
                  {job.role} · {job.where}
                </h3>
                {job.note && <p>{job.note}</p>}
              </div>
            </div>
          ))}
        </section>

        <section className="ds-resume-sec">
          <Eyebrow as="p">04 · More projects</Eyebrow>
          <div className="ds-resume-projects">
            {PROJECTS.map(project => (
              <p key={project.name}>
                <TextLink href={project.href} external>
                  {project.name}
                </TextLink>{' '}
                · {project.what}
              </p>
            ))}
          </div>
        </section>

        <section className="ds-resume-sec ds-resume-foot">
          <div>
            <Eyebrow as="p">05 · Stack</Eyebrow>
            {STACK.map(group => (
              <p key={group.title}>
                <strong>{group.title}.</strong> {group.items}
              </p>
            ))}
          </div>
          <div>
            <Eyebrow as="p">06 · Education and languages</Eyebrow>
            <p>
              Master’s degree, Computer Science · V.N. Karazin Kharkiv National
              University · 2007 – 2012
            </p>
            <p>English fluent · Ukrainian native · Russian native</p>
            <Eyebrow as="p">07 · Contracting</Eyebrow>
            <p>
              UK LTD, W-8BEN-E for US clients. Invoices in USD, EUR or GBP via
              Wise or Revolut Business; USDC/USDT accepted.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
