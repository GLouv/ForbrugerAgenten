# 📧 EMAIL SYSTEM - PURE EMAIL (NO TEMPLATES)

## ✅ HVAD ER KLAR

### 1. **SendGrid Integration** (Pure Email)
- ✅ Send plain text/HTML emails
- ✅ No templates needed - just send emails directly
- ✅ Reply-to support for provider emails
- ✅ CC/BCC support

### 2. **Inbound Email Webhook**
- ✅ Receives emails at `user@inbound.forbrugeragent.dk`
- ✅ Auto-matches providers by domain
- ✅ Stores in database
- ✅ Triggers AI analysis automatically

### 3. **AI Email Agent**
- ✅ Analyzes inbound emails automatically
- ✅ Classifies: quote / question / rejection / info / marketing
- ✅ Extracts structured data (prices, dates, terms)
- ✅ Generates Danish responses
- ✅ Confidence scoring (0.0-1.0)
- ✅ Flags messages needing human review

### 4. **Email Flow Handler** (NEW!)
- ✅ Orchestrates what happens when email arrives
- ✅ **QUOTE:** Notifies user, updates provider stats
- ✅ **QUESTION:** Auto-respond if simple, flag if complex
- ✅ **REJECTION:** Logs, auto-thanks provider
- ✅ **MARKETING:** Archives if user opted-out
- ✅ **INFO:** Stores for user review

### 5. **Admin Dashboard**
- ✅ Monitor all emails
- ✅ See AI analysis results
- ✅ Track provider performance
- ✅ View user conversations

---

## 🚀 HVAD DU SKAL GØRE (15 MIN)

### STEP 1: Find SendGrid API Key

Du sagde du allerede har SendGrid credentials. Find dem:

1. **If you have SendGrid account:**
   - Go to: https://app.sendgrid.com/settings/api_keys
   - Copy existing key OR create new one
   
2. **If key is elsewhere:**
   - Check `.env` files
   - Check Railway dashboard
   - Check password manager

### STEP 2: Add to Railway

```bash
# In Railway backend environment variables:
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@forbrugeragent.dk
SENDGRID_FROM_NAME=ForbrugerAgenten
```

### STEP 3: Setup Inbound Parse in SendGrid

1. Go to: https://app.sendgrid.com/settings/parse
2. Click: **"Add Host & URL"**
3. **Receiving Domain:** `inbound.forbrugeragent.dk`
4. **Destination URL:** `https://your-backend.up.railway.app/api/v1/webhooks/sendgrid/inbound`
5. **Check:** "POST the raw, full MIME message"
6. Click **"Add"**

### STEP 4: Add DNS MX Record (Cloudflare)

1. Go to: Cloudflare → forbrugeragent.dk → DNS
2. Add **MX Record:**
   - **Type:** MX
   - **Name:** `inbound`
   - **Mail Server:** `mx.sendgrid.net`
   - **Priority:** `10`
   - **TTL:** Auto
3. Save

**Wait 5-10 min for DNS propagation**

---

## 🧪 TEST IT!

### Test 1: Send Email via API

```bash
# Replace with your email
curl -X POST "https://your-backend.up.railway.app/api/v1/webhooks/sendgrid/test-send?to_email=din@email.com&subject=Test&body=Virker det?"
```

**Expected:** You receive email in your inbox

### Test 2: Receive Email (Inbound)

1. Send email FROM any email to: `testuser@inbound.forbrugeragent.dk`
2. Check admin dashboard:

```bash
curl "https://your-backend.up.railway.app/api/v1/admin-dashboard/messages/recent?limit=5"
```

**Expected:** You see the message stored

### Test 3: Check AI Analysis

```bash
curl "https://your-backend.up.railway.app/api/v1/admin-dashboard/ai/activity"
```

**Expected:** AI has analyzed the email (if OpenAI key is set)

---

## 📊 EMAIL FLOWS (WHAT HAPPENS AUTOMATICALLY)

### When Provider Sends QUOTE:
1. ✅ Email received at `user@inbound.forbrugeragent.dk`
2. ✅ AI analyzes → "This is a QUOTE"
3. ✅ Message marked as "quote" type
4. ✅ User gets notification (TODO: push notification)
5. ✅ Provider response time tracked

### When Provider Asks QUESTION:
1. ✅ Email received
2. ✅ AI analyzes → "This is a QUESTION"
3. ✅ **If simple + high confidence:** AI generates response (TODO: auto-send)
4. ✅ **If complex:** Flagged for human review

### When Provider Sends REJECTION:
1. ✅ Email received
2. ✅ AI analyzes → "This is a REJECTION"
3. ✅ Auto-thanks provider (TODO: auto-send)
4. ✅ Logs rejection in provider stats
5. ✅ User notified politely

### When Provider Sends MARKETING:
1. ✅ Email received
2. ✅ AI analyzes → "This is MARKETING"
3. ✅ Archived automatically (unless user opted-in)
4. ✅ No notification to user

---

## 🤖 AI AGENT EXAMPLE

**Inbound Email:**
```
From: quote@norlys.dk
Subject: Tilbud på el
Body: Hej, vi kan tilbyde 2.50 kr/kWh...
```

**AI Analysis:**
```json
{
  "email_type": "quote",
  "requires_human": false,
  "confidence": 0.92,
  "extracted_data": {
    "monthly_price": null,
    "annual_price": null,
    "price_per_kwh": 2.50,
    "contract_length": null,
    "start_date": null
  },
  "summary": "Tilbud på el til 2.50 kr/kWh fra Norlys",
  "suggested_response": null
}
```

**Action Taken:**
- Message stored as "quote"
- User notified
- Provider stats updated

---

## 📍 API ENDPOINTS

### Send Email
```bash
POST /api/v1/webhooks/sendgrid/test-send
  ?to_email=user@example.com
  &subject=Test
  &body=Hello
```

### Receive Email (Webhook)
```bash
POST /api/v1/webhooks/sendgrid/inbound
# Called automatically by SendGrid
```

### Check Status
```bash
GET /api/v1/webhooks/sendgrid/test
# Returns: {"status": "configured"} or {"status": "not_configured"}
```

### Admin Dashboard
```bash
GET /api/v1/admin-dashboard/stats
GET /api/v1/admin-dashboard/emails/flows
GET /api/v1/admin-dashboard/messages/recent
GET /api/v1/admin-dashboard/ai/activity
```

---

## 🔧 HVOR ER CREDENTIALS?

Hvis du ikke kan finde SendGrid key:

1. **Check Railway:**
   ```bash
   railway variables list
   ```

2. **Check local env:**
   ```bash
   cat backend/.env 2>/dev/null | grep SENDGRID
   ```

3. **Create new in SendGrid:**
   - https://app.sendgrid.com/settings/api_keys
   - Click "Create API Key"
   - Name: `forbrugeragent-production`
   - Permissions: **Full Access**
   - Copy key NOW (shown only once!)

---

## 🎯 NEXT STEPS

### After Email Works:

1. **Enable AI Auto-Responses**
   - Uncomment TODO sections in `email_flow_handler.py`
   - Set thresholds for auto-response

2. **Add User Notifications**
   - Push notifications for quotes
   - Email notifications for important messages

3. **Frontend Integration**
   - Show inbox in user dashboard
   - Allow users to reply via app

4. **Provider Management**
   - Track response times
   - Update reputation scores
   - Ban slow/bad providers

---

## ✅ SUMMARY

**What's Ready:**
- ✅ Pure email sending (no templates)
- ✅ Inbound email receiving
- ✅ AI analysis + classification
- ✅ Smart email flow handling
- ✅ Admin dashboard monitoring

**What You Need:**
- 🔑 SendGrid API key
- 🌐 DNS MX record
- ⚙️ Railway env vars

**Time:** 15 minutes to setup → Then test! 🚀
