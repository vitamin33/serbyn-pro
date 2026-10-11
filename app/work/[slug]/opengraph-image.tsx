import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';
import { getAllCaseStudies, getCaseStudyBySlug } from '@/lib/case-studies';
import {
  caseStudyCategory,
  CATEGORY_LABEL,
  PROJECT_LABEL,
} from '@/lib/taxonomy';

export const alt = 'Case study — Vitalii Serbyn';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getAllCaseStudies().map(study => ({ slug: study.slug }));
}

export default async function Image({ params }: { params: { slug: string } }) {
  const study = getCaseStudyBySlug(params.slug);
  return ogCard({
    kind: 'case',
    badge: study?.project_type
      ? (PROJECT_LABEL[study.project_type] ?? 'Case study')
      : 'Case study',
    eyebrow: study
      ? `Case study · ${CATEGORY_LABEL[caseStudyCategory(study.category)]}`
      : 'Case study',
    title: study?.title ?? 'Case study',
    strip: (study?.highlight_metrics ?? []).slice(0, 3),
  });
}
