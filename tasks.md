# 🔨 IMPLEMENTATION TASKS: PHASE 1 (THE HUNTER)

Denne fil styrer implementeringen af `plans/PHASE_1_BLUEPRINT.md`.
Hvert punkt repræsenterer en konkret handling i koden.

---

## 📦 BATCH 1: THE IDENTITY & CORE MODELS
*Mål: Fundamentet. Brugeren har en agent-mail, og databasen er opdateret til alle features.*

### 1.1 Database Schema Updates (Pre-requisite)
- [ ] **Model Update (`Contract`):** Tilføj `contract_file_url` (String) og `last_parsed_at` (DateTime).
- [ ] **Model Update (`SupportTicket`):** Tilføj `type` (Enum: complaint, switch_request, question, system_notice).
- [ ] **Migration:** Kør Alembic migration for at opdatere DB med `User`, `Provider`, `Contract`, `SupportTicket` ændringer.

### 1.2 Agent Email Logic
- [ ] **Backend:** Færdiggør `generate_unique_email` i `AgentMailService` (Navne-rensning + Unikhedstjek).
- [ ] **API:** Opdater `POST /users` (Signup) og `GET /users/me` til at kalde generatoren, hvis `agent_email` mangler.
- [ ] **Frontend:** Opdater `Dashboard/page.tsx` til at vise `user.agent_email` med en "Kopier" knap.
- [ ] **Frontend:** Tilføj "Indstillinger" toggle for `forward_marketing` og `forward_essential`.

---

## 📦 BATCH 2: THE EYES (DATA COLLECTION)
*Mål: Få data ind. Upload og Takeover.*

### 2.1 Bill Parser Engine
- [ ] **Service:** Implementer `BillParserService` med OpenAI Vision API integration.
- [ ] **Prompt Engineering:** Design system-prompt til at udtrække: Provider, Price, Specs.
- [ ] **Data Logic:** Lav `upsert_contract_from_parser` metode (Opdater eksisterende vs. Opret ny).

### 2.2 API & Frontend
- [ ] **API:** Opret `POST /api/v1/upload/bill`. Skal håndtere fil-upload -> Parser -> DB Save.
- [ ] **Frontend:** Byg "Dropzone" komponent i Onboarding flowet.
- [ ] **Frontend:** Byg "Upload Regning" knap i Dashboardet (til løbende opdatering).

### 2.3 Takeover Mail Logic
- [ ] **Service:** Implementer `send_takeover_request(user, provider)` i `EmailService`.
- [ ] **Template:** Design HTML-mail til selskaber ("Ændring af kontaktinfo").
- [ ] **Trigger:** Forbindes til Onboarding/MitID flowet.

---

## 📦 BATCH 3: THE BRAIN (DIGITAL MAILBOX)
*Mål: Modtagelse og sortering af post.*

### 3.1 Infrastructure & Webhook
- [ ] **Config:** Opsæt DNS records (MX) for `agent.forbrugeragenten.dk` (Manual task).
- [ ] **API:** Opret `POST /api/v1/webhooks/email` (Sikret med API Key/Signature).

### 3.2 The Sorting Hat (AI Logic)
- [ ] **Service:** Implementer `process_inbound_email` i `AgentMailService`.
- [ ] **AI Logic:** Implementer 4 scenarier:
    - **Welcome:** Trigger `contract.status = active` + User Notification.
    - **Bill:** Trigger `BillParserService` + User Notification.
    - **Warning:** Trigger `SupportTicket.create` + User Notification.
    - **Spam:** Check `user.forward_marketing`. Slet/Forward.

---

## 📦 BATCH 4: THE INTERFACE (BODYGUARD UI)
*Mål: Transparens for kunden.*

### 4.1 Activity Feed
- [ ] **Backend:** Opret `ActivityService`. Skal aggregere:
    - `EmailLog` (Outbound/Inbound).
    - `SupportTicket` (Beskeder/Status ændringer).
    - `Contract` (Status ændringer).
- [ ] **API:** Opret `GET /api/v1/activity`.
- [ ] **Frontend:** Byg "Timeline" komponent på Dashboardet.

### 4.2 Support System
- [ ] **API:** Opret CRUD endpoints for `SupportTicket`.
- [ ] **Frontend:** Byg Chat-interface ("Bufferen") integreret i Dashboardet.

---

## 📦 BATCH 5: THE CONTROL TOWER (ADMIN)
*Mål: Styring og Automatisering.*

### 5.1 Admin Dashboard
- [ ] **API:** Opret `GET /api/v1/admin/queues` (Unanswered tickets).
- [ ] **API:** Opret `GET /api/v1/admin/scorecards` (Provider stats).
- [ ] **Frontend:** Opret `/admin` side med oversigt.

### 5.2 The Nudge Bot (Automation)
- [ ] **Backend:** Opret `cron_jobs.py`.
- [ ] **Logic:** Implementer "Dag 3 Reminder" og "Dag 7 Warning" logik.
- [ ] **Integration:** Forbind til `EmailService` for at sende rykkere.

---

*Husk: Kør `./restart.sh` og test efter hver Batch.*




