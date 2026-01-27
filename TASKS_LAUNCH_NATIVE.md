# 🚀 LAUNCH TASKS - NATIVE HYBRID

**Launch Date:** 7. Januar 2026 (Web) / 15-20. Januar (Native)  
**Status Updated:** 14. December 2025

---

## 🔴 FASE 1: CRITICAL FOUNDATION (14-20 DEC)

### 🔐 CRIIPTO MITID SETUP (Priority: CRITICAL)

**Backend Tasks:**
- [ ] Create Criipto account (criipto.com) - 30 min
- [ ] Get domain, client_id, client_secret - 15 min
- [ ] Add to Railway env vars - 10 min
- [ ] Create `backend/app/services/criipto_service.py` - 2h
  - [ ] `initiate_login()` method
  - [ ] `handle_callback()` method
  - [ ] `get_user_info()` method
  - [ ] `create_or_login_user()` method
- [ ] Create endpoint `/api/v1/auth/mitid/login` - 30 min
- [ ] Create endpoint `/api/v1/auth/mitid/callback` - 1h
- [ ] Update User model with `mitid_sub` field - 30 min
- [ ] Write tests for Criipto service - 1h
- [ ] Test with test MitID credentials - 1h

**Frontend Tasks:**
- [ ] Create `frontend/src/lib/criipto.ts` - 30 min
- [ ] Create `frontend/src/app/mitid/callback/page.tsx` - 1h
- [ ] Update login page to use MitID button - 30 min
- [ ] Handle callback, save token, redirect - 1h
- [ ] Add loading states - 30 min
- [ ] Add error handling - 30 min
- [ ] Test full flow locally - 1h
- [ ] Test on Railway staging - 1h

**Total:** ~12-16 hours

---

### 📄 POLICY PAGES (Priority: CRITICAL)

**Content Writing:**
- [ ] Write Privatlivspolitik (Privacy Policy) - dansk - 2h
- [ ] Write Vilkår & Betingelser (Terms) - dansk - 2h
- [ ] Write Cookie Politik - dansk - 1h
- [ ] Review all policies for legal compliance - 1h

**Frontend Implementation:**
- [ ] Create `frontend/src/app/privacy/page.tsx` - 30 min
- [ ] Create `frontend/src/app/terms/page.tsx` - 30 min
- [ ] Create `frontend/src/app/cookies/page.tsx` - 30 min
- [ ] Style pages consistently - 1h
- [ ] Add footer links to policies - 15 min
- [ ] Update onboarding consent links - 15 min
- [ ] Test all policy pages - 30 min

**Total:** ~9-12 hours

---

### 🐛 CORE BUG FIXES (Priority: CRITICAL)

**Backend:**
- [ ] Fix inbox MessageStatus enum issue - 1h
  - Change from Enum to String literals
  - Update all queries
  - Test endpoints
- [ ] Test all `/api/v1/inbox/*` endpoints - 2h
- [ ] Run full pytest suite - 30 min
- [ ] Fix any failing tests - 2h
- [ ] Verify database migrations work - 30 min

**Frontend:**
- [ ] Fix indentation issues (dashboard.tsx) - ✅ Done
- [ ] Test all pages load - 1h
- [ ] Fix any console errors - 1h
- [ ] Test API calls work - 1h

**Deployment:**
- [ ] Deploy to Railway - 15 min
- [ ] Run migrations on Railway - 10 min
- [ ] Smoke test production - 1h
- [ ] Check error logs - 30 min

**Total:** ~10-12 hours

---

### 📧 EMAIL SYSTEM SETUP (Priority: HIGH)

**SendGrid:**
- [ ] Verify forbrugeragent.dk domain in SendGrid - 30 min
- [ ] Add DNS records (SPF, DKIM, DMARC) - 30 min
- [ ] Wait for verification (~24h) - 0h (waiting)
- [ ] Create email templates in SendGrid - 2h
  - Welcome email
  - Quote notification
  - Reminder email
  - Support confirmation

**Backend:**
- [ ] Update `backend/app/services/email_service.py` - 2h
  - [ ] `send_welcome_email()`
  - [ ] `send_quote_notification()`
  - [ ] `send_reminder()`
  - [ ] `send_support_confirmation()`
- [ ] Setup inbound email webhook - 1h
- [ ] Update `/api/v1/webhooks/inbound-email` - 1h
- [ ] Test email sending locally - 1h
- [ ] Test email sending on Railway - 1h
- [ ] Test inbound email webhook - 1h

**Total:** ~10-12 hours

---

## 🔴 FASE 2: NATIVE APPS (21 DEC - 5 JAN)

### 📱 EXPO PROJECT SETUP (Priority: CRITICAL)

**Initial Setup:**
- [ ] Install Expo CLI globally - 5 min
- [ ] Create new Expo project `npx create-expo-app forbrugeragent-app` - 10 min
- [ ] Install dependencies - 20 min
  - @react-navigation/native
  - @react-navigation/native-stack
  - @react-native-async-storage/async-storage
  - axios
  - expo-secure-store
  - expo-web-browser
  - expo-auth-session
  - expo-notifications
- [ ] Configure app.json - 30 min
  - Set bundle ID (iOS): dk.forbrugeragent.app
  - Set package (Android): dk.forbrugeragent.app
  - Set app name, version, etc.
- [ ] Create folder structure - 30 min
  - app/(tabs)/
  - components/
  - lib/
  - assets/

**Navigation Setup:**
- [ ] Create tab navigation - 1h
- [ ] Create stack navigation - 1h
- [ ] Test navigation locally - 30 min

**API Client:**
- [ ] Create `lib/api.ts` - 1h
  - Copy logic from web app
  - Add token management
  - Add error handling
- [ ] Create `lib/auth.ts` - 1h
  - Save/load user
  - Save/load token
  - Logout function
- [ ] Test API calls - 1h

**Total:** ~8-10 hours

---

### 🎨 SCREEN CONVERSION (Priority: CRITICAL)

**Dashboard (app/(tabs)/index.tsx):**
- [ ] Convert HTML to React Native components - 2h
- [ ] Style with React Native StyleSheet - 1h
- [ ] Connect to API - 1h
- [ ] Test on iOS simulator - 30 min
- [ ] Test on Android emulator - 30 min

**Inbox (app/(tabs)/inbox.tsx):**
- [ ] Convert message list - 2h
- [ ] Add filters - 1h
- [ ] Add message detail modal - 1h
- [ ] Connect to API - 1h
- [ ] Test - 1h

**Quotes (app/(tabs)/quotes.tsx):**
- [ ] Convert quote cards - 1.5h
- [ ] Add filters and sorting - 1h
- [ ] Connect to API - 30 min
- [ ] Test - 30 min

**Chat (app/(tabs)/chat.tsx):**
- [ ] Convert chat UI - 2h
- [ ] Add message input - 30 min
- [ ] Connect to AI API - 1h
- [ ] Test - 30 min

**Settings (app/(tabs)/settings.tsx):**
- [ ] Convert settings sections - 1.5h
- [ ] Add notification toggles - 1h
- [ ] Connect to API - 30 min
- [ ] Test - 30 min

**Onboarding (app/onboarding.tsx):**
- [ ] Convert 5-step flow - 3h
- [ ] Add MitID integration - 1h
- [ ] Connect to API - 1h
- [ ] Test full flow - 1h

**Shared Components:**
- [ ] EmptyState component - 1h
- [ ] Skeleton component - 1h
- [ ] Button component - 30 min
- [ ] Card component - 30 min

**Total:** ~28-32 hours

---

### 🔐 MITID NATIVE INTEGRATION (Priority: CRITICAL)

**Criipto Setup:**
- [ ] Add app redirect URI to Criipto - 15 min
  - forbrugeragent://callback

**Implementation:**
- [ ] Implement WebBrowser auth flow in `lib/auth.ts` - 2h
- [ ] Handle deep link callback - 1h
- [ ] Parse auth code - 30 min
- [ ] Exchange code for token - 1h
- [ ] Save user & token - 30 min
- [ ] Test on iOS simulator - 1h
- [ ] Test on Android emulator - 1h
- [ ] Handle errors - 1h
- [ ] Add loading states - 30 min

**Total:** ~9-11 hours

---

### 🔔 PUSH NOTIFICATIONS (Priority: HIGH)

**Setup:**
- [ ] Request notification permissions - 1h
- [ ] Get Expo push token - 1h
- [ ] Send token to backend - 1h

**Backend:**
- [ ] Add `push_token` field to User model - 30 min
- [ ] Create endpoint `/api/v1/users/push-token` - 30 min
- [ ] Create `notification_service.py` - 2h
  - [ ] `send_push_notification()`
  - [ ] `send_to_multiple_users()`
- [ ] Integrate with inbox messages - 1h
- [ ] Test notifications - 2h

**Total:** ~9-11 hours

---

### 🍎 IOS BUILD (Priority: CRITICAL)

**Preparation:**
- [ ] Create Apple Developer account - 30 min
- [ ] Pay $99 fee - 5 min
- [ ] Install EAS CLI - 5 min
- [ ] Login to EAS - 5 min

**Build:**
- [ ] Run `eas build:configure` - 10 min
- [ ] Create production build profile - 30 min
- [ ] Run `eas build --platform ios --profile production` - 30 min
- [ ] Wait for build (~20 min) - 0h (waiting)
- [ ] Download IPA - 5 min
- [ ] Test on TestFlight - 2h

**App Store Connect:**
- [ ] Create app in App Store Connect - 30 min
- [ ] Add app icon (1024x1024) - 1h (design)
- [ ] Add screenshots (5.5" and 6.5") - 2h (design)
- [ ] Write app description (dansk) - 1h
- [ ] Set pricing (Free) - 5 min
- [ ] Add privacy policy URL - 5 min
- [ ] Submit for review - 15 min

**Total:** ~8-10 hours + design time

---

### 🤖 ANDROID BUILD (Priority: CRITICAL)

**Preparation:**
- [ ] Create Google Play Developer account - 30 min
- [ ] Pay $25 fee - 5 min

**Build:**
- [ ] Run `eas build --platform android --profile production` - 30 min
- [ ] Wait for build (~20 min) - 0h (waiting)
- [ ] Download APK/AAB - 5 min
- [ ] Test on device/emulator - 2h

**Google Play Console:**
- [ ] Create app in Play Console - 30 min
- [ ] Add app icon - 10 min (reuse from iOS)
- [ ] Add screenshots - 1h
- [ ] Write app description (dansk) - 30 min (adapt from iOS)
- [ ] Set pricing (Free) - 5 min
- [ ] Add privacy policy URL - 5 min
- [ ] Submit for review - 15 min

**Total:** ~6-8 hours

---

### ✨ APP POLISH (Priority: MEDIUM)

**Design Assets:**
- [ ] Design app icon (1024x1024) - 2h
- [ ] Create splash screen - 1h
- [ ] Export in all sizes - 30 min

**Improvements:**
- [ ] Add loading indicators everywhere - 2h
- [ ] Improve error messages - 1h
- [ ] Add retry buttons on errors - 1h
- [ ] Test offline mode - 1h
- [ ] Add basic analytics (optional) - 2h

**Total:** ~10-12 hours

---

## 🟡 FASE 3: WEB APP POLISH (28 DEC - 6 JAN)

### 💬 CUSTOMER SUPPORT FORM (Priority: HIGH)

**Frontend:**
- [ ] Create `frontend/src/app/support/page.tsx` - 2h
- [ ] Add form fields (name, email, subject, message) - 1h
- [ ] Add validation - 30 min
- [ ] Add success/error states - 30 min

**Backend:**
- [ ] Create endpoint `/api/v1/support/contact` - 1h
- [ ] Send email to support@forbrugeragent.dk - 1h
- [ ] Add auto-reply to user - 30 min
- [ ] Test - 30 min

**Total:** ~7-8 hours

---

### 🤖 ADMIN AI FLOWS DASHBOARD (Priority: MEDIUM)

**Backend:**
- [ ] Create `backend/app/models/ai_flow.py` - 1h
- [ ] Create migration for `ai_flows` table - 30 min
- [ ] Seed default flows - 1h
  - Indhent tilbud
  - Rykker efter 3 dage
  - Bekræftelse
  - Opfølgning
- [ ] Create endpoint `/api/v1/admin/ai-flows` (GET) - 1h
- [ ] Create endpoint `/api/v1/admin/ai-flows/{id}` (PUT) - 1h

**Frontend:**
- [ ] Create `frontend/src/app/admin/ai-flows/page.tsx` - 2h
- [ ] Display all flows - 1h
- [ ] Add toggle for auto/manual - 1h
- [ ] Add edit flow modal - 2h
- [ ] Test - 1h

**Total:** ~11-13 hours

---

### 🌐 LANDING PAGE (Priority: MEDIUM)

**Design:**
- [ ] Sketch layout - 30 min
- [ ] Choose colors/fonts - 30 min

**Implementation:**
- [ ] Update `frontend/src/app/page.tsx` - 3h
  - Hero section
  - How it works
  - Trust badges
  - CTA button
- [ ] Make responsive - 1h
- [ ] Add animations (optional) - 1h
- [ ] Test - 30 min

**Total:** ~6-7 hours

---

## 🟢 FASE 4: BETA TESTING (2-6 JAN)

### 📢 RECRUITMENT (Priority: HIGH)

**Setup:**
- [ ] Create `frontend/src/app/beta/page.tsx` - 1h
- [ ] Add signup form - 1h
- [ ] Store signups in database - 1h
- [ ] Create admin view of signups - 1h

**Facebook Posts:**
- [ ] Write recruitment post - 30 min
- [ ] Find 5-10 relevant groups - 30 min
- [ ] Post in groups - 1h
- [ ] Respond to comments - 2h (ongoing)

**Onboarding:**
- [ ] Send welcome email to testers - 1h
- [ ] Create testing checklist - 30 min
- [ ] Setup feedback form - 1h

**Total:** ~10-12 hours

---

### 🧪 TESTING MONITORING (Priority: HIGH)

**Daily Tasks (3-5 jan):**
- [ ] Check tester progress - 1h/day × 3 = 3h
- [ ] Read feedback - 1h/day × 3 = 3h
- [ ] Fix critical bugs - 4h/day × 3 = 12h
- [ ] Reply to questions - 1h/day × 3 = 3h

**Payment:**
- [ ] Collect MobilePay numbers - 1h
- [ ] Send 50 DKK to each tester - 2h

**Total:** ~24 hours (spread over 3 days)

---

## 🚀 FASE 5: WEB LAUNCH (7 JAN)

### ✅ PRE-LAUNCH CHECKLIST (6 JAN)

**Final QA:**
- [ ] Test all pages - 2h
- [ ] Test MitID login - 30 min
- [ ] Test onboarding - 30 min
- [ ] Test email sending - 30 min
- [ ] Test inbox - 30 min
- [ ] Test chat - 30 min
- [ ] Test settings - 30 min
- [ ] Test GDPR features - 30 min

**Monitoring:**
- [ ] Setup error tracking (Sentry?) - 1h
- [ ] Setup uptime monitoring - 30 min
- [ ] Setup analytics - 1h

**Backup:**
- [ ] Backup database - 15 min
- [ ] Note git commit - 5 min
- [ ] Create rollback script - 30 min

**Total:** ~8-10 hours

---

### 🎉 LAUNCH DAY (7 JAN)

**Morning:**
- [ ] Final deploy to Railway - 15 min
- [ ] Run migrations - 10 min
- [ ] Verify health endpoint - 5 min
- [ ] Test frontend loads - 10 min

**Ads:**
- [ ] Launch Facebook ads campaign - 30 min
- [ ] Launch Google ads campaign - 30 min
- [ ] Post on Instagram - 15 min
- [ ] Post on LinkedIn - 15 min

**Monitoring:**
- [ ] Watch error logs (all day) - 8h
- [ ] Monitor sign-ups - ongoing
- [ ] Respond to support emails - ongoing

**Total:** ~10-12 hours (long day!)

---

## 🍎 FASE 6: NATIVE APPS DEPLOYMENT (8-20 JAN)

### 📱 APP REVIEW MONITORING

**Daily Checks:**
- [ ] Check App Store Connect status - 10 min/day
- [ ] Check Google Play Console status - 10 min/day
- [ ] Respond to review queries - as needed

**If Rejected:**
- [ ] Read rejection reason carefully - 30 min
- [ ] Fix specific issue - 2-4h
- [ ] Resubmit immediately - 30 min

**Total:** ~20-30 min/day + potential fixes

---

### 🎊 APPS GO LIVE (15-20 JAN)

**When Approved:**
- [ ] Test app download on real device - 30 min
- [ ] Test app login - 15 min
- [ ] Test key flows - 1h

**Marketing:**
- [ ] Update landing page with app badges - 1h
- [ ] Update ads to mention app - 1h
- [ ] Email all users about app - 1h
- [ ] Post on social media - 30 min

**Monitoring:**
- [ ] Watch app analytics - ongoing
- [ ] Monitor crash reports - ongoing
- [ ] Respond to app reviews - ongoing

**Total:** ~5-6 hours

---

## 📊 TASK SUMMARY

### By Phase:

| Phase | Tasks | Est. Hours | Est. Days |
|-------|-------|------------|-----------|
| 1. Foundation | 52 | 48-52h | 6-7d |
| 2. Native Apps | 68 | 84-96h | 10.5-12d |
| 3. Web Polish | 18 | 24-28h | 3-3.5d |
| 4. Beta Testing | 28 | 34-36h | 4.5-5d |
| 5. Launch | 14 | 18-22h | 2.5-3d |
| 6. Native Deploy | 10 | 5-7h | 1d |
| **TOTAL** | **190** | **213-241h** | **27-30d** |

### By Priority:

| Priority | Tasks | Hours |
|----------|-------|-------|
| CRITICAL | 89 | 120-140h |
| HIGH | 45 | 50-60h |
| MEDIUM | 38 | 30-35h |
| LOW | 18 | 13-16h |

---

## 🎯 NEXT 3 IMMEDIATE TASKS

**START THESE NOW:**

1. **Create Criipto Account** (30 min)
   - Go to criipto.com
   - Sign up
   - Get credentials

2. **Write Privacy Policy** (2h)
   - Open Google Docs
   - Write dansk text
   - Get approval

3. **Install Expo CLI** (5 min)
   - `npm install -g eas-cli`
   - `npx create-expo-app forbrugeragent-app`

**READY TO START? 🚀**
