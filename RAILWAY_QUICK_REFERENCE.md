# 🚂 RAILWAY QUICK REFERENCE

**3 Services Setup - Hurtig Guide**

---

## 🎯 SERVICE OVERVIEW:

| Service | Root Dir | Domain | Purpose |
|---------|----------|--------|---------|
| **Marketing** | `/` | forbrugeragent.dk | Hjemmeside |
| **Web App** | `/frontend` | app.forbrugeragent.dk | Login/Dashboard |
| **Backend** | `/backend` | api.forbrugeragent.dk | API |
| **Database** | - | - | PostgreSQL |

---

## ⚙️ SERVICE 1: MARKETING WEBSITE

```yaml
Name: forbrugeragent-website
Root: /
Domain: forbrugeragent.dk
Env Vars: (none)
```

**Test:**
```bash
curl https://forbrugeragent.dk
```

---

## ⚙️ SERVICE 2: WEB APP ⚠️

```yaml
Name: forbrugeragent-app
Root: /frontend  ⚠️ CRITICAL!
Domain: app.forbrugeragent.dk
Env Vars:
  NEXT_PUBLIC_API_URL=https://api.forbrugeragent.dk
```

**Test:**
```bash
curl https://app.forbrugeragent.dk
# Should show LOGIN page (not marketing!)
```

---

## ⚙️ SERVICE 3: BACKEND API

```yaml
Name: forbrugeragent-backend
Root: /backend
Domain: api.forbrugeragent.dk
Env Vars:
  DATABASE_URL=(auto)
  SENDGRID_API_KEY=REDACTED_SENDGRID_KEY
  SENDGRID_FROM_EMAIL=noreply@forbrugeragent.dk
  SENDGRID_FROM_NAME=ForbrugerAgenten
  OPENAI_API_KEY=(your key)
  DEBUG=false
  DEV_MODE=false
  ALLOWED_ORIGINS=https://app.forbrugeragent.dk,https://forbrugeragent.dk
```

**Migration:**
```bash
railway link
railway run --service forbrugeragent-backend alembic upgrade head
```

**Test:**
```bash
curl https://api.forbrugeragent.dk/health
# Expected: {"status":"healthy","database":"connected"}
```

---

## ✅ VERIFICATION:

```bash
# 1. Marketing
curl https://forbrugeragent.dk
# → Marketing homepage

# 2. Web App
curl https://app.forbrugeragent.dk
# → Login page

# 3. Backend
curl https://api.forbrugeragent.dk/health
# → {"status":"healthy"}

# 4. Auth Test
curl -X POST https://api.forbrugeragent.dk/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
# → {"success": true}
```

---

## 🐛 COMMON ISSUES:

### Web App shows marketing site?
→ Root directory must be `/frontend` (not `/`)

### Backend 500 errors?
→ Run migration: `railway run alembic upgrade head`

### CORS errors?
→ Check `ALLOWED_ORIGINS` includes frontend domain

---

## 📋 CHECKLIST:

- [ ] Marketing root = `/`
- [ ] Web App root = `/frontend` ⚠️
- [ ] Backend root = `/backend`
- [ ] Backend env vars set
- [ ] Database migration run
- [ ] All 3 services deployed
- [ ] All 3 domains working

---

## 🚀 WHEN ALL GREEN:

✅ Marketing: forbrugeragent.dk  
✅ Web App: app.forbrugeragent.dk  
✅ Backend: api.forbrugeragent.dk  

**YOU'RE LIVE! 🎉**



