# Professional Portfolio Website | serbyn.pro

Next.js 14 + TypeScript + Tailwind + shadcn/ui | 4 Milestones | 6 Hours

## 🎯 Project Goals
Replace PDF CV with professional, extensible portfolio site for senior AI/ML engineer.

### Business Requirements:
- Senior-looking design (minimal, high contrast, one accent color)
- Mobile-first responsive
- Print-optimized for PDF generation
- ATS-compatible resume
- UK LTD legal compliance (footer requirements)
- Lighthouse >90 all categories

### Technical Stack:
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui components
- Contentlayer + MDX (case studies)
- JSON data sources (no database)
- GitHub Actions (automated sync)
- Vercel deployment

## 📁 Project Structure
```
serbyn-pro/
├─ app/
│  ├─ page.tsx                      # [M1] Home: Hero, Proof, Services, Contact
│  ├─ about/page.tsx                # [M1] Bio + download resume
│  ├─ case-studies/
│  │  ├─ page.tsx                   # [M1] List view
│  │  └─ [slug]/page.tsx            # [M3] MDX details
│  ├─ how-to-pay/page.tsx           # [M1] Payment methods + UK LTD
│  ├─ legal/
│  │  ├─ privacy/page.tsx           # [M1] GDPR compliant
│  │  └─ terms/page.tsx             # [M1] Service terms
│  ├─ resume/page.tsx               # [M2] Full resume + print CSS
│  ├─ api/resume/route.ts           # [M4] JSON Resume format
│  ├─ sitemap.ts                    # [M1] SEO
│  └─ robots.txt                    # [M1] SEO
├─ components/
│  ├─ ui/                           # [M0] shadcn components
│  ├─ navbar.tsx                    # [M0] Navigation
│  ├─ footer-legal.tsx              # [M0] UK LTD details
│  ├─ hero.tsx                      # [M1] Main hero section
│  ├─ proof-pack.tsx                # [M1] 4 evidence cards
│  ├─ services.tsx                  # [M1] 3 service offerings
│  ├─ case-card.tsx                 # [M1] Reusable case preview
│  └─ achievements-live.tsx         # [M4] JSON-fed widgets
├─ content/case-studies/            # [M3] MDX files
├─ data/                            # [M4] JSON sources
│  ├─ achievements.json
│  ├─ projects.json
│  └─ resume.json
├─ lib/
│  ├─ utils.ts                      # Helpers
│  └─ seo.ts                        # Metadata utilities
├─ public/
│  ├─ og.png                        # Social preview
│  └─ logos/                        # Assets
├─ styles/globals.css               # [M0] Typography + print CSS
├─ .github/workflows/
│  ├─ ci.yml                        # [M1] Lint + build
│  └─ sync-data.yml                 # [M4] Auto-refresh JSON
└─ [config files]
```

## 🏁 Milestones & Timing
| Milestone | Time | Key Deliverable | Deploy Ready |
|-----------|------|----------------|--------------|
| M0 | 1h | Dev setup + shell | ✅ Skeleton |
| M1 | 2.5h | Marketing site | ✅ PDF replacement |
| M2 | 3.5h | Resume + print | ✅ ATS ready |
| M3 | 4.5h | Case studies | ✅ Portfolio depth |
| M4 | 6h | Live achievements | ✅ Dynamic content |

**Stop Point:** M1 already replaces PDF CV for most use cases.

## 🎨 Design System

### Typography:
- Primary: Inter (UI text)
- Mono: JetBrains Mono (code/metrics)
- Hierarchy: h1(2xl), h2(xl), h3(lg), body(base)

### Layout:
- Container: max-w-6xl mx-auto px-4
- Section spacing: py-16
- Card padding: p-6
- Paragraph width: ~70ch

### Colors:
- One accent color (blue-600 recommended)
- Gray scale: 50, 100, 200, 500, 700, 900
- High contrast for accessibility

### Components:
- Cards: rounded-lg shadow-sm border
- Buttons: Primary (accent), Secondary (outline)
- Focus: visible ring-2 ring-accent

## 📝 Content Requirements

### Hero Section:
- H1: "AI engineer who ships reliable LLM systems"
- Subhead: "Cut token cost 30–50% at stable p95 with MLflow registry, SLO-gated CI, vLLM, and clean rollbacks"
- Trust line: "UK LTD · Remote from Kyiv · US/EU clients"
- CTAs: "Book a Call" (#contact), "See Proof Pack" (#proof)

### Proof Pack (4 cards):
- MLflow lifecycle management
- SLO-gated CI pipeline
- vLLM vs API cost comparison
- Grafana p95/error monitoring

### Services (3 offerings):
- LLM Infrastructure & RAG
- MLOps & Lifecycle Management
- GenAI for Marketing & E-commerce

### Footer Legal (UK LTD compliance):
- Company name + number
- Registered office address
- Contact email
- Privacy/Terms links

## 🔧 Technical Specifications

### shadcn/ui Components Required:
Button, Card, Badge, Separator, Tabs, Input, Sheet

### Performance Targets:
- Lighthouse >90 all categories
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- Print mode: clean A4 layout, hidden nav/footer

### SEO Requirements:
- Meta titles/descriptions all pages
- OpenGraph + Twitter Cards
- Sitemap.xml + robots.txt
- Semantic HTML structure
- Schema.org JSON-LD (Person, Organization)

### Accessibility:
- WCAG 2.1 AA compliance
- Keyboard navigation
- Focus indicators
- Alt text for images
- Proper heading hierarchy

## 🚀 Development Workflow

### Step Order:
1. M0: Foundation (Next.js + Tailwind + shadcn)
2. M0: Navigation shell (Navbar + Footer)
3. M1: Homepage sections (Hero, Proof, Services, Contact)
4. M1: Business pages (About, How-to-Pay, Legal)
5. M1: SEO + deployment
6. M2: Resume page + print CSS
7. M3: Contentlayer + MDX case studies
8. M4: JSON data system + achievements
9. M4: GitHub Actions automation

### Quality Gates per Step:
- Build passes without errors
- TypeScript compiles clean
- Responsive on mobile/desktop
- Accessibility basics working
- Git commit with clear message

### Deployment Flow:
- Push to GitHub
- Auto-deploy via Vercel
- Domain: serbyn.pro (www → apex redirect)
- HTTPS enforced

## 📊 Data Structures

### Achievement JSON Schema:
```json
{
  "id": "2025-08-10-mlflow",
  "date": "2025-08-10", 
  "title": "MLflow: 2 model versions promoted + rollback",
  "tags": ["MLOps", "SLO"],
  "impact": "Rollback time <2min",
  "link": "https://github.com/..."
}
```

### Case Study MDX Frontmatter:
```yaml
title: "Threads-Agent: LLM Social Automation"
slug: "threads-agent"
summary: "Automated social media with cost-optimized LLM pipeline"
tech: ["Python", "vLLM", "MLflow", "FastAPI"]
outcomes: ["50% cost reduction", "99.9% uptime", "2min rollbacks"]
date: "2024-12-15"
links:
  demo: "https://demo.example.com"
  repo: "https://github.com/..."
  loom: "https://loom.com/..."
cover: "/logos/threads-agent.png"
```

### Resume API Format:
- JSON Resume standard (jsonresume.org)
- Served from /api/resume.json
- Source: data/resume.json
- ATS-compatible structure

## ⚡ Performance Optimizations

### Images:
- WebP format preferred
- Responsive sizing with next/image
- Proper alt text and lazy loading
- Consistent aspect ratios

### Code Splitting:
- Dynamic imports for heavy components
- Route-based splitting (automatic)
- Lazy load case studies and achievements

### Caching:
- Static generation where possible
- ISR for dynamic data (achievements)
- CDN optimization via Vercel

### Print CSS:
```css
@media print {
  .no-print { display: none !important; }
  .print-url:after { content: " (" attr(href) ")"; }
  .page-break { page-break-inside: avoid; }
}
```

## 🔒 Security & Compliance

### Privacy (GDPR):
- Analytics: Plausible (cookieless)
- No tracking without consent
- Data retention policies
- Contact for data requests

### Security Headers:
- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff

### Business Compliance:
- UK LTD registration display
- VAT handling mention
- Terms of service
- W-8BEN-E availability note

## 📈 Success Metrics

### Technical:
- Lighthouse score >90
- Page load <3s
- Zero console errors
- Mobile usability 100%

### Business:
- Contact form submissions
- Resume downloads
- Case study views
- Time on site >2min

### Conversion Events:
- cta_book_call
- view_proof_pack
- download_resume
- case_study_view