# 🧪 MANUAL TEST CHECKLIST - ForbrugerAgenten

**Date:** December 16, 2025  
**Tester:** _________  
**Environment:** Production

---

## 📋 PRE-TEST SETUP

### Get Your URLs

**Frontend URL:**
- Expected: `https://app.forbrugeragent.dk` OR `https://forbrugeragent-frontend.up.railway.app`
- Actual: ________________

**Backend URL:**
- Expected: `https://forbrugeragent-backend.up.railway.app`
- Actual: ________________

### How to Find Your URLs:
1. Go to: https://railway.app/dashboard
2. Click on your project
3. Click on "Frontend" service → Copy public URL
4. Click on "Backend" service → Copy public URL

---

## ✅ TEST SUITE 1: FRONTEND (15 MIN)

### Test 1.1: Main Landing Page
- [ ] **URL:** `{FRONTEND_URL}/`
- [ ] Page loads successfully
- [ ] "Coming Soon" banner visible
- [ ] "Kom på venteliste" button visible
- [ ] No console errors (F12 → Console)
- [ ] Mobile responsive (try different sizes)

**Screenshot:** _________  
**Status:** ⬜ Pass | ⬜ Fail  
**Notes:** ________________

---

### Test 1.2: Waitlist Modal
- [ ] **Action:** Click "Kom på venteliste"
- [ ] Modal opens
- [ ] Email input field visible
- [ ] "Tilmeld" button works
- [ ] Can enter email
- [ ] Can submit
- [ ] Success message shows (if backend connected)
- [ ] Modal closes after submit

**Test Email Used:** ________________  
**Status:** ⬜ Pass | ⬜ Fail  
**Notes:** ________________

---

### Test 1.3: Privacy Policy Page
- [ ] **URL:** `{FRONTEND_URL}/privacy`
- [ ] Page loads successfully
- [ ] Content in Danish
- [ ] Sections visible:
  - [ ] Velkommen til ForbrugerAgenten
  - [ ] Hvem er vi?
  - [ ] Hvilke oplysninger indsamler vi?
  - [ ] Dine rettigheder (GDPR)
- [ ] No console errors
- [ ] Links to Terms & Cookies work

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:** ________________

---

### Test 1.4: Terms & Conditions Page
- [ ] **URL:** `{FRONTEND_URL}/terms`
- [ ] Page loads successfully
- [ ] Content in Danish
- [ ] Sections visible:
  - [ ] Hvad er ForbrugerAgenten?
  - [ ] Hvem kan bruge tjenesten?
  - [ ] Fuldmagt (Power of Attorney)
  - [ ] Pris
- [ ] No console errors
- [ ] Links work

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:** ________________

---

### Test 1.5: Cookie Policy Page
- [ ] **URL:** `{FRONTEND_URL}/cookies`
- [ ] Page loads successfully
- [ ] Content in Danish
- [ ] Sections visible:
  - [ ] Hvad er cookies?
  - [ ] Hvilke cookies bruger vi?
  - [ ] Hvordan kan du styre cookies?
- [ ] No console errors
- [ ] Links work

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:** ________________

---

### Test 1.6: Frontend Console Check
- [ ] **Action:** Open DevTools (F12)
- [ ] Go to Console tab
- [ ] Refresh page
- [ ] No red errors
- [ ] No 404s
- [ ] No failed API calls (acceptable if backend not connected)

**Errors Found:** ________________  
**Status:** ⬜ Pass | ⬜ Fail

---

## ✅ TEST SUITE 2: BACKEND API (20 MIN)

### Test 2.1: Health Check
```bash
curl {BACKEND_URL}/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "ai": "not configured" or "ready"
}
```

- [ ] Returns 200 OK
- [ ] Valid JSON response
- [ ] Database connected
- [ ] No errors

**Actual Response:** ________________  
**Status:** ⬜ Pass | ⬜ Fail

---

### Test 2.2: SendGrid Status Check
```bash
curl {BACKEND_URL}/api/v1/webhooks/sendgrid/test
```

**Expected Response:**
```json
{
  "status": "configured",
  "from_email": "noreply@forbrugeragent.dk",
  "from_name": "ForbrugerAgenten"
}
```
OR
```json
{
  "status": "not_configured",
  "message": "SENDGRID_API_KEY not set"
}
```

- [ ] Returns 200 OK
- [ ] Valid JSON response
- [ ] SendGrid status clear

**Actual Response:** ________________  
**Status:** ⬜ Pass | ⬜ Fail  
**SendGrid Configured:** ⬜ Yes | ⬜ No

---

### Test 2.3: Send Test Email (If SendGrid Configured)
```bash
curl -X POST "{BACKEND_URL}/api/v1/webhooks/sendgrid/test-send?to_email=YOUR_EMAIL@example.com"
```

**Expected Response:**
```json
{
  "status": "sent",
  "to": "YOUR_EMAIL@example.com",
  "subject": "Test Email fra ForbrugerAgenten"
}
```

- [ ] Returns 200 OK
- [ ] API confirms sent
- [ ] **Check your email inbox**
- [ ] Email received
- [ ] From: noreply@forbrugeragent.dk
- [ ] Subject correct
- [ ] Body readable

**Email Received:** ⬜ Yes | ⬜ No  
**Time to Receive:** _____ seconds  
**Status:** ⬜ Pass | ⬜ Fail  
**Notes:** ________________

---

### Test 2.4: Inbox API - Get Stats
```bash
curl "{BACKEND_URL}/api/v1/inbox/stats?user_id=test_user_123"
```

**Expected Response:**
```json
{
  "total": 0,
  "unread": 0,
  "by_type": {
    "quote": 0,
    "info": 0,
    "marketing": 0,
    "system": 0,
    "support": 0,
    "reminder": 0
  },
  "pending_quotes": 0
}
```

- [ ] Returns 200 OK
- [ ] Valid JSON response
- [ ] Stats structure correct

**Actual Response:** ________________  
**Status:** ⬜ Pass | ⬜ Fail

---

### Test 2.5: Inbox API - Get Messages
```bash
curl "{BACKEND_URL}/api/v1/inbox?user_id=test_user_123&limit=5"
```

**Expected Response:**
```json
{
  "messages": [],
  "total": 0,
  "unread": 0,
  "limit": 5,
  "offset": 0
}
```

- [ ] Returns 200 OK
- [ ] Valid JSON response
- [ ] Empty messages array (no data yet)

**Actual Response:** ________________  
**Status:** ⬜ Pass | ⬜ Fail

---

### Test 2.6: Admin Dashboard - System Stats
```bash
curl "{BACKEND_URL}/api/v1/admin-dashboard/stats"
```

**Expected Response:**
```json
{
  "total_users": 0 or more,
  "total_messages": 0,
  "total_providers": 0 or more,
  "messages_today": 0,
  "messages_pending_review": 0,
  "active_conversations": 0
}
```

- [ ] Returns 200 OK
- [ ] Valid JSON response
- [ ] Stats present

**Actual Response:** ________________  
**Status:** ⬜ Pass | ⬜ Fail

---

### Test 2.7: Admin Dashboard - Email Flows
```bash
curl "{BACKEND_URL}/api/v1/admin-dashboard/emails/flows"
```

**Expected Response:**
```json
{
  "sent_today": 0,
  "received_today": 0,
  "failed_today": 0,
  "by_type": {},
  "by_provider": [],
  "ai_analyzed": 0,
  "ai_auto_responded": 0
}
```

- [ ] Returns 200 OK
- [ ] Valid JSON response
- [ ] Flow stats present

**Actual Response:** ________________  
**Status:** ⬜ Pass | ⬜ Fail

---

### Test 2.8: Waitlist API - Add Entry
```bash
curl -X POST "{BACKEND_URL}/api/v1/waitlist" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

**Expected Response:**
```json
{
  "id": "...",
  "email": "test@example.com",
  "name": "Test User",
  "created_at": "..."
}
```
OR 409 if duplicate

- [ ] Returns 200 OK or 409
- [ ] Entry created or duplicate detected
- [ ] Valid JSON response

**Actual Response:** ________________  
**Status:** ⬜ Pass | ⬜ Fail

---

## ✅ TEST SUITE 3: INTEGRATION (15 MIN)

### Test 3.1: Frontend → Backend Connection
- [ ] **Action:** Submit waitlist from frontend
- [ ] Open browser DevTools → Network tab
- [ ] Submit email
- [ ] Check API call to backend
- [ ] Backend responds successfully
- [ ] Success message shows

**API Call Visible:** ⬜ Yes | ⬜ No  
**Response Code:** _______  
**Status:** ⬜ Pass | ⬜ Fail  
**Notes:** ________________

---

### Test 3.2: Database Persistence
```bash
# Submit waitlist entry via frontend
# Then check via API:
curl "{BACKEND_URL}/api/v1/admin-dashboard/stats"
```

- [ ] total_users increased
- [ ] Entry persisted in database
- [ ] Data consistent

**Users Count:** Before: _____ After: _____  
**Status:** ⬜ Pass | ⬜ Fail

---

### Test 3.3: Email Notification (If SendGrid Configured)
- [ ] **Action:** Submit waitlist
- [ ] Check your email
- [ ] Welcome/confirmation email received (if implemented)
- [ ] Email contains correct info

**Email Received:** ⬜ Yes | ⬜ No | ⬜ Not Implemented  
**Status:** ⬜ Pass | ⬜ Fail | ⬜ N/A

---

## ✅ TEST SUITE 4: ENVIRONMENT CHECKS (10 MIN)

### Test 4.1: Railway Environment Variables

**Backend Service:**
- [ ] `DATABASE_URL` set
- [ ] `SENDGRID_API_KEY` set (check status from Test 2.2)
- [ ] `SENDGRID_FROM_EMAIL` set
- [ ] `SENDGRID_FROM_NAME` set
- [ ] `OPENAI_API_KEY` set (optional)

**Frontend Service:**
- [ ] `NEXT_PUBLIC_API_URL` set (should point to backend)

**How to Check:**
1. Go to Railway dashboard
2. Click service
3. Go to Variables tab
4. Verify each variable

**Status:** ⬜ Pass | ⬜ Fail  
**Missing Variables:** ________________

---

### Test 4.2: Railway Deployment Status

**Backend:**
- [ ] Service status: Active
- [ ] Build successful
- [ ] No deployment errors
- [ ] Logs show "Application startup complete"

**Frontend:**
- [ ] Service status: Active
- [ ] Build successful
- [ ] No deployment errors

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:** ________________

---

### Test 4.3: DNS & Domain Setup

**Frontend Domain:**
- [ ] `app.forbrugeragent.dk` resolves
- [ ] SSL certificate valid (https://)
- [ ] No browser security warnings

**Backend Domain:**
- [ ] Backend URL accessible
- [ ] SSL certificate valid

**Inbound Email (Future):**
- [ ] MX record for `inbound.forbrugeragent.dk` (not yet setup - OK)

**Status:** ⬜ Pass | ⬜ Fail  
**Notes:** ________________

---

## ✅ TEST SUITE 5: PERFORMANCE & UX (10 MIN)

### Test 5.1: Load Time
- [ ] **Action:** Open `{FRONTEND_URL}` in incognito
- [ ] Measure time to interactive
- [ ] Page loads in < 3 seconds
- [ ] Images load properly
- [ ] No layout shift

**Load Time:** _____ seconds  
**Status:** ⬜ Pass | ⬜ Fail

---

### Test 5.2: Mobile Responsiveness
**Action:** Test on different screen sizes

**iPhone (375px):**
- [ ] Layout works
- [ ] Text readable
- [ ] Buttons clickable
- [ ] Modal works

**iPad (768px):**
- [ ] Layout works
- [ ] Text readable
- [ ] Buttons clickable

**Desktop (1920px):**
- [ ] Layout works
- [ ] Not too wide
- [ ] Centered properly

**Status:** ⬜ Pass | ⬜ Fail

---

### Test 5.3: Browser Compatibility

**Chrome:**
- [ ] All features work
- [ ] No errors

**Safari:**
- [ ] All features work
- [ ] No errors

**Firefox:**
- [ ] All features work
- [ ] No errors

**Status:** ⬜ Pass | ⬜ Fail  
**Issues:** ________________

---

## 📊 TEST SUMMARY

### Overall Results

| Test Suite | Tests | Passed | Failed | N/A |
|------------|-------|--------|--------|-----|
| Frontend | 6 | _____ | _____ | _____ |
| Backend API | 8 | _____ | _____ | _____ |
| Integration | 3 | _____ | _____ | _____ |
| Environment | 3 | _____ | _____ | _____ |
| Performance | 3 | _____ | _____ | _____ |
| **TOTAL** | **23** | **_____** | **_____** | **_____** |

**Pass Rate:** _____% (Target: >90%)

---

## 🐛 ISSUES FOUND

### Critical Issues (P0)
1. ________________
2. ________________
3. ________________

### High Priority (P1)
1. ________________
2. ________________

### Medium Priority (P2)
1. ________________
2. ________________

### Low Priority (P3)
1. ________________

---

## ✅ NEXT STEPS

### Immediate Actions (Today)
- [ ] Fix all P0 issues
- [ ] Verify fixes
- [ ] Re-test failed tests

### Short Term (This Week)
- [ ] Fix P1 issues
- [ ] Implement missing features from analysis
- [ ] Setup monitoring

### Medium Term (Next Week)
- [ ] Start authentication implementation
- [ ] Begin user dashboard
- [ ] Plan onboarding flow

---

## 📝 NOTES & OBSERVATIONS

**General:**
________________

**Positive:**
________________

**Concerns:**
________________

**Recommendations:**
________________

---

## ✍️ SIGN-OFF

**Tester:** ________________  
**Date:** ________________  
**Time Spent:** _____ minutes  
**Overall Assessment:** ⬜ Production Ready | ⬜ Needs Work | ⬜ Critical Issues

**Ready for Beta?** ⬜ Yes | ⬜ No  
**Ready for Public?** ⬜ Yes | ⬜ No

---

## 🔗 QUICK LINKS

**Documentation:**
- `COMPLETE_ANALYSIS_NEXT_STEPS.md` - Full analysis
- `EMAIL_SYSTEM_READY.md` - Email setup guide
- `SENDGRID_QUICK_TEST.md` - Quick test guide

**Commands:**
```bash
# Health check
curl {BACKEND_URL}/health

# SendGrid status
curl {BACKEND_URL}/api/v1/webhooks/sendgrid/test

# Send test email
curl -X POST "{BACKEND_URL}/api/v1/webhooks/sendgrid/test-send?to_email=YOUR_EMAIL"

# Check stats
curl {BACKEND_URL}/api/v1/admin-dashboard/stats
```
