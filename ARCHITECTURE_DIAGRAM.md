# 🏗️ FORBRUGERAGENTEN - ARCHITECTURE

**3 Separate Services on Railway**

---

## 📊 SYSTEM ARCHITECTURE:

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS / CLIENTS                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
        ┌───────────────┐  ┌──────────┐  ┌─────────┐
        │   MARKETING   │  │ WEB APP  │  │ MOBILE  │
        │   WEBSITE     │  │  (SPA)   │  │   APP   │
        └───────────────┘  └──────────┘  └─────────┘
                │               │              │
                │               └──────┬───────┘
                │                      │
                ▼                      ▼
        ┌───────────────┐      ┌──────────────┐
        │  forbruger    │      │     app.     │
        │  agent.dk     │      │  forbruger   │
        │               │      │  agent.dk    │
        └───────────────┘      └──────────────┘
                                       │
                                       │ API Calls
                                       ▼
                               ┌───────────────┐
                               │      api.     │
                               │  forbruger    │
                               │   agent.dk    │
                               └───────────────┘
                                       │
                                       ▼
                               ┌───────────────┐
                               │  PostgreSQL   │
                               │   Database    │
                               └───────────────┘
```

---

## 🔄 SERVICE FLOW:

### 1️⃣ MARKETING FLOW:
```
User → forbrugeragent.dk → Marketing Pages
                          ↓
                    "Kom i gang" button
                          ↓
              app.forbrugeragent.dk/login
```

### 2️⃣ USER AUTHENTICATION FLOW:
```
User → app.forbrugeragent.dk/login
          ↓
     Enter email
          ↓
     POST /api/v1/auth/login → Backend
          ↓
     SendGrid sends magic link email
          ↓
     User clicks link
          ↓
     app.forbrugeragent.dk/auth/verify?token=xxx
          ↓
     POST /api/v1/auth/verify → Backend
          ↓
     Session created (7 days)
          ↓
     Redirect to /onboarding or /dashboard
```

### 3️⃣ ONBOARDING FLOW:
```
User → app.forbrugeragent.dk/onboarding
          ↓
     Step 1: Profile (name, phone, address)
          ↓ POST /api/v1/onboarding/profile
     Step 2: Services (Energy, Mobile, Internet)
          ↓ POST /api/v1/onboarding/services
     Step 3: Upload bills (optional)
          ↓ POST /api/v1/onboarding/upload
     Step 4: Consent & Fuldmagt
          ↓ POST /api/v1/onboarding/consent
     Onboarding Complete!
          ↓
     Redirect to /dashboard
```

### 4️⃣ DASHBOARD FLOW:
```
User → app.forbrugeragent.dk/dashboard
          ↓
     GET /api/v1/auth/me → User data
     GET /api/v1/inbox/messages → Messages
          ↓
     Display:
     - Active services
     - Savings overview
     - Recent messages
     - Quick actions
```

---

## 🗂️ REPOSITORY STRUCTURE:

```
forbrugeragenten/
│
├── 📁 / (root)                    ← SERVICE 1: MARKETING
│   ├── app/                       
│   │   ├── page.tsx               # Homepage
│   │   ├── hvordan-virker-det/   # Info pages
│   │   ├── sikkerhed/
│   │   └── support/
│   ├── components/                # Shared UI components
│   ├── package.json               # Next.js 16 deps
│   ├── next.config.ts
│   └── nixpacks.toml              # Railway config
│
├── 📁 frontend/                   ← SERVICE 2: WEB APP
│   ├── src/app/
│   │   ├── login/                 # ✅ Login page
│   │   ├── auth/verify/           # ✅ Token verification
│   │   ├── onboarding/            # ✅ 4-step onboarding
│   │   ├── dashboard/             # ✅ User dashboard
│   │   ├── inbox/                 # ✅ Messages
│   │   └── settings/              # ✅ User settings
│   ├── package.json               # Next.js 14 deps
│   ├── next.config.js
│   └── nixpacks.toml              # Railway config
│
└── 📁 backend/                    ← SERVICE 3: BACKEND API
    ├── app/
    │   ├── api/v1/endpoints/
    │   │   ├── auth.py            # ✅ Authentication
    │   │   ├── onboarding.py      # ✅ Onboarding
    │   │   ├── inbox.py           # ✅ Messages
    │   │   ├── webhooks.py        # SendGrid webhooks
    │   │   └── admin_dashboard.py # Admin panel
    │   ├── models/
    │   │   ├── user.py            # User, MagicLink, Session
    │   │   ├── message.py         # Messages
    │   │   ├── provider.py        # Providers
    │   │   └── contract.py        # Contracts
    │   └── services/
    │       ├── auth_service.py    # ✅ Auth logic
    │       ├── email_service.py   # SendGrid
    │       └── agent_mail_service.py # Agent emails
    ├── alembic/                   # Database migrations
    ├── requirements.txt           # Python deps
    └── nixpacks.toml              # Railway config
```

---

## 🌐 DOMAINS & ROUTING:

```
┌─────────────────────────────────────────────────────┐
│                   CLOUDFLARE DNS                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  forbrugeragent.dk                                 │
│  └→ CNAME → forbrugeragent-website.railway.app    │
│                                                     │
│  app.forbrugeragent.dk                             │
│  └→ CNAME → forbrugeragent-app.railway.app        │
│                                                     │
│  api.forbrugeragent.dk                             │
│  └→ CNAME → forbrugeragent-backend.railway.app    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 💾 DATABASE SCHEMA:

```
┌─────────────────────────────────────────────────────┐
│                  PostgreSQL Database                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  👤 users                                           │
│     ├── id (PK)                                     │
│     ├── email (unique)                              │
│     ├── name                                        │
│     ├── phone                                       │
│     ├── address                                     │
│     ├── agent_email (unique)                        │
│     ├── wants_energy                                │
│     ├── wants_mobile                                │
│     ├── wants_internet                              │
│     ├── onboarding_complete                         │
│     └── created_at                                  │
│                                                     │
│  🔐 magic_links                                     │
│     ├── id (PK)                                     │
│     ├── user_id (FK → users)                        │
│     ├── token_hash                                  │
│     ├── expires_at                                  │
│     └── used_at                                     │
│                                                     │
│  🎫 sessions                                        │
│     ├── id (PK)                                     │
│     ├── user_id (FK → users)                        │
│     ├── session_token                               │
│     ├── expires_at                                  │
│     └── created_at                                  │
│                                                     │
│  📧 messages                                        │
│     ├── id (PK)                                     │
│     ├── user_id (FK → users)                        │
│     ├── subject                                     │
│     ├── body                                        │
│     ├── from_email                                  │
│     └── received_at                                 │
│                                                     │
│  🏢 providers                                       │
│     ├── id (PK)                                     │
│     ├── name                                        │
│     ├── service_type                                │
│     └── is_active                                   │
│                                                     │
│  📄 contracts                                       │
│     ├── id (PK)                                     │
│     ├── user_id (FK → users)                        │
│     ├── provider_id (FK → providers)                │
│     └── status                                      │
│                                                     │
│  💰 quotes                                          │
│     ├── id (PK)                                     │
│     ├── user_id (FK → users)                        │
│     ├── provider_id (FK → providers)                │
│     └── monthly_price                               │
│                                                     │
│  📝 waitlist_entries                                │
│     ├── id (PK)                                     │
│     ├── email                                       │
│     └── created_at                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 AUTHENTICATION FLOW (DETAILED):

```
┌─────────────────────────────────────────────────────┐
│              MAGIC LINK AUTHENTICATION              │
└─────────────────────────────────────────────────────┘

1. REQUEST MAGIC LINK:
   User enters email → POST /api/v1/auth/login
   ↓
   Backend generates:
   - Random token (32 bytes)
   - SHA256 hash of token
   ↓
   Store in magic_links table:
   - token_hash
   - user_id
   - expires_at (15 minutes)
   ↓
   SendGrid sends email with:
   - Magic link: app.forbrugeragent.dk/auth/verify?email=...&token=...
   - Raw token (not hash!)

2. VERIFY MAGIC LINK:
   User clicks link → GET /auth/verify?email=...&token=...
   ↓
   Frontend → POST /api/v1/auth/verify
   ↓
   Backend:
   - Hash received token
   - Compare with stored hash
   - Check expiry
   ↓
   If valid:
   - Generate session token
   - Store in sessions table (7 days expiry)
   - Mark magic_link as used
   - Return session token
   ↓
   Frontend:
   - Store session token in localStorage
   - Set HttpOnly cookie
   - Redirect to /onboarding or /dashboard

3. AUTHENTICATED REQUESTS:
   All API calls include:
   - Authorization: Bearer {session_token}
   ↓
   Backend verifies:
   - Session exists
   - Not expired
   - User is active
   ↓
   Returns user data

4. LOGOUT:
   POST /api/v1/auth/logout
   ↓
   Backend:
   - Delete session from database
   - Revoke token
   ↓
   Frontend:
   - Clear localStorage
   - Clear cookies
   - Redirect to /login
```

---

## 📊 DATA FLOW EXAMPLE:

### New User Journey:

```
1. DISCOVERY:
   User visits forbrugeragent.dk
   → Sees marketing content
   → Clicks "Kom i gang"

2. REGISTRATION:
   Redirected to app.forbrugeragent.dk/login
   → Enters email: user@example.com
   → POST /api/v1/auth/login
   → Email sent via SendGrid
   → User clicks magic link

3. VERIFICATION:
   app.forbrugeragent.dk/auth/verify?token=xxx
   → POST /api/v1/auth/verify
   → Session created
   → User record created in database

4. ONBOARDING:
   app.forbrugeragent.dk/onboarding
   
   Step 1: Profile
   → POST /api/v1/onboarding/profile
   → Updates user: name, phone, address
   
   Step 2: Services
   → POST /api/v1/onboarding/services
   → Updates: wants_energy=true, wants_mobile=true
   
   Step 3: Upload (optional)
   → POST /api/v1/onboarding/upload
   → Stores bills for analysis
   
   Step 4: Consent
   → POST /api/v1/onboarding/consent
   → Generates agent_email
   → Sets onboarding_complete=true

5. DASHBOARD:
   app.forbrugeragent.dk/dashboard
   → GET /api/v1/auth/me
   → GET /api/v1/inbox/messages
   → Shows personalized dashboard

6. ONGOING:
   - Providers send quotes to agent_email
   - Backend parses emails
   - Creates messages in database
   - User sees in inbox
   - User accepts/rejects offers
```

---

## 🚀 DEPLOYMENT ARCHITECTURE:

```
┌─────────────────────────────────────────────────────┐
│                    RAILWAY PROJECT                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Service 1: Marketing Website                      │
│  ├── Build: npm run build                          │
│  ├── Start: npm start                              │
│  ├── Port: 3000                                     │
│  └── Domain: forbrugeragent.dk                     │
│                                                     │
│  Service 2: Web App                                 │
│  ├── Build: npm run build                          │
│  ├── Start: npm start                              │
│  ├── Port: 3000                                     │
│  └── Domain: app.forbrugeragent.dk                 │
│                                                     │
│  Service 3: Backend API                             │
│  ├── Build: pip install -r requirements.txt        │
│  ├── Start: uvicorn app.main:app                   │
│  ├── Port: 8000                                     │
│  └── Domain: api.forbrugeragent.dk                 │
│                                                     │
│  Service 4: PostgreSQL                              │
│  ├── Version: 15                                    │
│  ├── Storage: Persistent volume                    │
│  └── Backups: Automatic                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 KEY FEATURES:

### ✅ Implemented:
- Magic link email authentication
- User registration & login
- 4-step onboarding flow
- Service selection (Energy/Mobile/Internet)
- Agent email auto-generation
- User dashboard
- Message inbox
- Settings management
- Admin panel
- Provider management
- SendGrid integration
- Database migrations

### 🔜 Coming Soon:
- Quote comparison
- Contract signing
- Payment integration
- Mobile app (iOS/Android)
- Push notifications
- Advanced analytics

---

## 📈 SCALABILITY:

### Current Setup:
- 3 independent services
- Can scale individually
- Shared database (optimized)

### Future Scaling:
- Add Redis for caching
- Add CDN for static assets
- Add load balancer
- Add queue system (Celery/Bull)
- Add monitoring (Sentry/DataDog)

---

## 🎉 SUMMARY:

**3 Services:**
1. Marketing Website (Next.js 16)
2. Web App (Next.js 14)
3. Backend API (FastAPI)

**All Connected:**
- Shared PostgreSQL database
- RESTful API communication
- Magic link authentication
- Complete user journey

**Ready for:**
- Production deployment
- User testing
- Provider integration
- Mobile app launch

**🚀 LET'S GO LIVE!**



