import { OFFERS, ADVISORY, UPSELL, CONTACT } from '@/lib/facts';
import { siteConfig } from '@/lib/seo';
import { getAllBlogPosts } from '@/lib/blog-posts';

// /llms.txt — a canonical, extractable summary for answer engines (AEO). Built
// from lib/facts so offers/prices/identity never drift from the site. Adoption
// is contested; treated as cheap upside, not a guaranteed channel.
export const dynamic = 'force-static';

export function GET() {
  const url = siteConfig.url;
  const offerLines = OFFERS.map(
    o => `- [${o.name}](${url}${o.href}): ${o.price}, ${o.terms}. ${o.summary}`
  ).join('\n');
  const posts = getAllBlogPosts().slice(0, 3);
  const postLines = posts
    .map(p => `- [${p.title}](${url}/blog/${p.slug})`)
    .join('\n');

  const body = `# Vitalii Serbyn — serbyn.io

> Agentic Systems Architect. I make AI agents reliable enough to run in
> production. Agent reliability engineering (trajectory evals, false-green
> metering, evidence-binding, trust-tiered execution) and LLM cost engineering,
> for US, UK, and EU teams. Contracting via ${CONTACT.company} (UK, Companies
> House no. 15983917), remote from ${CONTACT.location}.
> Contact: ${CONTACT.email}

## Offers (canonical pricing)
${offerLines}
- ${ADVISORY.name}: ${ADVISORY.price}, ${ADVISORY.terms}. ${ADVISORY.summary}
- ${UPSELL}

## Canonical facts
- Ascend: multi-agent orchestration daemon I designed and built — 27 agents (18 mature), 1,178 automated tests, trust-tiered L0–L4 execution.
- DW: autonomous spec-driven development pipeline — 101 logged runs, 0.94 pass rate (methodology: ${url}/methodology).
- Employed-role history: a consumer app with 100M+ downloads (Google Play Editor's Choice); an 80–90% RPC cost reduction on a Web3 platform.
- Every quantified claim carries its source label; no client metrics are borrowed.

## Key writing
${postLines}
- Full index: ${url}/writing · RSS: ${url}/feed.xml

## Verification
- GitHub: ${CONTACT.github} (Ascend core: ${CONTACT.github}/ascend-core)
- LinkedIn: ${CONTACT.linkedin}
- UK Companies House: 15983917 (${CONTACT.company})
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
