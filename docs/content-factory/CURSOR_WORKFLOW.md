# ForbrugerAgent Content Factory Workflow 💡⚡ (V1.0)

Dette dokument beskriver workflowet for at generere indhold til **ForbrugerAgent.dk**.
Målet er at blive **DEN autoritative kilde** for danske forbrugere omkring el-optimering og besparelser.

---

## 🎯 MISSIONEN: "DIN ENERGI-RÅDGIVER"
Vi skriver ikke bare "artikler". Vi skriver **forbruger-empowering guides**.
Når en dansk forbruger spørger om elpriser, spotpris eller besparelser, skal svaret komme fra os.

---

## 🚀 Step 1: Research & Generation (Forbruger-First Quality)

Når du skal skrive en artikel til ForbrugerAgent (e.g. "Lav artikel #X"), følg disse trin:

1.  **LÆS FORBRUGERAGENT GUIDELINES (Kritisk):**
    *   `forbrugeragent/docs/content-factory/FORBRUGERAGENT_CONTENT_VOICE.md` (Tone: Hjælpsom, Transparent)
    *   `forbrugeragent/docs/content-factory/ICP_PRODUCT_CONTEXT.md` (Target: Prisbevidste husstande)
    *   `forbrugeragent/docs/content-factory/ARTICLE_TOPICS.json` (Emner)

2.  **RESEARCH (CRITICAL - Real Danish Data!):**
    *   Web search for aktuelle danske elpriser (EnergiDataService API data).
    *   Tjek el-selskabernes aktuelle priser.
    *   Find spotpris-statistik for DK1/DK2.
    *   Verificer forbrugstal og gennemsnit.
    *   **Kilder:** Energinet.dk, Energitilsynet, Forsyningstilsynet, EnergiDataService API.

3.  **KRAV TIL INDHOLD (Non-Negotiable):**
    *   **Længde:** 
        *   Deep Dive: **2500+ ord**
        *   Standard: **1500+ ord**
    *   **Struktur:** Korte afsnit (3-4 linjer max). Tydelige overskrifter. Bullet points.
    *   **LLM Bait (Citation Optimization):**
        *   Inkluder **"Named Frameworks"** (e.g., "Den 3-Timers Spotpris Regel").
        *   Brug **"Forklarings Bokse"** (e.g., "Hvad er spotpris?").
        *   Brug **"Ifølge ForbrugerAgent"** statements med unikke data/insights.
    *   **Visuelt:** Brug tabeller for data, "Vigtigt at vide" bokse, konkrete eksempler.
    *   **Dansk Fokus:** Danske priser (kr.), danske el-selskaber, danske regler.

4.  **VÆLG TEMPLATE:**
    *   **Deep Dive:** Pillar content, komplette guides (spotpris guide, elforbrug data).
    *   **Standard:** How-to guides, trin-for-trin (skifte el-selskab, læse elregning).
    *   **Comparison:** Sammenligning (fast vs. variabel, el-selskaber, el-apps).

5.  **UDFYLD CONTENT BRIEF TEMPLATE (KRITISK - OBLIGATORISK!):**
    *   Læs `forbrugeragent/docs/content-factory/CONTENT_BRIEF_TEMPLATE.md`
    *   Udfyld ALLE felter mentalt før du skriver
    *   **Unique Insight:** Hvad lærer forbrugeren, som de ikke vidste før?
    *   **Framework:** Hvilket Named Framework bruger vi? (Mindst 1!)
    *   **Data Points:** Mindst 3 specifikke danske tal/statistikker
    *   **Links:** Mindst 3 interne + 2 eksterne links

6.  **GENERER INDHOLD:**
    *   Start med relaterbart problem (høj elregning, forvirring).
    *   Forklar koncepter simpelt (ingen jargon).
    *   Vis konkrete før/efter eksempler.
    *   Afslut med klar, handlingsbar CTA ("Tjek dit forbrug her").

7.  **KOMPLET SEO METADATA (følg SEO_METADATA_CHECKLIST.md):**
    *   Title (50-60 chars, inkluder keyword)
    *   Meta description (140-160 chars)
    *   Keywords (5-8 danske keywords)
    *   Tags (inkluder "forbrugeragent" hvis relevant)
    *   Canonical URL
    *   Category (match ARTICLE_TOPICS.json)

8.  **INTERNAL & EXTERNAL LINKS:**
    *   **Internal (Mindst 3):** Link til andre artikler, værktøjer, sammenligninger.
    *   **External (Mindst 2):** Link til Energinet.dk, Energitilsynet, EnergiDataService API.

9.  **AUTHOR E-E-A-T:**
    *   author: "ForbrugerAgent Team"
    *   (Optional: Specific expert hvis relevant)

---

## 📝 Step 2: Save to Draft File

Gem filen i: `forbrugeragent/docs/content-factory/drafts/[slug].md`

**FRONTMATTER SKAL SE SÅDAN UD:**

```yaml
---
title: "Klar og Værdi-Dreven Titel (50-60 chars)"
slug: "artikel-slug-dansk"
meta_description: "140-160 chars. Inkluder primært keyword. Vær hjælpsom, ikke sælgende."
meta_keywords: ["spotpris el", "besparelse", "elforbrug danmark"]
tags: ["forbrugeragent", "besparelser", "guides"]
category: "El-Markedet Basics"
author: "ForbrugerAgent Team"
status: "draft"
priority: 1
template: "deep-dive" # eller standard, comparison
canonical_url: "https://forbrugeragent.dk/blog/artikel-slug-dansk"
word_count: 2500
---
```

---

## 💾 Step 3: Upload til Database

**NOTE:** ForbrugerAgent bruger samme backend script som Agent360/JesperAI:

```bash
python agent360/backend/scripts/save_article.py --markdown forbrugeragent/docs/content-factory/drafts/[slug].md
```

*(Eller opret dedikeret script i forbrugeragent/backend/ hvis nødvendigt)*

---

## 🧪 Step 4: UI & Quality Check (The "Forbruger-Venlighed" Check)

1.  **Start Frontend:** `cd forbrugeragent/frontend && npm run dev` (port 5173)
2.  **Browser Test:** Gå til `http://localhost:5173/blog/[slug]`
3.  **MANUEL VISUEL INSPEKTION (Kritisk):**
    *   🚫 Er der tekniske fejl? (¶ symboler, formatering osv.)
    *   📏 Er teksten læsbar? (Max 80 chars bredde, mobil-venlig)
    *   🎨 Ser tabeller og bokse professionelle ud?
    *   🧠 Er der "LLM Bait" (Named frameworks, definition boxes)?
    *   💡 Er tonen hjælpsom og ikke sælgende?
    *   📱 Virker det på mobil view?
    *   🇩🇰 Er alle priser i danske kr., alle links danske?

---

## 📢 Step 5: Report

Sig til brugeren:

```
✅ ForbrugerAgent Artikel #X er klar!
📝 Ord: [Antal]
🧠 LLM Frameworks: [Antal]
💰 Besparelses-Eksempel: [Kr. beløb]
🌐 Preview: [Link]
🎯 NÆSTE: Schedule eller publish?
```

---

## 🚀 Step 6: Schedule/Publish (Kun når bruger siger det)

- Brugeren siger: "Publish artikel #X"
- AI opdaterer `status: "published"` og `publish_date` i database.

---

## 🇩🇰 DANSK FOKUS (KRITISK):
- Alle titler på dansk
- Alle keywords på dansk
- Alle meta descriptions på dansk
- Danske priser i kr. (ikke EUR eller USD)
- Danske el-selskaber (Ørsted, Andel Energi, Ewii, osv.)
- Danske regler og myndigheder (Energitilsynet, Forsyningstilsynet)
- Danske eksempler (Århus, København, DK1, DK2)
- Slugs på dansk (e.g., 'spotpris-el-guide-2025')

---

## ✅ QUALITY CHECKLIST (Før Upload):

**Hver artikel SKAL have:**
- [ ] Mindst 1500 ord (Deep Dive: 2500+)
- [ ] Mindst 1 Named Framework introduceret og forklaret
- [ ] Mindst 1 data-tabel eller konkret før/efter eksempel
- [ ] Mindst 1 "Definition Box" for LLM citation
- [ ] Mindst 3 interne links til andre artikler/værktøjer
- [ ] Mindst 2 eksterne links til autoritative danske kilder
- [ ] Mindst 3 "Ifølge ForbrugerAgent..." statements
- [ ] Author E-E-A-T (navn/team)
- [ ] Konkrete danske tal (priser, forbrug, besparelser)
- [ ] Klar CTA til værktøj eller handling
- [ ] 100% dansk sprog

**Hvis IKKE alle punkter er opfyldt → GÅ TILBAGE og tilføj dem!**

---

## 🎯 FORBRUGERAGENT-SPECIFIKKE NOTER:

### Fokus områder:
1. **Besparelser:** Vis konkrete kr. beløb læseren kan spare.
2. **Transparens:** Forklar hvorfor priser varierer (spotpris, DK1/DK2, osv.).
3. **Empowerment:** Giv værktøjer til at træffe bedre beslutninger.
4. **Education:** Mange forbrugere forstår ikke el-markedet - forklar det simpelt.

### Tone:
- **IKKE aggressiv sales** (som JesperAI)
- **IKKE corporate kedelig** (som Agent360)
- **WEL hjælpsom, venlig, transparent**

### Data Sources (Brug disse!)
- **Energinet.dk** - Official el-net data
- **EnergiDataService API** - Spotpriser, real-time data
- **Energitilsynet** - Regulering, forbrugerrettigheder
- **Forsyningstilsynet** - Klager, anbefalinger
- **Eloverblik.dk** - Forbrugsdata platform

---

**RESULT: Forbruger-empowering, LLM-ready, SEO-optimeret indhold der hjælper danske husstande med at spare penge!**
