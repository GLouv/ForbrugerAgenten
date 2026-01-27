# 🚀 FORBRUGERAGENTEN - HYBRID LAUNCH PLAN

**Launch Strategy:** Web App (7. jan) → Native Apps (15-20. jan)  
**Timeline:** 14. dec 2025 - 20. jan 2026  
**Total:** 37 dage (~5 uger)

---

## 📊 EXECUTIVE SUMMARY

### Fase Oversigt:

| Fase | Periode | Mål | Status |
|------|---------|-----|--------|
| **1. Foundation** | 14-20 dec (7 dage) | Critical infrastructure | 🟡 Starting |
| **2. Native Apps** | 21 dec - 5 jan (16 dage) | iOS + Android apps | 🔴 Not started |
| **3. Web Polish** | 28 dec - 6 jan (10 dage) | Web app final touches | 🔴 Not started |
| **4. Testing** | 2-6 jan (5 dage) | Beta testing | 🔴 Not started |
| **5. Launch** | 7 jan | Web app goes live | 🔴 Not started |
| **6. Native Deploy** | 8-20 jan | Apps approved & live | 🔴 Not started |

### Success Metrics:
- ✅ Web app live 7. januar
- ✅ iOS app submitted 31. december
- ✅ Android app submitted 31. december
- ✅ Both apps live by 20. januar (worst case)
- ✅ 100 beta testers recruited
- ✅ All policies approved

---

## 🎯 FASE 1: CRITICAL FOUNDATION (14-20 DEC)

**Mål:** Infrastructure + Policies + Core Fixes

### Dag 1-2: Criipto MitID Setup (14-15 dec)

**Backend:**
```python
# app/services/criipto_service.py
class CriiptoService:
    def __init__(self):
        self.domain = os.getenv("CRIIPTO_DOMAIN")
        self.client_id = os.getenv("CRIIPTO_CLIENT_ID")
        self.client_secret = os.getenv("CRIIPTO_CLIENT_SECRET")
    
    async def initiate_login(self, redirect_uri: str):
        # Redirect to Criipto
        pass
    
    async def handle_callback(self, code: str):
        # Exchange code for token
        # Extract CPR + name
        # Create/login user
        pass
```

**Frontend:**
```tsx
// src/lib/criipto.ts
export const loginWithMitID = () => {
  const authUrl = `${CRIIPTO_DOMAIN}/oauth2/authorize?...`
  window.location.href = authUrl
}

// src/app/mitid/callback/page.tsx
// Handle callback, save user, redirect to dashboard
```

**Tasks:**
- [ ] Create Criipto account
- [ ] Get test credentials
- [ ] Implement backend service
- [ ] Implement frontend flow
- [ ] Test with test MitID
- [ ] Update Railway env vars

**Time:** 16 timer (2 dage)

---

### Dag 3-4: Policy Pages (16-17 dec)

**Required Pages:**

**1. Privatlivspolitik** (`/privacy`)
```markdown
# Privatlivspolitik

## Hvad vi indsamler
- Navn, CPR (via MitID)
- Email, telefon
- Forbrugsdata
- Kommunikation

## Hvordan vi bruger det
- Indhente tilbud
- Kontakte selskaber
- Forbedre service

## Tredjeparter
- Criipto (MitID)
- SendGrid (emails)
- Railway (hosting)

## Dine rettigheder (GDPR)
- Eksporter data
- Slet data
- Ret data
```

**2. Vilkår & Betingelser** (`/terms`)
```markdown
# Vilkår & Betingelser

## Tjenesten
ForbrugerAgenten hjælper dig med at spare penge...

## Fuldmagt
Du giver os ret til at:
- Kontakte selskaber på dine vegne
- Modtage tilbud i din inbox
- Forhandle på dine vegne

Vi skifter ALDRIG uden din godkendelse.

## Ansvar
Vi garanterer ikke besparelser...

## Opsigelse
Du kan altid trække fuldmagt tilbage...
```

**3. Cookie Politik** (`/cookies`)
```markdown
# Cookie Politik

Vi bruger kun nødvendige cookies:
- Session cookie (login)
- Analytics (opt-in)
```

**Implementation:**
```tsx
// frontend/src/app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1>Privatlivspolitik</h1>
      {/* Markdown content */}
    </div>
  )
}
```

**Tasks:**
- [ ] Write privacy policy (dansk)
- [ ] Write terms & conditions (dansk)
- [ ] Write cookie policy (dansk)
- [ ] Create frontend pages
- [ ] Add links in footer
- [ ] Update onboarding consent links

**Time:** 12 timer (1.5 dage)

---

### Dag 5: Core Bug Fixes (18 dec)

**High Priority:**
1. Fix inbox backend enum issue
2. Fix indentation in dashboard.tsx (already done)
3. Test all API endpoints
4. Verify database migrations
5. Check Railway deployment

**Tasks:**
- [ ] Fix inbox MessageStatus enum casting
- [ ] Test `/api/v1/inbox/*` endpoints
- [ ] Run full backend test suite
- [ ] Deploy to Railway
- [ ] Smoke test production

**Time:** 8 timer (1 dag)

---

### Dag 6-7: Email System Setup (19-20 dec)

**SendGrid Production:**
```python
# backend/app/services/email_service.py
class EmailService:
    def send_welcome_email(self, user):
        pass
    
    def send_quote_notification(self, user, quote):
        pass
    
    def send_reminder(self, user):
        pass
```

**Inbound Email Webhook:**
```python
# backend/app/api/v1/endpoints/webhooks.py
@router.post("/inbound-email")
async def handle_inbound_email(payload: dict):
    # Parse email
    # Create Message
    # Notify user
    pass
```

**Tasks:**
- [ ] Verify SendGrid domain
- [ ] Create email templates
- [ ] Setup inbound parse
- [ ] Test email sending
- [ ] Test email receiving

**Time:** 12 timer (1.5 dage)

---

## 🎯 FASE 2: NATIVE APPS DEVELOPMENT (21 DEC - 5 JAN)

**Mål:** iOS + Android apps bygget og klar til submission

### Dag 8-9: Expo Setup (21-22 dec)

**Project Setup:**
```bash
# Create new Expo project
npx create-expo-app forbrugeragent-app --template blank-typescript

# Install dependencies
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-native-async-storage/async-storage
npm install axios
npm install expo-secure-store
```

**Project Structure:**
```
forbrugeragent-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard
│   │   ├── inbox.tsx          # Inbox
│   │   ├── quotes.tsx         # Tilbud
│   │   ├── chat.tsx           # Chat
│   │   └── settings.tsx       # Settings
│   ├── onboarding.tsx         # Onboarding flow
│   └── login.tsx              # MitID login
├── components/
│   ├── AppLayout.tsx
│   ├── EmptyState.tsx
│   └── Skeleton.tsx
├── lib/
│   ├── api.ts                 # API client
│   └── auth.ts                # Auth helpers
└── app.json
```

**Tasks:**
- [ ] Create Expo project
- [ ] Setup navigation
- [ ] Configure app.json
- [ ] Setup API client
- [ ] Create folder structure

**Time:** 12 timer (1.5 dage)

---

### Dag 10-13: Convert Screens (23-26 dec)

**Priority Order:**

**1. Dashboard (4 timer)**
- Convert `frontend/src/app/dashboard/page.tsx` → `app/(tabs)/index.tsx`
- Active hunts
- Contracts overview
- Quick actions

**2. Inbox (4 timer)**
- Convert `frontend/src/app/inbox/page.tsx` → `app/(tabs)/inbox.tsx`
- Message list
- Filters
- Detail modal

**3. Quotes (3 timer)**
- Convert `frontend/src/app/quotes/page.tsx` → `app/(tabs)/quotes.tsx`
- Quote cards
- Filters
- Sorting

**4. Chat (3 timer)**
- Convert `frontend/src/app/chat/page.tsx` → `app/(tabs)/chat.tsx`
- Message bubbles
- AI responses

**5. Settings (2 timer)**
- Convert `frontend/src/app/settings/page.tsx` → `app/(tabs)/settings.tsx`
- Notification preferences
- GDPR options

**6. Onboarding (4 timer)**
- Convert `frontend/src/app/onboarding/page.tsx` → `app/onboarding.tsx`
- 5-step flow
- MitID integration

**Tasks:**
- [ ] Dashboard screen
- [ ] Inbox screen
- [ ] Quotes screen
- [ ] Chat screen
- [ ] Settings screen
- [ ] Onboarding flow
- [ ] Shared components (EmptyState, Skeleton)

**Time:** 20 timer (2.5 dage)

---

### Dag 14-15: MitID Native Integration (27-28 dec)

**Criipto Native Flow:**
```typescript
// lib/auth.ts
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'

export const loginWithMitID = async () => {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'forbrugeragent'
  })
  
  const authUrl = `${CRIIPTO_DOMAIN}/oauth2/authorize?...`
  
  const result = await WebBrowser.openAuthSessionAsync(
    authUrl,
    redirectUri
  )
  
  if (result.type === 'success') {
    // Extract code
    // Exchange for token
    // Save user
  }
}
```

**Deep Linking:**
```json
// app.json
{
  "expo": {
    "scheme": "forbrugeragent",
    "ios": {
      "bundleIdentifier": "dk.forbrugeragent.app"
    },
    "android": {
      "package": "dk.forbrugeragent.app"
    }
  }
}
```

**Tasks:**
- [ ] Setup Criipto redirect URI for app
- [ ] Implement WebBrowser auth flow
- [ ] Handle callback
- [ ] Test on iOS simulator
- [ ] Test on Android emulator

**Time:** 12 timer (1.5 dage)

---

### Dag 16-17: Push Notifications (29-30 dec)

**Expo Push Notifications:**
```typescript
// lib/notifications.ts
import * as Notifications from 'expo-notifications'

export const registerForPushNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync()
  
  if (status !== 'granted') return null
  
  const token = await Notifications.getExpoPushTokenAsync()
  
  // Send token to backend
  await api.post('/users/push-token', { token: token.data })
  
  return token
}
```

**Backend:**
```python
# app/api/v1/endpoints/users.py
@router.post("/push-token")
async def save_push_token(token: str, user_id: str):
    # Save to database
    pass

# app/services/notification_service.py
async def send_push_notification(user_id: str, title: str, body: str):
    # Get user's push token
    # Send via Expo push service
    pass
```

**Tasks:**
- [ ] Setup Expo push notifications
- [ ] Request permissions
- [ ] Save tokens to backend
- [ ] Test notifications on iOS
- [ ] Test notifications on Android

**Time:** 12 timer (1.5 dage)

---

### Dag 18: iOS Build (31 dec)

**Build Configuration:**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for iOS
eas build --platform ios --profile production
```

**App Store Connect:**
- Create app listing
- Add screenshots
- Write description
- Set pricing (Free)
- Add privacy info

**Tasks:**
- [ ] Create Apple Developer account ($99)
- [ ] Configure EAS build
- [ ] Build iOS app
- [ ] Test on TestFlight
- [ ] Submit to App Store

**Time:** 8 timer (1 dag)

---

### Dag 19: Android Build (1 jan)

**Build Configuration:**
```bash
# Build for Android
eas build --platform android --profile production

# Download APK/AAB
# Test on device
```

**Google Play Console:**
- Create app listing
- Add screenshots
- Write description
- Set pricing (Free)
- Add privacy policy link

**Tasks:**
- [ ] Create Google Play Developer account ($25)
- [ ] Configure EAS build
- [ ] Build Android app
- [ ] Test APK
- [ ] Submit to Google Play

**Time:** 8 timer (1 dag)

---

### Dag 20-21: App Polish (2-3 jan)

**Final Touches:**
- App icon (1024x1024)
- Splash screen
- Loading states
- Error handling
- Offline support
- Analytics (optional)

**Tasks:**
- [ ] Design app icon
- [ ] Create splash screen
- [ ] Add loading indicators
- [ ] Improve error messages
- [ ] Test offline mode
- [ ] Add basic analytics

**Time:** 12 timer (1.5 dage)

---

## 🎯 FASE 3: WEB APP POLISH (28 DEC - 6 JAN)

**Parallel med native app development**

### Customer Support Email Form

**Implementation:**
```tsx
// frontend/src/app/support/page.tsx
export default function SupportPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const handleSubmit = async () => {
    await api.post('/support/contact', form)
    toast.success('Vi vender tilbage inden for 24 timer')
  }
  
  return (
    <AppLayout>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </AppLayout>
  )
}
```

**Backend:**
```python
# app/api/v1/endpoints/support.py
@router.post("/contact")
async def contact_support(
    name: str,
    email: str,
    subject: str,
    message: str
):
    # Send email to support@forbrugeragent.dk
    await email_service.send_support_email(...)
    return {"status": "sent"}
```

**Time:** 4 timer

---

### Admin AI Flow Dashboard

**New Admin Page:**
```tsx
// frontend/src/app/admin/ai-flows/page.tsx
export default function AIFlowsPage() {
  const flows = [
    {
      id: 'indhent_tilbud',
      name: 'Indhent Tilbud',
      description: 'Send til selskaber når jagt starter',
      mode: 'auto', // or 'manual'
      lastRun: '2025-01-05 14:30'
    },
    {
      id: 'rykker',
      name: 'Rykker Efter 3 Dage',
      description: 'Påmind selskab hvis ingen svar',
      mode: 'auto',
      lastRun: '2025-01-05 10:15'
    }
  ]
  
  return (
    <div>
      <h1>AI Email Flows</h1>
      {flows.map(flow => (
        <FlowCard
          key={flow.id}
          flow={flow}
          onToggle={(mode) => updateFlowMode(flow.id, mode)}
        />
      ))}
    </div>
  )
}
```

**Backend:**
```python
# app/models/ai_flow.py
class AIFlow(Base):
    __tablename__ = "ai_flows"
    id = Column(String, primary_key=True)
    name = Column(String)
    description = Column(String)
    mode = Column(String)  # 'auto' or 'manual'
    template = Column(Text)
    enabled = Column(Boolean, default=True)

# app/api/v1/endpoints/admin/ai_flows.py
@router.get("/ai-flows")
async def get_ai_flows():
    flows = await db.execute(select(AIFlow))
    return flows.all()

@router.put("/ai-flows/{flow_id}")
async def update_ai_flow(flow_id: str, mode: str):
    # Update flow mode
    pass
```

**Time:** 6 timer

---

### Landing Page

**Simple Landing:**
```tsx
// frontend/src/app/page.tsx
export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <h1>Spar Penge På Strøm, Mobil & Internet</h1>
        <p>Vi finder de bedste tilbud - automatisk</p>
        <button onClick={() => router.push('/onboarding')}>
          Kom i gang gratis
        </button>
      </section>
      
      {/* How it works */}
      <section className="how-it-works">
        <Step number={1}>Upload din regning</Step>
        <Step number={2}>Vi indhenter tilbud</Step>
        <Step number={3}>Du vælger - vi skifter</Step>
      </section>
      
      {/* Trust */}
      <section className="trust">
        <p>100% gratis</p>
        <p>MitID sikker</p>
        <p>GDPR compliant</p>
      </section>
    </div>
  )
}
```

**Time:** 4 timer

---

## 🎯 FASE 4: BETA TESTING (2-6 JAN)

### Rekruttering (2-3 jan)

**Facebook Groups:**
- "Spar Penge Danmark"
- "Billige tilbud og besparelser"
- "Bolig økonomitips"

**Post:**
```
🎁 Få 50 kr for at teste ny app!

Vi søger 100 test personer til vores nye app der hjælper 
med at spare penge på strøm, mobil og internet.

Du skal:
✓ Teste appen i 3 dage
✓ Give feedback
✓ Rapportere bugs

Du får:
✓ 50 kr via MobilePay
✓ Gratis brug af appen
✓ Hjælp os med at bygge noget fedt!

Tilmeld dig: forbrugeragent.dk/beta
```

**Beta Signup Form:**
```tsx
// frontend/src/app/beta/page.tsx
<form onSubmit={signupForBeta}>
  <input name="name" required />
  <input name="email" required />
  <input name="phone" required />
  <select name="category">
    <option>Strøm</option>
    <option>Mobil</option>
    <option>Internet</option>
  </select>
  <button>Tilmeld dig</button>
</form>
```

**Tasks:**
- [ ] Create beta signup page
- [ ] Post in Facebook groups
- [ ] Collect 100 signups
- [ ] Send onboarding emails

**Time:** 8 timer

---

### Testing Period (3-5 jan)

**Test Checklist:**
```markdown
For hver tester:

□ Sign up via MitID
□ Complete onboarding (5 steps)
□ Upload bill / enter data
□ Wait for quotes (simulated)
□ Check inbox
□ Use chat
□ Accept a quote
□ Manage settings
□ Export data (GDPR test)

Rapporter:
□ Bugs
□ Confusion points
□ Feature requests
□ Overall experience (1-10)
```

**Feedback Collection:**
- Google Forms survey
- In-app feedback button
- Direct messages

**Bug Tracking:**
```tsx
// Admin panel: /admin/beta-feedback
- List all testers
- See their progress
- Read feedback
- Track bug reports
```

**Tasks:**
- [ ] Monitor testing
- [ ] Fix critical bugs daily
- [ ] Collect feedback
- [ ] Pay testers (50 kr each)

**Time:** Continuous (3 dage)

---

## 🎯 FASE 5: WEB LAUNCH (7 JAN)

### Pre-Launch Checklist (6 jan)

**Final QA:**
- [ ] All pages load
- [ ] MitID login works
- [ ] Onboarding flow complete
- [ ] Email sending works
- [ ] Inbox displays messages
- [ ] Chat responds
- [ ] Settings save
- [ ] GDPR export/delete works

**Monitoring:**
- [ ] Railway health checks
- [ ] Error tracking (Sentry?)
- [ ] Analytics (Google Analytics?)
- [ ] Uptime monitoring

**Rollback Plan:**
- [ ] Backup database
- [ ] Previous git commit noted
- [ ] Rollback script ready

---

### Launch Day (7 jan)

**Morning:**
```bash
# Final deploy
git push origin master

# Verify health
curl https://forbrugeragent.dk/health

# Check frontend
open https://forbrugeragent.dk
```

**Ads Go Live:**
- Facebook Ads campaign starts
- Google Ads campaign starts
- Instagram posts

**Monitoring:**
- Watch error logs
- Monitor sign-ups
- Track conversions
- Respond to support emails

**Celebrate! 🎉**

---

## 🎯 FASE 6: NATIVE APPS DEPLOYMENT (8-20 JAN)

### App Review Period (8-14 jan)

**iOS App Store:**
- Review typically 3-7 days
- Could be up to 14 days
- Check status daily

**Google Play:**
- Review typically 1-3 days
- Sometimes instant
- Check status daily

**If Rejected:**
1. Read rejection reason
2. Fix issue
3. Resubmit immediately
4. Cross fingers

---

### Apps Go Live (15-20 jan)

**When Approved:**

**Update Landing Page:**
```tsx
<section className="apps">
  <h2>Download Appen!</h2>
  <a href="https://apps.apple.com/...">
    <img src="/app-store-badge.svg" />
  </a>
  <a href="https://play.google.com/...">
    <img src="/google-play-badge.svg" />
  </a>
</section>
```

**Update Ads:**
- Change ad copy to mention app
- Add app download links
- Create app-specific campaigns

**Announce:**
- Email all existing users
- Post on social media
- Update website

---

## 📊 RESOURCE ALLOCATION

### Development Time Breakdown:

| Task Category | Hours | Days |
|---------------|-------|------|
| Criipto MitID Setup | 16h | 2d |
| Policy Pages | 12h | 1.5d |
| Bug Fixes | 8h | 1d |
| Email System | 12h | 1.5d |
| **Phase 1 Total** | **48h** | **6d** |
| | | |
| Expo Setup | 12h | 1.5d |
| Convert Screens | 20h | 2.5d |
| MitID Native | 12h | 1.5d |
| Push Notifications | 12h | 1.5d |
| iOS Build | 8h | 1d |
| Android Build | 8h | 1d |
| App Polish | 12h | 1.5d |
| **Phase 2 Total** | **84h** | **10.5d** |
| | | |
| Customer Support | 4h | 0.5d |
| Admin AI Flows | 6h | 0.75d |
| Landing Page | 4h | 0.5d |
| **Phase 3 Total** | **14h** | **1.75d** |
| | | |
| Beta Recruitment | 8h | 1d |
| Beta Monitoring | 24h | 3d |
| **Phase 4 Total** | **32h** | **4d** |
| | | |
| **GRAND TOTAL** | **178h** | **22.25d** |

**With 8 hour workdays = 22 working days**
**Calendar time = 37 days (14 dec - 20 jan)**

---

## 💰 BUDGET BREAKDOWN

| Item | Cost | Notes |
|------|------|-------|
| Apple Developer | $99 | Yearly |
| Google Play Developer | $25 | One-time |
| Beta Tester Payments | 5,000 DKK | 100 users × 50 DKK |
| Contingency | 1,000 DKK | Unexpected costs |
| **Total** | **~6,000 DKK** | ~$850 |

---

## 🚨 RISK MITIGATION

### Critical Risks:

**1. App Store Rejection**
- **Risk:** High
- **Impact:** Delays native launch
- **Mitigation:** Submit early, follow guidelines strictly, have web app as fallback

**2. MitID Integration Issues**
- **Risk:** Medium
- **Impact:** Can't launch at all
- **Mitigation:** Start early, test extensively, have Criipto support contact

**3. Not Enough Beta Testers**
- **Risk:** Low
- **Impact:** Poor quality at launch
- **Mitigation:** Post in multiple groups, offer 75 DKK if needed

**4. Database Scaling Issues**
- **Risk:** Low
- **Impact:** Slow app, crashes
- **Mitigation:** Load testing, Railway auto-scaling, monitoring

**5. Email Deliverability**
- **Risk:** Medium
- **Impact:** Users don't receive quotes
- **Mitigation:** Verify SendGrid domain, monitor bounce rates, warm up domain

---

## 📋 DAILY CHECKLIST TEMPLATE

**Every Day:**
- [ ] Check Railway health
- [ ] Review error logs
- [ ] Commit code progress
- [ ] Update task list
- [ ] Test what was built
- [ ] Communicate blockers

**Every Week:**
- [ ] Review timeline
- [ ] Adjust priorities
- [ ] Plan next week
- [ ] Backup database

---

## 🎯 SUCCESS CRITERIA

### Phase 1 Success:
- ✅ MitID login works
- ✅ All policy pages live
- ✅ No critical bugs
- ✅ Email system operational

### Phase 2 Success:
- ✅ Native apps built
- ✅ All screens functional
- ✅ Push notifications work
- ✅ Submitted to stores

### Phase 3 Success:
- ✅ Landing page live
- ✅ Admin AI flows visible
- ✅ Support form works

### Phase 4 Success:
- ✅ 100 beta testers recruited
- ✅ All testers completed flow
- ✅ Critical bugs fixed
- ✅ Feedback collected

### Phase 5 Success:
- ✅ Web app live 7. januar
- ✅ Ads running
- ✅ Sign-ups happening
- ✅ No downtime

### Phase 6 Success:
- ✅ iOS app approved
- ✅ Android app approved
- ✅ Both apps in stores
- ✅ Users downloading

---

## 📞 ESCALATION PATHS

### If Behind Schedule:
1. Cut non-critical features
2. Extend launch date
3. Launch web-only first

### If Critical Bug Found:
1. Stop all other work
2. Fix immediately
3. Test thoroughly
4. Deploy ASAP

### If App Rejected:
1. Read rejection carefully
2. Fix specific issues
3. Don't add new features
4. Resubmit same day

### If Need Help:
- Criipto support: support@criipto.com
- Expo support: docs.expo.dev
- Railway support: help.railway.app

---

## 🚀 LET'S DO THIS!

**Status:** READY TO START! 🎯

**Next Immediate Action:**
1. Create Criipto account
2. Start MitID integration
3. Set up Expo project (parallel)

**FORTÆL MIG NÅR DU ER KLAR TIL AT STARTE! 🚀**
