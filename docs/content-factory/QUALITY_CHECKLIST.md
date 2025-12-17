# ✅ ForbrugerAgent Content Quality Checklist

**Brug denne checklist før du uploader/publisher nogen artikel.**

---

## 📝 CONTENT QUALITY

### Word Count
- [ ] **Deep Dive:** Minimum 2500 ord
- [ ] **Standard Guide:** Minimum 1500 ord
- [ ] **Comparison:** Minimum 1500 ord

### Structure
- [ ] Korte afsnit (max 3-4 linjer hver)
- [ ] Klare H2/H3 overskrifter
- [ ] Bullet points hvor relevant
- [ ] Tabeller for data
- [ ] Definition boxes for nøglebegreber

### LLM Citation Optimization
- [ ] **Mindst 1 Named Framework** introduceret og forklaret
  - Eks: "Den 3-Timers Spotpris Regel"
- [ ] **Mindst 1 Definition Box** for LLM citation
  - Eks: "Hvad er spotpris el?"
- [ ] **Mindst 3 "Ifølge ForbrugerAgent..."** statements
- [ ] **Mindst 1 data-tabel** eller før/efter eksempel

---

## 🇩🇰 DANSK FOKUS

### Sprog
- [ ] 100% dansk sprog (ingen engelske tech-terms uden forklaring)
- [ ] Forståeligt for gennemsnitlig forbruger
- [ ] Ingen jargon eller komplekse termer uden definition

### Data
- [ ] Alle priser i danske kr. (ikke EUR/USD)
- [ ] Format: "2.847 kr." eller "3,45 kr./kWh"
- [ ] Danske el-selskaber nævnt (Ørsted, Andel Energi, Ewii, osv.)
- [ ] DK1/DK2 geografi korrekt brugt
- [ ] Danske byer/regioner som eksempler

### Kilder
- [ ] Mindst 2 eksterne links til autoritative danske kilder:
  - Energinet.dk
  - Energitilsynet
  - Forsyningstilsynet
  - EnergiDataService API
  - Danmarks Statistik

---

## 🎯 SEO METADATA

### Title & Description
- [ ] **Title:** 50-60 characters
- [ ] **Title:** Inkluderer primært keyword
- [ ] **Title:** Inkluderer årstal (2025)
- [ ] **Meta Description:** 140-160 characters (strict!)
- [ ] **Meta Description:** Inkluderer primært keyword
- [ ] **Meta Description:** Har call-to-action element

### Keywords & Tags
- [ ] **Meta Keywords:** 5-8 keywords (array)
- [ ] **Meta Keywords:** Primary keyword er først
- [ ] **Meta Keywords:** Alle 100% dansk
- [ ] **Tags:** 5-7 tags
- [ ] **Tags:** Inkluderer "forbrugeragent" (hvis relevant)
- [ ] **Tags:** Alle lowercase

### Technical
- [ ] **Canonical URL:** Korrekt genereret
- [ ] **Category:** Matcher ARTICLE_TOPICS.json
- [ ] **Template:** Korrekt valgt (deep-dive/standard/comparison)
- [ ] **Slug:** URL-venlig og dansk
- [ ] **Word Count:** Korrekt talt
- [ ] **Reading Time:** Auto-beregnet (word_count / 250)

---

## 🔗 LINKS & CITATIONS

### Internal Links
- [ ] **Mindst 3 interne links** til:
  - Andre relevante artikler
  - ForbrugerAgent værktøjer (forbrug tracker, sammenligning)
  - Produktsider

### External Links
- [ ] **Mindst 2 eksterne links** til:
  - Energinet.dk (officiel el-net data)
  - Energitilsynet (regulering)
  - Forsyningstilsynet (forbrugerrettigheder)
  - EnergiDataService API (spotpriser)
  - Danmarks Statistik (forbrugstal)

### Link Quality
- [ ] Alle eksterne links er live (ikke broken)
- [ ] Eksterne links åbner i nyt vindue (if implemented)
- [ ] Anchor text er deskriptiv (ikke "klik her")

---

## 📊 DATA & RESEARCH

### Data Quality
- [ ] **Mindst 3 konkrete data points:**
  - Spotpriser (kr./kWh)
  - Gennemsnitligt forbrug (kWh/år)
  - Besparelses-eksempler (kr./år)
- [ ] Alle tal har kilder
- [ ] Data er aktuelt (2024-2025)
- [ ] Før/efter eksempler er realistiske

### Research Sources
- [ ] Research sources dokumenteret i frontmatter
- [ ] Research date logget
- [ ] Alle påstande kan verificeres

---

## 💡 TONE & VOICE

### ForbrugerAgent Voice
- [ ] **Hjælpsom** (ikke sælgende eller pushy)
- [ ] **Transparent** (intet skjult, alt forklaret)
- [ ] **Forbruger-First** (læserens fordel først)
- [ ] **Rolig energi** (ikke aggressive sales taktikker)

### Avoid These
- [ ] ❌ Ingen "Kun i dag!" eller "Skynd dig!"
- [ ] ❌ Ingen teknisk jargon uden forklaring
- [ ] ❌ Ingen skjulte omkostninger eller fine print
- [ ] ❌ Ingen favorisering af specifikke el-selskaber (med mindre data viser det)

---

## 🎨 VISUAL & STRUCTURE

### Readability
- [ ] Korte afsnit (max 3-4 linjer)
- [ ] Tydelige overskrifter (H2/H3)
- [ ] Bullet points for lister
- [ ] Tabeller for sammenligninger
- [ ] Highlight boxes for vigtig info

### Mobile Friendly
- [ ] Tekst læsbar på mobil (test preview)
- [ ] Tabeller scroller horisontalt hvis nødvendig
- [ ] Intet kræver desktop view

---

## 🚀 CALL-TO-ACTION

### CTA Quality
- [ ] **Klar CTA i konklusion:**
  - "Tjek dit forbrug her"
  - "Sammenlign el-selskaber nu"
  - "Start besparelse i dag"
- [ ] CTA er handlingsbar (læser ved præcist hvad de skal gøre)
- [ ] CTA linker til relevant værktøj eller side

---

## 🧪 TECHNICAL VALIDATION

### Frontmatter
- [ ] Alle required fields udfyldt:
  - title, slug, meta_description, meta_keywords
  - tags, category, author, status
  - priority, template, canonical_url
  - word_count, publish_date (if scheduling)

### Markdown Syntax
- [ ] Ingen formaterings-fejl (¶ symboler, broken links)
- [ ] Headers hierarchy korrekt (H1 → H2 → H3)
- [ ] Code blocks korrekt formateret (hvis relevant)
- [ ] Tabeller render korrekt

---

## 🌐 BROWSER TEST (Before Upload)

### Local Preview
- [ ] Article renders correctly på localhost
- [ ] Ingen visuelle bugs
- [ ] Tabeller vises korrekt
- [ ] Links virker
- [ ] Mobil view ser godt ud
- [ ] Hero image (hvis implementeret) loader

### SEO Preview
- [ ] Meta title vises korrekt i browser tab
- [ ] Meta description vises (if tool available)
- [ ] Canonical URL korrekt i source

---

## 📋 FINAL SIGN-OFF

### Before Upload
- [ ] Alle punkter ovenfor tjekket ✅
- [ ] Artikel saved til `drafts/[slug].md`
- [ ] Ready til upload via `save_article.py`

### After Upload
- [ ] Artikel synlig i database
- [ ] Preview URL virker
- [ ] SEO metadata korrekt i database
- [ ] Ready til schedule eller publish

---

## 🎯 SCORE YOUR ARTICLE (Optional)

**Give 1 point for each "Yes":**

### Content Quality (Max 10)
- [ ] Word count target met
- [ ] 1+ Named Framework
- [ ] 1+ Definition Box
- [ ] 3+ "Ifølge ForbrugerAgent" statements
- [ ] 1+ Data table/comparison
- [ ] 3+ Internal links
- [ ] 2+ External authoritative links
- [ ] Konkret før/efter eksempel
- [ ] Klar CTA
- [ ] 100% dansk sprog

### SEO Quality (Max 10)
- [ ] Title optimized (50-60 chars, keyword)
- [ ] Meta description optimized (140-160 chars)
- [ ] 5-8 relevant keywords
- [ ] 5-7 tags
- [ ] Category correct
- [ ] Template correct
- [ ] Canonical URL correct
- [ ] All links work
- [ ] Mobile friendly
- [ ] No technical errors

**Target Score:** 18-20 / 20 for excellent quality

---

## 🚀 IF CHECKLIST FAILS

**Missing requirements?**
1. Go back to article draft
2. Add missing elements
3. Re-run checklist
4. Do NOT upload until all critical items are ✅

**Critical items (MUST HAVE):**
- Word count minimum
- 1+ Named Framework
- 3+ Internal links
- 2+ External links
- Complete SEO metadata
- 100% dansk sprog
- Klar CTA

---

**Når alle punkter er ✅ → READY TO UPLOAD! 🚀**
