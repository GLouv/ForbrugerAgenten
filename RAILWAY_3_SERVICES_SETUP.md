# 🚂 RAILWAY - 3 SEPARATE SERVICES SETUP

**Date:** December 16, 2024  
**Status:** Ready for deployment

---

## 🎯 OVERVIEW - 3 SERVICES:

```
┌─────────────────────────────────────────────────────────┐
│                    FORBRUGERAGENTEN                     │
│                    Railway Project                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1️⃣  Marketing Website (forbrugeragent.dk)            │
│      Root: /                                           │
│      Next.js 16 - Marketing & info pages               │
│                                                         │
│  2️⃣  Web App (app.forbrugeragent.dk)                  │
│      Root: /frontend                                   │
│      Next.js 14 - Login, Dashboard, Onboarding         │
│                                                         │
│  3️⃣  Backend API (api.forbrugeragent.dk)              │
│      Root: /backend                                    │
│      FastAPI - REST API for app & mobile               │
│                                                         │
│  4️⃣  PostgreSQL Database                               │
│      Shared by all services                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 SERVICE 1: MARKETING WEBSITE

### Configuration:
```yaml
Name: forbrugeragent-website
Root Directory: /
Build Command: npm run build
Start Command: npm start
Domain: forbrugeragent.dk
```

### Environment Variables:
```bash
# None required - static marketing site
```

### Files Used:
- `/nixpacks.toml` (root)
- `/package.json` (root)
- `/next.config.ts` (root)
- `/app/*` (all pages)

### Purpose:
- Marketing homepage
- Feature descriptions
- Download links (iOS/Android)
- Info pages (hvordan virker det, sikkerhed, support)

### Verify:
```bash
curl https://forbrugeragent.dk
# Should return: Marketing homepage HTML
```

---

## 📋 SERVICE 2: WEB APP (MAIN APPLICATION)

### Configuration:
```yaml
Name: forbrugeragent-app
Root Directory: /frontend ⚠️ CRITICAL!
Build Command: npm run build
Start Command: npm start
Domain: app.forbrugeragent.dk
```

### Environment Variables:
```bash
NEXT_PUBLIC_API_URL=https://forbrugeragent-backend-production.up.railway.app

# Or with custom domain:
NEXT_PUBLIC_API_URL=https://api.forbrugeragent.dk
```

### Files Used:
- `/frontend/nixpacks.toml`
- `/frontend/package.json`
- `/frontend/next.config.js`
- `/frontend/src/app/*` (all pages)

### Features:
- ✅ Magic link authentication
- ✅ User registration
- ✅ 4-step onboarding
- ✅ Service selection (Energy/Mobile/Internet)
- ✅ User dashboard
- ✅ Message inbox
- ✅ Settings page

### Pages:
- `/login` - Login with magic link
- `/auth/verify` - Token verification
- `/onboarding` - 4-step onboarding
- `/dashboard` - User dashboard
- `/inbox` - Messages
- `/settings` - User settings

### Verify:
```bash
curl https://app.forbrugeragent.dk
# Should return: Login page HTML (not marketing!)

curl https://app.forbrugeragent.dk/login
# Should return: Login form
```

---

## 📋 SERVICE 3: BACKEND API

### Configuration:
```yaml
Name: forbrugeragent-backend
Root Directory: /backend
Build Command: (automatic via nixpacks)
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
Domain: api.forbrugeragent.dk
```

### Environment Variables:
```bash
# Database (auto-set by Railway)
DATABASE_URL=postgresql://postgres:...@...railway.app:5432/railway

# SendGrid Email
SENDGRID_API_KEY=REDACTED_SENDGRID_KEY
SENDGRID_FROM_EMAIL=noreply@forbrugeragent.dk
SENDGRID_FROM_NAME=ForbrugerAgenten

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# App Settings
DEBUG=false
DEV_MODE=false
ENVIRONMENT=production

# CORS (allow frontend domains)
ALLOWED_ORIGINS=https://app.forbrugeragent.dk,https://forbrugeragent.dk
```

### Files Used:
- `/backend/nixpacks.toml`
- `/backend/requirements.txt`
- `/backend/main.py`
- `/backend/app/*` (all modules)

### Endpoints:
- `/health` - Health check
- `/api/v1/auth/*` - Authentication
- `/api/v1/onboarding/*` - Onboarding
- `/api/v1/inbox/*` - Messages
- `/api/v1/webhooks/*` - SendGrid webhooks
- `/api/v1/admin-dashboard/*` - Admin panel
- `/api/v1/waitlist/*` - Waitlist

### Database Migration:
After first deploy, run:
```bash
railway link
railway run --service forbrugeragent-backend alembic upgrade head
```

### Verify:
```bash
curl https://api.forbrugeragent.dk/health
# Expected: {"status":"healthy","database":"connected"}

curl https://api.forbrugeragent.dk/docs
# Expected: OpenAPI documentation (Swagger UI)
```

---

## 📋 SERVICE 4: POSTGRESQL DATABASE

### Configuration:
```yaml
Name: postgres
Type: PostgreSQL Plugin
Version: 15+
```

### Automatic:
- ✅ DATABASE_URL automatically injected to backend
- ✅ Connection pooling enabled
- ✅ Backups enabled

### Tables Created (via migration):
1. `users` - User accounts
2. `magic_links` - Auth tokens
3. `sessions` - User sessions
4. `messages` - Inbox messages
5. `providers` - Service providers
6. `contracts` - User contracts
7. `quotes` - Price quotes
8. `waitlist_entries` - Pre-launch waitlist

---

## 🚀 DEPLOYMENT STEPS:

### Step 1: Create Services in Railway

**Option A: From Railway Dashboard**
1. Go to Railway project
2. Click "New Service"
3. Select "GitHub Repo"
4. Choose your repo
5. Configure each service (see below)

**Option B: From CLI**
```bash
railway link
railway service create forbrugeragent-website
railway service create forbrugeragent-app
railway service create forbrugeragent-backend
```

### Step 2: Configure Service 1 (Marketing Website)

```
Service: forbrugeragent-website
├── Settings
│   ├── Root Directory: /
│   ├── Build Command: npm run build
│   └── Start Command: npm start
├── Domains
│   └── Add: forbrugeragent.dk
└── Environment Variables
    └── (none required)
```

### Step 3: Configure Service 2 (Web App)

```
Service: forbrugeragent-app
├── Settings
│   ├── Root Directory: /frontend ⚠️
│   ├── Build Command: npm run build
│   └── Start Command: npm start
├── Domains
│   └── Add: app.forbrugeragent.dk
└── Environment Variables
    └── NEXT_PUBLIC_API_URL=https://api.forbrugeragent.dk
```

### Step 4: Configure Service 3 (Backend)

```
Service: forbrugeragent-backend
├── Settings
│   ├── Root Directory: /backend
│   ├── Build Command: (auto)
│   └── Start Command: (auto from nixpacks.toml)
├── Domains
│   └── Add: api.forbrugeragent.dk
├── Environment Variables
│   ├── DATABASE_URL (auto-set)
│   ├── SENDGRID_API_KEY=SG._wUpo...
│   ├── SENDGRID_FROM_EMAIL=noreply@forbrugeragent.dk
│   ├── SENDGRID_FROM_NAME=ForbrugerAgenten
│   ├── OPENAI_API_KEY=sk-...
│   ├── DEBUG=false
│   ├── DEV_MODE=false
│   └── ALLOWED_ORIGINS=https://app.forbrugeragent.dk,https://forbrugeragent.dk
└── Connect to Database
    └── Link PostgreSQL service
```

### Step 5: Run Database Migration

```bash
# Link to Railway project
railway link

# Select backend service
railway service

# Run migration
railway run alembic upgrade head
```

### Step 6: Deploy All Services

```bash
# Trigger deployment
git push origin main

# Or manually in Railway dashboard
# Click "Deploy" on each service
```

---

## ✅ VERIFICATION CHECKLIST:

After deployment:

### Marketing Website:
- [ ] `https://forbrugeragent.dk` loads
- [ ] Shows marketing homepage
- [ ] "Kom i gang" button works
- [ ] Download links work
- [ ] All pages accessible

### Web App:
- [ ] `https://app.forbrugeragent.dk` loads
- [ ] Shows LOGIN page (not marketing!)
- [ ] Can request magic link
- [ ] Email arrives with link
- [ ] Can complete onboarding
- [ ] Dashboard loads after login

### Backend API:
- [ ] `https://api.forbrugeragent.dk/health` returns 200
- [ ] `https://api.forbrugeragent.dk/docs` shows Swagger
- [ ] Database connection works
- [ ] Auth endpoints work
- [ ] Onboarding endpoints work

### Database:
- [ ] Migration completed successfully
- [ ] All 8 tables created
- [ ] Backend can connect
- [ ] No connection errors in logs

---

## 🔧 TROUBLESHOOTING:

### Marketing Website Issues:

**Problem:** 404 or blank page  
**Solution:** Check root directory is `/` (not `/app`)

**Problem:** Build fails  
**Solution:** Check `package.json` in root has correct dependencies

### Web App Issues:

**Problem:** Shows marketing site instead of login  
**Solution:** ⚠️ Root directory MUST be `/frontend` not `/`

**Problem:** "API connection failed"  
**Solution:** Check `NEXT_PUBLIC_API_URL` environment variable

**Problem:** Build fails  
**Solution:** Check `/frontend/package.json` dependencies

### Backend Issues:

**Problem:** 500 errors  
**Solution:** Check logs, verify DATABASE_URL is set

**Problem:** Database connection failed  
**Solution:** Ensure PostgreSQL service is linked

**Problem:** Migration errors  
**Solution:** Run `railway run alembic upgrade head` again

**Problem:** CORS errors  
**Solution:** Add frontend domain to `ALLOWED_ORIGINS`

---

## 📊 EXPECTED URLS:

### Production:
```
Marketing:  https://forbrugeragent.dk
Web App:    https://app.forbrugeragent.dk
Backend:    https://api.forbrugeragent.dk
Docs:       https://api.forbrugeragent.dk/docs
```

### Railway Default URLs:
```
Marketing:  https://forbrugeragent-website-production.up.railway.app
Web App:    https://forbrugeragent-app-production.up.railway.app
Backend:    https://forbrugeragent-backend-production.up.railway.app
```

---

## 🎯 QUICK TEST COMMANDS:

```bash
# Test all services
curl https://forbrugeragent.dk
curl https://app.forbrugeragent.dk
curl https://api.forbrugeragent.dk/health

# Test auth flow
curl -X POST https://api.forbrugeragent.dk/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Test onboarding
curl https://api.forbrugeragent.dk/api/v1/onboarding/status \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

# Check database
railway run --service forbrugeragent-backend alembic current
```

---

## 🎉 SUCCESS CRITERIA:

All 3 services should be:
- ✅ Deploying successfully
- ✅ Running without errors
- ✅ Accessible via custom domains
- ✅ Communicating with each other
- ✅ Connected to database

**When all green: YOU'RE LIVE! 🚀**

---

## 📝 NOTES:

### Why 3 Separate Services?

1. **Independent Scaling**
   - Marketing site: Low traffic, static
   - Web App: Medium traffic, dynamic
   - Backend: High traffic, API calls

2. **Independent Deployment**
   - Update marketing without touching app
   - Deploy app features without backend changes
   - Backend updates don't affect frontend

3. **Better Organization**
   - Clear separation of concerns
   - Easier debugging
   - Better monitoring

4. **Cost Optimization**
   - Scale only what needs scaling
   - Marketing can be on CDN
   - Backend can have more resources

### Domain Setup:

In Cloudflare DNS:
```
forbrugeragent.dk       → CNAME → forbrugeragent-website-production.up.railway.app
app.forbrugeragent.dk   → CNAME → forbrugeragent-app-production.up.railway.app
api.forbrugeragent.dk   → CNAME → forbrugeragent-backend-production.up.railway.app
```

---

## 🚀 YOU'RE READY!

All code is pushed, all configs are ready.  
Just follow the steps above! 💪



