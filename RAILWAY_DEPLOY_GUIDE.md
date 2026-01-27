# 🚀 RAILWAY DEPLOYMENT GUIDE

## 📁 PROJECT STRUCTURE

```
forbrugeragenten/
├── app/              # OLD - Marketing website (forbrugeragent.dk)
├── backend/          # Backend API (FastAPI)
└── frontend/         # NEW - Main App (app.forbrugeragent.dk)
    └── src/
        └── app/
            ├── login/        ✅ NEW
            ├── auth/         ✅ NEW
            ├── onboarding/   ✅ NEW
            ├── dashboard/    ✅ NEW
            ├── inbox/        ✅ NEW
            ├── settings/     ✅ NEW
            └── ...
```

---

## 🎯 RAILWAY SERVICES NEEDED

### 1. Backend API Service
**Root Directory:** `/backend`  
**Start Command:** `. /opt/venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 2. Frontend App Service (NEW!)
**Root Directory:** `/frontend`  
**Start Command:** `npm start`  
**Domain:** `app.forbrugeragent.dk`

### 3. Marketing Website (Optional)
**Root Directory:** `/` (root)  
**Domain:** `forbrugeragent.dk`

---

## ⚙️ RAILWAY CONFIGURATION

### Backend Service
```toml
# backend/nixpacks.toml
[phases.setup]
nixPkgs = ["python311", "python311Packages.pip", "postgresql"]

[phases.install]
cmds = [
  "python -m venv /opt/venv",
  ". /opt/venv/bin/activate && pip install --upgrade pip",
  ". /opt/venv/bin/activate && pip install -r requirements.txt"
]

[start]
cmd = ". /opt/venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

### Frontend App Service
```toml
# frontend/nixpacks.toml
[phases.setup]
nixPkgs = ["nodejs-20_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

---

## 🔧 ENVIRONMENT VARIABLES

### Backend Service
```bash
DATABASE_URL=postgresql://...
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@forbrugeragent.dk
SENDGRID_FROM_NAME=ForbrugerAgenten
OPENAI_API_KEY=sk-...
DEBUG=false
DEV_MODE=false
```

### Frontend App Service
```bash
NEXT_PUBLIC_API_URL=https://[backend-url].railway.app
```

---

## 📝 DEPLOYMENT STEPS

### Step 1: Create Railway Services

1. **Backend Service:**
   - New Service from repo
   - Root Directory: `/backend`
   - Deploy from `main` branch

2. **Frontend App Service:**
   - New Service from repo
   - Root Directory: `/frontend`  ⚠️ IMPORTANT!
   - Deploy from `main` branch

### Step 2: Configure Domains

1. Backend: `api.forbrugeragent.dk` or Railway domain
2. Frontend App: `app.forbrugeragent.dk`

### Step 3: Set Environment Variables

Use Railway dashboard to set all env vars listed above.

### Step 4: Run Database Migration

```bash
railway run -s backend alembic upgrade head
```

### Step 5: Verify Deployment

```bash
# Check backend
curl https://[backend-url]/health

# Check frontend  
curl https://app.forbrugeragent.dk

# Test auth flow
curl -X POST https://[backend-url]/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

## 🐛 TROUBLESHOOTING

### Frontend shows old marketing site?
- Verify Railway service root directory is `/frontend`
- Check build logs for correct app
- Look for "forbrugeragenten-app" in package.json

### Backend not starting?
- Check if venv is activated in start command
- Verify all Python dependencies installed
- Check DATABASE_URL format

### Database connection issues?
- Ensure Railway PostgreSQL plugin added
- Check DATABASE_URL uses `postgresql+asyncpg://`
- Run migrations: `railway run alembic upgrade head`

---

## ✅ VERIFICATION CHECKLIST

After deployment, verify:

- [ ] Backend health check responds
- [ ] Frontend loads at app.forbrugeragent.dk
- [ ] Frontend shows LOGIN page (not marketing site!)
- [ ] Can request magic link
- [ ] Database tables exist
- [ ] SendGrid configured
- [ ] All routes work:
  - [ ] /login
  - [ ] /auth/verify  
  - [ ] /onboarding
  - [ ] /dashboard
  - [ ] /inbox
  - [ ] /settings

---

## 🎉 SUCCESS CRITERIA

✅ Backend API responding  
✅ Frontend App showing NEW pages (login, dashboard, etc.)  
✅ Database connected  
✅ Auth flow working  
✅ Onboarding flow working  

**YOU'RE LIVE! 🚀**




