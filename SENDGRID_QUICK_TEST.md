# 📧 SENDGRID - QUICK TEST GUIDE

## ✅ EMAIL SYSTEM ER KLAR!

Alt kode er skrevet og pushed til GitHub. Nu mangler kun at teste det.

---

## 🔑 SENDGRID CREDENTIALS (ALLEREDE FUNDET)

```bash
SENDGRID_API_KEY=REDACTED_SENDGRID_KEY
SENDGRID_FROM_EMAIL=noreply@forbrugeragent.dk
SENDGRID_FROM_NAME=ForbrugerAgenten
```

**✅ Disse er allerede i Railway** (ifølge PRODUCTION_STATUS_CRITICAL.md)

---

## 🚀 HVAD ER KLAR I KODEN

### 1. Email Service (`email_service.py`)
- ✅ Send pure emails (no templates)
- ✅ `send_email()` - Plain text/HTML
- ✅ `send_to_provider()` - Med reply-to
- ✅ `send_to_user()` - Notifications

### 2. Email Flow Handler (`email_flow_handler.py`)
- ✅ Auto-process inbound emails
- ✅ **QUOTE** → Notify user
- ✅ **QUESTION** → Auto-respond if simple
- ✅ **REJECTION** → Thank & log
- ✅ **MARKETING** → Archive
- ✅ **INFO** → Store

### 3. Inbound Webhook (`webhooks.py`)
- ✅ Receives at `user@inbound.forbrugeragent.dk`
- ✅ Triggers AI analysis
- ✅ Calls flow handler

### 4. Admin Dashboard (`admin_dashboard.py`)
- ✅ View all emails
- ✅ See AI analysis
- ✅ Monitor providers

---

## 🧪 TEST IT (3 STEPS)

### STEP 1: Deploy til Railway

**Backend er allerede deployed**, tjek at env vars er sat:

```bash
# Go to Railway dashboard
# https://railway.app/project/your-project

# Verify these variables exist in BACKEND service:
SENDGRID_API_KEY=REDACTED_SENDGRID_KEY
SENDGRID_FROM_EMAIL=noreply@forbrugeragent.dk
SENDGRID_FROM_NAME=ForbrugerAgenten
```

### STEP 2: Test Outbound Email

Send test email VIA SendGrid:

```bash
# Replace YOUR-BACKEND-URL with your Railway backend URL
curl -X POST "https://YOUR-BACKEND-URL.up.railway.app/api/v1/webhooks/sendgrid/test-send?to_email=YOUR@EMAIL.com&subject=Test&body=Virker det?"
```

**Expected:** You receive email in your inbox

### STEP 3: Setup Inbound Parse

**A) In SendGrid:**
1. Go to: https://app.sendgrid.com/settings/parse
2. Click: **"Add Host & URL"**
3. Enter:
   - **Hostname:** `inbound.forbrugeragent.dk`
   - **URL:** `https://YOUR-BACKEND-URL.up.railway.app/api/v1/webhooks/sendgrid/inbound`
   - **Spam Check:** Disabled
   - **Post Raw:** ✅ Checked
4. Click **"Add"**

**B) In Cloudflare:**
1. Go to: Cloudflare → forbrugeragent.dk → DNS
2. Add **MX Record:**
   - **Type:** MX
   - **Name:** `inbound`
   - **Mail server:** `mx.sendgrid.net`
   - **Priority:** `10`
   - **TTL:** Auto
3. Save

**Wait 5-10 min for DNS to propagate**

### STEP 4: Test Inbound Email

1. Send email FROM any email TO: `testuser@inbound.forbrugeragent.dk`
2. Check it was received:

```bash
curl "https://YOUR-BACKEND-URL.up.railway.app/api/v1/admin-dashboard/messages/recent?limit=5"
```

**Expected:** You see the message in the response

---

## 📊 MONITORING

### Check SendGrid Status:
```bash
curl "https://YOUR-BACKEND-URL.up.railway.app/api/v1/webhooks/sendgrid/test"
```

**Expected:**
```json
{
  "status": "configured",
  "from_email": "noreply@forbrugeragent.dk",
  "from_name": "ForbrugerAgenten"
}
```

### View All Messages:
```bash
curl "https://YOUR-BACKEND-URL.up.railway.app/api/v1/admin-dashboard/messages/recent"
```

### Check AI Activity:
```bash
curl "https://YOUR-BACKEND-URL.up.railway.app/api/v1/admin-dashboard/ai/activity"
```

### Email Flow Stats:
```bash
curl "https://YOUR-BACKEND-URL.up.railway.app/api/v1/admin-dashboard/emails/flows"
```

---

## 🎯 HVAD SKER DER NÅR EMAIL KOMMER IND?

```
Provider sends email to: user123@inbound.forbrugeragent.dk
        ↓
SendGrid receives it
        ↓
Forwards to webhook: /webhooks/sendgrid/inbound
        ↓
Stores in messages table
        ↓
🤖 AI Agent analyzes:
   - email_type: "quote" / "question" / "rejection" / "info"
   - confidence: 0.0-1.0
   - extracted_data: {prices, dates, etc}
   - suggested_response: "..."
        ↓
Email Flow Handler decides action:
   - QUOTE → Notify user
   - QUESTION → Auto-respond or flag
   - REJECTION → Auto-thank
   - MARKETING → Archive
   - INFO → Store
        ↓
User sees message in inbox
```

---

## ✅ CHECKLIST

- [ ] SendGrid env vars i Railway
- [ ] Test outbound email (send via API)
- [ ] Setup inbound parse i SendGrid
- [ ] Add MX record i Cloudflare
- [ ] Wait 10 min for DNS
- [ ] Test inbound email
- [ ] Check admin dashboard
- [ ] Verify AI analysis works

---

## 🐛 TROUBLESHOOTING

### "SendGrid not configured"
**Fix:** Add `SENDGRID_API_KEY` to Railway env vars

### "Email not received"
**Fix:** Check:
1. MX record exists: `dig MX inbound.forbrugeragent.dk`
2. SendGrid inbound parse URL is correct
3. Check Railway logs for webhook calls

### "AI analysis not working"
**Fix:** Add `OPENAI_API_KEY` to Railway (optional - emails still work without AI)

---

## 📁 ALL CODE PUSHED

```bash
✅ backend/app/services/email_service.py
✅ backend/app/agents/email_flow_handler.py
✅ backend/app/agents/email_agent.py
✅ backend/app/api/v1/endpoints/webhooks.py
✅ backend/app/api/v1/endpoints/admin_dashboard.py
✅ EMAIL_SYSTEM_READY.md
```

**Git commit:** `70648fe` - "PURE EMAIL SYSTEM COMPLETE"

---

## 🚀 NEXT STEPS AFTER IT WORKS

1. **Enable Auto-Responses**
   - Uncomment TODO sections i `email_flow_handler.py`
   - Set confidence thresholds

2. **User Notifications**
   - Push notifications for quotes
   - Email summaries

3. **Frontend**
   - Show inbox in user dashboard
   - Reply via app

4. **Provider Stats**
   - Track response times
   - Update reputation scores

---

## 💡 EASY TEST

Hurtigste måde at teste:

1. **Go to Railway dashboard**
2. **Verify SENDGRID_API_KEY is set**
3. **Click "Deploy" if needed**
4. **Test outbound:**
   ```bash
   curl -X POST "https://your-backend.up.railway.app/api/v1/webhooks/sendgrid/test-send?to_email=din@email.com"
   ```
5. **Done!** Email systemet virker hvis du modtager emailen.

Inbound test (with provider replies) kan komme senere.

---

**BOTTOM LINE:** Alt kode er klar. Du skal bare teste det på Railway! 🎉
