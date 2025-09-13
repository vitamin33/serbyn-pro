import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { SitePack } from '@/lib/types.leadgen';

interface CaseStudyListProps {
  pack: SitePack;
  icp: string;
}

// Available MDX case studies (hardcoded for now - could be made dynamic)
const availableCaseStudies = [
  {
    slug: 'threads-agent-platform',
    title: 'Threads-Agent Platform',
    description:
      'GenAI content platform with MLflow registry and SLO-gated CI/CD',
    kpis: ['MLflow Registry', 'SLO-gated CI', 'Production Ready'],
    tags: ['MLOps', 'LLM', 'CI/CD'],
  },
  {
    slug: 'vllm-cost-optimization',
    title: 'vLLM Cost Optimization',
    description:
      'Cost analysis and optimization comparing vLLM vs hosted API solutions',
    kpis: ['60% Cost Reduction', '2x Throughput', 'Sub-second Latency'],
    tags: ['Cost Analysis', 'Performance', 'vLLM'],
  },
  {
    slug: 'rag-system-optimization',
    title: 'RAG System Optimization',
    description:
      'Hybrid retrieval system with vector and keyword search optimization',
    kpis: ['40% Better Recall', 'Hybrid Retrieval', 'Production Scale'],
    tags: ['RAG', 'Vector Search', 'Optimization'],
  },
];

export default function CaseStudyList({ pack, icp }: CaseStudyListProps) {
  const caseStudyConfigs = pack.blocks.case_studies || [];

  if (caseStudyConfigs.length === 0) {
    return null;
  }

  // Filter available case studies based on pack configuration
  const filteredCaseStudies = availableCaseStudies.filter(study =>
    caseStudyConfigs.some(config => config.slug === study.slug)
  );

  // Merge pack config with available case studies
  const caseStudiesWithConfig = filteredCaseStudies.map(study => {
    const config = caseStudyConfigs.find(c => c.slug === study.slug);
    return {
      ...study,
      title: config?.title || study.title,
      configKpi: config?.kpi,
    };
  });

  if (caseStudiesWithConfig.length === 0) {
    return (
      <section
        id="case-studies"
        className="py-16 bg-slate-50 dark:bg-slate-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
              Case Studies
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              No case studies configured for this ICP.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="case-studies" className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
            Real Projects, Real Results
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Production MLOps implementations from my personal R&D lab
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {caseStudiesWithConfig.map(study => (
            <Card
              key={study.slug}
              className="hover:shadow-lg transition-shadow bg-white dark:bg-slate-800"
            >
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-3">
                  {study.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {study.title}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {study.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* KPIs */}
                {(study.configKpi || study.kpis.length > 0) && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                      Key Results:
                    </h4>
                    <ul className="space-y-1">
                      {study.configKpi && (
                        <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <svg
                            className="h-4 w-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {study.configKpi}
                        </li>
                      )}
                      {!study.configKpi &&
                        study.kpis.map(kpi => (
                          <li
                            key={kpi}
                            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                          >
                            <svg
                              className="h-4 w-4 text-green-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {kpi}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Read More Button */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <Link href={`/case-studies/${study.slug}`}>
                      Read Full Case Study →
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/case-studies">View All Case Studies →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
