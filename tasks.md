# 🔨 IMPLEMENTATION TASKS: PHASE 1 (THE HUNTER)

**Projekt:** `/forbrugeragenten` (Master projekt)  
**Database:** PostgreSQL på Railway  
**Frontend:** Next.js i `/forbrugeragenten/frontend`  
**Backend:** FastAPI i `/forbrugeragenten/backend`

Denne fil styrer implementeringen af `plans/PHASE_1_BLUEPRINT.md`.
Hvert punkt repræsenterer en konkret handling i koden.

---

## 📦 BATCH 1: THE IDENTITY & CORE MODELS
*Mål: Fundamentet. Brugeren har en agent-mail, og databasen er opdateret til alle features.*

### 1.1 Database Schema Updates (Pre-requisite)
- [x] **Model Update (`Contract`):** Tilføj `contract_file_url` (String) og `last_parsed_at` (DateTime).
  - Location: `/forbrugeragenten/backend/app/models/contract.py`
- [x] **Model Update (`SupportTicket`):** Tilføj `type` (Enum: complaint, switch_request, question, system_notice).
  - Location: `/forbrugeragenten/backend/app/models/support.py`
- [x] **Migration:** Kør SQL migration for at opdatere DB.
  - File: `/forbrugeragenten/backend/migrations/000_create_missing_tables.sql` ✅ DONE
  - Verified: `contracts.contract_file_url`, `contracts.last_parsed_at`, `support_tickets.type` ✅

### 1.2 Agent Email Logic
- [x] **Backend:** Færdiggør `generate_unique_email` in `AgentMailService` (Navne-rensning + Unikhedstjek).
  - Location: `/forbrugeragenten/backend/app/services/agent_mail_service.py` ✅
- [x] **API:** Opdater `POST /users` (Signup) og `GET /users/me` til at kalde generatoren, hvis `agent_email` mangler.
  - Location: `/forbrugeragenten/backend/app/api/v1/endpoints/auth.py` ✅
  - Signup: Auto-generates agent_email when creating new user ✅
  - GET /me: Auto-generates agent_email if missing ✅
- [ ] **Frontend:** Opdater `Dashboard/page.tsx` til at vise `user.agent_email` med en "Kopier" knap.
  - Location: `/forbrugeragenten/frontend/src/app/dashboard/page.tsx`
- [ ] **Frontend:** Tilføj "Indstillinger" toggle for `forward_marketing` og `forward_essential`.
  - Location: `/forbrugeragenten/frontend/src/app/settings/page.tsx` (skal laves)

---

## 📦 BATCH 2: THE EYES (DATA COLLECTION)
*Mål: Få data ind. Upload og Takeover.*

### 2.1 Bill Parser Engine
- [x] **Service:** Implementer `BillParserService` med OpenAI Vision API integration.
  - Location: `/forbrugeragenten/backend/app/services/bill_parser_service.py` ✅ EKSISTERER
- [x] **Prompt Engineering:** Design system-prompt til at udtrække: Provider, Price, Specs.
  - Location: `bill_parser_service.py` linje 43-57 ✅ DONE
- [x] **Data Logic:** Lav `upsert_contract_from_parser` metode (Opdater eksisterende vs. Opret ny).
  - Location: `bill_parser_service.py` linje 88-116 ✅ DONE

### 2.2 API & Frontend
- [x] **API:** Opret `POST /api/v1/upload/bill`. Skal håndtere fil-upload -> Parser -> DB Save.
  - Location: `/forbrugeragenten/backend/app/api/v1/endpoints/upload.py` ✅ DONE
  - Integration: Brug `BillParserService.parse_bill()` og `create_contract_from_bill()` ✅
  - Additional endpoints: `GET /upload/contracts`, `GET /upload/contracts/{id}` ✅
  - Features: File validation (type, size), AI parsing, contract creation ✅
- [ ] **Frontend:** Byg "Dropzone" komponent i Onboarding flowet.
  - Location: `/forbrugeragenten/frontend/src/components/Dropzone.tsx` (skal laves)
- [ ] **Frontend:** Byg "Upload Regning" knap i Dashboardet (til løbende opdatering).
  - Location: `/forbrugeragenten/frontend/src/app/dashboard/page.tsx`

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
- [x] **Service:** Implementer `process_inbound_email` i `AgentMailService`.
  - Location: `/forbrugeragenten/backend/app/services/agent_mail_service.py` ✅ EKSISTERER
- [x] **AI Logic:** Implementer 4 scenarier:
    - **Welcome:** Trigger `contract.status = active` + User Notification. ✅ Linje 156-162
    - **Bill:** Trigger `BillParserService` + User Notification. ✅ Linje 164-167
    - **Warning:** Trigger `SupportTicket.create` + User Notification. ✅ Linje 169-180
    - **Spam:** Check `user.forward_marketing`. Slet/Forward. ✅ Linje 182-191

---

## 📦 BATCH 4: THE INTERFACE (BODYGUARD UI)
*Mål: Transparens for kunden.*

### 4.1 Activity Feed
- [x] **Backend:** Opret `ActivityService`. Skal aggregere:
    - `EmailLog` (Outbound/Inbound).
    - `SupportTicket` (Beskeder/Status ændringer).
    - `Contract` (Status ændringer).
  - Location: `/forbrugeragenten/backend/app/services/support_service.py` ✅ get_activity_feed() metode
- [x] **API:** Opret `GET /api/v1/activity`.
  - Location: `/forbrugeragenten/backend/app/api/v1/endpoints/activity.py` ✅ EKSISTERER
- [ ] **Frontend:** Byg "Timeline" komponent på Dashboardet.
  - Location: `/forbrugeragenten/frontend/src/components/ActivityTimeline.tsx` (skal laves)

### 4.2 Support System
- [x] **API:** Opret CRUD endpoints for `SupportTicket`.
  - Location: `/forbrugeragenten/backend/app/api/v1/endpoints/support.py` ✅ EKSISTERER
- [ ] **Frontend:** Byg Chat-interface ("Bufferen") integreret i Dashboardet.
  - Location: `/forbrugeragenten/frontend/src/components/SupportChat.tsx` (skal laves)

---

## 📦 BATCH 5: THE CONTROL TOWER (ADMIN)
*Mål: Styring og Automatisering.*

### 5.1 Admin Dashboard
- [x] **API:** Opret `GET /api/v1/admin/queues` (Unanswered tickets).
  - Location: `/forbrugeragenten/backend/app/api/v1/endpoints/admin/dashboard.py` ✅ EKSISTERER
- [x] **API:** Opret `GET /api/v1/admin/scorecards` (Provider stats).
  - Location: `/forbrugeragenten/backend/app/api/v1/endpoints/admin/providers.py` ✅ EKSISTERER
- [x] **Frontend:** Opret `/admin` side med oversigt.
  - Location: `/forbrugeragenten/frontend/src/app/admin/` ✅ EKSISTERER (komplet admin panel)

### 5.2 The Nudge Bot (Automation)
- [ ] **Backend:** Opret `cron_jobs.py`.
- [ ] **Logic:** Implementer "Dag 3 Reminder" og "Dag 7 Warning" logik.
- [ ] **Integration:** Forbind til `EmailService` for at sende rykkere.

---

*Husk: Kør `./restart.sh` og test efter hver Batch.*





