import { ImageResponse } from 'next/og';
import { getAllCaseStudies, getCaseStudyBySlug } from '@/lib/case-studies';

export const alt = 'Case study — Vitalii Serbyn';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllCaseStudies().map(study => ({ slug: study.slug }));
}

const TYPE_LABELS: Record<string, string> = {
  primary: 'Primary R&D',
  startup: 'Startup',
  anonymized: 'Enterprise',
};

export default async function Image({ params }: { params: { slug: string } }) {
  const study = getCaseStudyBySlug(params.slug);
  const title = study?.title ?? 'Case study';
  const kicker = study?.project_type
    ? (TYPE_LABELS[study.project_type] ?? 'Case study')
    : 'Case study';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A0C10',
          backgroundImage:
            'radial-gradient(circle at 78% 18%, rgba(10,133,255,0.22), transparent 46%), radial-gradient(circle at 8% 92%, rgba(10,133,255,0.10), transparent 42%)',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            color: '#0A85FF',
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}
        >
          {kicker.toUpperCase()}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            color: '#E6E9EF',
            maxWidth: '1000px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 28,
            color: '#8B93A1',
          }}
        >
          <div style={{ display: 'flex' }}>serbyn.io</div>
          <div style={{ display: 'flex', color: '#E6E9EF' }}>
            Vitalii Serbyn · AI Systems Architect
          </div>
        </div>
      </div>
    ),
    size
  );
}
