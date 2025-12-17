# 🏁 COMPLETE STAGE VIEW: PHASE 1 (THE HUNTER)

Dette dokument er den **eneste sandhed** om projektets status.
Vi er først færdige med Fase 1, når alle bokse herunder er 🟢.

---

## 👤 1. THE IDENTITY (DIGITALT JEG)
*Fundamentet for at agere på kundens vegne.*

| Feature | Definition of Done (Krav) | Status |
| :--- | :--- | :--- |
| **Agent Email Gen** | Systemet tildeler automatisk `navn.suffix@agent.fa.dk` til alle brugere. | 🟢 |
| **User Prefs** | Bruger kan toggle "Videresend Spam" (False) og "Videresend Regninger" (True). | 🟢 |
| **Dashboard Display** | Bruger kan se sin Agent Email og kopiere den med ét klik. | 🟢 |

---

## 📬 2. THE DIGITAL MAILBOX (INDGANGEN)
*Evnen til at modtage og sortere post fra selskaberne.*

| Feature | Definition of Done (Krav) | Status |
| :--- | :--- | :--- |
| **Inbound Webhook** | Serveren modtager mails fra SendGrid/Resend uden fejl. | 🟢 |
| **AI "The Brain"** | AI skelner korrekt mellem: Regning, Velkomst, Varsling, Spam. | 🟢 |
| **Auto-Forwarding** | Mails videresendes til brugers private mail baseret på regler. | 🟢 |
| **Success Trigger** | "Velkomstmail" fra selskab -> Kontrakt skifter automatisk til `Active`. | 🟢 |

---

## 📄 3. DATA COLLECTION (JÆGEREN)
*Indsamling af ammunition (data).*

| Feature | Definition of Done (Krav) | Status |
| :--- | :--- | :--- |
| **Upload Engine** | Bruger kan uploade PDF/Billede via Dashboard. | 🟢 |
| **Bill Parser** | AI udtrækker korrekt: Udsteder, Pris, Forbrug fra filen. | 🟢 |
| **Takeover Mail** | System kan sende "Overtagelses-mail" til selskab (Skift mail-adresse). | 🟢 |
| **Manual Entry** | Bruger kan oprette en kontrakt manuelt hvis upload fejler. | 🟢 |

---

## 🛡️ 4. THE BODYGUARD (SUPPORT & OVERBLIK)
*Det kunden ser og føler.*

| Feature | Definition of Done (Krav) | Status |
| :--- | :--- | :--- |
| **Activity Feed** | Tidslinje viser samlet view: Mails, Chat, Systemændringer. | 🟢 |
| **Support Chat** | Chat-modul integreret i dashboardet (koblet til `SupportTicket`). | 🟢 |
| **Notifications** | Bruger får besked ved: Ny regning, Nyt svar, Varsling. | 🟢 |

---

## 👮 5. THE CONTROL TOWER (ADMIN & AUTO)
*Vores interne styringsværktøj.*

| Feature | Definition of Done (Krav) | Status |
| :--- | :--- | :--- |
| **Queue View** | Admin kan se liste over sager der afventer svar fra selskab. | 🟢 |
| **Scorecard** | Systemet tracker "Avg Response Time" for hvert selskab. | 🟢 |
| **Nudge Bot (Dag 3)** | System sender automatisk rykker efter 3 dages stilhed. | 🟢 |
| **Warning Bot (Dag 7)** | System sender advarsel og flagger selskab som "Langsom". | 🟢 |
| **Blacklist Logic** | Kunder advares mod selskaber med dårlig score. | 🟢 |

---

## 🔐 6. THE PERFECT SWITCH (HANDLING)
*Lukning af aftalen.*

| Feature | Definition of Done (Krav) | Status |
| :--- | :--- | :--- |
| **MitID Integration** | Bruger kan signere via Criipto. | 🟡 (Service skelet lavet, kræver client credentials) |
| **Fuldmagt Gen** | System genererer PDF med signatur. | 🟢 |
| **Switch Exec** | System sender Opsigelse + Oprettelse til relevante parter. | 🟢 |

---
*Sidst opdateret: 2025-12-11*





