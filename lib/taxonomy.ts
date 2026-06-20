// Public-facing category taxonomy for the redesigned sidebar/filters.
// Maps the existing case-study + blog category enums onto the 4 display
// categories from the Kinetic Lab design without changing the source enums.
// See docs/redesign/02_DATA_MODEL_AND_GAPS.md §4.

export type PublicCategory =
  | 'architecture'
  | 'infrastructure'
  | 'optimization'
  | 'research';

export const PUBLIC_CATEGORIES: PublicCategory[] = [
  'architecture',
  'infrastructure',
  'optimization',
  'research',
];

export const CATEGORY_LABEL: Record<PublicCategory, string> = {
  architecture: 'Architecture',
  infrastructure: 'Infrastructure',
  optimization: 'Optimization',
  research: 'Research',
};

// Short code used in system-id labels (e.g. 01_ARCH_001).
export const CATEGORY_CODE: Record<PublicCategory, string> = {
  architecture: 'ARCH',
  infrastructure: 'INFRA',
  optimization: 'OPT',
  research: 'RSCH',
};

const CASE_STUDY_MAP: Record<string, PublicCategory> = {
  platform: 'architecture',
  infrastructure: 'infrastructure',
  optimization: 'optimization',
  feature: 'architecture',
};

const BLOG_MAP: Record<string, PublicCategory> = {
  architecture: 'architecture',
  engineering: 'infrastructure',
  operations: 'optimization',
  strategy: 'research',
};

export function caseStudyCategory(category: string): PublicCategory {
  return CASE_STUDY_MAP[category] ?? 'architecture';
}

export function blogCategory(category: string): PublicCategory {
  return BLOG_MAP[category] ?? 'research';
}
