import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface CaseStudyMeta {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: 'infrastructure' | 'optimization' | 'feature' | 'platform';
  project_type?: 'primary' | 'startup' | 'anonymized';
  highlight_metrics?: string[];

  achievement_id?: string;
  impact_score?: number;
  business_value?: number;

  tech: string[];
  architecture?: string[];

  outcomes: string[];
  metrics_before?: Record<string, any>;
  metrics_after?: Record<string, any>;

  date: string;
  duration_hours?: number;
  links: {
    demo?: string;
    repo?: string;
    pr?: string;
    grafana?: string;
    loom?: string;
  };

  cover: string;
  gallery?: string[];

  featured: boolean;
  portfolio_ready: boolean;
  seo_keywords?: string[];
}

export interface CaseStudy extends CaseStudyMeta {
  content: string;
  url: string;
  readingTime: number;
}

const CASE_STUDIES_PATH = path.join(process.cwd(), 'content/case-studies');

export function getAllCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(CASE_STUDIES_PATH)) {
    fs.mkdirSync(CASE_STUDIES_PATH, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(CASE_STUDIES_PATH);

  const caseStudies = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      try {
        const filePath = path.join(CASE_STUDIES_PATH, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        const meta = data as CaseStudyMeta;

        if (!meta.title || !meta.slug) {
          console.warn(`Skipping invalid case study: ${file}`);
          return null;
        }

        const wordCount = content ? content.split(' ').length : 0;
        const readingTime = Math.ceil(wordCount / 200);

        return {
          ...meta,
          content: content || '',
          url: `/work/${meta.slug}`,
          readingTime,
        };
      } catch (error) {
        console.warn(`Error parsing case study ${file}:`, error);
        return null;
      }
    })
    .filter((study): study is CaseStudy => study !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return caseStudies;
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  const caseStudies = getAllCaseStudies();
  return caseStudies.find(study => study.slug === slug) || null;
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return getAllCaseStudies().filter(
    study => study.featured && study.portfolio_ready
  );
}

export function getCaseStudiesByCategory(category: string): CaseStudy[] {
  return getAllCaseStudies().filter(study => study.category === category);
}

export function getCaseStudyStats() {
  const caseStudies = getAllCaseStudies().filter(
    study => study.portfolio_ready
  );

  const withImpact = caseStudies.filter(s => s.impact_score != null);
  const totalImpact = withImpact.reduce(
    (sum, study) => sum + (study.impact_score ?? 0),
    0
  );
  const avgImpact = withImpact.length > 0 ? totalImpact / withImpact.length : 0;

  return {
    totalCases: caseStudies.length,
    avgImpact: Math.round(avgImpact * 10) / 10,
    categories: {
      infrastructure: caseStudies.filter(s => s.category === 'infrastructure')
        .length,
      optimization: caseStudies.filter(s => s.category === 'optimization')
        .length,
      feature: caseStudies.filter(s => s.category === 'feature').length,
      platform: caseStudies.filter(s => s.category === 'platform').length,
    },
  };
}
