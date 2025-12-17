# 🏗️ PHASE 1: THE HUNTER - COMPREHENSIVE SYSTEM BLUEPRINT
**Version:** 2.0 (FINAL MASTER)
**Date:** 2025-10-10
**Goal:** Build the "Economic Bodyguard" platform.
**Strategy:** Aggregator (Volume & Pressure) + Middleman (Infrastructure).

---

## 1. 🗄️ DATABASE ARCHITECTURE (DETAILED)

### 👤 `User` (The Identity)
*Formål: Central identitet og præferencer.*
- `id`: UUID (PK)
- `email`: String (Login)
- `agent_email`: String (Unique Alias: `peter.hansen.x92@agent.fa.dk`) **[CRITICAL]**
- `forward_marketing`: Boolean (Default: False) - "Skal vi sortere spam fra?"
- `forward_essential`: Boolean (Default: True) - "Skal vi videresende regninger?"
- `mitid_verified`: Boolean - "Har vi fuldmagt?"
- `cpr_number`: Encrypted String - Krævet til opsigelser.

### 🏢 `Provider` (The Target)
*Formål: Styring af selskaberne.*
- `name`: String ("Norlys")
- `quote_email`: String (Indgang til salg)
- `support_email`: String (Indgang til klager)
- **Scorecard Metrics:**
    - `response_score`: Int (0-100)
    - `avg_response_time_hours`: Float
    - `is_slow_responder`: Boolean (Triggered by auto-nudge logic)
    - `admin_notes`: Text ("Kræver kunde-login", "Svarer aldrig")

### 📄 `Contract` (The Asset)
*Formål: Det vi optimerer.*
- `user_id`: UUID
- `category`: Enum (Energy, Mobile, Internet)
- `provider_id`: UUID
- `status`: Enum (Active, Pending_Switch, Cancelled, Unknown)
- `monthly_price`: Decimal
- `specs`: JSONB (`{ "data": "100GB", "speed": "1000/1000" }`)
- `contract_file_url`: String (Link til uploadet PDF)
- `last_parsed_at`: DateTime

### 🎫 `SupportTicket` (The Buffer)
*Formål: Kundeservice og kommunikation.*
- `user_id`: UUID
- `contract_id`: UUID (Optional)
- `type`: Enum (Complaint, Switch_Request, Question, System_Notice)
- `status`: Enum (Open, Waiting_Provider, Waiting_User, Resolved)
- `provider_status`: String (Tracking af selskabets svar)
- `internal_priority`: Enum (Low, Normal, Urgent)

---

## 2. 🧠 BUSINESS LOGIC & AUTOMATION (THE BRAIN)

### 📬 2.1 The Digital Mailbox (Inbound Logic)
*Trigger: Webhook fra SendGrid (`POST /webhooks/inbound-email`)*

**Process Flow:**
1.  **Identify:** Find `User` baseret på `to_address` (`peter...x92@agent...`).
2.  **Analyze (AI):** GPT-4 klassificerer mailen:
    - **Scenario A: "Velkommen / Ordrebekræftelse"**
        - *Action:* Marker relateret `Contract` som `Active`.
        - *Notify:* "Tillykke! Dit skift til [Selskab] er gået igennem."
        - *Log:* Activity Feed update.
    - **Scenario B: "Faktura / Regning"**
        - *Action:* Parse PDF -> Opdater `Contract.monthly_price` + `Contract.specs`.
        - *Notify:* "Ny regning registreret: [Pris] kr."
        - *Forward:* Hvis `forward_essential` = True -> Send til brugers private mail.
    - **Scenario C: "Varsling / Prisstigning"**
        - *Action:* Opret `SupportTicket` (Type: System_Notice).
        - *Notify:* "VIGTIGT: [Selskab] varsler prisstigning. Vi kigger på det."
    - **Scenario D: "Spam / Nyhedsbrev"**
        - *Action:* Hvis `forward_marketing` = True -> Forward. Ellers Slet.

### 🤖 2.2 The Nudge Bot (Admin Automation)
*Trigger: Dagligt CRON job (kl. 10:00)*

**Logic:**
For hver `SupportTicket` eller `QuoteRequest` med status `Waiting_Provider`:
1.  **Dag 3 (The Gentle Nudge):**
    - *Action:* Send "Reminder Mail" til selskabet.
    - *Template:* "Hej [Selskab], vi afventer stadig svar vedr. kunde [Navn]. Mvh ForbrugerAgenten."
    - *Log:* Activity Feed: "Vi har rykket [Selskab]."
2.  **Dag 7 (The Warning):**
    - *Action:* Send "Warning Mail".
    - *Template:* "Hej, I har ikke svaret i 7 dage. Det noteres i vores system som 'Dårlig Service'."
    - *System Update:* Sæt `Provider.is_slow_responder = True`. Sænk `response_score`.
3.  **Dag 10 (The User Alert):**
    - *Action:* Notificer brugeren.
    - *Message:* "[Selskab] svarer ikke. Det er dårlig stil. Vi anbefaler at skifte væk."
    - *Offer:* Vis alternativt tilbud.

---

## 3. 🛡️ TAKEOVER & SWITCH FLOWS (STRATEGY)

### 3.1 The "Takeover" (Onboarding)
*Mål: At tvinge selskabet til at bruge vores agent-mail.*

1.  **User Action:** Onboarding -> Vælger "Norlys" -> Signerer Generel Fuldmagt (MitID).
2.  **System Action:**
    - Generer PDF: "Fuldmagt til Data & Kommunikation".
    - Sender Mail til Norlys (`support_email`):
        - *Subject:* "Ændring af kontaktinfo: Kunde [CPR]"
        - *Body:* "På vegne af kunden, skift venligst kontakt-email til [agent_email] og fremsend al fremtidig korrespondance hertil."
        - *Attach:* MitID-signeret PDF.

### 3.2 The "Perfect Switch"
*Mål: At flytte kunden.*

1.  **User Action:** Accepterer tilbud fra "Fastspeed".
2.  **System Logic:**
    - **Scenario A (Partner Link):** Redirect til Fastspeeds signup flow (via tracking link).
    - **Scenario B (Manual/Fuldmagt):**
        - System genererer opsigelses-mail til Gammelt Selskab.
        - System genererer oprettelses-mail til Nyt Selskab (med data fra `Contract`).
        - *Note:* Dette flow bruges kun, hvis API/Link ikke er muligt.

---

## 4. 🔌 API ENDPOINTS (SPECIFICATION)

### Core
- `GET /users/me` (Auto-creates agent_email if missing)
- `POST /users/onboarding` (Category selection + Takeover trigger)

### Data Collection
- `POST /upload/bill` (Multipart/form-data -> AI Parser -> JSON)
- `POST /contracts/manual` (Hvis kunden taster selv)

### Communication
- `POST /webhooks/inbound-email` (SendGrid Payload)
- `GET /activity` (Aggregated Timeline: Mails, Tickets, System Events)
- `POST /support/tickets` (User creates complaint)
- `POST /support/tickets/{id}/message` (Chat)

### Admin / Provider
- `GET /admin/queues` (Sager der venter på svar)
- `GET /admin/providers/scorecard` (Performance stats)

---

## 5. ⚠️ EDGE CASES & HANDLING

1.  **"Kunden Ukendt" (Selskab svarer):**
    - *System:* AI ser "ukendt kunde" eller "kundenummer mangler" i svar-mail.
    - *Action:* Opret `SupportTicket` til bruger: "Selskabet kan ikke finde dig. Upload venligst billede af regning med kundenummer."
2.  **"Kræver Login" (Selskab afviser mail):**
    - *System:* AI ser "Log ind på MitTelenor" i svar.
    - *Action:* Flag Provider som `requires_login_scraping` (Til Fase 2). Notificer bruger manuelt.
3.  **Spam-filter Blokering:**
    - *System:* SendGrid webhook reporterer "Bounced".
    - *Action:* Admin Alert! Vi skal skifte IP eller kontakte selskabet.

---

**Dette er den komplette plan.**
Den dækker strategi, teknik, automation og "hvad nu hvis".

Er vi enige om, at dette dokument nu er **fyldestgørende** nok til at bygge efter?





