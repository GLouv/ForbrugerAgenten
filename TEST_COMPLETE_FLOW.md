# 🧪 COMPLETE FLOW TEST GUIDE

## 📋 PRE-TEST CHECKLIST

### Backend Setup
- [ ] Database migration applied (`alembic upgrade head`)
- [ ] SendGrid API key configured
- [ ] Backend running on Railway or local

### Frontend Setup
- [ ] `NEXT_PUBLIC_API_URL` configured
- [ ] Frontend deployed or running locally

---

## 🎯 TEST FLOW: COMPLETE USER JOURNEY

### **TEST 1: Authentication** 🔐

#### 1.1 Request Magic Link
1. Go to `/login`
2. Enter email: `test@example.com`
3. Click "Send login link"
4. ✅ **Expected:** "Tjek din email" message

#### 1.2 Verify Email (Manual)
1. Check SendGrid dashboard for sent email
2. Copy magic link URL from email
3. ✅ **Expected:** Email received with link

#### 1.3 Login via Magic Link
1. Paste magic link in browser
2. ✅ **Expected:** Redirect to `/auth/verify`
3. ✅ **Expected:** "Login successful" message
4. ✅ **Expected:** Redirect to `/onboarding` (new user)

---

### **TEST 2: Onboarding** 📝

#### 2.1 Step 1: Profile
1. Fill in:
   - Navn: "Test Bruger"
   - Telefon: "+45 12345678"
   - Adresse: "Testvej 123"
   - Postnummer: "2100"
   - By: "København"
2. Click "Næste"
3. ✅ **Expected:** Progress to Step 2

#### 2.2 Step 2: Services
1. Select services:
   - ✅ Elektricitet
   - ✅ Mobil
2. Click "Næste"
3. ✅ **Expected:** Progress to Step 3
4. ✅ **Expected:** `agent_email` generated in backend

#### 2.3 Step 3: Upload (Optional)
1. Click "Spring over" OR upload a test document
2. ✅ **Expected:** Progress to Step 4

#### 2.4 Step 4: Fuldmagt
1. Check ✅ "Jeg accepterer GDPR vilkår"
2. Check ✅ "Jeg accepterer fuldmagten"
3. Click "Kom i gang!"
4. ✅ **Expected:** Redirect to `/dashboard`

---

### **TEST 3: Dashboard** 📊

#### 3.1 Main Dashboard
1. Verify displayed:
   - Welcome message with name
   - Active services: 2 (Elektricitet, Mobil)
   - Messages: 0
2. ✅ **Expected:** All data correct

#### 3.2 Navigation
1. Click "Indbakke" icon
2. ✅ **Expected:** Redirect to `/inbox`
3. Click back to dashboard
4. Click "Indstillinger" icon
5. ✅ **Expected:** Redirect to `/settings`

---

### **TEST 4: Inbox** 📧

#### 4.1 Empty State
1. Go to `/inbox`
2. ✅ **Expected:** "Ingen beskeder" message

#### 4.2 Receive Test Email
**Backend API Test:**
```bash
curl -X POST ${API_URL}/api/v1/webhooks/sendgrid/test-send \
  -H "Content-Type: application/json" \
  -d '{
    "to_email": "user-xxx@inbound.forbrugeragent.dk",
    "subject": "Test Tilbud",
    "body": "Dette er et test tilbud på el"
  }'
```

3. Refresh `/inbox`
4. ✅ **Expected:** Test message appears
5. Click on message
6. ✅ **Expected:** Message detail shows
7. ✅ **Expected:** Unread indicator disappears

---

### **TEST 5: Settings** ⚙️

#### 5.1 Profile Display
1. Go to `/settings`
2. Verify displayed:
   - Email: `test@example.com`
   - Name: "Test Bruger"
   - Active services: Elektricitet ✅, Mobil ✅
   - Agent email: `user-xxx@inbound.forbrugeragent.dk`
3. ✅ **Expected:** All info correct

#### 5.2 Edit Services
1. Click "Rediger Services"
2. ✅ **Expected:** Redirect to `/onboarding`

---

### **TEST 6: Logout** 🚪

#### 6.1 Logout Flow
1. Click "Log ud" in header
2. ✅ **Expected:** Redirect to `/login`
3. ✅ **Expected:** Session cleared
4. Try to access `/dashboard` directly
5. ✅ **Expected:** Redirect back to `/login`

---

## 🔄 TEST FLOW 2: RETURNING USER

### Login as Existing User
1. Go to `/login`
2. Enter same email: `test@example.com`
3. Request magic link
4. Click link
5. ✅ **Expected:** Redirect to `/dashboard` (NOT onboarding)

---

## 🧪 API ENDPOINT TESTS

### Auth Endpoints
```bash
# 1. Request magic link
curl -X POST ${API_URL}/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# 2. Check session
curl -X GET ${API_URL}/api/v1/auth/check \
  -H "Authorization: Bearer ${SESSION_TOKEN}"

# 3. Get user profile
curl -X GET ${API_URL}/api/v1/auth/me \
  -H "Authorization: Bearer ${SESSION_TOKEN}"

# 4. Logout
curl -X POST ${API_URL}/api/v1/auth/logout \
  -H "Authorization: Bearer ${SESSION_TOKEN}"
```

### Onboarding Endpoints
```bash
# 1. Get status
curl -X GET ${API_URL}/api/v1/onboarding/status \
  -H "Authorization: Bearer ${SESSION_TOKEN}"

# 2. Save profile
curl -X POST ${API_URL}/api/v1/onboarding/profile \
  -H "Authorization: Bearer ${SESSION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "phone": "+45 12345678",
    "address": "Test Street 123",
    "postal_code": "2100",
    "city": "Copenhagen"
  }'

# 3. Save services
curl -X POST ${API_URL}/api/v1/onboarding/services \
  -H "Authorization: Bearer ${SESSION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "wants_energy": true,
    "wants_mobile": true,
    "wants_internet": false
  }'

# 4. Complete onboarding
curl -X POST ${API_URL}/api/v1/onboarding/complete \
  -H "Authorization: Bearer ${SESSION_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"onboarding_completed": true}'
```

### Inbox Endpoints
```bash
# Get messages
curl -X GET ${API_URL}/api/v1/inbox/messages \
  -H "Authorization: Bearer ${SESSION_TOKEN}"

# Mark as read
curl -X PUT ${API_URL}/api/v1/inbox/messages/${MESSAGE_ID}/read \
  -H "Authorization: Bearer ${SESSION_TOKEN}"
```

---

## ✅ SUCCESS CRITERIA

### All tests pass if:
- ✅ Magic link authentication works
- ✅ Onboarding saves data correctly
- ✅ Dashboard loads user data
- ✅ Inbox receives messages
- ✅ Settings displays correctly
- ✅ Logout clears session
- ✅ Protected routes redirect to login
- ✅ Returning user skips onboarding

---

## 🐛 BUG TRACKING

| Bug # | Description | Status | Fix |
|-------|-------------|--------|-----|
| 1     |             |        |     |
| 2     |             |        |     |
| 3     |             |        |     |

---

## 📊 TEST RESULTS

**Date:** ___________  
**Tester:** ___________  
**Environment:** [ ] Local  [ ] Railway Production

**Overall Result:** [ ] ✅ PASS  [ ] ❌ FAIL

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________




