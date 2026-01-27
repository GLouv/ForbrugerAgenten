# 📁 PROJEKT STRUKTUR - FORBRUGERAGENTEN

## 🎯 VI HAR 3 SEPARATE PROJEKTER:

---

## 1️⃣ HJEMMESIDE (Marketing Website)

**Lokation:** `/app/` (i root)  
**Domain:** `forbrugeragent.dk`  
**Formål:** Marketing & information

### Sider:
- `/` - Forside med hero, features, download links
- `/hvordan-virker-det` - Forklaring
- `/sikkerhed` - Sikkerhed info
- `/support` - Support info
- `/download/ios` - iOS download
- `/download/android` - Android download

### Teknologi:
- Next.js 16
- React 19
- Tailwind CSS
- Framer Motion (animations)

### Deploy:
- Root directory: `/` (root)
- Domain: `forbrugeragent.dk`

---

## 2️⃣ WEB APP (Bruger Portal)

**Lokation:** `/frontend/`  
**Domain:** `app.forbrugeragent.dk`  
**Formål:** Bruger login, dashboard, onboarding

### Sider:
- `/login` - Login med magic link ✅
- `/auth/verify` - Token verification ✅
- `/onboarding` - 4-step onboarding ✅
- `/dashboard` - Bruger dashboard ✅
- `/inbox` - Beskeder fra udbydere ✅
- `/settings` - Bruger indstillinger ✅
- `/quotes` - Tilbud oversigt
- `/privacy` - Privatlivspolitik
- `/terms` - Vilkår & betingelser
- `/cookies` - Cookie politik

### Teknologi:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons

### Features:
- ✅ Magic link authentication
- ✅ Session management
- ✅ Complete onboarding flow
- ✅ Service selection (Energy/Mobile/Internet)
- ✅ Agent email generation
- ✅ User dashboard
- ✅ Message inbox

### Deploy:
- Root directory: `/frontend` ⚠️
- Domain: `app.forbrugeragent.dk`

---

## 3️⃣ BACKEND API

**Lokation:** `/backend/`  
**Domain:** `api.forbrugeragent.dk`  
**Formål:** API for web app & mobile apps

### Endpoints:
- `/api/v1/auth/*` - Authentication
- `/api/v1/onboarding/*` - Onboarding
- `/api/v1/inbox/*` - Messages
- `/api/v1/webhooks/*` - SendGrid webhooks
- `/api/v1/admin-dashboard/*` - Admin panel
- `/api/v1/waitlist/*` - Waitlist

### Teknologi:
- FastAPI (Python)
- PostgreSQL
- SQLAlchemy
- Alembic (migrations)
- SendGrid (email)
- OpenAI (AI features)

### Deploy:
- Root directory: `/backend`
- Domain: `api.forbrugeragent.dk`

---

## 🗂️ FOLDER STRUKTUR:

```
forbrugeragenten/
│
├── app/                    # 1️⃣ HJEMMESIDE (Marketing)
│   ├── page.tsx           # Forside
│   ├── hvordan-virker-det/
│   ├── sikkerhed/
│   └── support/
│
├── frontend/              # 2️⃣ WEB APP (Bruger Portal)
│   ├── src/
│   │   └── app/
│   │       ├── login/     # ✅ Login page
│   │       ├── auth/      # ✅ Auth verification
│   │       ├── onboarding/ # ✅ Onboarding flow
│   │       ├── dashboard/ # ✅ User dashboard
│   │       ├── inbox/     # ✅ Messages
│   │       └── settings/  # ✅ Settings
│   ├── package.json
│   ├── next.config.js
│   └── nixpacks.toml
│
├── backend/               # 3️⃣ BACKEND API
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   └── agents/
│   ├── alembic/
│   ├── requirements.txt
│   └── nixpacks.toml
│
├── components/            # Shared components (hjemmeside)
├── lib/                   # Shared utilities (hjemmeside)
├── public/                # Static assets (hjemmeside)
│
├── package.json           # Hjemmeside dependencies
├── next.config.ts         # Hjemmeside config
└── nixpacks.toml          # Hjemmeside deploy config
```

---

## 🌐 DOMAINS & ROUTING:

### Production:
- `forbrugeragent.dk` → Hjemmeside (marketing)
- `app.forbrugeragent.dk` → Web App (bruger portal)
- `api.forbrugeragent.dk` → Backend API

### Development:
- `localhost:3000` → Hjemmeside (root)
- `localhost:3001` → Web App (frontend/)
- `localhost:8000` → Backend API (backend/)

---

## 🚀 RAILWAY SERVICES:

### Service 1: Marketing Website
- **Name:** `forbrugeragent-website`
- **Root Directory:** `/` (root)
- **Domain:** `forbrugeragent.dk`
- **Purpose:** Marketing & info

### Service 2: Web App (MAIN APP!)
- **Name:** `forbrugeragent-app`
- **Root Directory:** `/frontend` ⚠️
- **Domain:** `app.forbrugeragent.dk`
- **Purpose:** User login & dashboard

### Service 3: Backend API
- **Name:** `forbrugeragent-backend`
- **Root Directory:** `/backend`
- **Domain:** `api.forbrugeragent.dk`
- **Purpose:** API for app & mobile

---

## 🎯 BRUGER FLOW:

### Marketing → App:
1. User visits `forbrugeragent.dk` (hjemmeside)
2. Clicks "Kom i gang" eller "Log ind"
3. Redirects to `app.forbrugeragent.dk/login`
4. Completes login → onboarding → dashboard

### Direct App Access:
1. User visits `app.forbrugeragent.dk`
2. Redirects to `/login` if not authenticated
3. Shows `/dashboard` if authenticated

---

## ✅ HVAD ER FÆRDIGT:

### Hjemmeside (Marketing):
- ✅ Forside med hero
- ✅ Features section
- ✅ Download links (iOS/Android)
- ✅ Info pages
- ✅ Responsive design

### Web App:
- ✅ Complete authentication
- ✅ Complete onboarding
- ✅ Dashboard
- ✅ Inbox
- ✅ Settings
- ✅ All API integration

### Backend:
- ✅ All endpoints
- ✅ Database models
- ✅ Authentication system
- ✅ Email system
- ✅ Admin panel

---

## 📝 DEPLOYMENT NOTES:

### KRITISK FOR RAILWAY:
⚠️ **Web App SKAL deployes fra `/frontend/` folder**  
⚠️ **IKKE fra root** (det er hjemmesiden!)

### Verify Deployment:
- `forbrugeragent.dk` → Skal vise marketing site
- `app.forbrugeragent.dk` → Skal vise LOGIN page
- `api.forbrugeragent.dk/health` → Skal returnere health status

---

## 🎉 KONKLUSION:

**3 separate projekter:**
1. Hjemmeside = Marketing (`/app/`)
2. Web App = Bruger portal (`/frontend/`)
3. Backend = API (`/backend/`)

**Alle 3 er færdige og klar til deploy! 🚀**



