'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Mail, MapPin, Globe } from 'lucide-react';

// Source of truth for this page: the CV (work history, education) and
// lib/facts.ts (numbers for the systems). Kept deliberately short on detail:
// no phone number, clients of an employer or a contract are described by
// industry and not by name, and only public repositories are linked.

const SKILLS: { title: string; items: string[] }[] = [
  {
    title: 'Agent reliability',
    items: [
      'Trajectory evals',
      'False-green metering',
      'Evidence-binding gates',
      'Trust-tiered execution',
      'Policy gates',
      'Claude Code hooks and plugins',
    ],
  },
  {
    title: 'LLM and agent frameworks',
    items: [
      'Claude API',
      'Claude Code',
      'MCP',
      'LangGraph',
      'LangChain',
      'OpenAI API',
      'RAG',
    ],
  },
  {
    title: 'LLM cost engineering',
    items: [
      'Multi-model routing',
      'Prompt caching',
      'Semantic caching',
      'Per-service cost tracking',
    ],
  },
  {
    title: 'Backend and data',
    items: [
      'Python',
      'FastAPI',
      'Flask',
      'Node.js/NestJS',
      'Celery',
      'PostgreSQL',
      'Redis',
      'Kafka',
      'GraphQL',
    ],
  },
  {
    title: 'Cloud and delivery',
    items: [
      'Docker',
      'Kubernetes',
      'AWS (Lambda, AppSync, DynamoDB)',
      'GCP/GKE',
      'GitHub Actions',
    ],
  },
  {
    title: 'Evaluation and observability',
    items: [
      'Eval harnesses',
      'LLM-as-judge calibration',
      'Session-log audits',
      'Prometheus',
      'Grafana',
      'Sentry',
    ],
  },
];

const CERTIFICATIONS: { name: string; issuer: string; href: string }[] = [
  {
    name: 'Claude Certified Architect – Professional',
    issuer: 'Anthropic · 2026 · proctored exam',
    href: 'https://www.credly.com/org/anthropic/badge/claude-certified-architect-professional',
  },
  {
    name: 'Claude Certified Developer – Foundations',
    issuer: 'Anthropic · 2026 · proctored exam',
    href: 'https://www.credly.com/org/anthropic/badge/claude-certified-developer-foundations',
  },
];

const EXPERIENCE: {
  role: string;
  where: string;
  dates: string;
  points: string[];
}[] = [
  {
    role: 'Agentic Systems Architect',
    where: 'Easelect LTD · Remote · own systems and client contracts',
    dates: '2025 – Present',
    points: [
      'Designed and built Ascend, a multi-agent orchestration daemon: 27 agents (18 mature), trust-tiered L0–L4 execution, policy gates, budget guards, 6-provider LLM fallback, 1,178 automated tests',
      'Built DW, a spec-driven development pipeline where an agent turns a spec into a working change, gated by acceptance checks: 101 logged runs at a 0.94 pass rate',
      'Built Crest, an AI content engine live at usecrest.io: tiered multi-model routing, editorial and fabrication checks, 109 posts published from 1,455 generated (Aug 2026)',
      'Ran controlled experiments on agent self-verification and published the results, including a checkpoint design that took silent failures from 22 of 40 runs to 0 of 40',
      'Analysed 68,700 of my own Claude Code requests and traced 24% of spend to 1,119 prompt-cache rebuilds; shipped the status line that warns before one happens',
      'Contract, AI platform (assisterr, 2025): largest contributor across 13 repositories; designed and shipped the quality-oracle service that verifies AI-agent quality before payment; production on AWS ECS',
      'Contract, platform engineering (Vitelle, 2026 – present): own release engineering end to end; 26 store builds shipped in 2026, each gated by an end-to-end suite that runs against the shipped binary',
      'Contract, multimodal pipeline (2025): a vision model captions ad creatives, an LLM analyses copy variants, local inference with a hosted fallback',
    ],
  },
  {
    role: 'Senior Software Engineer',
    where: 'Luxoft · global dental-technology client · Remote',
    dates: '2023 – 2024',
    points: [
      'Led a company-wide Flutter UI library: 120+ widgets, used by 6 apps, 40% faster time-to-feature, 90% test coverage',
      'Automated the Figma to design tokens to generated code pipeline, and the release pipeline with GitHub Actions and Fastlane',
    ],
  },
  {
    role: 'Senior Full-Stack Engineer (Python and Flutter)',
    where: 'Precision OT Network · AI-medicine startup · Remote',
    dates: '2023',
    points: [
      'Took a fragile MVP to production readiness; wrote the Flask and SQLAlchemy API and cut unknown crashes by 30%',
    ],
  },
  {
    role: 'Lead Software Engineer',
    where: 'DarkstoreApp · logistics startup',
    dates: '2022 – 2023',
    points: [
      'Led the Android team on a multi-app logistics service where a branded app is generated per customer by the build pipeline; built its CI/CD',
    ],
  },
  {
    role: 'Senior, then Lead Software Engineer',
    where:
      'EPAM Systems · clients in US fintech, German sport, UK telecom and Spanish e-commerce',
    dates: '2017 – 2022',
    points: [
      'Led teams of 3 to 4 from MVP to store launch, with a rating above 4 on first release for a Palo Alto fintech client',
      'Ran CI/CD, technical interviews and the feature roadmap for a German sport client; mentored two trainees to middle level',
      'Completed EPAM Management School (Software Engineering Manager), 2020',
    ],
  },
  {
    role: 'Software Engineer',
    where: 'GlobalLogic · video-editing app, later acquired by Vimeo',
    dates: '2015 – 2017',
    points: [
      'Developed an app with 100M+ users, Google Play Editors’ Choice and a store rating above 4.5',
    ],
  },
  {
    role: 'Android Developer',
    where: 'QArea, Sloboda Studio',
    dates: '2012 – 2015',
    points: [],
  },
];

const PROJECTS: { name: string; what: string; href?: string }[] = [
  {
    name: 'Ascend',
    what: 'Multi-agent orchestration daemon with trust tiers, policy gates and budget guards.',
    href: 'https://github.com/vitamin33/ascend-core',
  },
  {
    name: 'DW',
    what: 'Spec-driven development pipeline; how runs and passes are counted is public.',
    href: 'https://serbyn.io/methodology',
  },
  {
    name: 'Crest',
    what: 'Content marketing engine with multi-model routing and fabrication checks.',
    href: 'https://usecrest.io',
  },
  {
    name: 'proof-of-green',
    what: 'Claude Code plugin that flags a "tests pass" claim made with no test run after the last edit.',
    href: 'https://github.com/vitamin33/proof-of-green',
  },
  {
    name: 'claude-code-statusline',
    what: 'Cost-aware status line for Claude Code, plus a prompt-cache cost analyzer.',
    href: 'https://github.com/vitamin33/claude-code-statusline',
  },
  {
    name: 'agent-eval-labs',
    what: 'Reproducible experiments on how agents verify their own work.',
    href: 'https://github.com/vitamin33/agent-eval-labs',
  },
  {
    name: 'RAGline',
    what: 'Streaming-first, multi-tenant Python back end with an optional RAG module.',
    href: 'https://github.com/vitamin33/ragline',
  },
  {
    name: 'High-load Python starter',
    what: 'FastAPI, Kafka, Postgres and Redis scaffold with metrics, tracing and load tests.',
    href: 'https://github.com/vitamin33/highload-python-starter-full',
  },
  {
    name: 'Forge UI',
    what: 'Agent that automates repetitive UI-library work.',
  },
  {
    name: 'Moxy',
    what: 'E-commerce shop for web and mobile: Flutter app and FastAPI back end. Part-time, 2022 – 2023.',
    href: 'https://github.com/vitamin33/moxy',
  },
];

export default function ResumePage() {
  const handlePrintResume = () => {
    window.print();
  };

  return (
    <>
      <div className="container max-w-4xl py-8">
        {/* Print/Download Controls */}
        <div className="no-print mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resume</h1>
          <Button onClick={handlePrintResume} className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Resume Content */}
        <div className="resume-content">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Vitalii Serbyn</h1>
            <h2 className="text-xl text-muted-foreground mb-4">
              Agentic Systems Architect
            </h2>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                serbyn.vitalii@gmail.com
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Kyiv, Ukraine · Remote only · UK LTD for contracting
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                serbyn.io
              </span>
            </div>
          </header>

          {/* Professional Summary */}
          <section className="mb-8 page-break-inside-avoid">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Professional Summary
            </h3>
            <p className="text-sm leading-relaxed">
              AI engineer and architect. I design and run multi-agent systems on
              Claude and other LLMs, measure where agents report success they
              did not earn, and bring LLM bills down. Anthropic-certified
              (Claude Certified Architect, Professional). Before AI: 12 years of
              production engineering, including an app with 100M+ installs and
              teams of up to 8 engineers, which is where the release and testing
              discipline comes from.
            </p>
          </section>

          {/* Certifications */}
          <section className="mb-8 page-break-inside-avoid">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Certifications
            </h3>
            <ul className="text-sm space-y-2">
              {CERTIFICATIONS.map(cert => (
                <li key={cert.name}>
                  <a
                    href={cert.href}
                    className="font-medium underline underline-offset-4"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {cert.name}
                  </a>
                  <span className="text-muted-foreground">
                    {' '}
                    · {cert.issuer}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Technical Skills */}
          <section className="mb-8 page-break-inside-avoid">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Technical Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 text-sm">
              {SKILLS.map(group => (
                <div key={group.title}>
                  <h4 className="font-medium mb-2">{group.title}</h4>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {group.items.map(item => (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Professional Experience */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Experience
            </h3>
            {EXPERIENCE.map(job => (
              <div
                key={job.role + job.dates}
                className="mb-6 page-break-inside-avoid"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <h4 className="font-medium">{job.role}</h4>
                    <p className="text-sm text-muted-foreground">{job.where}</p>
                  </div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {job.dates}
                  </span>
                </div>
                {job.points.length > 0 && (
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    {job.points.map(point => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>

          {/* Projects */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Projects
            </h3>
            <ul className="text-sm space-y-2">
              {PROJECTS.map(project => (
                <li key={project.name} className="page-break-inside-avoid">
                  {project.href ? (
                    <a
                      href={project.href}
                      className="font-medium underline underline-offset-4"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {project.name}
                    </a>
                  ) : (
                    <span className="font-medium">{project.name}</span>
                  )}
                  <span className="text-muted-foreground">
                    {' '}
                    · {project.what}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Education */}
          <section className="mb-8 page-break-inside-avoid">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Education
            </h3>
            <p className="text-sm">
              Master’s degree, Computer Science · V.N. Karazin Kharkiv National
              University · 2007 – 2012
            </p>
          </section>

          {/* Business Setup & Legal */}
          <section className="mb-8 page-break-inside-avoid">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Business Setup & Legal
            </h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contracting</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>UK LTD available for contracting</li>
                    <li>Comfortable with W-8BEN-E for US clients</li>
                    <li>Standard business terms available</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Payments</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Wise Business or Revolut Business</li>
                    <li>Crypto: USDC/USDT (ERC-20, SOL, TRX)</li>
                    <li>Invoices in USD, EUR, or GBP</li>
                    <li>Standard contracting terms available</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Languages */}
          <section className="mb-8 page-break-inside-avoid">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Languages
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>English: Fluent</div>
              <div>Ukrainian: Native</div>
              <div>Russian: Native</div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
