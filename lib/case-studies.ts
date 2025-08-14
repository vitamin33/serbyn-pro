import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// TypeScript interfaces for case studies that integrate with achievements
export interface CaseStudyMeta {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: 'infrastructure' | 'optimization' | 'feature';

  // Achievement Collector Integration
  achievement_id?: string; // Links to our achievements.json data
  impact_score: number; // 0-100 from backend
  business_value: number; // Dollar amount

  // Technical Details
  tech: string[];
  architecture?: string[];

  // Quantified Outcomes
  outcomes: string[];
  metrics_before: Record<string, any>;
  metrics_after: Record<string, any>;

  // Evidence & Links
  date: string;
  duration_hours: number;
  links: {
    demo?: string;
    repo?: string;
    pr?: string;
    grafana?: string;
    loom?: string;
  };

  // Media
  cover: string;
  gallery?: string[];

  // SEO & Portfolio
  featured: boolean;
  portfolio_ready: boolean;
  seo_keywords?: string[];
}

export interface CaseStudy extends CaseStudyMeta {
  content: string;
  url: string;
  readingTime: number;
  roi_calculation: number;
}

const CASE_STUDIES_PATH = path.join(process.cwd(), 'content/case-studies');

export function getAllCaseStudies(): CaseStudy[] {
  // Ensure directory exists
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

        // Validate required fields
        if (
          !meta.title ||
          !meta.slug ||
          !meta.business_value ||
          !meta.duration_hours
        ) {
          console.warn(`Skipping invalid case study: ${file}`);
          return null;
        }

        // Computed fields with safety checks
        const wordCount = content ? content.split(' ').length : 0;
        const readingTime = Math.ceil(wordCount / 200);
        const roi_calculation =
          meta.business_value && meta.duration_hours
            ? meta.business_value / (meta.duration_hours * 150)
            : 0;

        return {
          ...meta,
          content: content || '',
          url: `/case-studies/${meta.slug}`,
          readingTime,
          roi_calculation,
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

// Integration with achievements system
export function linkCaseStudyToAchievement(
  caseStudy: CaseStudy,
  achievements: any[]
) {
  if (!caseStudy.achievement_id) return null;

  return achievements.find(
    achievement => achievement.id === caseStudy.achievement_id
  );
}

// Generate case study stats
export function getCaseStudyStats() {
  const caseStudies = getAllCaseStudies().filter(
    study => study.portfolio_ready
  );

  const totalValue = caseStudies.reduce(
    (sum, study) => sum + study.business_value,
    0
  );
  const totalImpact = caseStudies.reduce(
    (sum, study) => sum + study.impact_score,
    0
  );
  const avgImpact =
    caseStudies.length > 0 ? totalImpact / caseStudies.length : 0;
  const totalHours = caseStudies.reduce(
    (sum, study) => sum + study.duration_hours,
    0
  );
  const avgROI = caseStudies.length > 0 ? totalValue / (totalHours * 150) : 0;

  return {
    totalCases: caseStudies.length,
    totalValue,
    avgImpact: Math.round(avgImpact * 10) / 10,
    totalHours,
    avgROI: Math.round(avgROI * 100) / 100,
    categories: {
      infrastructure: caseStudies.filter(s => s.category === 'infrastructure')
        .length,
      optimization: caseStudies.filter(s => s.category === 'optimization')
        .length,
      feature: caseStudies.filter(s => s.category === 'feature').length,
    },
  };
}
