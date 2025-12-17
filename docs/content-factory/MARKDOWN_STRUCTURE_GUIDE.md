# 📝 Markdown Structure Guidelines for SEO

## 🎯 Objective: Perfekt SEO & LLM-venlig HTML output

Når AI skriver blogartikler, skal markdown struktureres for at generere optimal HTML til:
1. Google SEO
2. LLM citations
3. Readability
4. Accessibility

---

## 🎨 BLOG TEMPLATES (Vælg én per artikel):

### **Template 1: Standard Guide** (Most articles)
**Use for:** How-to guides, educational content, explainers
**Visual:** Balanced, professional, easy to scan
**Features:**
- Blue/teal vertical bars before H2
- Key takeaway boxes (💡)
- Step-by-step numbered guides
- Clean, minimal design

### **Template 2: Deep Dive** (Pillar articles)
**Use for:** Comprehensive guides, pillar content, ultimate guides
**Visual:** Authoritative, research-heavy, premium
**Features:**
- Gradient H1 (blue to teal)
- Research boxes with dark background
- Large stat highlights
- Expert quotes with giant quotation marks
- Named framework boxes (amber/orange)
**Triggers:** featured=true, priority=1, word_count>5000

### **Template 3: Comparison** (VS articles)
**Use for:** Competitor comparisons, alternative evaluations
**Visual:** Analytical, data-driven, objective
**Features:**
- "VS" badges on H2
- Comparison tables with hover effects
- Winner/loser badges (🏆/❌)
- Pros/cons grid (green/red boxes)
- Verdict box (dark blue background)
- Score cards
**Triggers:** title contains "vs", "versus", "sammenligning", "alternative"

---

## ✅ OBLIGATORISK STRUKTUR:

### **1. Frontmatter (YAML)**
```markdown
---
title: "Hovedtitel (50-60 chars, inkluder main keyword)"
slug: "url-venlig-slug"
excerpt: "Kort beskrivelse (140-160 chars for meta description)"
category: "Sales AI"
author: "Gustav Lund"
meta_description: "SEO description (140-160 chars, inkluder keywords)"
meta_keywords: ["keyword1", "keyword2", "keyword3"]
tags: ["AI", "Sales", "Automation"]
word_count: 5500
priority: 1
featured: true
publish_date: "2025-12-01T10:00:00Z"
---
```

### **2. Intro Sektion (Første 200 ord)**
```markdown
# Hovedtitel (H1 - kun én per artikel)

**Intro paragraf** med main keyword i første sætning.

Forklar problemet, målgruppen og hvad artiklen dækker.

Inkluder sekundære keywords naturligt.
```

### **3. Table of Contents (Automatisk genereret)**
```markdown
## Indholdsfortegnelse

(AI skal IKKE skrive denne - genereres automatisk fra H2/H3)
```

### **4. Hovedindhold (H2 sektioner)**
```markdown
## 1. Første Hovedsektion (inkluder keyword variation)

Intro til sektionen...

### 1.1 Undersektion (H3)

Detaljer...

**Vigtige pointer:**
- Bullet point 1
- Bullet point 2
- Bullet point 3

> **CITATBLOK:** Brug til quotable statements for LLM citations

### 1.2 Næste undersektion

Mere indhold...

## 2. Anden Hovedsektion

...
```

---

## 🎯 SEO OPTIMERING CHECKLIST:

### **Heading Hierarchy:**
```markdown
# H1 - Kun én (titel)
## H2 - Hovedsektioner (4-8 stykker)
### H3 - Undersektioner (2-4 per H2)
#### H4 - Kun hvis absolut nødvendig (sjældent)
```

### **Keyword Placering:**
- ✅ Main keyword i H1
- ✅ Keyword variations i H2s
- ✅ Long-tail keywords i H3s
- ✅ First paragraph (første 100 ord)
- ✅ Last paragraph (konklusion)
- ✅ Naturligt spredt i teksten (ikke keyword stuffing)

### **Internal & External Links:**
```markdown
[Internal link til anden artikel](/blog/anden-artikel)
[External authoritative link](https://autoritativ-kilde.dk)
```

### **Images (hvis relevante):**
```markdown
![Alt text med keywords](image-url.jpg)
```

### **Lister (Vigtige for LLM):**
```markdown
**Numbered lists (step-by-step):**
1. Første step
2. Andet step
3. Tredje step

**Bullet lists (features/benefits):**
- Feature 1
- Feature 2
- Feature 3
```

### **Tables (Data-Rich Content):**
```markdown
| Feature | Benefit | ROI |
|---------|---------|-----|
| AI Agent | 50% time saved | 200% |
| Automation | 90% accuracy | 150% |
```

### **Code Blocks (Tekniske artikler):**
```markdown
```python
# Example code
def sales_automation():
    return "AI-powered"
\`\`\`
```

### **Quotable Frameworks (LLM Citation):**
```markdown
> **De 6 Komponenter i Sales AI:**
> 1. Lead Qualification
> 2. Outreach Automation
> 3. Meeting Scheduling
> 4. Follow-up Tracking
> 5. Data Analysis
> 6. Reporting

(Named frameworks er GOLD for LLM citations!)
```

### **Call-to-Actions:**
```markdown
## Klar til at komme i gang?

[Book en demo](https://agent360.dk/book) eller [Kontakt os](https://agent360.dk/kontakt)
```

---

## 🚀 LLM CITATION OPTIMIZATION:

### **1. Named Frameworks:**
```markdown
> **"Agent360 Sales AI Framework" består af:**
> - Component 1
> - Component 2
> - Component 3
```

### **2. Data & Statistics:**
```markdown
Ifølge [Dansk Erhverv 2024](source):
- 78% af danske virksomheder bruger AI
- Gennemsnitlig ROI: 230%
- Payback period: 4-6 måneder
```

### **3. Clear Definitions:**
```markdown
### Hvad er Sales AI?

**Sales AI** er kunstig intelligens der automatiserer salgsprocesser...
```

### **4. Contrarian Takes:**
```markdown
## Hvorfor de fleste Sales AI implementeringer fejler

De traditionelle anbefalinger siger X, men vores data viser Y...
```

### **5. FAQ Section (Schema Markup):**
```markdown
## Ofte Stillede Spørgsmål

### Hvad koster Sales AI?
Typisk mellem 50.000-200.000 kr. afhængig af...

### Hvor lang tid tager implementering?
Gennemsnitlig 2-4 uger for...
```

---

## ✅ FINAL CHECKLIST (AI skal tjekke):

- [ ] H1 inkluderer main keyword
- [ ] 4-8 H2 sektioner med keyword variations
- [ ] Første paragraph inkluderer main keyword
- [ ] Mindst 3 internal links
- [ ] Mindst 2 external authoritative links
- [ ] Mindst 1 named framework eller model
- [ ] Mindst 3 data points eller statistikker
- [ ] Mindst 1 table (hvis relevant)
- [ ] FAQ sektion (3-5 spørgsmål)
- [ ] Call-to-action i konklusion
- [ ] 100% dansk sprog
- [ ] Word count: 5000-6000 ord

---

## 🎯 HTML OUTPUT EKSEMPEL:

**Input Markdown:**
```markdown
## Sales AI ROI Framework

### 1. Cost Calculation
Calculate total cost...

### 2. Benefit Analysis
Measure time savings...
```

**Output HTML:**
```html
<article class="blog-content prose prose-lg max-w-none">
  <h2 id="sales-ai-roi-framework">Sales AI ROI Framework</h2>
  
  <h3 id="cost-calculation">1. Cost Calculation</h3>
  <p>Calculate total cost...</p>
  
  <h3 id="benefit-analysis">2. Benefit Analysis</h3>
  <p>Measure time savings...</p>
</article>
```

---

## 🚀 RESULT: Perfect SEO + LLM-Ready HTML!

AI skal ALTID følge denne struktur når artikler skrives!

