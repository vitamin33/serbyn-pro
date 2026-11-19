import '@/styles/tools.css';
import { Eyebrow, SourceLabel, TextLink, Verdict } from '@/components/ds';
import { BookingCta } from '@/components/ds/cta';
import { CacheRebuildTool } from '@/components/tools/cache-rebuild-tool';
import { createMetadata, PERSON_ID, siteConfig } from '@/lib/seo';
import { PRICES_CHECKED, REBUILD_TOKENS } from '@/lib/tools/cache-rebuilds';

const PAGE_URL = `${siteConfig.url}/tools/claude-code-cache-rebuilds`;
const REPO = 'https://github.com/vitamin33/claude-code-statusline';
const DESCRIPTION =
  'Drop your Claude Code session logs and see how much of your spend went to prompt-cache rebuilds, and why. Runs in your browser; nothing is uploaded.';

export const metadata = createMetadata({
  title: 'Claude Code Cache Rebuild Cost Checker',
  description: DESCRIPTION,
  canonicalUrl: PAGE_URL,
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Claude Code cache rebuild cost checker',
  url: PAGE_URL,
  description: DESCRIPTION,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any (runs in the browser)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@id': PERSON_ID },
};

export default function CacheRebuildsPage() {
  return (
    <div className="ds-tool">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="ds-wrap ds-tool-wrap">
        <header className="ds-tool-head">
          <Eyebrow tone="accent">Tool · Claude Code cost</Eyebrow>
          <h1 className="ds-h1" data-size="index">
            How much of your Claude Code spend is cache rebuilds?
          </h1>
          <Verdict>In my logs it was 24%. Check yours in a minute.</Verdict>
          <p className="ds-intro">
            Claude Code keeps your conversation in a prompt cache, so each turn
            reads it at a small fraction of the input price. When that cache is
            lost, the next request writes the whole conversation again at up to
            twice the input price. This page counts those requests in your own
            session logs and prices them.
          </p>
          <SourceLabel claimLabel={false}>
            Your files are read inside this browser tab. Nothing from them is
            uploaded or stored, and the only analytics event says the tool was
            used.
          </SourceLabel>
        </header>

        <CacheRebuildTool />

        <section className="ds-tool-sec">
          <Eyebrow as="p">How it counts</Eyebrow>
          <h2 className="ds-h2">The same rules as my published numbers</h2>
          <p>
            Claude Code writes one <code>.jsonl</code> file per session under{' '}
            <code>~/.claude/projects</code>. Each assistant row records the
            tokens that were sent fresh, written to the cache, read from the
            cache and generated. Streaming writes several rows per request, so
            the page keeps one row per request id, the last one.
          </p>
          <p>
            A rebuild is a request that wrote{' '}
            {REBUILD_TOKENS.toLocaleString('en-US')} tokens or more to the
            cache. A normal turn writes a few thousand. The cost of a rebuild is
            the cache-write cost of that request: 2 times the input price for
            the 1-hour cache and 1.25 times for the 5-minute cache. The cause
            comes from the request before it in the same session: a gap longer
            than the cache lifetime, a different model, or neither, which means
            the context itself was edited.
          </p>
          <p>
            Dollars are API list prices, checked on {PRICES_CHECKED}. On a
            subscription you are not billed per token, and the same tokens are
            what your usage limits measure. This is the method behind{' '}
            <TextLink href={REPO} external>
              claude-code-statusline
            </TextLink>
            , where 1,119 rebuilds across 68,700 requests came to 24% of spend.
            The repo has the same analysis as a Python script and a status line
            that shows the cache countdown while you work.
          </p>
        </section>

        <section className="ds-tool-sec">
          <Eyebrow as="p">If the number is large</Eyebrow>
          <h2 className="ds-h2">A team bill has more levers than this one</h2>
          <p>
            Cache rebuilds are one line of an LLM bill. The{' '}
            <TextLink href="/llm-cost-teardown">LLM Cost Teardown</TextLink>{' '}
            covers the rest for a production system: model routing, caching,
            prompt size and batch pricing, measured on your own traffic.
          </p>
          <div className="ds-tool-foot">
            <BookingCta location="tool_cache_rebuilds" />
          </div>
        </section>
      </div>
    </div>
  );
}
