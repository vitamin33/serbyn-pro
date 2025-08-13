'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Mail, MapPin, Globe, Phone } from 'lucide-react';

export default function ResumePage() {
  const handlePrintResume = () => {
    window.print();
  };

  return (
    <>
      <div className="container max-w-4xl py-8">
        {/* Print/Download Controls */}
        <div className="no-print mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resume</h1>
          <Button onClick={handlePrintResume} className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Resume Content */}
        <div className="resume-content">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Vitalii Serbyn</h1>
            <h2 className="text-xl text-muted-foreground mb-4">
              Senior AI/ML Engineer & MLOps Specialist
            </h2>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                vitalii@serbyn.pro
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                +380 XX XXX XXXX
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Kyiv, Ukraine (Remote US/EU)
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                serbyn.pro
              </span>
            </div>
          </header>

          {/* Professional Summary */}
          <section className="mb-8 page-break-inside-avoid">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Professional Summary
            </h3>
            <p className="text-sm leading-relaxed">
              Senior AI/ML Engineer with 11+ years of experience building
              scalable machine learning systems and LLM infrastructure. Expert
              in MLOps, cost optimization, and production deployment of AI
              systems. Led teams of 5-12 engineers, shipped products to 10M+
              users. Specialized in LLM inference optimization, RAG systems, and
              SLO-gated CI/CD pipelines. UK LTD registered consultant serving US
              and European clients.
            </p>
          </section>

          {/* Technical Skills */}
          <section className="mb-8 page-break-inside-avoid">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Technical Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">AI/ML & LLMs</h4>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="secondary">Python</Badge>
                  <Badge variant="secondary">PyTorch</Badge>
                  <Badge variant="secondary">TensorFlow</Badge>
                  <Badge variant="secondary">Hugging Face</Badge>
                  <Badge variant="secondary">LangChain</Badge>
                  <Badge variant="secondary">vLLM</Badge>
                  <Badge variant="secondary">Ollama</Badge>
                </div>

                <h4 className="font-medium mb-2">MLOps & Infrastructure</h4>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="secondary">MLflow</Badge>
                  <Badge variant="secondary">Kubeflow</Badge>
                  <Badge variant="secondary">Docker</Badge>
                  <Badge variant="secondary">Kubernetes</Badge>
                  <Badge variant="secondary">Airflow</Badge>
                  <Badge variant="secondary">DVC</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Cloud & DevOps</h4>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="secondary">AWS</Badge>
                  <Badge variant="secondary">GCP</Badge>
                  <Badge variant="secondary">Azure</Badge>
                  <Badge variant="secondary">Terraform</Badge>
                  <Badge variant="secondary">GitHub Actions</Badge>
                  <Badge variant="secondary">Jenkins</Badge>
                </div>

                <h4 className="font-medium mb-2">Databases & Storage</h4>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="secondary">PostgreSQL</Badge>
                  <Badge variant="secondary">Redis</Badge>
                  <Badge variant="secondary">Elasticsearch</Badge>
                  <Badge variant="secondary">Pinecone</Badge>
                  <Badge variant="secondary">Weaviate</Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Experience */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Professional Experience
            </h3>

            {/* Experience 1 */}
            <div className="mb-6 page-break-inside-avoid">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Senior AI/ML Consultant</h4>
                  <p className="text-sm text-muted-foreground">
                    Serbyn.pro (UK LTD) • Remote
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  2023 - Present
                </span>
              </div>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>
                  Reduced LLM inference costs by 30-50% using vLLM optimization
                  and model quantization
                </li>
                <li>
                  Implemented MLflow model registry with SLO-gated CI/CD,
                  achieving &lt;2min rollback times
                </li>
                <li>
                  Built RAG systems with 99.5% accuracy for financial compliance
                  and e-commerce personalization
                </li>
                <li>
                  Designed A/B testing frameworks for LLM model comparisons with
                  statistical significance
                </li>
                <li>
                  Deployed production systems serving 1M+ requests/day with
                  99.9% uptime SLA
                </li>
              </ul>
            </div>

            {/* Experience 2 */}
            <div className="mb-6 page-break-inside-avoid">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Lead ML Engineer</h4>
                  <p className="text-sm text-muted-foreground">
                    AdTech Startup • Remote
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  2021 - 2023
                </span>
              </div>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>
                  Led team of 8 engineers building real-time bidding ML models
                  for programmatic advertising
                </li>
                <li>
                  Implemented MLOps pipeline reducing model deployment time from
                  weeks to hours
                </li>
                <li>
                  Built feature store and data pipeline processing 100TB+ daily
                  with Apache Spark
                </li>
                <li>
                  Achieved 15% CTR improvement and $2M+ annual revenue increase
                  through model optimization
                </li>
                <li>
                  Established monitoring and alerting system with Grafana and
                  Prometheus for ML models
                </li>
              </ul>
            </div>

            {/* Experience 3 */}
            <div className="mb-6 page-break-inside-avoid">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Senior Software Engineer</h4>
                  <p className="text-sm text-muted-foreground">
                    Mobile Gaming Company • Kyiv
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  2018 - 2021
                </span>
              </div>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>
                  Developed recommendation engines for mobile games with 10M+
                  MAU
                </li>
                <li>
                  Built real-time analytics platform processing 50M+ events/day
                </li>
                <li>
                  Implemented A/B testing framework improving player retention
                  by 25%
                </li>
                <li>
                  Led migration from monolith to microservices architecture on
                  Kubernetes
                </li>
                <li>
                  Mentored 5 junior developers and established code review
                  processes
                </li>
              </ul>
            </div>

            {/* Experience 4 */}
            <div className="mb-6 page-break-inside-avoid">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Full-Stack Developer</h4>
                  <p className="text-sm text-muted-foreground">
                    E-commerce Platform • Kyiv
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  2013 - 2018
                </span>
              </div>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>
                  Built scalable e-commerce platform handling 1M+ orders
                  annually
                </li>
                <li>
                  Implemented search and recommendation systems improving
                  conversion by 18%
                </li>
                <li>
                  Developed CI/CD pipeline reducing deployment time by 80%
                </li>
                <li>
                  Optimized database queries and caching, reducing page load
                  time by 60%
                </li>
              </ul>
            </div>
          </section>

          {/* Key Projects */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Key Projects
            </h3>

            <div className="space-y-4">
              <div className="page-break-inside-avoid">
                <h4 className="font-medium">LLM Cost Optimization Platform</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  MLflow • vLLM • Grafana • GitHub Actions • 2024
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>
                    Built model registry with automated cost/performance
                    benchmarking
                  </li>
                  <li>
                    Implemented SLO-gated deployments with automatic rollback
                    capabilities
                  </li>
                  <li>
                    Achieved 45% cost reduction while maintaining 99.5% SLA
                    compliance
                  </li>
                </ul>
              </div>

              <div className="page-break-inside-avoid">
                <h4 className="font-medium">Financial Compliance RAG System</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  LangChain • OpenAI • Elasticsearch • FastAPI • 2023
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>
                    Processed 10K+ regulatory documents with 99.5% accuracy
                  </li>
                  <li>Reduced manual compliance review time by 80%</li>
                  <li>
                    SOC 2 compliant deployment with audit trail and access
                    controls
                  </li>
                </ul>
              </div>

              <div className="page-break-inside-avoid">
                <h4 className="font-medium">
                  Real-time Personalization Engine
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Python • Redis • Kubernetes • Kafka • 2022
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Served 1M+ daily users with &lt;100ms response time</li>
                  <li>
                    Improved conversion rates by 23% and reduced churn by 15%
                  </li>
                  <li>
                    Implemented feature store with real-time and batch
                    processing
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="mb-8 page-break-inside-avoid">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Education
            </h3>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">
                  Master of Science in Computer Science
                </h4>
                <p className="text-sm text-muted-foreground">
                  National Technical University of Ukraine
                </p>
              </div>
              <span className="text-sm text-muted-foreground">2009 - 2011</span>
            </div>
          </section>

          {/* Certifications */}
          <section className="mb-8 page-break-inside-avoid">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Certifications
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>AWS Certified Machine Learning - Specialty</span>
                <span className="text-muted-foreground">2023</span>
              </div>
              <div className="flex justify-between">
                <span>Google Professional Machine Learning Engineer</span>
                <span className="text-muted-foreground">2022</span>
              </div>
              <div className="flex justify-between">
                <span>Kubernetes Certified Application Developer (CKAD)</span>
                <span className="text-muted-foreground">2021</span>
              </div>
            </div>
          </section>

          {/* Languages */}
          <section className="mb-8 page-break-inside-avoid">
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Languages
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>English: Fluent</div>
              <div>Ukrainian: Native</div>
              <div>Russian: Native</div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
