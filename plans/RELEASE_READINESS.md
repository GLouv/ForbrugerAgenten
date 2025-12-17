# 🎯 RELEASE READINESS: GAP ANALYSIS & EXECUTION PLAN

**Formål:** Komplet oversigt over hvad der mangler for production release.
**Status:** 🟡 I GANG
**Estimeret arbejde:** ~20-23 timer (4 sprints)

---

## 📊 NUVÆRENDE STATUS

### Hvad Dokumenterne Siger vs. Virkeligheden

`COMPLETE_STAGE_VIEW.md` viser mange 🟢 items, men det reflekterer **kode-eksistens**, ikke **production readiness**.

| Område | Dokumenteret | Virkelighed |
|:-------|:-------------|:------------|
| Identity System | 🟢 Komplet | ✅ Virker faktisk |
| Digital Mailbox | 🟢 Komplet | ⚠️ Webhook klar, men ingen emails sendes |
| Bill Parser | 🟢 Komplet | ✅ Virker med OpenAI |
| Support System | 🟢 Komplet | ✅ API virker |
| Admin Control | 🟢 Komplet | ⚠️ Endpoints eksisterer, ingen UI |
| Authentication | 🟢 Komplet | ❌ Ikke integreret end-to-end |
| Navigation | Ikke nævnt | ❌ Mangler helt |
| Email Sending | 🟢 Komplet | ❌ Skeleton uden implementation |

---

## 🔴 KATEGORI A: BLOKERENDE PROBLEMER

Disse SKAL fixes før en eneste rigtig bruger kan bruge systemet.

### A1. Authentication Flow

**Problem:** Auth0 er konfigureret men ikke integreret. Brugere kan bypasse login.

| Komponent | Status | Problem |
|:----------|:-------|:--------|
| Auth0 Login | ⚠️ Konfigureret | Ikke forbundet til user creation |
| Session Persistence | ❌ Mangler | `localStorage.getItem('user_id')` har hardcoded fallback |
| Protected Routes | ❌ Mangler | Alle kan tilgå `/dashboard` uden login |
| Logout | ❌ Mangler | Ingen måde at logge ud |
| Token Refresh | ❌ Mangler | Session udløber uden varsel |

**Filer der skal ændres:**
```
frontend/src/app/layout.tsx           → Tilføj AuthGuard wrapper
frontend/src/components/AuthGuard.tsx → NY: Route protection
frontend/src/lib/auth.ts              → NY: Auth utilities
frontend/src/app/login/page.tsx       → Forbind til Auth0
frontend/src/app/logout/page.tsx      → Implementer logout
frontend/src/app/callback/page.tsx    → Håndter Auth0 callback korrekt
```

**Implementation Steps:**
```
[ ] A1.1 - Opret AuthGuard component der checker session
[ ] A1.2 - Wrap dashboard/chat/settings i AuthGuard
[ ] A1.3 - Redirect til /login hvis ikke authenticated
[ ] A1.4 - Gem user_id fra Auth0 i localStorage efter login
[ ] A1.5 - Implementer logout der clearer session
[ ] A1.6 - Test: Login → Dashboard → Refresh → Stadig logged in
```

**Estimat:** 2-3 timer

**🧪 TEST CASES: A1 Authentication**

```python
# tests/test_auth.py

class TestAuthenticationFlow:
    """Tests for A1: Authentication Flow"""
    
    # === UNIT TESTS ===
    
    def test_auth_guard_redirects_unauthenticated(self):
        """A1.1: Uauthenticated user accessing /dashboard redirects to /login"""
        # Given: No session/token in localStorage
        # When: Navigate to /dashboard
        # Then: Redirect to /login
        # Assert: URL == "/login"
        
    def test_auth_guard_allows_authenticated(self):
        """A1.2: Authenticated user can access protected routes"""
        # Given: Valid token in localStorage
        # When: Navigate to /dashboard
        # Then: Page renders normally
        # Assert: Dashboard content visible
        
    def test_session_persists_on_refresh(self):
        """A1.3: Session survives page refresh"""
        # Given: Logged in user on /dashboard
        # When: Page refresh (F5)
        # Then: Still on /dashboard, still logged in
        # Assert: No redirect to /login
        
    def test_logout_clears_session(self):
        """A1.4: Logout removes all session data"""
        # Given: Logged in user
        # When: Click logout
        # Then: localStorage cleared, redirect to /login
        # Assert: localStorage.getItem('user_id') == null
        
    # === INTEGRATION TESTS ===
    
    def test_auth0_callback_creates_user(self):
        """A1.5: Auth0 callback creates user in database if new"""
        # Given: New Auth0 user (not in DB)
        # When: Auth0 callback with user data
        # Then: User created in DB, user_id stored
        # Assert: DB query returns user, localStorage has user_id
        
    def test_auth0_callback_existing_user(self):
        """A1.6: Auth0 callback for existing user doesn't duplicate"""
        # Given: Existing user in DB
        # When: Auth0 callback
        # Then: No duplicate, existing user returned
        # Assert: User count unchanged
        
    # === E2E TESTS (Playwright) ===
    
    def test_e2e_login_flow(self):
        """A1.7: Complete login flow works"""
        # Steps:
        # 1. Navigate to /login
        # 2. Click "Log ind med Auth0"
        # 3. Complete Auth0 login
        # 4. Verify redirect to /dashboard
        # 5. Verify user name displayed
        # Assert: Dashboard shows user greeting
        
    def test_e2e_protected_route_redirect(self):
        """A1.8: Direct URL to protected route redirects"""
        # Steps:
        # 1. Clear all cookies/storage
        # 2. Navigate directly to /dashboard
        # 3. Verify redirect to /login
        # Assert: URL is /login
        
    # === EDGE CASES ===
    
    def test_expired_token_refresh(self):
        """A1.9: Expired token triggers re-auth"""
        # Given: Expired JWT in storage
        # When: API call made
        # Then: Redirect to login OR token refresh
        # Assert: User re-authenticated
        
    def test_malformed_token_rejected(self):
        """A1.10: Invalid token format rejected"""
        # Given: Garbage string as token
        # When: API call made
        # Then: 401 returned, redirect to login
        # Assert: Unauthorized response
```

**Test Execution:**
```bash
# Run auth tests
pytest tests/test_auth.py -v

# Run E2E auth tests
npx playwright test tests/e2e/auth.spec.ts
```

---

### A2. Email Sending

**Problem:** Systemet kan ikke sende emails. Alt er skelet-kode.

| Komponent | Status | Problem |
|:----------|:-------|:--------|
| Email Service | ❌ Skeleton | `send_email()` gør ingenting |
| Resend/SendGrid | ❌ Ikke forbundet | Ingen API integration |
| Quote Request Emails | ❌ Sendes ikke | Onboarding opretter request, men ingen email går ud |
| Nudge Bot Emails | ❌ Sendes ikke | CRON logik eksisterer, `send_email()` er tom |
| Welcome Emails | ❌ Sendes ikke | Bruger får ingen bekræftelse |

**Filer der skal ændres:**
```
backend/app/services/email_service.py     → Implementer med Resend
backend/app/core/config.py                → Tilføj RESEND_API_KEY
backend/requirements.txt                  → Tilføj resend package
backend/app/services/quote_service.py     → NY: Send quote emails
backend/app/templates/emails/             → NY: Email templates mappe
```

**Email Templates Needed:**
```
quote_request.html      → "Ny kundeforespørgsel fra ForbrugerAgenten"
nudge_day3.html         → "Venlig påmindelse: Kundeforespørgsel afventer"
nudge_day7.html         → "Sidste påmindelse: Kundeforespørgsel"
welcome_user.html       → "Velkommen til ForbrugerAgenten"
quote_received.html     → "Du har modtaget et nyt tilbud"
switch_confirmation.html → "Dit skift er bekræftet"
```

**Implementation Steps:**
```
[ ] A2.1 - Installer resend package: pip install resend
[ ] A2.2 - Implementer EmailService.send_email() med Resend API
[ ] A2.3 - Opret email templates mappe med base template
[ ] A2.4 - Opret quote_request template
[ ] A2.5 - Kald send_email() når QuoteRequest oprettes
[ ] A2.6 - Test: Opret bruger → Check inbox hos test-provider
```

**Kode Eksempel:**
```python
# backend/app/services/email_service.py
import resend
from app.core.config import settings

class EmailService:
    def __init__(self):
        resend.api_key = settings.RESEND_API_KEY
    
    async def send_email(
        self,
        to: str,
        subject: str,
        html: str,
        from_email: str = "agent@forbrugeragenten.dk"
    ) -> bool:
        try:
            resend.Emails.send({
                "from": from_email,
                "to": to,
                "subject": subject,
                "html": html
            })
            return True
        except Exception as e:
            print(f"Email error: {e}")
            return False
```

**Estimat:** 2 timer (+ API key setup)

**🧪 TEST CASES: A2 Email Sending**

```python
# tests/test_email_service.py

class TestEmailService:
    """Tests for A2: Email Sending"""
    
    # === UNIT TESTS ===
    
    def test_send_email_success(self):
        """A2.1: Email sends successfully with valid data"""
        # Given: Valid recipient, subject, body
        # When: send_email() called
        # Then: Returns True, email logged
        # Assert: Return value True, EmailLog created
        
    def test_send_email_invalid_recipient(self):
        """A2.2: Invalid email format rejected"""
        # Given: Invalid email "not-an-email"
        # When: send_email() called
        # Then: Returns False, error logged
        # Assert: Return value False
        
    def test_send_email_template_renders(self):
        """A2.3: Template variables replaced correctly"""
        # Given: Template with {{user.name}}, user.name = "Peter"
        # When: render_template() called
        # Then: Output contains "Peter", not "{{user.name}}"
        # Assert: "Peter" in rendered_html
        
    def test_send_email_logs_to_database(self):
        """A2.4: Every email attempt logged"""
        # Given: Any email send attempt
        # When: send_email() called (success or fail)
        # Then: EmailLog entry created
        # Assert: EmailLog.count increased by 1
        
    # === INTEGRATION TESTS ===
    
    def test_quote_request_triggers_emails(self):
        """A2.5: QuoteRequest creation sends emails to providers"""
        # Given: User with categories ['energy', 'mobile']
        # When: QuoteRequest created
        # Then: Emails sent to all active energy + mobile providers
        # Assert: Email count == active provider count for categories
        
    def test_quote_request_email_content(self):
        """A2.6: Quote request email contains correct data"""
        # Given: User "Peter Hansen", category "energy"
        # When: Quote email sent
        # Then: Email contains user name, category, contact info
        # Assert: "Peter Hansen" in email body
        
    def test_nudge_bot_sends_day3_reminder(self):
        """A2.7: Nudge bot sends reminder after 3 days"""
        # Given: QuoteRequest 3+ days old, no response
        # When: run_nudge_bot() called
        # Then: Reminder email sent to provider
        # Assert: EmailLog with type="nudge_day3"
        
    def test_nudge_bot_sends_day7_warning(self):
        """A2.8: Nudge bot sends warning after 7 days"""
        # Given: QuoteRequest 7+ days old, no response
        # When: run_nudge_bot() called
        # Then: Warning email sent, provider flagged
        # Assert: Provider.is_slow_responder == True
        
    # === E2E TESTS ===
    
    def test_e2e_onboarding_sends_emails(self):
        """A2.9: Complete onboarding triggers provider emails"""
        # Steps:
        # 1. Complete onboarding as new user
        # 2. Check email service logs
        # 3. Verify emails sent to expected providers
        # Assert: Email count matches provider count
        
    # === EDGE CASES ===
    
    def test_email_handles_special_characters(self):
        """A2.10: Danish characters (æøå) render correctly"""
        # Given: User name "Søren Ålborg"
        # When: Email sent
        # Then: Characters display correctly
        # Assert: No encoding errors
        
    def test_email_retry_on_failure(self):
        """A2.11: Failed emails retry with backoff"""
        # Given: Temporary Resend API failure
        # When: send_email() fails
        # Then: Retry 3 times with exponential backoff
        # Assert: Up to 3 attempts logged
        
    def test_email_to_inactive_provider_skipped(self):
        """A2.12: Inactive providers don't receive emails"""
        # Given: Provider with is_active=False
        # When: QuoteRequest created
        # Then: No email sent to inactive provider
        # Assert: No EmailLog for inactive provider
```

**Test Data Fixtures:**
```python
# tests/fixtures/email_fixtures.py

VALID_EMAIL_DATA = {
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Hello</h1>"
}

QUOTE_REQUEST_EMAIL_EXPECTED = {
    "subject_contains": "Ny kundeforespørgsel",
    "body_contains": ["ForbrugerAgenten", "kunde", "tilbud"]
}
```

**Test Execution:**
```bash
# Run email tests (with mocked Resend)
pytest tests/test_email_service.py -v --mock-resend

# Run with real Resend (use test API key)
RESEND_API_KEY=test_key pytest tests/test_email_service.py -v
```

---

### A3. Provider Database

**Problem:** Ingen selskaber i databasen. Systemet ved ikke hvem der skal emailes.

| Komponent | Status | Problem |
|:----------|:-------|:--------|
| Provider Tabel | ✅ Eksisterer | Men er tom |
| Seed Data | ❌ Mangler | Ingen Norlys, TDC, osv. |
| Quote Email Targets | ❌ Ingen | Ingen at sende til |
| Category Mapping | ❌ Mangler | Hvilke providers har hvilke kategorier |

**Filer der skal oprettes:**
```
backend/app/seeds/                        → NY: Seeds mappe
backend/app/seeds/providers.py            → Provider seed data
backend/app/seeds/__init__.py             → Seed runner
scripts/seed_database.py                  → CLI til at køre seeds
```

**Provider Seed Data:**
```python
PROVIDERS = [
    # ENERGY
    {
        "name": "Norlys",
        "category": "energy",
        "quote_email": "erhverv@norlys.dk",
        "support_email": "kundeservice@norlys.dk",
        "website": "https://norlys.dk",
        "is_active": True
    },
    {
        "name": "Andel Energi",
        "category": "energy",
        "quote_email": "tilbud@andel.dk",
        "support_email": "support@andel.dk",
        "website": "https://andel.dk",
        "is_active": True
    },
    {
        "name": "OK",
        "category": "energy",
        "quote_email": "el@telemail.ok.dk",
        "support_email": "kundeservice@ok.dk",
        "website": "https://ok.dk",
        "is_active": True
    },
    
    # MOBILE
    {
        "name": "TDC",
        "category": "mobile",
        "quote_email": "erhverv@tdc.dk",
        "support_email": "kundeservice@tdc.dk",
        "website": "https://tdc.dk",
        "is_active": True
    },
    {
        "name": "Telmore",
        "category": "mobile",
        "quote_email": "kontakt@telmore.dk",
        "support_email": "support@telmore.dk",
        "website": "https://telmore.dk",
        "is_active": True
    },
    {
        "name": "Lebara",
        "category": "mobile",
        "quote_email": "info@lebara.dk",
        "support_email": "support@lebara.dk",
        "website": "https://lebara.dk",
        "is_active": True
    },
    {
        "name": "CBB Mobil",
        "category": "mobile",
        "quote_email": "info@cbb.dk",
        "support_email": "support@cbb.dk",
        "website": "https://cbb.dk",
        "is_active": True
    },
    
    # INTERNET
    {
        "name": "YouSee",
        "category": "internet",
        "quote_email": "erhverv@yousee.dk",
        "support_email": "kundeservice@yousee.dk",
        "website": "https://yousee.dk",
        "is_active": True
    },
    {
        "name": "Fastspeed",
        "category": "internet",
        "quote_email": "salg@fastspeed.dk",
        "support_email": "support@fastspeed.dk",
        "website": "https://fastspeed.dk",
        "is_active": True
    },
    {
        "name": "Hiper",
        "category": "internet",
        "quote_email": "kontakt@hiper.dk",
        "support_email": "support@hiper.dk",
        "website": "https://hiper.dk",
        "is_active": True
    },
    {
        "name": "Stofa",
        "category": "internet",
        "quote_email": "erhverv@stofa.dk",
        "support_email": "kundeservice@stofa.dk",
        "website": "https://stofa.dk",
        "is_active": True
    }
]
```

**Implementation Steps:**
```
[ ] A3.1 - Opret seeds mappe struktur
[ ] A3.2 - Opret providers.py med alle danske selskaber
[ ] A3.3 - Opret seed runner script
[ ] A3.4 - Kør seed: python scripts/seed_database.py
[ ] A3.5 - Verificer: SELECT * FROM providers; → 11+ rækker
```

**Estimat:** 1 time

**🧪 TEST CASES: A3 Provider Database**

```python
# tests/test_providers.py

class TestProviderDatabase:
    """Tests for A3: Provider Database"""
    
    # === UNIT TESTS ===
    
    def test_seed_creates_providers(self):
        """A3.1: Seed script creates all expected providers"""
        # Given: Empty providers table
        # When: run_seed() called
        # Then: Providers created
        # Assert: Provider.count >= 11
        
    def test_seed_idempotent(self):
        """A3.2: Running seed twice doesn't duplicate"""
        # Given: Providers already seeded
        # When: run_seed() called again
        # Then: No duplicates created
        # Assert: Provider.count unchanged
        
    def test_provider_has_required_fields(self):
        """A3.3: Each provider has all required fields"""
        # Given: Seeded providers
        # When: Query all providers
        # Then: Each has name, category, quote_email
        # Assert: No None values in required fields
        
    def test_provider_categories_correct(self):
        """A3.4: Providers have valid categories"""
        # Given: Seeded providers
        # When: Query all providers
        # Then: Categories are 'energy', 'mobile', or 'internet'
        # Assert: All categories in valid set
        
    # === INTEGRATION TESTS ===
    
    def test_get_providers_by_category(self):
        """A3.5: Can filter providers by category"""
        # Given: Seeded providers
        # When: GET /providers?category=energy
        # Then: Only energy providers returned
        # Assert: All results have category='energy'
        
    def test_get_active_providers_only(self):
        """A3.6: Inactive providers excluded by default"""
        # Given: Mix of active/inactive providers
        # When: GET /providers
        # Then: Only active providers returned
        # Assert: All results have is_active=True
        
    def test_provider_scorecard_fields(self):
        """A3.7: Scorecard fields initialized correctly"""
        # Given: New provider
        # When: Provider created
        # Then: Scorecard fields have defaults
        # Assert: reputation_score=50, is_slow_responder=False
        
    # === DATA VALIDATION ===
    
    def test_provider_email_format_valid(self):
        """A3.8: All provider emails are valid format"""
        # Given: Seeded providers
        # When: Validate all quote_email fields
        # Then: All match email regex
        # Assert: No invalid emails
        
    def test_provider_website_format_valid(self):
        """A3.9: All provider websites are valid URLs"""
        # Given: Seeded providers
        # When: Validate all website fields
        # Then: All match URL regex
        # Assert: No invalid URLs
        
    # === EDGE CASES ===
    
    def test_provider_with_multiple_categories(self):
        """A3.10: Provider can have multiple categories"""
        # Given: Provider like TDC (mobile + internet)
        # When: Query by either category
        # Then: Provider appears in both
        # Note: May need category as JSON array
```

**Seed Verification Script:**
```python
# scripts/verify_seed.py

def verify_providers():
    """Verify provider seed data is correct"""
    
    expected_counts = {
        "energy": 3,    # Norlys, Andel, OK
        "mobile": 4,    # TDC, Telmore, Lebara, CBB
        "internet": 4   # YouSee, Fastspeed, Hiper, Stofa
    }
    
    for category, expected in expected_counts.items():
        actual = Provider.query.filter_by(category=category).count()
        assert actual >= expected, f"{category}: expected {expected}, got {actual}"
    
    print("✅ All provider seeds verified")
```

**Test Execution:**
```bash
# Run provider tests
pytest tests/test_providers.py -v

# Verify seed
python scripts/verify_seed.py
```

---

## 🟡 KATEGORI B: CORE USER EXPERIENCE

Nødvendigt for at MVP føles som et rigtigt produkt.

### B1. Navigation & Layout

**Problem:** Brugeren er "fanget" på én side. Ingen menu.

| Komponent | Status | Problem |
|:----------|:-------|:--------|
| Sidebar Menu | ❌ Mangler | Bruger stuck på én side |
| Route Guard | ❌ Mangler | Ingen redirect af uauthenticerede |
| Consistent Header | ❌ Mangler | Hver side er en ø |
| Mobile Menu | ❌ Mangler | Ingen responsiv menu |

**Filer der skal oprettes/ændres:**
```
frontend/src/components/Sidebar.tsx       → NY: Navigation sidebar
frontend/src/components/Header.tsx        → NY: Top header
frontend/src/components/AppLayout.tsx     → NY: Wrapper layout
frontend/src/app/(authenticated)/         → NY: Route group
frontend/src/app/(authenticated)/layout.tsx → Layout med sidebar
frontend/src/app/(authenticated)/dashboard/page.tsx → Flyttes hertil
frontend/src/app/(authenticated)/chat/page.tsx     → Flyttes hertil
frontend/src/app/(authenticated)/settings/page.tsx → NY
frontend/src/app/(authenticated)/quotes/page.tsx   → NY
```

**Sidebar Menu Items:**
```
📊 Oversigt        → /dashboard
💬 Rådgiver        → /chat  
📋 Mine Tilbud     → /quotes
⚙️ Indstillinger   → /settings
🚪 Log ud          → /logout
```

**Implementation Steps:**
```
[ ] B1.1 - Opret Sidebar component med menu items
[ ] B1.2 - Opret Header component med bruger info
[ ] B1.3 - Opret AppLayout der wrapper sidebar + header + content
[ ] B1.4 - Opret (authenticated) route group
[ ] B1.5 - Flyt dashboard og chat ind under (authenticated)
[ ] B1.6 - Test: Klik mellem alle menu items
```

**Estimat:** 2 timer

**🧪 TEST CASES: B1 Navigation & Layout**

```typescript
// tests/e2e/navigation.spec.ts

describe('B1: Navigation & Layout', () => {
  
  // === SIDEBAR TESTS ===
  
  test('B1.1: Sidebar displays all menu items', async ({ page }) => {
    // Given: Logged in user on dashboard
    // When: Page loads
    // Then: Sidebar shows all menu items
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()
    await expect(page.getByText('Oversigt')).toBeVisible()
    await expect(page.getByText('Rådgiver')).toBeVisible()
    await expect(page.getByText('Mine Tilbud')).toBeVisible()
    await expect(page.getByText('Indstillinger')).toBeVisible()
    await expect(page.getByText('Log ud')).toBeVisible()
  })
  
  test('B1.2: Sidebar navigation works', async ({ page }) => {
    // Given: User on dashboard
    // When: Click "Rådgiver" in sidebar
    // Then: Navigate to /chat
    await page.click('text=Rådgiver')
    await expect(page).toHaveURL(/\/chat/)
  })
  
  test('B1.3: Active menu item highlighted', async ({ page }) => {
    // Given: User on /dashboard
    // When: Check sidebar
    // Then: "Oversigt" has active styling
    const activeItem = page.locator('[data-testid="nav-oversigt"]')
    await expect(activeItem).toHaveClass(/active/)
  })
  
  test('B1.4: Sidebar collapses on mobile', async ({ page }) => {
    // Given: Mobile viewport (375px)
    await page.setViewportSize({ width: 375, height: 667 })
    // When: Page loads
    // Then: Sidebar hidden, hamburger menu visible
    await expect(page.locator('[data-testid="sidebar"]')).toBeHidden()
    await expect(page.locator('[data-testid="mobile-menu-btn"]')).toBeVisible()
  })
  
  test('B1.5: Mobile menu opens on hamburger click', async ({ page }) => {
    // Given: Mobile viewport, menu closed
    await page.setViewportSize({ width: 375, height: 667 })
    // When: Click hamburger
    await page.click('[data-testid="mobile-menu-btn"]')
    // Then: Menu slides in
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
  })
  
  // === HEADER TESTS ===
  
  test('B1.6: Header shows user name', async ({ page }) => {
    // Given: Logged in as "Peter Hansen"
    // When: Check header
    // Then: Name displayed
    await expect(page.getByText('Peter Hansen')).toBeVisible()
  })
  
  test('B1.7: Header shows user avatar/initials', async ({ page }) => {
    // Given: Logged in user
    // When: Check header
    // Then: Avatar or initials visible
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible()
  })
  
  // === ROUTE PROTECTION TESTS ===
  
  test('B1.8: Unauthenticated user redirected from /dashboard', async ({ page }) => {
    // Given: No session
    await page.context().clearCookies()
    // When: Navigate to /dashboard
    await page.goto('/dashboard')
    // Then: Redirect to /login
    await expect(page).toHaveURL(/\/login/)
  })
  
  test('B1.9: Unauthenticated user redirected from /quotes', async ({ page }) => {
    // Given: No session
    await page.context().clearCookies()
    // When: Navigate to /quotes
    await page.goto('/quotes')
    // Then: Redirect to /login
    await expect(page).toHaveURL(/\/login/)
  })
  
  // === LAYOUT CONSISTENCY ===
  
  test('B1.10: Layout consistent across pages', async ({ page }) => {
    // Given: Multiple pages
    const pages = ['/dashboard', '/chat', '/quotes', '/settings']
    for (const url of pages) {
      await page.goto(url)
      // Then: Sidebar present on all
      await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()
      // Then: Header present on all
      await expect(page.locator('[data-testid="header"]')).toBeVisible()
    }
  })
})
```

**Test Execution:**
```bash
# Run navigation E2E tests
npx playwright test tests/e2e/navigation.spec.ts

# Run with specific viewport
npx playwright test --project=mobile
```

---

### B2. Dashboard Interaktivitet

**Problem:** Alle knapper er pynt. Ingen gør noget.

| Komponent | Status | Problem |
|:----------|:-------|:--------|
| "+ Tilføj ny aftale" | ❌ Gør ingenting | Skal åbne upload modal |
| "Se detaljer" | ❌ Gør ingenting | Skal vise quote request status |
| Contract details | ❌ Ingen visning | Kan ikke se kontrakt info |
| Copy agent email | ✅ Virker | Eneste fungerende knap |

**Filer der skal ændres:**
```
frontend/src/app/(authenticated)/dashboard/page.tsx → Tilføj onClick handlers
frontend/src/components/AddContractModal.tsx        → NY: Upload modal
frontend/src/components/QuoteRequestDetail.tsx      → NY: Status visning
frontend/src/components/ContractDetail.tsx          → NY: Kontrakt modal
```

**Implementation Steps:**
```
[ ] B2.1 - Opret AddContractModal med UploadDropzone
[ ] B2.2 - Forbind "+ Tilføj" knap til modal
[ ] B2.3 - Opret QuoteRequestDetail component
[ ] B2.4 - Forbind "Se detaljer" til QuoteRequestDetail
[ ] B2.5 - Opret ContractDetail modal
[ ] B2.6 - Forbind kontrakt-kort til ContractDetail
[ ] B2.7 - Test: Alle knapper åbner korrekt modal/visning
```

**Estimat:** 3 timer

**🧪 TEST CASES: B2 Dashboard Interactivity**

```typescript
// tests/e2e/dashboard.spec.ts

describe('B2: Dashboard Interactivity', () => {
  
  // === BUTTON TESTS ===
  
  test('B2.1: "Tilføj ny aftale" opens modal', async ({ page }) => {
    // Given: User on dashboard
    // When: Click "+ Tilføj ny aftale"
    await page.click('text=Tilføj ny aftale')
    // Then: Modal opens with upload dropzone
    await expect(page.locator('[data-testid="add-contract-modal"]')).toBeVisible()
    await expect(page.locator('[data-testid="upload-dropzone"]')).toBeVisible()
  })
  
  test('B2.2: Modal closes on X click', async ({ page }) => {
    // Given: Modal open
    await page.click('text=Tilføj ny aftale')
    // When: Click X button
    await page.click('[data-testid="modal-close"]')
    // Then: Modal hidden
    await expect(page.locator('[data-testid="add-contract-modal"]')).toBeHidden()
  })
  
  test('B2.3: Modal closes on backdrop click', async ({ page }) => {
    // Given: Modal open
    await page.click('text=Tilføj ny aftale')
    // When: Click outside modal
    await page.click('[data-testid="modal-backdrop"]')
    // Then: Modal hidden
    await expect(page.locator('[data-testid="add-contract-modal"]')).toBeHidden()
  })
  
  test('B2.4: "Se detaljer" shows quote request detail', async ({ page }) => {
    // Given: User with active quote request
    // When: Click "Se detaljer" on quote request card
    await page.click('[data-testid="quote-request-details-btn"]')
    // Then: Detail panel/modal opens
    await expect(page.locator('[data-testid="quote-request-detail"]')).toBeVisible()
  })
  
  test('B2.5: Quote request detail shows status timeline', async ({ page }) => {
    // Given: Quote request detail open
    await page.click('[data-testid="quote-request-details-btn"]')
    // When: Check content
    // Then: Timeline with status steps visible
    await expect(page.locator('[data-testid="status-timeline"]')).toBeVisible()
  })
  
  test('B2.6: Contract card click shows contract detail', async ({ page }) => {
    // Given: User with contracts
    // When: Click contract card
    await page.click('[data-testid="contract-card"]')
    // Then: Contract detail modal opens
    await expect(page.locator('[data-testid="contract-detail-modal"]')).toBeVisible()
  })
  
  test('B2.7: Contract detail shows all fields', async ({ page }) => {
    // Given: Contract detail open
    await page.click('[data-testid="contract-card"]')
    // When: Check content
    // Then: Provider, price, dates visible
    await expect(page.getByText('Udbyder:')).toBeVisible()
    await expect(page.getByText('Pris:')).toBeVisible()
    await expect(page.getByText('Startdato:')).toBeVisible()
  })
  
  // === COPY AGENT EMAIL ===
  
  test('B2.8: Copy agent email button works', async ({ page }) => {
    // Given: Dashboard with agent email displayed
    // When: Click copy button
    await page.click('[data-testid="copy-agent-email"]')
    // Then: Toast notification shows "Kopieret"
    await expect(page.getByText('Kopieret')).toBeVisible()
  })
  
  // === LOADING STATES ===
  
  test('B2.9: Dashboard shows loading state', async ({ page }) => {
    // Given: Slow API response
    await page.route('**/api/v1/contracts/**', route => 
      route.fulfill({ status: 200, body: '[]', delay: 2000 })
    )
    // When: Page loads
    await page.goto('/dashboard')
    // Then: Loading spinner visible
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible()
  })
  
  test('B2.10: Empty state when no contracts', async ({ page }) => {
    // Given: User with no contracts
    // When: Dashboard loads
    // Then: Empty state message visible
    await expect(page.getByText('Ingen aktive aftaler')).toBeVisible()
  })
})
```

**Test Execution:**
```bash
# Run dashboard E2E tests
npx playwright test tests/e2e/dashboard.spec.ts
```

---

### B3. Quote Comparison View

**Problem:** Brugeren kan ikke se eller vælge tilbud. Hele value proposition mangler!

| Komponent | Status | Problem |
|:----------|:-------|:--------|
| Incoming quotes list | ❌ Mangler | Hvor ser bruger tilbud? |
| Accept/Reject actions | ❌ Mangler | Ingen måde at vælge |
| Price comparison | ❌ Mangler | Kan ikke sammenligne |
| Savings calculation | ❌ Mangler | Ser ikke besparelse |

**Filer der skal oprettes:**
```
frontend/src/app/(authenticated)/quotes/page.tsx    → Tilbudsoversigt
frontend/src/components/QuoteCard.tsx               → Enkelt tilbud kort
frontend/src/components/QuoteComparison.tsx         → Sammenligning
frontend/src/components/AcceptQuoteModal.tsx        → Bekræft valg
backend/app/api/v1/endpoints/quotes.py              → Tilføj accept endpoint
backend/app/schemas/quote.py                        → Tilføj AcceptQuote schema
```

**Quote Card Design:**
```
┌─────────────────────────────────────┐
│ 🏢 Norlys                    ⭐ 4.2 │
│                                     │
│ Spotpris + 2 øre/kWh               │
│                                     │
│ Estimeret pris: 847 kr/md          │
│ Din besparelse: 234 kr/md          │
│                                     │
│ [Se detaljer]  [Vælg dette tilbud] │
└─────────────────────────────────────┘
```

**Implementation Steps:**
```
[ ] B3.1 - Opret /quotes page med liste over aktive forespørgsler
[ ] B3.2 - Opret QuoteCard component
[ ] B3.3 - Vis modtagne tilbud under hver forespørgsel
[ ] B3.4 - Opret sammenligningstabel
[ ] B3.5 - Opret AcceptQuoteModal med bekræftelse
[ ] B3.6 - Implementer POST /quotes/{id}/accept endpoint
[ ] B3.7 - Send "switch initiation" email ved accept
[ ] B3.8 - Test: Se tilbud → Sammenlign → Vælg → Email sendes
```

**Estimat:** 4 timer

**🧪 TEST CASES: B3 Quote Comparison View**

```typescript
// tests/e2e/quotes.spec.ts

describe('B3: Quote Comparison View', () => {
  
  // === PAGE LOAD ===
  
  test('B3.1: Quotes page loads with active requests', async ({ page }) => {
    // Given: User with active quote requests
    await page.goto('/quotes')
    // When: Page loads
    // Then: Quote requests visible
    await expect(page.locator('[data-testid="quote-request-list"]')).toBeVisible()
  })
  
  test('B3.2: Quote request shows category and date', async ({ page }) => {
    // Given: Quote request for "energy"
    await page.goto('/quotes')
    // When: Check request card
    // Then: Category and created date visible
    await expect(page.getByText('Strøm')).toBeVisible()
    await expect(page.locator('[data-testid="request-date"]')).toBeVisible()
  })
  
  // === QUOTE DISPLAY ===
  
  test('B3.3: Received quotes displayed under request', async ({ page }) => {
    // Given: Quote request with 3 received quotes
    await page.goto('/quotes')
    // When: Expand request
    await page.click('[data-testid="expand-quotes"]')
    // Then: 3 quote cards visible
    await expect(page.locator('[data-testid="quote-card"]')).toHaveCount(3)
  })
  
  test('B3.4: Quote card shows provider and price', async ({ page }) => {
    // Given: Quote from "Norlys" at 847 kr/md
    await page.goto('/quotes')
    await page.click('[data-testid="expand-quotes"]')
    // When: Check quote card
    // Then: Provider name and price visible
    await expect(page.getByText('Norlys')).toBeVisible()
    await expect(page.getByText('847 kr/md')).toBeVisible()
  })
  
  test('B3.5: Quote card shows savings calculation', async ({ page }) => {
    // Given: Current price 1000 kr, quote 847 kr
    await page.goto('/quotes')
    await page.click('[data-testid="expand-quotes"]')
    // When: Check quote card
    // Then: Savings "Spar 153 kr/md" visible
    await expect(page.getByText(/Spar.*kr/)).toBeVisible()
  })
  
  // === COMPARISON ===
  
  test('B3.6: Compare button opens comparison view', async ({ page }) => {
    // Given: Multiple quotes
    await page.goto('/quotes')
    await page.click('[data-testid="expand-quotes"]')
    // When: Click "Sammenlign"
    await page.click('text=Sammenlign')
    // Then: Comparison table visible
    await expect(page.locator('[data-testid="comparison-table"]')).toBeVisible()
  })
  
  test('B3.7: Comparison table shows all quotes side-by-side', async ({ page }) => {
    // Given: 3 quotes to compare
    await page.goto('/quotes')
    await page.click('[data-testid="expand-quotes"]')
    await page.click('text=Sammenlign')
    // When: Check table
    // Then: 3 columns (one per quote)
    await expect(page.locator('[data-testid="comparison-column"]')).toHaveCount(3)
  })
  
  // === ACCEPT FLOW ===
  
  test('B3.8: Accept button opens confirmation modal', async ({ page }) => {
    // Given: Quote displayed
    await page.goto('/quotes')
    await page.click('[data-testid="expand-quotes"]')
    // When: Click "Vælg dette tilbud"
    await page.click('text=Vælg dette tilbud')
    // Then: Confirmation modal opens
    await expect(page.locator('[data-testid="accept-quote-modal"]')).toBeVisible()
  })
  
  test('B3.9: Confirmation modal shows quote details', async ({ page }) => {
    // Given: Accept modal open
    await page.goto('/quotes')
    await page.click('[data-testid="expand-quotes"]')
    await page.click('text=Vælg dette tilbud')
    // When: Check modal content
    // Then: Provider, price, terms visible
    await expect(page.getByText('Du er ved at vælge')).toBeVisible()
    await expect(page.locator('[data-testid="confirm-provider"]')).toBeVisible()
    await expect(page.locator('[data-testid="confirm-price"]')).toBeVisible()
  })
  
  test('B3.10: Confirm acceptance triggers API call', async ({ page }) => {
    // Given: Accept modal open
    let apiCalled = false
    await page.route('**/api/v1/quotes/*/accept', route => {
      apiCalled = true
      route.fulfill({ status: 200, json: { success: true } })
    })
    await page.goto('/quotes')
    await page.click('[data-testid="expand-quotes"]')
    await page.click('text=Vælg dette tilbud')
    // When: Click "Bekræft"
    await page.click('text=Bekræft')
    // Then: API called
    expect(apiCalled).toBe(true)
  })
  
  test('B3.11: Success message after acceptance', async ({ page }) => {
    // Given: Accept confirmed
    await page.route('**/api/v1/quotes/*/accept', route => 
      route.fulfill({ status: 200, json: { success: true } })
    )
    await page.goto('/quotes')
    await page.click('[data-testid="expand-quotes"]')
    await page.click('text=Vælg dette tilbud')
    await page.click('text=Bekræft')
    // When: API returns success
    // Then: Success toast shown
    await expect(page.getByText('Tillykke!')).toBeVisible()
  })
  
  // === EMPTY STATES ===
  
  test('B3.12: Empty state when no quote requests', async ({ page }) => {
    // Given: User with no quote requests
    // When: Visit /quotes
    await page.goto('/quotes')
    // Then: Empty state message
    await expect(page.getByText('Ingen aktive jagter')).toBeVisible()
  })
  
  test('B3.13: Pending state when waiting for quotes', async ({ page }) => {
    // Given: Quote request with 0 received quotes
    await page.goto('/quotes')
    // When: Check request status
    // Then: "Afventer tilbud" visible
    await expect(page.getByText('Afventer tilbud')).toBeVisible()
  })
})

// === BACKEND TESTS ===

// tests/test_quote_acceptance.py
class TestQuoteAcceptance:
    """Backend tests for quote acceptance"""
    
    def test_accept_quote_creates_contract(self):
        """B3.14: Accepting quote creates contract"""
        # Given: Valid quote
        # When: POST /quotes/{id}/accept
        # Then: Contract created with quote data
        # Assert: Contract.provider == Quote.provider
        
    def test_accept_quote_sends_switch_email(self):
        """B3.15: Accepting quote triggers switch email"""
        # Given: Valid quote
        # When: POST /quotes/{id}/accept
        # Then: Email sent to provider
        # Assert: EmailLog created with type="switch_initiation"
        
    def test_accept_quote_updates_request_status(self):
        """B3.16: Accepting quote updates request status"""
        # Given: QuoteRequest status="pending"
        # When: Quote accepted
        # Then: Status = "accepted"
        # Assert: QuoteRequest.status == "accepted"
        
    def test_cannot_accept_already_accepted(self):
        """B3.17: Cannot accept quote on accepted request"""
        # Given: QuoteRequest already accepted
        # When: Try to accept another quote
        # Then: 400 error returned
        # Assert: Response status 400
```

**Test Execution:**
```bash
# Run quotes E2E tests
npx playwright test tests/e2e/quotes.spec.ts

# Run backend acceptance tests
pytest tests/test_quote_acceptance.py -v
```

---

### B4. Settings Page

**Problem:** Bruger kan ikke ændre profil eller slette konto (GDPR).

| Komponent | Status | Problem |
|:----------|:-------|:--------|
| Profile edit | ❌ Mangler | Kan ikke opdatere navn/telefon |
| Email preferences | ❌ Mangler | Kan ikke toggle forward settings |
| Password change | ❌ Mangler | Auth0 håndterer, men UI mangler |
| Delete account | ❌ Mangler | GDPR krav! |
| Export data | ❌ Mangler | GDPR krav! |

**Filer der skal oprettes:**
```
frontend/src/app/(authenticated)/settings/page.tsx  → Settings page
frontend/src/components/ProfileForm.tsx             → Profil redigering
frontend/src/components/EmailPreferences.tsx        → Email toggles
frontend/src/components/DeleteAccountModal.tsx      → Slet konto dialog
backend/app/api/v1/endpoints/users.py               → Tilføj DELETE endpoint
```

**Settings Sektioner:**
```
📝 Profil
   - Navn
   - Email (readonly)
   - Telefon
   - [Gem ændringer]

📧 Email Præferencer  
   - [x] Videresend vigtige emails
   - [ ] Videresend marketing
   - Agent email: peter.x92@agent.fa.dk [Kopier]

🔐 Sikkerhed
   - [Skift adgangskode] → Auth0

⚠️ Farezone
   - [Download mine data] → GDPR eksport
   - [Slet min konto] → GDPR sletning
```

**Implementation Steps:**
```
[ ] B4.1 - Opret /settings page med sektioner
[ ] B4.2 - Opret ProfileForm med update endpoint
[ ] B4.3 - Opret EmailPreferences component
[ ] B4.4 - Implementer DELETE /users/me endpoint
[ ] B4.5 - Opret DeleteAccountModal med bekræftelse
[ ] B4.6 - Implementer GET /users/me/export endpoint
[ ] B4.7 - Test: Opdater profil, toggle emails, eksportér, slet
```

**Estimat:** 2 timer

**🧪 TEST CASES: B4 Settings Page**

```typescript
// tests/e2e/settings.spec.ts

describe('B4: Settings Page', () => {
  
  // === PROFILE SECTION ===
  
  test('B4.1: Profile form loads with current data', async ({ page }) => {
    // Given: User "Peter Hansen", phone "12345678"
    await page.goto('/settings')
    // When: Check form fields
    // Then: Pre-filled with current values
    await expect(page.locator('input[name="name"]')).toHaveValue('Peter Hansen')
    await expect(page.locator('input[name="phone"]')).toHaveValue('12345678')
  })
  
  test('B4.2: Email field is readonly', async ({ page }) => {
    // Given: Settings page loaded
    await page.goto('/settings')
    // When: Check email field
    // Then: Cannot edit
    await expect(page.locator('input[name="email"]')).toBeDisabled()
  })
  
  test('B4.3: Profile update saves changes', async ({ page }) => {
    // Given: Edit name to "Peter Nielsen"
    await page.goto('/settings')
    await page.fill('input[name="name"]', 'Peter Nielsen')
    // When: Click save
    await page.click('text=Gem ændringer')
    // Then: Success toast, data persisted
    await expect(page.getByText('Profil opdateret')).toBeVisible()
  })
  
  test('B4.4: Invalid phone number rejected', async ({ page }) => {
    // Given: Invalid phone "abc"
    await page.goto('/settings')
    await page.fill('input[name="phone"]', 'abc')
    // When: Click save
    await page.click('text=Gem ændringer')
    // Then: Error shown
    await expect(page.getByText('Ugyldigt telefonnummer')).toBeVisible()
  })
  
  // === EMAIL PREFERENCES ===
  
  test('B4.5: Email preferences show current settings', async ({ page }) => {
    // Given: forward_essential=true, forward_marketing=false
    await page.goto('/settings')
    // When: Check toggles
    // Then: Correct states
    await expect(page.locator('[data-testid="toggle-essential"]')).toBeChecked()
    await expect(page.locator('[data-testid="toggle-marketing"]')).not.toBeChecked()
  })
  
  test('B4.6: Toggle email preference saves immediately', async ({ page }) => {
    // Given: forward_marketing=false
    await page.goto('/settings')
    // When: Toggle marketing ON
    await page.click('[data-testid="toggle-marketing"]')
    // Then: API called, toast shown
    await expect(page.getByText('Præference gemt')).toBeVisible()
  })
  
  test('B4.7: Agent email displayed with copy button', async ({ page }) => {
    // Given: User with agent_email
    await page.goto('/settings')
    // When: Check email section
    // Then: Agent email visible with copy button
    await expect(page.locator('[data-testid="agent-email-display"]')).toBeVisible()
    await expect(page.locator('[data-testid="copy-agent-email"]')).toBeVisible()
  })
  
  // === GDPR - DATA EXPORT ===
  
  test('B4.8: Export data button triggers download', async ({ page }) => {
    // Given: Settings page
    await page.goto('/settings')
    // When: Click "Download mine data"
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('text=Download mine data')
    ])
    // Then: JSON file downloaded
    expect(download.suggestedFilename()).toContain('.json')
  })
  
  test('B4.9: Exported data contains all user info', async ({ page }) => {
    // Given: User with contracts, quotes, emails
    // When: GET /users/me/export
    // Then: JSON contains all data
    const response = await page.request.get('/api/v1/users/me/export')
    const data = await response.json()
    expect(data).toHaveProperty('user')
    expect(data).toHaveProperty('contracts')
    expect(data).toHaveProperty('quote_requests')
    expect(data).toHaveProperty('emails')
  })
  
  // === GDPR - DELETE ACCOUNT ===
  
  test('B4.10: Delete account button opens confirmation', async ({ page }) => {
    // Given: Settings page
    await page.goto('/settings')
    // When: Click "Slet min konto"
    await page.click('text=Slet min konto')
    // Then: Confirmation modal opens
    await expect(page.locator('[data-testid="delete-account-modal"]')).toBeVisible()
  })
  
  test('B4.11: Delete confirmation requires typing SLET', async ({ page }) => {
    // Given: Delete modal open
    await page.goto('/settings')
    await page.click('text=Slet min konto')
    // When: Confirm button checked
    // Then: Disabled until "SLET" typed
    await expect(page.locator('[data-testid="confirm-delete-btn"]')).toBeDisabled()
    await page.fill('input[placeholder="Skriv SLET"]', 'SLET')
    await expect(page.locator('[data-testid="confirm-delete-btn"]')).toBeEnabled()
  })
  
  test('B4.12: Delete account removes all data', async ({ page }) => {
    // Given: User confirms deletion
    await page.goto('/settings')
    await page.click('text=Slet min konto')
    await page.fill('input[placeholder="Skriv SLET"]', 'SLET')
    // When: Click confirm
    await page.click('[data-testid="confirm-delete-btn"]')
    // Then: Redirect to goodbye page, data deleted
    await expect(page).toHaveURL(/\/goodbye/)
  })
})

// === BACKEND GDPR TESTS ===

// tests/test_gdpr.py
class TestGDPRCompliance:
    """Backend tests for GDPR compliance"""
    
    def test_export_includes_all_user_data(self):
        """B4.13: Export contains complete user data"""
        # Given: User with various data
        # When: GET /users/me/export
        # Then: All tables included
        # Assert: Keys present for all user-related tables
        
    def test_delete_removes_user_record(self):
        """B4.14: Delete removes user from database"""
        # Given: User exists
        # When: DELETE /users/me
        # Then: User not found
        # Assert: User.query.get(id) is None
        
    def test_delete_removes_contracts(self):
        """B4.15: Delete cascades to contracts"""
        # Given: User with 3 contracts
        # When: DELETE /users/me
        # Then: Contracts deleted
        # Assert: Contract.query.filter_by(user_id=id).count() == 0
        
    def test_delete_removes_email_logs(self):
        """B4.16: Delete cascades to email logs"""
        # Given: User with email history
        # When: DELETE /users/me
        # Then: Email logs deleted
        # Assert: EmailLog.query.filter_by(user_id=id).count() == 0
        
    def test_delete_anonymizes_audit_trail(self):
        """B4.17: Delete anonymizes (not removes) audit entries"""
        # Given: User with audit trail
        # When: DELETE /users/me
        # Then: Audit entries show "[DELETED]" not real name
        # Assert: No PII in audit logs
```

**Test Execution:**
```bash
# Run settings E2E tests
npx playwright test tests/e2e/settings.spec.ts

# Run GDPR compliance tests
pytest tests/test_gdpr.py -v
```

---

## 🟢 KATEGORI C: POLISH

Ikke blokerende, men vigtigt for professionelt førstehåndsindtryk.

### C1. Error Handling & Loading States

| Komponent | Status | Anbefaling |
|:----------|:-------|:-----------|
| API Error Messages | ⚠️ Generic | Vis brugervenlige fejlbeskeder |
| Loading Spinners | ⚠️ Inkonsistent | Ensartet loading på alle sider |
| Empty States | ⚠️ Mangelfuld | Pæne "ingen data" visninger |
| Toast Notifications | ✅ Implementeret | react-hot-toast virker |

**Implementation Steps:**
```
[ ] C1.1 - Opret ErrorBoundary component
[ ] C1.2 - Tilføj loading skeletons på alle sider
[ ] C1.3 - Opret EmptyState component til lister
[ ] C1.4 - Standardiser fejlbeskeder
```

**Estimat:** 1.5 timer

---

### C2. Mobile Responsiveness

| Komponent | Status | Anbefaling |
|:----------|:-------|:-----------|
| Dashboard | ⚠️ Delvist | Sidebar skal collapsible |
| Onboarding | ✅ Responsiv | Virker på mobil |
| Modals | ⚠️ Ukendt | Test og fix |
| Tables | ⚠️ Ukendt | Scroll eller stack |

**Implementation Steps:**
```
[ ] C2.1 - Gør sidebar collapsible på mobil
[ ] C2.2 - Test alle modals på mobil
[ ] C2.3 - Tilføj horizontal scroll på tabeller
[ ] C2.4 - Test full flow på iPhone/Android
```

**Estimat:** 1.5 timer

---

### C3. Email Templates (Pretty HTML)

| Template | Status | Prioritet |
|:---------|:-------|:----------|
| Quote Request | ❌ Mangler | 🔴 Kritisk |
| Welcome User | ❌ Mangler | 🟡 Høj |
| Quote Received | ❌ Mangler | 🟡 Høj |
| Nudge Day 3 | ❌ Mangler | 🟢 Medium |
| Nudge Day 7 | ❌ Mangler | 🟢 Medium |

**Template Struktur:**
```html
<!-- base_template.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: #1a1a2e; color: white; padding: 20px; }
    .content { padding: 30px; }
    .button { background: #4361ee; color: white; padding: 12px 24px; }
    .footer { background: #f5f5f5; padding: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="logo.png" alt="ForbrugerAgenten" />
    </div>
    <div class="content">
      {{ content }}
    </div>
    <div class="footer">
      ForbrugerAgenten ApS | CVR: XXXXXXXX
      <br>Du modtager denne email fordi...
    </div>
  </div>
</body>
</html>
```

**Implementation Steps:**
```
[ ] C3.1 - Opret base email template
[ ] C3.2 - Opret quote_request template
[ ] C3.3 - Opret welcome template
[ ] C3.4 - Opret quote_received template
[ ] C3.5 - Test alle templates i email client
```

**Estimat:** 1 time

**🧪 TEST CASES: C1-C3 Polish**

```typescript
// tests/e2e/polish.spec.ts

describe('C1: Error Handling & Loading States', () => {
  
  test('C1.1: API error shows user-friendly message', async ({ page }) => {
    // Given: API returns 500
    await page.route('**/api/**', route => 
      route.fulfill({ status: 500 })
    )
    await page.goto('/dashboard')
    // When: Error occurs
    // Then: Friendly message, not stack trace
    await expect(page.getByText('Noget gik galt')).toBeVisible()
    await expect(page.locator('text=Error:')).not.toBeVisible()
  })
  
  test('C1.2: Network error shows retry option', async ({ page }) => {
    // Given: Network failure
    await page.route('**/api/**', route => route.abort())
    await page.goto('/dashboard')
    // When: Error occurs
    // Then: "Prøv igen" button visible
    await expect(page.getByText('Prøv igen')).toBeVisible()
  })
  
  test('C1.3: Loading skeleton on dashboard', async ({ page }) => {
    // Given: Slow API
    await page.route('**/api/**', route => 
      route.fulfill({ status: 200, body: '[]', delay: 2000 })
    )
    // When: Page loads
    await page.goto('/dashboard')
    // Then: Skeleton visible, not blank page
    await expect(page.locator('[data-testid="skeleton"]')).toBeVisible()
  })
  
  test('C1.4: Empty state for lists', async ({ page }) => {
    // Given: Empty contracts list
    await page.route('**/api/v1/contracts/**', route => 
      route.fulfill({ status: 200, json: [] })
    )
    await page.goto('/dashboard')
    // When: Data loads
    // Then: Empty state with icon and text
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible()
    await expect(page.locator('[data-testid="empty-state-icon"]')).toBeVisible()
  })
  
  test('C1.5: 404 page for unknown routes', async ({ page }) => {
    // Given: Invalid URL
    // When: Navigate to /unknown-page
    await page.goto('/unknown-page-xyz')
    // Then: 404 page shown
    await expect(page.getByText('Siden blev ikke fundet')).toBeVisible()
  })
})

describe('C2: Mobile Responsiveness', () => {
  
  test('C2.1: Dashboard readable on iPhone SE', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    // Then: No horizontal scroll
    const body = await page.locator('body')
    const scrollWidth = await body.evaluate(el => el.scrollWidth)
    const clientWidth = await body.evaluate(el => el.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10)
  })
  
  test('C2.2: Modals fit mobile screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    await page.click('text=Tilføj ny aftale')
    // Then: Modal doesn't overflow
    const modal = page.locator('[data-testid="add-contract-modal"]')
    const box = await modal.boundingBox()
    expect(box.width).toBeLessThanOrEqual(375)
  })
  
  test('C2.3: Touch targets minimum 44px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    // Then: All buttons at least 44px height
    const buttons = page.locator('button')
    const count = await buttons.count()
    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox()
      expect(box.height).toBeGreaterThanOrEqual(44)
    }
  })
  
  test('C2.4: Onboarding flow works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/onboarding')
    // Step through all steps
    await page.click('text=Næste')
    await page.click('text=Næste')
    await page.click('text=Næste')
    // Then: Final step reachable
    await expect(page.getByText('Start Jagten')).toBeVisible()
  })
  
  test('C2.5: Tables scroll horizontally on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/quotes')
    // Then: Table has horizontal scroll
    const tableContainer = page.locator('[data-testid="table-container"]')
    await expect(tableContainer).toHaveCSS('overflow-x', 'auto')
  })
})

describe('C3: Email Templates', () => {
  
  test('C3.1: Quote request email renders correctly', async () => {
    // Given: Template with variables
    const template = await loadTemplate('quote_request')
    const rendered = renderTemplate(template, {
      user: { name: 'Peter Hansen' },
      provider: { name: 'Norlys' },
      categories: ['energy']
    })
    // Then: Variables replaced
    expect(rendered).toContain('Peter Hansen')
    expect(rendered).toContain('Norlys')
    expect(rendered).not.toContain('{{')
  })
  
  test('C3.2: Email valid HTML', async () => {
    // Given: Rendered email
    const html = await renderQuoteRequestEmail(testData)
    // When: Validate HTML
    const errors = validateHTML(html)
    // Then: No errors
    expect(errors).toHaveLength(0)
  })
  
  test('C3.3: Email renders in major clients', async () => {
    // Given: Rendered email
    const html = await renderQuoteRequestEmail(testData)
    // When: Check compatibility
    // Then: Works in Gmail, Outlook, Apple Mail
    const compatibility = await checkEmailCompatibility(html)
    expect(compatibility.gmail).toBe(true)
    expect(compatibility.outlook).toBe(true)
    expect(compatibility.appleMail).toBe(true)
  })
  
  test('C3.4: Danish characters render correctly', async () => {
    // Given: Template with Danish characters
    const rendered = renderTemplate('welcome', {
      user: { name: 'Søren Ålborg' }
    })
    // Then: Characters preserved
    expect(rendered).toContain('Søren Ålborg')
    expect(rendered).not.toContain('S&oslash;ren')
  })
})
```

**Test Execution:**
```bash
# Run all polish tests
npx playwright test tests/e2e/polish.spec.ts

# Run mobile-specific tests
npx playwright test --project=mobile

# Run email template tests
pytest tests/test_email_templates.py -v
```

---

## 🧪 KOMPLET TEST MATRIX

### Oversigt over alle tests

| Kategori | Test Fil | Antal Tests | Type |
|:---------|:---------|:-----------:|:-----|
| A1: Auth | `test_auth.py` + `auth.spec.ts` | 10 | Unit + E2E |
| A2: Email | `test_email_service.py` | 12 | Unit + Integration |
| A3: Providers | `test_providers.py` | 10 | Unit + Data |
| B1: Navigation | `navigation.spec.ts` | 10 | E2E |
| B2: Dashboard | `dashboard.spec.ts` | 10 | E2E |
| B3: Quotes | `quotes.spec.ts` + `test_quote_acceptance.py` | 17 | E2E + Backend |
| B4: Settings | `settings.spec.ts` + `test_gdpr.py` | 17 | E2E + Backend |
| C1-C3: Polish | `polish.spec.ts` | 14 | E2E |
| **TOTAL** | | **100** | |

### Test Kommandoer

```bash
# Kør ALLE tests
./scripts/run_all_tests.sh

# Kør kun backend tests
pytest tests/ -v

# Kør kun E2E tests
npx playwright test

# Kør med coverage
pytest tests/ --cov=app --cov-report=html

# Kør specifik kategori
pytest tests/ -k "auth" -v
npx playwright test tests/e2e/auth.spec.ts
```

### CI/CD Pipeline Tests

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run pytest
        run: pytest tests/ -v --cov=app
        
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
      - name: Install Playwright
        run: npx playwright install
      - name: Run E2E tests
        run: npx playwright test
```

---

## 📋 SPRINT PLAN

### Sprint 1: "Make It Real" (Dag 1)
**Mål:** Core loop virker - bruger signup → providers får email

```
[ ] A3 - Seed providers (1 time)
[ ] A2 - Connect email service (2 timer)
[ ] B1 - Add navigation sidebar (2 timer)
[ ] Onboarding sends quote emails to seeded providers
```

**Test Kriterie:** 
- Ny bruger gennemfører onboarding
- 3+ selskaber modtager email med forespørgsel
- Bruger kan navigere mellem sider

**Samlet tid:** ~5 timer

---

### Sprint 2: "Close The Loop" (Dag 2)
**Mål:** Fuld flow fra forespørgsel → sammenligning → valg

```
[ ] B3 - Build Quote Comparison page (4 timer)
[ ] Admin kan manuelt tilføje provider-svar (1 time)
[ ] User kan acceptere tilbud (inkluderet i B3)
[ ] Accept trigger sender switch email (inkluderet i A2)
```

**Test Kriterie:**
- Admin tilføjer test-tilbud
- Bruger ser tilbud på /quotes
- Bruger accepterer → email sendes

**Samlet tid:** ~5 timer

---

### Sprint 3: "Secure It" (Dag 3)
**Mål:** Production-sikker applikation

```
[ ] A1 - Fix Auth0 end-to-end (3 timer)
[ ] B4 - Build settings page (2 timer)
[ ] Protected routes virker
[ ] GDPR slet/eksport virker
```

**Test Kriterie:**
- Kan ikke tilgå /dashboard uden login
- Session overlever refresh
- Kan eksportere og slette data

**Samlet tid:** ~5 timer

---

### Sprint 4: "Polish" (Dag 4)
**Mål:** Klar til rigtige brugere

```
[ ] C1 - Error handling & loading states (1.5 timer)
[ ] C2 - Mobile responsiveness (1.5 timer)
[ ] C3 - Email templates (1 time)
[ ] Full flow test x10
```

**Test Kriterie:**
- Ingen console errors
- Virker på mobil
- Emails ser professionelle ud
- 10 gennemløb uden fejl

**Samlet tid:** ~4 timer

---

## 🔑 EKSTERNE AFHÆNGIGHEDER

Disse skal være på plads FØR vi kan starte:

| Item | Formål | Handling | Status |
|:-----|:-------|:---------|:-------|
| `RESEND_API_KEY` | Send emails | Sign up på resend.com | ⬜ |
| `OPENAI_API_KEY` | Bill parsing | Allerede konfigureret? | ⬜ |
| Domain MX Records | Modtag agent emails | Point til Resend/SendGrid | ⬜ |
| Auth0 Credentials | Production auth | Allerede konfigureret? | ⬜ |
| Criipto Credentials | MitID signing | Kontakt Criipto | ⬜ |
| Test Email Accounts | Verificer emails | Opret test@... hos providers | ⬜ |

---

## ⏱️ SAMLET TIDSESTIMAT

| Kategori | Timer |
|:---------|------:|
| A: Blokerende Problemer | 5-6t |
| B: Core UX | 11-13t |
| C: Polish | 4t |
| **Total** | **~20-23t** |

**Fordelt på sprints:**
| Sprint | Fokus | Timer |
|:-------|:------|------:|
| Sprint 1 | Make It Real | 5t |
| Sprint 2 | Close The Loop | 5t |
| Sprint 3 | Secure It | 5t |
| Sprint 4 | Polish | 4t |

---

## ✅ DEFINITION OF DONE

Release er klar når:

### Kritisk (Blokerende)
- [ ] Bruger kan logge ind med Auth0
- [ ] Session overlever page refresh
- [ ] Providers er seeded i database
- [ ] Emails sendes faktisk (verificeret i inbox)
- [ ] Protected routes virker

### Core Flow
- [ ] Fuld flow: Signup → Onboarding → Providers emailet
- [ ] Admin kan tilføje tilbud manuelt
- [ ] Bruger kan se og sammenligne tilbud
- [ ] Bruger kan acceptere tilbud
- [ ] Accept sender switch email

### UX
- [ ] Navigation sidebar fungerer
- [ ] Alle dashboard knapper virker
- [ ] Settings page med profil og GDPR
- [ ] Mobile responsive

### Quality
- [ ] Ingen console errors
- [ ] Loading states overalt
- [ ] Pæne email templates
- [ ] 10 gennemløb uden fejl

---

## 🚀 QUICK START

Start her:

```bash
# 1. Tjek at backend kører
curl http://localhost:4332/health

# 2. Seed providers
cd backend && python scripts/seed_database.py

# 3. Test email (kræver RESEND_API_KEY)
curl -X POST http://localhost:4332/api/v1/test/email \
  -H "Content-Type: application/json" \
  -d '{"to": "din@email.dk", "subject": "Test", "body": "Virker!"}'

# 4. Gennemfør onboarding og verificer emails
open http://localhost:4411/onboarding
```

---

## 📁 FULD FIL OVERSIGT

### Nye Filer (skal oprettes)
```
backend/
├── app/
│   ├── seeds/
│   │   ├── __init__.py
│   │   └── providers.py
│   └── templates/
│       └── emails/
│           ├── base.html
│           ├── quote_request.html
│           ├── welcome.html
│           ├── quote_received.html
│           ├── nudge_day3.html
│           └── nudge_day7.html
└── scripts/
    └── seed_database.py

frontend/src/
├── components/
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── AppLayout.tsx
│   ├── AuthGuard.tsx
│   ├── AddContractModal.tsx
│   ├── QuoteCard.tsx
│   ├── QuoteComparison.tsx
│   ├── AcceptQuoteModal.tsx
│   ├── ProfileForm.tsx
│   ├── EmailPreferences.tsx
│   ├── DeleteAccountModal.tsx
│   ├── ErrorBoundary.tsx
│   └── EmptyState.tsx
├── lib/
│   └── auth.ts
└── app/
    └── (authenticated)/
        ├── layout.tsx
        ├── dashboard/
        │   └── page.tsx
        ├── chat/
        │   └── page.tsx
        ├── quotes/
        │   └── page.tsx
        └── settings/
            └── page.tsx
```

### Filer der skal ændres
```
backend/
├── app/
│   ├── core/config.py          → Tilføj RESEND_API_KEY
│   ├── services/email_service.py → Implementer med Resend
│   └── api/v1/endpoints/
│       ├── users.py            → Tilføj DELETE endpoint
│       └── quotes.py           → Tilføj accept endpoint
└── requirements.txt            → Tilføj resend

frontend/src/
├── app/
│   ├── layout.tsx              → Tilføj global providers
│   ├── login/page.tsx          → Forbind Auth0
│   ├── logout/page.tsx         → Implementer
│   └── callback/page.tsx       → Fix Auth0 callback
└── lib/
    └── api.ts                  → Tilføj nye endpoints
```

---

*Sidst opdateret: 2025-12-11*




