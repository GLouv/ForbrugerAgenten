# 🚂 RAILWAY ENV VARS - QUICK GUIDE

## 📍 Gå til Railway

1. **Åbn:** https://railway.app/dashboard
2. **Find:** "agent360dk / Sales" projekt (12 services)
3. **Klik på projektet**

---

## ⚙️ Tilføj Environment Variables

### Find Backend Service:
- Klik på **backend** service (eller den service der kører ForbrugerAgent backend)
- Klik på **Variables** tab

### Tilføj Disse 6 Variables:

```bash
# 1. OpenAI API Key (til bill parsing & chat)
OPENAI_API_KEY=REDACTED_OPENAI_KEY

# 2. OpenAI Model
OPENAI_MODEL=gpt-4

# 3. Auth0 Domain
AUTH0_DOMAIN=agent360.eu.auth0.com

# 4. Auth0 Client ID
AUTH0_CLIENT_ID=IDpoVPxWlD4DkeUAxw4cTnI5Liy4Trls

# 5. Auth0 Client Secret
AUTH0_CLIENT_SECRET=54zSwHxNOk-24ZGEG9XpEDUGeG0V4i5O_IgX5P3UHgJQ7E2WJjXWQQNgiS0pckOG

# 6. Auth0 API Identifier
AUTH0_API_IDENTIFIER=https://api.forbrugeragent.dk
```

### Sådan Tilføjer Du:

For hver variable:
1. Klik **"+ New Variable"**
2. Indtast **Name** (f.eks. `OPENAI_API_KEY`)
3. Indtast **Value** (hele nøglen)
4. Klik **"Add"**

### Efter Alle Er Tilføjet:

1. Klik **"Deploy"** eller vent på auto-deploy
2. Tjek **Deployments** tab for status
3. Vent 2-5 minutter på deployment

---

## ✅ Verificer

```bash
# Test Railway backend
curl https://[din-railway-backend-url]/health

# Skal returnere:
{
  "status": "healthy",
  "database": "connected",
  "ai": "ready"
}
```

---

**Tid:** 20 minutter  
**Når færdig:** Backend er 100% production ready! 🚀




