import type { Metadata } from 'next';

// Humans never see this page: middleware 302s them to the beehiiv subscribe
// page with UTM tagging. It exists so link-preview crawlers (LinkedInBot,
// Slack, etc.) get a 200 with real metadata — LinkedIn's Featured-link
// validator rejects a bare off-domain 302.
export const metadata: Metadata = {
  title: 'False Green - measured notes on production AI',
  description:
    'real incidents and real numbers from running autonomous AI systems. 1-2 emails a month. no demos.',
  alternates: { canonical: 'https://serbyn.io/newsletter' },
  openGraph: {
    title: 'False Green - measured notes on production AI',
    description:
      'real incidents and real numbers from running autonomous AI systems. 1-2 emails a month. no demos.',
    url: 'https://serbyn.io/newsletter',
    type: 'website',
  },
};

export default function NewsletterPage() {
  return (
    <div className="py-16">
      <div className="container max-w-3xl">
        <h1 className="mb-4 text-3xl font-semibold">False Green</h1>
        <p className="mb-8 text-muted-foreground">
          measured notes from running AI agent systems in production: what
          broke, what it cost, what the data showed. 1-2 emails a month.
        </p>
        <a
          className="underline underline-offset-4"
          href="https://falsegreen.beehiiv.com/subscribe?utm_source=linkedin&utm_medium=featured&utm_campaign=profile"
        >
          subscribe on beehiiv
        </a>
      </div>
    </div>
  );
}
