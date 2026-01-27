# 🌐 CLOUDFLARE DNS RECORDS - QUICK GUIDE

## ✅ Hvad er allerede gjort:
1. ✅ Cloudflare konto oprettet
2. ✅ `forbrugeragent.dk` tilføjet til Cloudflare
3. ✅ Free plan accepteret
4. ✅ **Nordicway nameservers opdateret til:**
   - `alla.ns.cloudflare.com`
   - `ricardo.ns.cloudflare.com`

---

## 📋 NÆSTE TRIN: Tilføj 6 DNS Records i Cloudflare

**URL:** https://dash.cloudflare.com/c35f7a3a2e774b61b92574cc4ddc6553/forbrugeragent.dk/dns/records

### Sådan tilføjer du hver record:

1. Klik på den **blå "Add record"** knap
2. Udfyld felterne som beskrevet nedenfor
3. **VIGTIGT:** Slå "Proxy status" til **OFF** (grå sky ikon) for CNAME records
4. Klik "Save"
5. Gentag for alle 6 records

---

## 🔹 CNAME RECORD #1

- **Type:** CNAME (vælg fra dropdown)
- **Name:** `url277`
- **Target:** `sendgrid.net`
- **TTL:** Auto
- **Proxy:** OFF (grå sky)
- Klik **Save**

---

## 🔹 CNAME RECORD #2

- **Type:** CNAME
- **Name:** `57215056`
- **Target:** `sendgrid.net`
- **TTL:** Auto
- **Proxy:** OFF
- Klik **Save**

---

## 🔹 CNAME RECORD #3

- **Type:** CNAME
- **Name:** `em6800`
- **Target:** `u57215056.wl057.sendgrid.net`
- **TTL:** Auto
- **Proxy:** OFF
- Klik **Save**

---

## 🔹 CNAME RECORD #4

- **Type:** CNAME
- **Name:** `s1._domainkey`
- **Target:** `s1.domainkey.u57215056.wl057.sendgrid.net`
- **TTL:** Auto
- **Proxy:** OFF
- Klik **Save**

---

## 🔹 CNAME RECORD #5

- **Type:** CNAME
- **Name:** `s2._domainkey`
- **Target:** `s2.domainkey.u57215056.wl057.sendgrid.net`
- **TTL:** Auto
- **Proxy:** OFF
- Klik **Save**

---

## 🔹 TXT RECORD #6

- **Type:** TXT (vælg fra dropdown)
- **Name:** `_dmarc`
- **Content:** `v=DMARC1; p=none;`
- **TTL:** Auto
- Klik **Save**

---

## ⏰ EFTER ALLE RECORDS ER TILFØJET:

1. **Vent 15-30 minutter** for nameserver propagering
2. **Gå til SendGrid** dashboard
3. **Verificer domænet** (klik "Verify" knappen)
4. ✅ **DONE!**

---

## 🎯 RESULTAT:

Når alle records er tilføjet og verificeret i SendGrid, vil:
- ✅ Email-afsendelse virke fra `noreply@forbrugeragent.dk`
- ✅ DMARC protection være aktiveret
- ✅ SendGrid SPF og DKIM være konfigureret
- ✅ Systemet være 100% klar til email kommunikation

---

**Estimeret tid:** 10 minutter for at tilføje records + 20 minutter vente tid for propagering = **30 minutter total**


