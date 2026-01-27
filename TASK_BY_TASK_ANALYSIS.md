# 📋 TASK-BY-TASK ANALYSE: Hvad er lavet vs. Hvad mangler

**Dato:** 2025-12-17  
**Kilde:** `tasks.md` + Kodebase analyse

---

## 📦 BATCH 1: THE IDENTITY & CORE MODELS

### ✅ 1.1 Database Schema Updates (KOMPLET)

| Task | Status | Location | Notes |
|------|--------|----------|-------|
| Model Update: Contract.contract_file_url | ✅ DONE | `/forsikringsagenten/backend/app/models/contract.py` | Tilføjet linje 47 |
| Model Update: Contract.last_parsed_at | ✅ DONE | `/forsikringsagenten/backend/app/models/contract.py` | Tilføjet linje 48 |
| Model Update: SupportTicket.type enum | ✅ DONE | `/forsikringsagenten/backend/app/models/support.py` | TicketType enum + type column |
| Migration: Alembic setup | ✅ DONE | `/forsikringsagenten/backend/alembic/` | Alembic initialiseret |
| Migration: SQL execution | ✅ DONE | Database | Felter tilføjet via SQL |

**Verification:**
```sql
-- Verified in PostgreSQL:
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'contracts' AND column_name IN ('contract_file_url', 'last_parsed_at');
-- Result: Both columns exist ✅

SELECT column_name FROM information_schema.columns 
WHERE table_name = 'support_tickets' AND column_name = 'type';
-- Result: Column exists with tickettype enum ✅
```

---

### ⚠️ 1.2 Agent Email Logic (DELVIST)

| Task | Status | Location | Notes |
|------|--------|----------|-------|
| Backend: generate_unique_email | ✅ DONE | `/forsikringsagenten/backend/app/services/agent_mail_service.py` | Komplet med Danish character handling |
| API: POST /users (Signup) | ⚠️ EXISTS | `/forbrugeragenten/backend/app/api/v1/endpoints/users.py` | Skal kopieres til /forsikringsagenten |
| API: GET /users/me | ⚠️ EXISTS | `/forbrugeragenten/backend/app/api/v1/endpoints/users.py` | Skal kopieres til /forsikringsagenten |
| Frontend: Dashboard agent_email display | ❌ MISSING | N/A | Skal bygges fra scratch |
| Frontend: Indstillinger toggles | ❌ MISSING | N/A | Skal bygges fra scratch |

**Hvad skal gøres:**
1. Kopier `/forbrugeragenten/backend/app/api/v1/endpoints/users.py` til `/forsikringsagenten`
2. Opdater endpoint til at kalde `agent_mail_service.generate_unique_email()` hvis `agent_email` mangler
3. Byg Dashboard frontend komponent
4. Byg Settings komponent

---

## 📦 BATCH 2: THE EYES (DATA COLLECTION)

### ⚠️ 2.1 Bill Parser Engine (SERVICE KLAR)

| Task | Status | Location | Notes |
|------|--------|----------|-------|
| Service: BillParserService | ✅ EXISTS | `/forbrugeragenten/backend/app/services/bill_parser_service.py` | Komplet med GPT-4o Vision |
| Prompt Engineering | ✅ DONE | bill_parser_service.py linje 43-57 | Extraherer provider, price, specs |
| Data Logic: upsert_contract | ✅ DONE | bill_parser_service.py linje 88-116 | create_contract_from_bill metode |

**Verification:**
```python
# BillParserService har:
- parse_bill(file_content, file_type) -> dict
- create_contract_from_bill(db, user_id, parsed_data) -> Contract
# ✅ Komplet implementeret
```

---

### ❌ 2.2 API & Frontend (MANGLER)

| Task | Status | Location | Notes |
|------|--------|----------|-------|
| API: POST /upload/bill | ❌ MISSING | N/A | Endpoint skal laves |
| Frontend: Dropzone komponent | ❌ MISSING | N/A | Skal bygges |
| Frontend: Upload knap i Dashboard | ❌ MISSING | N/A | Skal bygges |

**Hvad skal gøres:**
1. Lav endpoint i `/forsikringsagenten/backend/app/api/v1/endpoints/upload.py`
2. Integrer med BillParserService
3. Byg Dropzone React komponent med file upload
4. Test med rigtig regningsbillede

---

### ❌ 2.3 Takeover Mail Logic (MANGLER)

| Task | Status | Location | Notes |
|------|--------|----------|-------|
| Service: send_takeover_request | ❌ MISSING | N/A | Skal implementeres i EmailService |
| Template: HTML-mail | ❌ MISSING | N/A | Skal designes |
| Trigger: Onboarding flow | ❌ MISSING | N/A | Onboarding endpoint mangler |

**Hvad skal gøres:**
1. Design HTML email template for "Ændring af kontaktinfo"
2. Implementer send_takeover_request() metode
3. Integrer med onboarding flow

---

## 📦 BATCH 3: THE BRAIN (DIGITAL MAILBOX)

### ⚠️ 3.1 Infrastructure & Webhook (DELVIST)

| Task | Status | Location | Notes |
|------|--------|----------|-------|
| Config: DNS MX Records | ❌ MANUAL | N/A | Skal sættes op i DNS provider |
| API: POST /webhooks/email | ✅ EXISTS | `/forbrugeragenten/backend/app/api/v1/endpoints/webhooks.py` | Skal kopieres |

---

### ✅ 3.2 The Sorting Hat (KOMPLET I KODE)

| Task | Status | Location | Notes |
|------|--------|----------|-------|
| Service: process_inbound_email | ✅ DONE | `/forsikringsagenten/backend/app/services/agent_mail_service.py` | Linje 111-194 |
| AI Logic: Welcome scenario | ✅ DONE | agent_mail_service.py linje 156-162 | Aktiverer contract |
| AI Logic: Bill scenario | ✅ DONE | agent_mail_service.py linje 164-167 | Parser regning |
| AI Logic: Warning scenario | ✅ DONE | agent_mail_service.py linje 169-180 | Opretter ticket |
| AI Logic: Spam scenario | ✅ DONE | agent_mail_service.py linje 182-191 | Forwarding logic |

**Verification:**
```python
# AgentMailService.process_inbound_email() har:
- User identification ✅
- Email classification via GPT-4o-mini ✅
- 4 scenario handlers ✅
- Forwarding logic ✅
```

---

## 📦 BATCH 4: THE INTERFACE (BODYGUARD UI)

### ✅ 4.1 Activity Feed (BACKEND KLAR)

| Task | Status | Location | Notes |
|------|--------|----------|-------|
| Backend: ActivityService | ✅ EXISTS | `/forbrugeragenten/backend/app/services/support_service.py` | get_activity_feed() metode |
| API: GET /activity | ✅ EXISTS | `/forbrugeragenten/backend/app/api/v1/endpoints/activity.py` | Komplet endpoint |
| Frontend: Timeline komponent | ❌ MISSING | N/A | Skal bygges |

---

### ⚠️ 4.2 Support System (BACKEND KLAR)

| Task | Status | Location | Notes |
|------|--------|----------|-------|
| API: CRUD endpoints | ✅ EXISTS | `/forbrugeragenten/backend/app/api/v1/endpoints/support.py` | GET, POST, PATCH |
| Frontend: Chat interface | ❌ MISSING | N/A | Skal bygges |

---

## 📦 BATCH 5: THE CONTROL TOWER (ADMIN)

### ⚠️ 5.1 Admin Dashboard (DELVIST)

| Task | Status | Location | Notes |
|------|--------|----------|-------|
| API: GET /admin/queues | ✅ EXISTS | `/forbrugeragenten/backend/app/api/v1/endpoints/admin/dashboard.py` | Linje 15-30 |
| API: GET /admin/scorecards | ✅ EXISTS | `/forbrugeragenten/backend/app/api/v1/endpoints/admin/providers.py` | Provider stats |
| Frontend: /admin side | ⚠️ EXISTS | `/forbrugeragenten/frontend/src/app/admin/` | Komplet admin panel |

---

### ❌ 5.2 The Nudge Bot (MANGLER)

| Task | Status | Location | Notes |
|------|--------|----------|-------|
| Backend: cron_jobs.py | ❌ MISSING | N/A | Skal laves fra scratch |
| Logic: Dag 3 Reminder | ❌ MISSING | N/A | Skal implementeres |
| Logic: Dag 7 Warning | ❌ MISSING | N/A | Skal implementeres |
| Integration: EmailService | ⚠️ PARTIAL | EmailSender eksisterer | Skal udvides |

---

## 📊 SAMLET COMPLETION STATUS

| Batch | Backend | API | Frontend | Total |
|-------|---------|-----|----------|-------|
| **BATCH 1** | 95% | 50% | 0% | **48%** |
| **BATCH 2** | 60% | 20% | 0% | **27%** |
| **BATCH 3** | 80% | 50% | 0% | **43%** |
| **BATCH 4** | 100% | 100% | 0% | **67%** |
| **BATCH 5** | 40% | 80% | 50% | **57%** |

**TOTAL PROJEKT:** ~**44% færdig**

---

## 🚀 ANBEFALET HANDLINGSPLAN

### FASE 1: Konsolidering (1-2 timer)
1. Beslut hvilket projekt der er "master" (/forsikringsagenten anbefales)
2. Kopier alle manglende services og endpoints
3. Opdater router.py med alle endpoints
4. Test at backend starter uden fejl

### FASE 2: Færdiggør BATCH 1 (2-3 timer)
1. Implementer user signup endpoint med agent_email generation
2. Test API endpoints
3. Byg basis Dashboard frontend

### FASE 3: BATCH 2 Implementation (3-4 timer)
1. Lav upload endpoint
2. Byg Dropzone komponent
3. Test med rigtig regning

### FASE 4: BATCH 3-5 (5-8 timer)
1. Setup webhook endpoint
2. Byg admin panel
3. Implementer cron jobs

**TOTAL ESTIMERET TID:** 11-17 timer til komplet Phase 1.

---

## ❓ BESLUTNING PÅKRÆVET

**Hvad vil du?**

A. Konsolider til `/forsikringsagenten` og fortsæt der? (ANBEFALET)
B. Fortsæt i `/forbrugeragenten` og ignorer `/forsikringsagenten`?
C. Noget helt tredje?



