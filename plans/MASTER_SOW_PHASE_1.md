# 📜 MASTER STATEMENT OF WORK (SOW) - V1 PLATFORM "THE HUNTER"

**Version:** 2.0 (FULL PLATFORM)
**Date:** 2025-10-10
**Goal:** Launch the complete "ForbrugerAgenten" platform acting as an Economic Bodyguard for Energy, Mobile, and Internet.

---

## 1. 🏗️ CORE PLATFORM ARCHITECTURE
*The foundation that holds everything together.*

### 1.1 Authentication & User Profile
- **Feature:** Auth0 Integration (Social Login + Email/Password).
- **Scope:** Secure login/signup, session management.
- **Requirement:** User ID must be persistent and linked to all data (Contracts, Tickets).
- **New Add-on:** Upon creation, User is assigned a unique `agent_email` alias (Identity).

### 1.2 Unified Database Schema
- **Feature:** Generic models for `Contracts`, `Quotes`, and `Providers`.
- **Scope:** Supports Energy, Mobile, and Internet data structures in JSONB fields.
- **Requirement:** Scalable architecture allowing new categories (Insurance) in V2 without schema migration.

---

## 2. 🚀 USER JOURNEY & ONBOARDING
*How the user enters the system.*

### 2.1 The Unified Flow
- **Step 1:** Landing Page -> "Start Check".
- **Step 2:** Category Selection (Energy, Mobile, Internet).
- **Step 3:** Data Collection (Hybrid):
    - **Option A:** Upload Bill (Triggers AI Parsing).
    - **Option B:** Manual Entry (Provider Name + Approx Price).
- **Step 4:** User Creation (Auth0) + Agent Email Generation.
- **Step 5:** GDPR Consent & General Power of Attorney (MitID).

### 2.2 The Dashboard (Customer View)
- **Feature:** "Overview" page.
- **Components:**
    - **Status Cards:** Active contracts per category.
    - **Savings Potential:** "We found 3 cheaper offers".
    - **Activity Feed:** Live timeline of agent actions (Mails sent, replies received).
    - **Support Chat:** Direct access to "The Buffer" agent.

---

## 3. 🏹 THE HUNTER ENGINE (QUOTE SYSTEM)
*How we get the best prices.*

### 3.1 Outbound Request Logic
- **Feature:** Automated Quote Requests.
- **Logic:**
    1. User completes onboarding.
    2. System identifies categories.
    3. System generates emails to relevant Providers (e.g., "Hi Telenor, quote for X GB data").
    4. Emails are sent from the user's `agent_email` alias.
- **Requirement:** Mails must be tracked in `EmailLog` and visible in Activity Feed.

### 3.2 Inbound Processing (The Digital Mailbox)
- **Feature:** AI-driven Email Handling.
- **Logic:**
    1. Provider replies to `agent_email`.
    2. Webhook receives mail.
    3. **AI Brain:** Classifies as `Quote`, `Bill`, `Welcome`, `Spam`.
    4. **Action:**
        - `Quote`: Parsed into standardized "Offer" format for comparison.
        - `Welcome`: Confirms switch success.
        - `Bill`: Updates spending stats.

---

## 4. 🛡️ THE BODYGUARD (SUPPORT & CONTROL)
*How we protect and manage the customer.*

### 4.1 "The Perfect Switch"
- **Feature:** One-click Switch Execution.
- **Logic:**
    - User clicks "Accept Offer".
    - System generates PDF Power of Attorney (if not already valid).
    - System emails Old Provider (Cancel) and New Provider (Sign up).
    - Status moves to "Switching".

### 4.2 Admin Control Tower
- **Feature:** Internal Dashboard for ForbrugerAgenten staff.
- **Components:**
    - **Queue:** "Unanswered Requests" (>3 days).
    - **Scorecards:** Provider Response Time tracking.
    - **Manual Override:** Ability for agents to step in and chat/email on behalf of user.

### 4.3 Automation (The Nudge)
- **Feature:** Background Jobs.
- **Logic:** Auto-reminders to providers who haven't answered quotes or complaints within set timeframes.

---

## 5. ✅ ACCEPTANCE TESTING PROTOCOL (FULL SCOPE)

### SCENARIO 1: The Full Cycle (Happy Path)
- [ ] **1. Signup:** User registers. Dashboard loads. Agent Email is present.
- [ ] **2. Onboarding:** User selects "Mobile", uploads Telmore bill.
- [ ] **3. Parsing:** System identifies "Telmore, 199kr". Creates Contract.
- [ ] **4. Hunting:** System sends "Quote Request" to 3 competitors from Agent Email.
- [ ] **5. Receiving:** Simulate reply from "Oister" with "129kr offer".
- [ ] **6. Parsing:** System creates "Quote" object. Shows "Save 70kr" on Dashboard.
- [ ] **7. Switch:** User clicks "Accept". MitID sign (mock). System sends "Switch Mail".

### SCENARIO 2: The Bodyguard (Problem Path)
- [ ] **1. Complaint:** User chats "Bill is wrong".
- [ ] **2. Ticket:** System creates Ticket.
- [ ] **3. Contact:** System emails Provider.
- [ ] **4. Nudge:** Simulate 4 days no reply. System auto-sends reminder.

---

**Sign-off:**
*This document represents the complete V1 Product Scope, integrating existing core features with new Bodyguard capabilities.*








