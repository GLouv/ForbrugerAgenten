# 🚀 PHASE 1: EXECUTION MASTER PLAN

**Goal:** Build "The Economic Bodyguard" (Identity, Mailbox, Upload, Support).
**Status:** 🔴 NOT STARTED

---

## 1. 🏗️ SYSTEM ARCHITECTURE (THE BLUEPRINT)

### A. Database Models (New Fields)
Vi skal sikre, at disse felter findes i databasen før vi koder logik.

**1. `User` (Identity)**
- `agent_email`: String (Unique, e.g., `peter.x92@agent.fa.dk`)
- `forward_marketing`: Boolean (Default: False)
- `forward_essential`: Boolean (Default: True)

**2. `Provider` (Scorecard)**
- `response_score`: Int (0-100)
- `avg_response_time_hours`: Float
- `is_slow_responder`: Boolean
- `support_email`: String

**3. `Contract` (The Asset)**
- `contract_file_url`: String (Link til PDF)
- `last_parsed_at`: DateTime

**4. `SupportTicket` (The Buffer)**
- `type`: Enum (Complaint, Switch, Question, Notice)
- `provider_status`: String

### B. Core Services (The Logic)
**1. `AgentMailService`**
- `generate_unique_email(name)`: Laver aliaset.
- `process_inbound_email(payload)`: Sorterer post (Regning vs. Spam).

**2. `BillParserService`**
- `parse_bill(file)`: Sender til GPT-4 Vision -> Returnerer JSON.

**3. `SupportService`**
- `nudge_providers()`: CRON job der rykker langsomme selskaber.

---

## 2. 📋 IMPLEMENTATION STEPS (THE PATH)

Vi bygger systemet i 4 "Batches". Vi færdiggør én batch 100% før vi går videre.

### 🏁 BATCH 1: THE IDENTITY (Start Here)
*Mål: Brugeren får sin unikke agent-mail.*

- [ ] **1.1 DB Update:** Tilføj `agent_email` og preferences til `User` model. Kør migration.
- [ ] **1.2 Service:** Implementer `generate_unique_email` logik (Unikheds-tjek).
- [ ] **1.3 API:** Opdater `/users/me` til at generere mail, hvis den mangler.
- [ ] **1.4 UI:** Vis mailen på Dashboardet med "Kopier" knap.

### 👁️ BATCH 2: THE EYES (DATA)
*Mål: Vi kan modtage en regning og forstå den.*

- [ ] **2.1 Service:** Implementer `BillParserService` (OpenAI integration).
- [ ] **2.2 API:** Byg `POST /upload/bill` endpoint.
- [ ] **2.3 UI:** Byg "Upload Regning" knap i Onboarding.
- [ ] **2.4 Logic:** Gem resultatet som en ny `Contract`.

### 📬 BATCH 3: THE MAILBOX (COMMUNICATION)
*Mål: Vi kan modtage post fra selskaberne.*

- [ ] **3.1 Infra:** Opsæt Webhook endpoint `POST /webhooks/inbound-email`.
- [ ] **3.2 Logic:** Implementer sorterings-logik (Regning vs. Velkomst vs. Spam).
- [ ] **3.3 Trigger:** Hvis "Velkomstmail" -> Sæt Kontrakt til "Aktiv".

### 🛡️ BATCH 4: THE BODYGUARD (CONTROL)
*Mål: Support og Admin styring.*

- [ ] **4.1 DB Update:** Opdater `Provider` med scorecard felter.
- [ ] **4.2 Cron:** Byg "Nudge Bot" (Dag 3/7 rykker logic).
- [ ] **4.3 UI:** Byg "Activity Feed" på Dashboardet.

---

## 3. 🚦 HVORDAN KOMMER VI I GANG?

Vi starter med **Step 1.1**.
Uden databasen på plads, kan vi intet bygge.

**Er du klar til at jeg udfører Step 1.1?**
*(Tilføjer felter til `User` model og kører migration)*





