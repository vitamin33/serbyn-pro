# Professional Portfolio Website | serbyn.pro

Next.js 14 + TypeScript + Tailwind + shadcn/ui | AI/ML Engineer Portfolio

## 🎯 Project Status & Next Steps

**COMPLETED (M1):** Foundation + marketing site - DEPLOYED ✅
- ✅ Dev environment + shadcn/ui setup
- ✅ Navigation (navbar, footer with UK LTD compliance) 
- ✅ Homepage sections: Hero, ProofPack, Services, CaseCard, Contact
- ✅ Business pages: About, How-to-Pay, Legal (Privacy, Terms)
- ✅ SEO foundation: metadata, sitemap, robots.txt
- ✅ Professional styling with responsive design

**CURRENT MILESTONE:** M2 - Resume & Print Mode
**NEXT:** M3 - MDX Case Studies, M4 - Live Achievements

## 📋 Remaining Development Tasks

### M2: Resume & Print Mode (30-60min)
1. Create `app/resume/page.tsx` with ATS-friendly resume
2. Add print CSS in `globals.css` for PDF generation
3. Skills matrix component with tabs (Hard/Soft skills)

### M3: MDX Case Studies (35-70min)
1. Install Contentlayer for MDX processing
2. Create `content/case-studies/*.mdx` with frontmatter
3. Build `app/case-studies/[slug]/page.tsx` for dynamic routing

### M4: Live Achievements (35-60min)
1. Create `data/*.json` for dynamic content
2. Build achievements display component
3. Add `app/api/resume/route.ts` (JSON Resume format)
4. GitHub Actions for automated data sync

## 🏗️ Project Architecture

### Key Files Structure:
```
app/
├─ page.tsx              # ✅ Homepage with all sections
├─ layout.tsx            # ✅ Root layout + SEO schemas
├─ about/page.tsx        # ✅ Bio + resume download
├─ resume/page.tsx       # 🔄 NEXT: Full resume + print CSS
├─ case-studies/         # 🔄 NEXT: MDX-driven case studies
├─ how-to-pay/page.tsx   # ✅ Payment methods + UK LTD
├─ legal/                # ✅ Privacy/Terms compliance
├─ sitemap.ts            # ✅ SEO sitemap
└─ robots.ts             # ✅ SEO robots

components/
├─ navbar.tsx            # ✅ Navigation with all links
├─ footer-legal.tsx      # ✅ UK LTD compliance footer
├─ hero.tsx              # ✅ Main value prop + CTAs
├─ proof-pack.tsx        # ✅ 4 evidence cards
├─ services.tsx          # ✅ 3 service offerings
├─ case-card.tsx         # ✅ Reusable case previews
├─ contact.tsx           # ✅ Contact section + CTAs
└─ ui/                   # ✅ shadcn components (Button, Card)

lib/
├─ seo.ts               # ✅ Metadata + schema generators
└─ utils.ts             # ✅ Utility functions

data/                   # 🔄 NEXT: JSON data sources
├─ achievements.json
├─ projects.json
└─ resume.json
```

## 🎨 Design System (Implemented)

**Colors:** Blue-600 accent, gray scale (50,100,200,500,700,900)
**Typography:** Inter (UI), JetBrains Mono (code/metrics)
**Layout:** max-w-6xl container, py-16 section spacing, p-6 card padding
**Components:** shadcn Card, Button with consistent styling

## 📝 Content Requirements

### Hero Section (✅ Implemented):
- H1: "AI engineer who ships reliable LLM systems"
- Subhead: "Cut token cost 30–50% at stable p95..."
- Trust line: "UK LTD · Remote from Kyiv · US/EU clients"
- CTAs: "Book a Call", "See Proof Pack"

### ProofPack (✅ Implemented):
4 evidence cards: MLflow lifecycle, SLO-gated CI, vLLM comparison, Grafana monitoring

### Services (✅ Implemented):
1. LLM Infrastructure & RAG
2. MLOps & Lifecycle Management  
3. GenAI for Marketing & E-commerce

## 🚀 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run lint            # ESLint check
npm run type-check      # TypeScript validation

# Quality Gates (MUST pass before deploy)
npm run build && npm run lint && npm run type-check
```

## 🔧 Quick Implementation Prompts

### Resume Page (M2):
```
Create app/resume/page.tsx with:
- ATS-friendly semantic structure
- Print CSS that hides nav/footer, formats for A4
- Sections: Summary, Experience, Projects, Skills, Education
- "Download PDF" button using window.print()
- Professional content for senior AI/ML engineer (11+ years)

Add print styles to globals.css:
@media print { .no-print { display: none !important; } }
```

### Case Studies with MDX (M3):
```
Install Contentlayer and create:
1. contentlayer.config.js with case study schema
2. content/case-studies/[slug].mdx files with frontmatter
3. app/case-studies/[slug]/page.tsx for dynamic routing
4. Update app/case-studies/page.tsx to list all cases

Frontmatter schema:
title, slug, summary, tech: string[], outcomes: string[], date, links: {demo?, repo?}
```

### Live Achievements (M4):
```
Create data/achievements.json with schema:
{ id, date, title, tags: ["MLOps", "LLM"], impact, link }

Build components/achievements-live.tsx:
- Reads JSON at build time
- Latest 6 achievements with tag filtering
- Responsive card layout

Add app/api/resume/route.ts serving JSON Resume format
```

## ⚡ Performance Requirements

**Lighthouse Targets:** >90 all categories
**Core Web Vitals:** LCP <2.5s, FID <100ms, CLS <0.1
**Print Mode:** Clean A4 layout, hidden nav/footer
**Mobile:** Responsive design, touch-friendly CTAs

## 🔒 Compliance (✅ Implemented)

**UK LTD:** Footer shows company details, registered office
**GDPR:** Privacy policy structure, contact for data requests
**Security:** Proper meta tags, no sensitive data in repo
**SEO:** Sitemap, robots.txt, structured data schemas

## 📈 Business Goals

**Primary:** Replace PDF CV with professional portfolio site
**Secondary:** Lead generation for US/EU AI consulting clients
**Success Metrics:** Contact form submissions, resume downloads, case study engagement

## 🔄 Deployment (Vercel)

**Domain:** serbyn.pro (www → apex redirect)
**Build:** Automatic on push to main
**Environment:** Production-ready with HTTPS
**DNS:** CNAME records pointing to Vercel

---

**Current Status:** M1 complete - professional marketing site deployed and ready to replace PDF CV. M2-M4 add depth and automation for enhanced portfolio showcase.