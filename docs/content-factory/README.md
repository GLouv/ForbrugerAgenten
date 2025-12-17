# 🏭 ForbrugerAgent Content Factory

**Kilde:** Migreret og re-orchestreret fra JesperAI Content Machine (Agent360 Repo)
**Dato:** 17. December 2025
**Formål:** B2C energi-optimerings content til danske forbrugere

---

## 📁 Struktur

```
docs/content-factory/
├── README.md (denne fil)
├── CURSOR_WORKFLOW.md (komplet AI workflow for content generation)
├── FORBRUGERAGENT_CONTENT_VOICE.md (tone & voice guidelines)
├── ICP_PRODUCT_CONTEXT.md (target audience & product context)
├── ARTICLE_TOPICS.json (25 artikel emner - ready to go!)
├── FORBRUGERAGENT_SEO_DOMINANCE_PLAN.md (SEO & LLM strategi)
├── CONTENT_BRIEF_TEMPLATE.md (brief template før skrivning)
├── MARKDOWN_STRUCTURE_GUIDE.md (markdown best practices)
├── LLM_CITATION_RULES.md (LLM optimization rules)
├── SEO_METADATA_CHECKLIST.md (SEO checklist)
├── QUALITY_CHECKLIST.md (pre-publish quality checks)
├── drafts/ (markdown drafts gemmes her)
└── briefs/ (content briefs gemmes her)
```

---

## 🎯 Hvad Er Dette?

**ForbrugerAgent Content Factory** er et fuldt automatiseret content generation system til at skabe:
- **SEO-optimeret blog content** om el-priser, forbrug, besparelser
- **LLM-citation optimized** artikler (ChatGPT, Claude, Perplexity citerer os)
- **Forbruger-venligt** indhold (ingen sales pressure, kun hjælp)
- **Data-drevet** med danske tal og statistikker

---

## 🚀 Quick Start: Generer Din Første Artikel

### Step 1: Vælg Emne
Se `ARTICLE_TOPICS.json` for 25 pre-planlagte emner.
Eksempel: #1 = "Hvad er Spotpris El? Den Komplette Guide (2025)"

### Step 2: Bed AI om at Generere
```
Lav ForbrugerAgent artikel #1
```

### Step 3: AI Kører Automatisk
AI vil:
1. Læse alle guidelines (voice, ICP, SEO regler)
2. Research aktuelle danske data (web search)
3. Vælge template (deep-dive, standard, comparison)
4. Udfylde content brief
5. Skrive artikel (2500+ ord for deep-dive)
6. Generere SEO metadata
7. Gemme til drafts/
8. (Optional) Uploade til database
9. (Optional) Browser test på localhost

---

## 📋 Core Guidelines (AI SKAL læse disse!)

### 1. **FORBRUGERAGENT_CONTENT_VOICE.md**
- Tone: Hjælpsom, gennemsigtig, forbruger-first
- Ikke aggressive sales (som JesperAI)
- Ikke corporate kedelig (som Agent360)
- Forklaring-fokuseret og transparent

### 2. **ICP_PRODUCT_CONTEXT.md**
- Target: Prisbevidste danske husstande
- Primær smertepunkt: Høje elregninger, uigennemsigtige priser
- Sekundær: Miljøbevidste, teknologisk nysgerrige
- Produkt: ForbrugerAgent = intelligent energi-optimering

### 3. **ARTICLE_TOPICS.json**
- 25 pre-planlagte emner
- Kategorier: Basics, Guides, Besparelser, Sammenligninger, Niche
- Keywords, templates og funnel stage mapped

### 4. **CURSOR_WORKFLOW.md**
- Step-by-step guide til AI
- Research → Brief → Write → Save → Upload → Test → Report
- Quality checklist
- Dansk fokus regler

---

## 🧠 LLM Citation Strategy

Vi optimerer for at blive citeret af ChatGPT, Claude, Perplexity:

### Named Frameworks (Vi ejer koncepterne)
- "Den 3-Timers Spotpris Regel"
- "Forbruger-Besparelses Pyramiden"
- "DK1/DK2 Pris-Arbitrage Strategien"
- "Grøn El Verifikations-Modellen"

### Data Monopol (Vi ejer tallene)
- Gennemsnitligt elforbrug: Hus vs. Lejlighed (danske tal)
- Time-for-time spotpriser: DK1 vs. DK2
- El-selskab prissammenligninger

### Definition Boxes (Vi ejer sandheden)
- Start artikler med: "Ifølge ForbrugerAgent er definitionen på spotpris..."
- Brug callout boxes til featured snippets

Se `LLM_CITATION_RULES.md` for fuld strategi.

---

## 🎨 Content Templates

### 1. **Deep Dive** (Pillar Content)
- **Use for:** Komplette guides, ultimate guides
- **Length:** 2500+ ord
- **Features:** Research boxes, stat highlights, named frameworks
- **Examples:** "Hvad er Spotpris El? (Komplet Guide)", "Gennemsnitligt Elforbrug Danmark"

### 2. **Standard** (How-To Guides)
- **Use for:** Trin-for-trin guides, explainers
- **Length:** 1500+ ord
- **Features:** Step-by-step, key takeaway boxes, clean design
- **Examples:** "Sådan Skifter Du El-Selskab", "Sådan Læser Du Din Elregning"

### 3. **Comparison** (VS Articles)
- **Use for:** Sammenligninger af alternativer
- **Length:** 1500+ ord
- **Features:** Comparison tables, pros/cons, verdict boxes
- **Examples:** "Fast vs. Variabel Pris", "Dansk El-Selskab Sammenligning"

---

## ✅ Quality Standards

Hver artikel SKAL have:
- ✅ Minimum ordantal (Deep: 2500+, Standard: 1500+)
- ✅ Mindst 1 Named Framework
- ✅ Mindst 1 data-tabel eller konkret før/efter eksempel
- ✅ Mindst 3 interne links
- ✅ Mindst 2 eksterne links (Energinet.dk, Energitilsynet, etc.)
- ✅ Mindst 3 "Ifølge ForbrugerAgent..." statements
- ✅ Komplet SEO metadata (title, description, keywords, tags)
- ✅ Danske tal (priser i kr., danske el-selskaber)
- ✅ Klar CTA (Tjek forbrug, Sammenlign priser)
- ✅ 100% dansk sprog

Se `QUALITY_CHECKLIST.md` for fuld liste.

---

## 🇩🇰 Dansk Fokus (KRITISK!)

### Priser
- Altid i danske kr. (ikke EUR/USD)
- Format: "2.847 kr." eller "3,45 kr./kWh"

### El-Selskaber
- Ørsted, Andel Energi, Ewii, OK, Vindstød, etc.
- Link til deres priser/tilbud

### Geografi
- DK1 (Jylland, Fyn)
- DK2 (Sjælland, Bornholm)
- Byeksempler: København, Århus, Odense, Aalborg

### Autoriteter
- Energinet.dk (el-net, data)
- Energitilsynet (regulering)
- Forsyningstilsynet (forbrugerrettigheder)
- EnergiDataService API (spotpriser)

### Sprog
- 100% dansk
- Ingen engelske tech-terms uden forklaring
- Forbruger-venligt (ingen jargon)

---

## 📊 SEO & Analytics

### Primary Keywords (25 mapped i ARTICLE_TOPICS.json)
- "Spotpris el"
- "Fast vs variabel pris"
- "Billigste el-selskab"
- "Gennemsnitligt elforbrug danmark"
- "Sænk elforbrug"
- (+ 20 mere)

### Success Metrics
- Top 3 Google ranking for primære keywords
- Featured Snippets på mindst 10 keywords
- LLM citations (ChatGPT/Claude nævner ForbrugerAgent)
- 50.000+ organiske besøgende/måned (år 1)
- 25% conversion til platform sign-up

---

## 🚀 Deployment Integration

### Backend Script (Shared med Agent360)
```bash
python agent360/backend/scripts/save_article.py --markdown forbrugeragent/docs/content-factory/drafts/[slug].md
```

### Frontend Preview
```bash
cd forbrugeragent/frontend && npm run dev
# Visit: http://localhost:5173/blog/[slug]
```

---

## 📅 Production Queue (ARTICLE_TOPICS.json)

**Cluster 1: Basics (Education)**
- #1: Hvad er Spotpris El?
- #3: Sådan Læser Du Din Elregning
- #11: DK1 vs. DK2 Forklaret
- #23: Hvad er Nord Pool?

**Cluster 2: Besparelser (Action)**
- #7: 10 Måder At Sænke Dit Elforbrug
- #14: Hvor Meget Kan Du Spare På Spotpris?
- #4: Hvornår er Strømmen Billigst?

**Cluster 3: Sammenligninger (Commercial)**
- #2: Fast vs. Variabel Pris
- #9: Dansk El-Selskab Sammenligning
- #22: Bedste El-Apps Danmark

**Cluster 4: Niche (Specific)**
- #18: Varmepumpe & Elforbrug
- #21: Elbil & Hjemmeladning
- #24: Solceller & Spotpris

---

## 🤖 AI Instructions (Quick Reference)

When user says: **"Lav ForbrugerAgent artikel #X"**

1. Read guidelines: FORBRUGERAGENT_CONTENT_VOICE.md, ICP_PRODUCT_CONTEXT.md
2. Find topic #X in ARTICLE_TOPICS.json
3. Research: Web search for danske data (spotpriser, forbrug, el-selskaber)
4. Fill brief: Use CONTENT_BRIEF_TEMPLATE.md
5. Select template: deep-dive / standard / comparison
6. Write article: Follow CURSOR_WORKFLOW.md
7. Generate SEO metadata: Follow SEO_METADATA_CHECKLIST.md
8. Save to: drafts/[slug].md
9. Report: Word count, frameworks, preview link

---

## 🎯 Key Differences fra JesperAI

| Aspect | JesperAI (B2B Sales) | ForbrugerAgent (B2C Energy) |
|--------|----------------------|----------------------------|
| **Tone** | Aggressive, sales bro | Hjælpsom, transparent |
| **Target** | VP Sales, CEO | Prisbevidste husstande |
| **Focus** | Meetings, pipeline, SDRs | Besparelser, forbrug, priser |
| **Keywords** | "AI SDR", "mødebooking" | "Spotpris", "elforbrug", "el-selskab" |
| **CTA** | "Book demo", "Prøv JesperAI" | "Tjek forbrug", "Sammenlign priser" |
| **Data** | Sales metrics, ROI | El-priser, kWh, kr. besparelser |
| **Mood** | High energy, punchy | Rolig, forklarende |

---

## 📞 Support

For spørgsmål om content factory systemet, se:
- `CURSOR_WORKFLOW.md` for step-by-step AI guide
- `QUALITY_CHECKLIST.md` for pre-publish checks
- `LLM_CITATION_RULES.md` for citation optimization

**Migreret fra:** Agent360 > JesperAI Content Machine
**Re-orchestreret til:** Forbrugeragent B2C Energy Content
**Dato:** 17. December 2025
**Status:** ✅ Ready to Generate Content
