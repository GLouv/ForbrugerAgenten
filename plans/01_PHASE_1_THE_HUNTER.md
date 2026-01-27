# 🏗️ PHASE 1: THE HUNTER - BUILD PLAN

**Status:** 🚀 READY TO BUILD
**Mål:** Lancer Unified Platform med Digital Mailbox, Upload, Admin Control Tower og MitID.

---

## 🧩 1. UNIFIED CORE & AUTH (FUNDAMENT)
*Status: 85% Færdig*
- [ ] **Auth0 Setup:** Sikre login virker fejlfrit.
- [ ] **Unified Onboarding:** Flowet hvor brugeren vælger kategorier.
- [ ] **Agent Email Generation:** Generer unikke emails (`klaus.x92@agent.fa.dk`) ved signup i `User` modellen.

---

## 📬 2. THE DIGITAL MAILBOX (INBOUND BUFFER)
*Status: Strategisk Kerne*

Vi agerer mellemmand. Vi modtager posten, sorterer den, og viser kunden resultatet.

**Implementation:**
- [ ] **DNS:** MX Records peger på vores mail-provider.
- [ ] **Inbound Webhook:** `POST /webhooks/inbound-email`.
- [ ] **AI Sortering (The Brain):**
    - **Welcome/Confirmation:** -> Marker kontrakt som "Active" -> Notificer bruger: "Tillykke, skiftet er gået igennem!".
    - **Bill/Invoice:** -> Parse data -> Opdater statistik -> Notificer bruger.
    - **Warning/Notice:** -> Opret `SupportTicket` -> Notificer bruger.
    - **Spam/Marketing:** -> Tjek `user.forward_marketing_emails`. Slet eller videresend.

---

## 📄 3. DATA COLLECTION & TAKEOVER
*Status: "Brute Force" tilgangen*

**Strategi:** Vi overtager kommunikationen via mail.
- [ ] **Upload Endpoint:** `POST /upload/bill` (til historisk data).
- [ ] **Takeover Mail:** Når bruger signer fuldmagt -> Send mail til selskab: *"Skift kontakt-email til [agent-mail] og send fremtidige regninger hertil."*

---

## 🛡️ 4. SUPPORT, ADMIN & AUTOMATION
*Status: "The Control Tower"*

Vi skal styre kaosset og presse selskaberne.

**Admin Dashboard:**
- [ ] **Provider Scorecard:** Visning af "Leads Sent" vs "Response Time".
- [ ] **Bad Service Flag:** Manuel/Auto markering af langsomme selskaber.
- [ ] **Queue View:** Liste over sager der afventer svar fra selskab.

**Automation (The Nudge):**
- [ ] **CRON Job:** Kører hver nat. Update `Provider.avg_response_time`.
- [ ] **Logic:**
    - Dag 3 uden svar: Send venlig rykker.
    - Dag 7 uden svar: Send "Advarsel" rykker + Sæt `is_slow_responder = True`.
    - Dag 10 uden svar: Notificer bruger -> "De svarer ikke. Skal vi skifte dig til en anden?"

---

## 🔐 5. THE PERFECT SWITCH (MITID)
*Status: Skal designes*

- [ ] Integration med Criipto (MitID).
- [ ] **Switch Flow:**
    - Scenario A (Link): Redirect til selskab.
    - Scenario B (Fuldmagt): Vi sender opsigelse/oprettelse via mail.

---

## ✅ READY TO MERGE CHECKLIST

**Dependencies:**
- [x] `weasyprint` (PDF)
- [x] `openai` (AI Parsing)
- [x] `resend` / `sendgrid` (Email)

**Services (Skeletons Created):**
- [x] `backend/app/services/agent_mail_service.py`
- [x] `backend/app/services/bill_parser_service.py`
- [x] `backend/app/services/contract_generator.py`
- [x] `backend/app/services/support_service.py`

**Environment Variables (.env) Needed:**
- `OPENAI_API_KEY`: For parsing.
- `SENDGRID_API_KEY`: For inbound mail.
- `CRIIPTO_CLIENT_ID`: For MitID.
- `AGENT_EMAIL_DOMAIN`: Fx `agent.forbrugeragenten.dk`.

---

## 🗓️ SPRINT PLAN (RÆKKEFØLGE)

1.  **Agent Email Logic:** Implementer generering af unikke emails (`AgentMailService`).
2.  **User Update:** Sørg for at nye brugere får en mail ved signup.
3.  **Upload & Parse:** Byg AI-motoren til regninger.
4.  **Admin Nudge Bot:** Byg rykker-automatiseringen.







