# 📧 SENDGRID SETUP GUIDE - ForbrugerAgenten

## ✅ HVAD DU SKAL GØRE (30 MIN)

### STEP 1: Get API Key (5 min)

1. Go to SendGrid: https://app.sendgrid.com/
2. Navigate to: **Settings → API Keys**
3. Click: **"Create API Key"**
4. Name: `forbrugeragent-production`
5. Permissions: **Full Access** (eller minimum: Mail Send + Inbound Parse)
6. Click **"Create & View"**
7. **COPY KEY NOW** (vises kun én gang!)

### STEP 2: Add to Railway (2 min)

```bash
# Go to Railway dashboard
# https://railway.app/project/your-project

# Add these environment variables to BACKEND:
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@forbrugeragent.dk
SENDGRID_FROM_NAME=ForbrugerAgenten
```

---

## STEP 3: Create Email Templates (15 min)

Go to: **Email API → Dynamic Templates → Create a Dynamic Template**

### Template 1: Welcome Email

**Name:** `Welcome - ForbrugerAgenten`

**Subject:** `Velkommen til ForbrugerAgenten! 🎉`

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Velkommen til ForbrugerAgenten! 🎉</h1>
    </div>
    
    <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">Hej {{user_name}},</p>
        
        <p style="font-size: 16px; color: #333;">
            Tak fordi du har tilmeldt dig ForbrugerAgenten! 🚀
        </p>
        
        <p style="font-size: 16px; color: #333;">
            Vi hjælper dig med at spare penge på el, internet og mobil - helt automatisk.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin-top: 0; color: #667eea;">Sådan kommer du i gang:</h3>
            <ol style="color: #555; line-height: 1.8;">
                <li>Log ind på din konto</li>
                <li>Giv os fuldmagt til at handle på dine vegne</li>
                <li>Vi kontakter selskaberne og finder de bedste tilbud</li>
                <li>Du godkender og sparer penge! 💰</li>
            </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{login_url}}" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Log ind nu
            </a>
        </div>
        
        <p style="font-size: 14px; color: #777; margin-top: 40px;">
            Har du spørgsmål? Skriv til os på <a href="mailto:{{support_email}}" style="color: #667eea;">{{support_email}}</a>
        </p>
    </div>
</body>
</html>
```

**After creating, COPY TEMPLATE ID** (starts with `d-`)

---

### Template 2: Quote Notification

**Name:** `Quote Notification`

**Subject:** `Nyt tilbud fra {{provider_name}}! 💰`

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #4caf50; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Du har fået et nyt tilbud! 💰</h1>
    </div>
    
    <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">Hej {{user_name}},</p>
        
        <p style="font-size: 16px; color: #333;">
            <strong>{{provider_name}}</strong> har sendt dig et tilbud:
        </p>
        
        <div style="background: #f1f8f4; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4caf50;">
            <h2 style="margin: 0 0 10px 0; color: #4caf50;">{{quote_amount}}</h2>
            <p style="margin: 0; color: #555;">{{quote_description}}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{view_url}}" style="background: #4caf50; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Se tilbuddet
            </a>
        </div>
        
        <p style="font-size: 14px; color: #777; margin-top: 30px;">
            Du kan altid se alle dine tilbud i appen.
        </p>
    </div>
</body>
</html>
```

---

### Template 3: Reminder

**Name:** `Reminder`

**Subject:** `Påmindelse: {{reminder_type}}`

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #ff9800; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Påmindelse 🔔</h1>
    </div>
    
    <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">Hej {{user_name}},</p>
        
        <p style="font-size: 16px; color: #333;">{{message}}</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{action_url}}" style="background: #ff9800; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Tag action
            </a>
        </div>
    </div>
</body>
</html>
```

---

### Template 4: Support Confirmation

**Name:** `Support Confirmation`

**Subject:** `Vi har modtaget din henvendelse ✅`

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #2196f3; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Support 💬</h1>
    </div>
    
    <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">Hej {{user_name}},</p>
        
        <p style="font-size: 16px; color: #333;">
            Vi har modtaget din henvendelse og vender tilbage hurtigst muligt.
        </p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0; color: #777; font-size: 14px;"><strong>Ticket ID:</strong> {{ticket_id}}</p>
            <p style="margin: 10px 0 0 0; color: #555;">{{message}}</p>
        </div>
        
        <p style="font-size: 14px; color: #777;">
            Forventet svartid: <strong>24 timer</strong>
        </p>
    </div>
</body>
</html>
```

---

### Template 5: Company Request (To Providers)

**Name:** `Company Request`

**Subject:** `Forespørgsel fra ForbrugerAgenten - {{request_type}}`

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <p>Hej {{provider_name}},</p>
    
    <p>Vi er ForbrugerAgenten - en digital forbrugerrådgiver som hjælper danskere med at finde de bedste aftaler på el, internet og mobil.</p>
    
    <p>Vi har en kunde som er interesseret i jeres {{request_type}}-løsninger.</p>
    
    <p><strong>Kundens email:</strong> {{user_agent_email}}</p>
    
    <p>Send venligst et tilbud til ovenstående email. Kunden har givet os fuldmagt til at handle på deres vegne.</p>
    
    <p>Med venlig hilsen,<br>ForbrugerAgenten</p>
</body>
</html>
```

---

### Template 6: Deal Confirmation

**Name:** `Deal Confirmation`

**Subject:** `Dit skift til {{provider_name}} er bekræftet! 🎉`

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #4caf50; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Tillykke! 🎉</h1>
    </div>
    
    <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">Hej {{user_name}},</p>
        
        <p style="font-size: 16px; color: #333;">
            Dit skift til <strong>{{provider_name}}</strong> er nu bekræftet!
        </p>
        
        <div style="background: #f1f8f4; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <p><strong>Type:</strong> {{deal_type}}</p>
            <p><strong>Pris:</strong> {{deal_amount}}</p>
            <p><strong>Start dato:</strong> {{start_date}}</p>
        </div>
        
        <h3>Næste skridt:</h3>
        <ol style="line-height: 1.8;">
            {{#each next_steps}}
            <li>{{this}}</li>
            {{/each}}
        </ol>
        
        <p style="font-size: 14px; color: #777; margin-top: 30px;">
            Spørgsmål? Kontakt os på {{support_email}}
        </p>
    </div>
</body>
</html>
```

---

## STEP 4: Copy Template IDs (5 min)

After creating each template, COPY the Template ID and add to Railway:

```bash
# In Railway backend environment variables:
SENDGRID_TEMPLATE_WELCOME=d-xxxxxxxxxxxxxxxxxx
SENDGRID_TEMPLATE_QUOTE=d-xxxxxxxxxxxxxxxxxx
SENDGRID_TEMPLATE_REMINDER=d-xxxxxxxxxxxxxxxxxx
SENDGRID_TEMPLATE_SUPPORT=d-xxxxxxxxxxxxxxxxxx
SENDGRID_TEMPLATE_COMPANY_REQUEST=d-xxxxxxxxxxxxxxxxxx
SENDGRID_TEMPLATE_DEAL_CONFIRM=d-xxxxxxxxxxxxxxxxxx
```

---

## STEP 5: Setup Inbound Parse (10 min)

### 5.1 In SendGrid:

1. Go to: **Settings → Inbound Parse → Webhooks**
2. Click: **"Add Host & URL"**
3. **Receiving Domain:** `inbound.forbrugeragent.dk`
4. **Destination URL:** `https://your-railway-backend.up.railway.app/api/v1/webhooks/sendgrid/inbound`
5. Click **"Add"**

### 5.2 In Cloudflare (DNS):

Go to: **forbrugeragent.dk → DNS → Records**

Add **MX Record:**
- **Type:** MX
- **Name:** `inbound`
- **Mail Server:** `mx.sendgrid.net`
- **Priority:** `10`
- **TTL:** Auto

---

## ✅ DONE! TEST IT

### Test Sending:

```bash
curl -X POST "https://your-railway-backend.up.railway.app/api/v1/webhooks/sendgrid/test-send?to_email=your@email.com"
```

### Test Receiving:

Send email to: `testuser@inbound.forbrugeragent.dk`

Check admin dashboard:
```bash
curl "https://your-railway-backend.up.railway.app/api/v1/admin-dashboard/messages/recent?limit=5"
```

---

## 📊 ADMIN DASHBOARD ENDPOINTS

### View Email Stats:
```
GET /api/v1/admin-dashboard/stats
GET /api/v1/admin-dashboard/emails/flows
GET /api/v1/admin-dashboard/messages/recent
GET /api/v1/admin-dashboard/ai/activity
```

### Monitor Providers:
```
GET /api/v1/admin-dashboard/providers/performance
```

### User Details:
```
GET /api/v1/admin-dashboard/users/{user_id}/detail
```

---

## 🤖 AI EMAIL AGENT

AI'en analyserer automatisk alle inbound emails:

1. **Klassificerer type:** quote, question, rejection, info, marketing
2. **Udtrækker data:** Priser, datoer, contract terms
3. **Genererer svar:** Foreslår passende response
4. **Flagger review:** Markerer komplekse emails til human review

**Konfidence scoring:** 0.0-1.0 (høj = AI kan håndtere, lav = human needed)

---

## 🎉 DONE!

Du har nu:
- ✅ SendGrid fuldt integreret
- ✅ 6 email templates klar
- ✅ Inbound email modtagelse
- ✅ AI agent til email analyse
- ✅ Admin dashboard til monitoring

**Alle emails bliver logget og kan ses i admin dashboard!**
