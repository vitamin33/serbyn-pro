import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import type { CaseStudy } from '@/lib/case-studies';
import { getAllCaseStudies } from '@/lib/case-studies';

interface CaseStudyFooterProps {
  caseStudy: CaseStudy;
}

export function CaseStudyFooter({ caseStudy }: CaseStudyFooterProps) {
  const allCaseStudies = getAllCaseStudies();
  const currentIndex = allCaseStudies.findIndex(
    study => study.slug === caseStudy.slug
  );

  const prevStudy = currentIndex > 0 ? allCaseStudies[currentIndex - 1] : null;
  const nextStudy =
    currentIndex < allCaseStudies.length - 1
      ? allCaseStudies[currentIndex + 1]
      : null;

  return (
    <footer className="mt-16 space-y-8">
      {/* Call to Action */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Discuss This Architecture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-6">
            Want to explore how similar patterns could work for your system?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="flex items-center gap-2" asChild>
              <a
                href="https://calendly.com/serbyn-vitalii/30min"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Architecture Review
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation to Other Case Studies */}
      <div className="grid gap-4 md:grid-cols-2">
        {prevStudy && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Previous</span>
              </div>
              <h4 className="font-semibold mb-2 line-clamp-2">
                {prevStudy.title}
              </h4>
              <Button variant="outline" className="w-full" asChild>
                <a href={prevStudy.url}>Read Case Study</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {nextStudy && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2 justify-end">
                <span className="text-sm text-muted-foreground">Next</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <h4 className="font-semibold mb-2 line-clamp-2 text-right">
                {nextStudy.title}
              </h4>
              <Button variant="outline" className="w-full" asChild>
                <a href={nextStudy.url}>Read Case Study</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Back to All */}
      <div className="text-center pt-8 border-t border-border">
        <Button variant="ghost" asChild>
          <a href="/work" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            All Work
          </a>
        </Button>
      </div>
    </footer>
  );
}
