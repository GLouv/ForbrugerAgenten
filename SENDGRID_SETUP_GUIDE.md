# 📧 SENDGRID SETUP GUIDE - FORBRUGERAGENTEN

**Domain:** forbrugeragent.dk  
**Purpose:** Email sending & receiving  
**Status:** Needs verification

---

## 🚀 STEP-BY-STEP SETUP

### 1. Login to SendGrid (5 min)

Go to: https://app.sendgrid.com/

If no account:
- Sign up with Google
- Verify email
- Choose "Free" plan (40,000 emails/month first 30 days)

---

### 2. Domain Authentication (15 min)

**Navigate to:**
Settings → Sender Authentication → Domain Authentication

**Click:** "Authenticate Your Domain"

**Enter:**
- Domain: `forbrugeragent.dk`
- DNS host: Cloudflare ✅

**SendGrid will give you DNS records like:**

```
Type: CNAME
Host: s1._domainkey.forbrugeragent.dk
Value: s1.domainkey.u123456.wl.sendgrid.net

Type: CNAME  
Host: s2._domainkey.forbrugeragent.dk
Value: s2.domainkey.u123456.wl.sendgrid.net

Type: CNAME
Host: em1234.forbrugeragent.dk
Value: u123456.wl.sendgrid.net
```

---

### 3. Add DNS Records to Cloudflare (10 min)

**Go to:** Cloudflare Dashboard → forbrugeragent.dk → DNS → Records

**Add each CNAME record:**
1. Click "Add record"
2. Type: CNAME
3. Name: (copy from SendGrid)
4. Target: (copy from SendGrid)
5. Proxy status: DNS only (grey cloud)
6. Save

**Repeat for all 3 CNAME records**

---

### 4. Verify in SendGrid (wait ~15 min)

Back in SendGrid, click **"Verify"**

If not immediately verified:
- Wait 15-30 minutes
- Check DNS propagation: https://dnschecker.org
- Click "Verify" again

**When verified:** ✅ Green checkmark

---

### 5. Get API Key (5 min)

**Navigate to:**
Settings → API Keys

**Click:** "Create API Key"

**Name:** `forbrugeragent-production`

**Permissions:** Full Access (for now)

**Copy the key** (only shown once!)

**Example:**
```
SG.1234567890abcdef.1234567890abcdefghijklmnopqrstuvwxyz
```

---

### 6. Add to Railway (5 min)

**Go to:** Railway Dashboard → forbrugeragent-backend → Variables

**Add:**
```
SENDGRID_API_KEY=SG.1234567890abcdef...
SENDGRID_FROM_EMAIL=noreply@forbrugeragent.dk
SENDGRID_FROM_NAME=ForbrugerAgenten
```

**Redeploy:**
```bash
# Backend will auto-redeploy with new vars
# Or manually redeploy in Railway dashboard
```

---

### 7. Setup Inbound Parse (15 min)

**Navigate to:**
Settings → Inbound Parse → Add Host & URL

**Hostname:**
```
inbound.forbrugeragent.dk
```

**URL (Webhook):**
```
https://forbrugeragent-backend-production.up.railway.app/api/v1/webhooks/inbound-email
```

**Check:** ☑ POST the raw, full MIME message

**Save**

---

### 8. Add MX Record to Cloudflare (10 min)

**Go to:** Cloudflare → DNS → Records

**Add:**
```
Type: MX
Name: inbound.forbrugeragent.dk
Mail server: mx.sendgrid.net
Priority: 10
```

**Save**

---

### 9. Create Email Templates (30 min)

**Navigate to:**
Email API → Dynamic Templates

**Create 4 templates:**

#### Template 1: Welcome Email
**Name:** `welcome-email`
**Subject:** `Velkommen til ForbrugerAgenten! 🎉`

**Content:**
```html
<p>Hej {{name}},</p>

<p>Velkommen til ForbrugerAgenten! Vi er glade for at have dig med.</p>

<p><strong>Hvad sker der nu?</strong></p>
<ul>
  <li>Vi indhenter tilbud fra selskaber</li>
  <li>Du får besked når tilbud kommer ind</li>
  <li>Du vælger det bedste tilbud</li>
</ul>

<p>Din unikke agent-email: <strong>{{agent_email}}</strong></p>

<p>Har du spørgsmål? Svar bare på denne email.</p>

<p>Med venlig hilsen,<br>
ForbrugerAgenten</p>
```

**Save & get Template ID**

#### Template 2: Quote Notification
**Name:** `quote-notification`
**Subject:** `Nyt tilbud: {{provider_name}} - Spar {{savings}} kr/md 💰`

**Content:**
```html
<p>Hej {{name}},</p>

<p>Godt nyt! Du har fået et nyt tilbud:</p>

<div style="background: #f0f9ff; padding: 20px; border-radius: 8px;">
  <h3>{{provider_name}}</h3>
  <p><strong>Pris:</strong> {{monthly_price}} kr/md</p>
  <p><strong>Du sparer:</strong> {{savings}} kr/md 🎉</p>
</div>

<p><a href="{{app_link}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Se tilbud i appen</a></p>

<p>Med venlig hilsen,<br>
ForbrugerAgenten</p>
```

**Save & get Template ID**

#### Template 3: Reminder Email
**Name:** `reminder-email`
**Subject:** `Vi venter stadig på svar fra {{provider_name}} ⏰`

**Content:**
```html
<p>Hej {{name}},</p>

<p>Vi har rykket {{provider_name}} for et tilbud på {{category}}.</p>

<p>Vi giver dig besked når vi hører fra dem.</p>

<p>Med venlig hilsen,<br>
ForbrugerAgenten</p>
```

**Save & get Template ID**

#### Template 4: Support Confirmation
**Name:** `support-confirmation`
**Subject:** `Vi har modtaget din henvendelse 📬`

**Content:**
```html
<p>Hej {{name}},</p>

<p>Tak for din henvendelse. Vi vender tilbage inden for 24 timer.</p>

<p><strong>Dit emne:</strong> {{subject}}</p>

<p>Med venlig hilsen,<br>
ForbrugerAgenten</p>
```

**Save & get Template ID**

---

### 10. Add Template IDs to Railway (5 min)

**Go to:** Railway → Variables

**Add:**
```
SENDGRID_TEMPLATE_WELCOME=d-1234567890abcdef
SENDGRID_TEMPLATE_QUOTE=d-abcdef1234567890
SENDGRID_TEMPLATE_REMINDER=d-567890abcdef1234
SENDGRID_TEMPLATE_SUPPORT=d-cdef1234567890ab
```

---

## ✅ VERIFICATION CHECKLIST

After 24 hours, verify:

- [ ] Domain authenticated in SendGrid
- [ ] API key works (test email sent)
- [ ] Inbound parse receives emails
- [ ] All 4 templates created
- [ ] Template IDs in Railway
- [ ] Test email sending from app
- [ ] Test email receiving (inbound)

---

## 🧪 TESTING

**Test Sending:**
```bash
curl -X POST https://forbrugeragent-backend-production.up.railway.app/api/v1/test/send-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@example.com"}'
```

**Test Receiving:**
Send email to: `test@inbound.forbrugeragent.dk`

Check logs:
```bash
railway logs -f
```

---

## 🚨 TROUBLESHOOTING

**Domain not verifying?**
- Wait 30 minutes
- Check DNS records in Cloudflare
- Use dnschecker.org
- Contact SendGrid support

**Emails not sending?**
- Check API key is correct
- Check from_email is verified
- Check Railway logs for errors

**Inbound not working?**
- Check MX record is correct
- Check webhook URL is accessible
- Check Railway logs

---

## 📊 EXPECTED TIMELINE

| Task | Time |
|------|------|
| SendGrid signup | 5 min |
| Domain authentication setup | 15 min |
| DNS records to Cloudflare | 10 min |
| **Wait for DNS propagation** | **15-30 min** |
| Verify domain | 2 min |
| Get API key | 5 min |
| Add to Railway | 5 min |
| Setup inbound parse | 15 min |
| Add MX record | 10 min |
| Create templates | 30 min |
| Add template IDs | 5 min |
| **Testing** | 15 min |
| **TOTAL** | **~2 hours + 30 min wait** |

---

## 🎯 START NOW!

**Go to:** https://app.sendgrid.com/

**Click:** "Authenticate Your Domain"

**LET ME KNOW WHEN YOU'RE AT THE DNS RECORDS STEP!** 🚀
