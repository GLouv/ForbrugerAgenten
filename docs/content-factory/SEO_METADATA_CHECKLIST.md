# 🎯 SEO Metadata Checklist - Complete Blog Creation Flow

## **CRITICAL: AI MUST GENERATE ALL OF THESE FOR EVERY ARTICLE**

---

## 📋 **FRONTMATTER METADATA (Required in every .md file)**

```yaml
---
# Core Identifiers
title: "Exact title for H1 and meta title (50-60 chars optimal)"
slug: "url-friendly-slug-dansk"

# SEO Critical Fields
meta_description: "Compelling description with primary keyword (140-160 chars)"
meta_keywords: ["keyword1", "keyword2", "keyword3"] # 5-8 keywords
excerpt: "Preview text for blog listing pages (140-160 chars)"

# Content Classification
category: "AI Strategy & Planning" # Must match existing categories
tags: ["ai salg", "automation", "produktivitet"] # 5-7 tags
author: "Gustav Lund"
word_count: 5500

# Publishing
status: "draft" # draft | scheduled | published
publish_date: null # Set when scheduling
priority: 1 # 1-12 based on ARTICLE_TOPICS.json

# Template System
template: "deep-dive" # deep-dive | standard | comparison
template_reason: "Chosen deep-dive because: [reasoning based on research]"

# Images
image: "/blog-images/slug-YYYYMMDD.png" # Hero image (auto-generated)
og_image: "/blog-images/slug-YYYYMMDD.png" # Same for social sharing
image_alt: "Descriptive alt text for hero image (SEO + accessibility)"

# Advanced SEO
canonical_url: "https://www.agent360.dk/blog/slug"
featured: true # For homepage featured posts
reading_time: 22 # Auto-calculated (word_count / 250)

# Research & Citations
research_sources:
  - "https://example.com/source1"
  - "https://example.com/source2"
research_date: "2025-11-21"

# Internal Linking (for related posts)
related_keywords: ["related topic 1", "related topic 2"]

# Schema.org hints (for structured data)
schema_type: "Article" # Article | BlogPosting | TechArticle
target_audience: "Salgsledere, CTOs, CEOs"
---
```

---

## 🔍 **METADATA REQUIREMENTS BY FIELD**

### **1. Title (meta title)**
- **Length:** 50-60 characters (including brand name)
- **Format:** `[Primary Keyword]: [Value Proposition] (2025)` 
- **Example:** `AI til Salgsafdelingen: Den Komplette Guide (2025)`
- **Must include:**
  - Primary keyword (from ARTICLE_TOPICS.json)
  - Value proposition or benefit
  - Year (for freshness signal)
- **AI checks:**
  - ✅ Contains primary keyword
  - ✅ Under 60 chars
  - ✅ Compelling and click-worthy
  - ✅ No clickbait or hype words

---

### **2. Meta Description**
- **Length:** 140-160 characters (strict!)
- **Format:** `[Benefit/Problem] + [Solution] + [Social Proof/Data]`
- **Example:** `Lær hvordan danske virksomheder implementerer AI i salgsafdelingen og opnår 40% højere produktivitet. Komplet guide med frameworks, data og cases.`
- **Must include:**
  - Primary keyword (naturally integrated)
  - Compelling benefit or problem statement
  - Call to action or value prop
  - Number/data if possible
- **AI checks:**
  - ✅ 140-160 chars (strict)
  - ✅ Contains primary keyword
  - ✅ Compelling CTA
  - ✅ No duplicate with title

---

### **3. Excerpt (for blog listing pages)**
- **Length:** 140-160 characters
- **Purpose:** Shows in blog list/grid views
- **Format:** Similar to meta_description but can be more descriptive
- **Example:** `Komplet guide til AI i salgsafdelingen: Frameworks, implementering og ROI-beregning baseret på danske cases.`
- **AI checks:**
  - ✅ 140-160 chars
  - ✅ Different from meta_description (slight variation OK)
  - ✅ Works standalone in blog list view

---

### **4. Meta Keywords**
- **Count:** 5-8 keywords (array format)
- **Source:** Primary + secondary from ARTICLE_TOPICS.json
- **Format:** `["primary keyword", "long-tail variant", "related keyword"]`
- **Example:** `["ai til salgsafdelingen", "kunstig intelligens salg", "automatisering salg", "ai salgsafdeling danmark", "sales ai guide"]`
- **AI checks:**
  - ✅ 5-8 keywords total
  - ✅ Primary keyword is first
  - ✅ Mix of head + long-tail
  - ✅ All 100% Danish

---

### **5. OG Image (Open Graph for social sharing)**
- **File:** Same as hero image (auto-generated via DALL-E 3)
- **Path:** `/blog-images/slug-YYYYMMDD.png`
- **Dimensions:** 1792x1024 (landscape, HD)
- **Cost:** $0.12 per image (DALL-E 3 HD)
- **Alt text:** Descriptive, includes primary keyword
- **AI checks:**
  - ✅ Image generated before article save
  - ✅ Alt text is descriptive and SEO-friendly
  - ✅ File saved to `/frontend/public/blog-images/`
  - ✅ Same image used for `image` and `og_image`

---

### **6. Canonical URL**
- **Format:** `https://www.agent360.dk/blog/{slug}`
- **Purpose:** Prevent duplicate content issues
- **AI generates:** Automatically based on slug
- **AI checks:**
  - ✅ Uses production domain
  - ✅ Matches article slug
  - ✅ HTTPS protocol

---

### **7. Tags (for filtering & related posts)**
- **Count:** 5-7 tags
- **Source:** Based on article content + keywords
- **Format:** `["ai salg", "automation", "crm", "produktivitet"]`
- **Use case:** Blog filtering, related posts logic
- **AI checks:**
  - ✅ 5-7 tags
  - ✅ All lowercase
  - ✅ Mix of specific + broad
  - ✅ 100% Danish

---

### **8. Category**
- **Must match:** Existing frontend categories
- **Options:**
  - "AI Strategy & Planning"
  - "Workflow Automation"
  - "Sales Intelligence"
  - "Tool Comparisons"
  - "Training & Onboarding"
  - "Compliance & Legal"
  - "ROI & Business Case"
  - "Sales Performance"
- **AI checks:**
  - ✅ Matches ARTICLE_TOPICS.json category
  - ✅ Exact case-sensitive match

---

### **9. Schema.org Type**
- **Purpose:** Structured data for Google rich results
- **Options:**
  - `Article` - General articles
  - `BlogPosting` - Standard blog posts
  - `TechArticle` - Technical guides
- **AI selects based on:**
  - Deep-dive = TechArticle
  - Standard guide = Article
  - Comparison = Article
- **Generated in:** `BlogPostContent.tsx` component

---

### **10. Reading Time**
- **Calculation:** `word_count / 250 words per minute`
- **Format:** Integer (minutes)
- **Example:** 5500 words = 22 minutes
- **AI checks:**
  - ✅ Auto-calculated
  - ✅ Displayed in blog post header

---

## 🤖 **AI AUTOMATED CHECKLIST (BEFORE SAVING ARTICLE)**

When AI generates article, it MUST verify:

```yaml
TITLE:
  ✅ 50-60 characters
  ✅ Contains primary keyword
  ✅ Includes year (2025)
  ✅ Compelling value prop

META_DESCRIPTION:
  ✅ 140-160 characters (strict!)
  ✅ Contains primary keyword
  ✅ Includes benefit/data
  ✅ Has call-to-action element

EXCERPT:
  ✅ 140-160 characters
  ✅ Different from meta_description
  ✅ Works standalone in blog list

META_KEYWORDS:
  ✅ 5-8 keywords (array)
  ✅ Primary keyword is first
  ✅ All 100% Danish
  ✅ Mix of head + long-tail

IMAGES:
  ✅ Hero image generated (DALL-E 3)
  ✅ File saved to /frontend/public/blog-images/
  ✅ Alt text is descriptive + includes keyword
  ✅ og_image = same as hero image

CANONICAL_URL:
  ✅ Generated: https://www.agent360.dk/blog/{slug}
  ✅ HTTPS protocol
  ✅ Matches slug

CATEGORY:
  ✅ Matches ARTICLE_TOPICS.json
  ✅ Exists in frontend categories

TAGS:
  ✅ 5-7 tags
  ✅ All lowercase
  ✅ 100% Danish

TEMPLATE:
  ✅ Selected based on research
  ✅ template_reason documented

READING_TIME:
  ✅ Auto-calculated (word_count / 250)

RESEARCH_SOURCES:
  ✅ All sources documented
  ✅ Links are valid
  ✅ Research date logged
```

---

## 🔄 **INTEGRATION WITH EXISTING WORKFLOW**

### **Updated Step 1: Research & Generate**

```markdown
AI performer automatisk:

1. Research (web search, competitor analysis)
2. Select template (deep-dive | standard | comparison)
3. Generate article content (5000+ words)
4. **NEW: Generate ALL SEO metadata:**
   - Title (50-60 chars)
   - Meta description (140-160 chars)
   - Excerpt (140-160 chars)
   - Meta keywords (5-8 keywords)
   - Tags (5-7 tags)
   - Canonical URL
   - Category
   - Schema type
5. **NEW: Generate hero image (DALL-E 3)**
   - Contextual prompt based on article
   - Save to /frontend/public/blog-images/
   - Generate alt text
6. Write complete frontmatter with ALL fields
7. Write article markdown
8. Save to drafts/[slug].md
```

---

## 📊 **VALIDATION SCRIPT (Optional Future Enhancement)**

```python
# agent360/backend/scripts/validate_article_seo.py

def validate_article_metadata(frontmatter: dict) -> dict:
    """
    Validates all SEO metadata before upload.
    Returns dict with validation results.
    """
    errors = []
    warnings = []
    
    # Title validation
    if len(frontmatter['title']) > 60:
        errors.append("Title exceeds 60 characters")
    
    # Meta description validation
    meta_desc_len = len(frontmatter['meta_description'])
    if meta_desc_len < 140 or meta_desc_len > 160:
        errors.append(f"Meta description is {meta_desc_len} chars (must be 140-160)")
    
    # Keywords validation
    if len(frontmatter['meta_keywords']) < 5:
        warnings.append("Less than 5 keywords provided")
    
    # ... more validation rules
    
    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'warnings': warnings
    }
```

---

## 🎯 **WHAT'S CURRENTLY IMPLEMENTED**

✅ **Database fields:** All SEO fields exist in `content_library` table
✅ **Frontend:** Next.js metadata generation uses meta_description, keywords, og_image
✅ **Image generation:** DALL-E 3 integration ready
✅ **Markdown parsing:** `save_article.py` parses frontmatter correctly

---

## ❌ **WHAT WAS MISSING (NOW FIXED)**

Was missing explicit checklist for AI to follow, now we have:

1. ✅ **SEO Metadata Checklist** (this document)
2. ✅ **Character limits for title/description**
3. ✅ **Excerpt generation** (separate from meta_description)
4. ✅ **Canonical URL auto-generation**
5. ✅ **Reading time calculation**
6. ✅ **Schema.org type selection logic**
7. ✅ **Complete frontmatter template**

---

## 🚀 **NEXT: Update .cursorrules**

Add reference to this document so AI ALWAYS generates complete metadata:

```markdown
## REFERENCE DOCS:
- **SEO Metadata:** `agent360/docs/content-factory/SEO_METADATA_CHECKLIST.md` (CRITICAL!)
- Content Voice: `agent360/docs/content-factory/AGENT360_CONTENT_VOICE.md`
- LLM Rules: `agent360/docs/content-factory/LLM_CITATION_RULES.md`
- ICP Context: `agent360/docs/content-factory/ICP_PRODUCT_CONTEXT.md`
- Topics: `agent360/docs/content-factory/ARTICLE_TOPICS.json`
- Workflow Guide: `agent360/docs/content-factory/CURSOR_WORKFLOW.md`
```

---

## ✅ **CONCLUSION**

**Every blog article MUST have these 10+ metadata fields:**

1. Title (SEO-optimized, 50-60 chars)
2. Meta description (140-160 chars)
3. Excerpt (140-160 chars)
4. Meta keywords (5-8 keywords)
5. Tags (5-7 tags)
6. Category (exact match)
7. Hero image + alt text (DALL-E 3)
8. OG image (same as hero)
9. Canonical URL (auto-generated)
10. Schema.org type
11. Reading time (auto-calculated)
12. Research sources (documentation)

**AI generates ALL of these automatically in Step 1 before saving to file.**

