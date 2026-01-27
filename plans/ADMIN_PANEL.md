# 🏢 ADMIN PANEL: KOMPLET SPECIFIKATION

**Formål:** Et centralt kontrolcenter til at drive ForbrugerAgenten som forretning.
**Status:** 🔴 IKKE STARTET
**Estimeret arbejde:** ~56 timer (4 uger ved deltid)

---

## 📐 ARKITEKTUR

### Beslutning: Embedded Admin (Fase 1)
- **Placering:** Samme Next.js app, `/admin/*` routes
- **Adgang:** Role-based (admin vs. bruger)
- **Fordele:** Hurtigere at bygge, delte komponenter
- **Fremtid:** Kan migreres til separat app når teamet vokser

### Teknisk Stack
- **Frontend:** Next.js 14 (App Router) + Tailwind
- **Backend:** FastAPI (eksisterende)
- **Auth:** Separat admin login (ikke Auth0)
- **Charts:** Recharts eller Chart.js

---

## 🗂️ MODUL OVERSIGT

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                          │
├──────────────┬──────────────┬──────────────┬───────────────┤
│  OPERATIONS  │    USERS     │  PROVIDERS   │  ANALYTICS    │
│  (Daglig)    │    (CRM)     │  (Partnere)  │  (Indsigt)    │
├──────────────┼──────────────┼──────────────┼───────────────┤
│    SYSTEM    │   FINANCE    │    COMMS     │    CONFIG     │
│  (Sundhed)   │  (Økonomi)   │  (Skabeloner)│  (Indstill.)  │
└──────────────┴──────────────┴──────────────┴───────────────┘
```

---

## 1️⃣ OPERATIONS CENTER (Dagligt Arbejde)

Kommandocentralen for daglig drift.

### 1.1 Hoved-Kø Dashboard
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Ventende Tilbudsforespørgsler** | Liste over aktive jagter der afventer selskabssvar | 🔴 Kritisk |
| **Support Tickets** | Åbne sager sorteret efter alder/prioritet | 🔴 Kritisk |
| **Afventer Bruger** | Modtagne tilbud hvor bruger ikke har svaret | 🟡 Høj |
| **Fastlåste Sager** | Alt ældre end X dage uden fremskridt | 🟡 Høj |
| **Hurtige Handlinger** | "Send Rykker", "Marker Løst", "Eskalér" | 🟡 Høj |

### 1.2 Aktivitetsstrøm (Real-time)
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Live Feed** | Real-time strøm af alle systemhændelser | 🟢 Medium |
| **Filtre** | Efter type (signup, tilbud, email, fejl) | 🟢 Medium |
| **Søgning** | Find specifik bruger/selskab aktivitet | 🟢 Medium |

### 1.3 Opgavestyring
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Manuelle Opfølgninger** | Opgaver tildelt admin-teamet | 🟢 Medium |
| **Påmindelser** | "Ring til bruger X i morgen" | 🟢 Medium |

### Backend Endpoints
```
GET  /admin/queues/quote-requests
GET  /admin/queues/support-tickets  
GET  /admin/queues/awaiting-user
GET  /admin/activity/stream
POST /admin/tasks
GET  /admin/tasks
PUT  /admin/tasks/{id}
```

### Frontend Sider
```
/admin/dashboard          → Kø-oversigt med alle ventende sager
/admin/activity           → Live aktivitetsstrøm
/admin/tasks              → Opgaveliste
```

**🧪 TEST CASES: Operations Center**

```python
# tests/admin/test_operations.py

class TestOperationsCenter:
    """Tests for Admin Operations Center"""
    
    # === QUEUE TESTS ===
    
    def test_get_pending_quote_requests(self):
        """OP.1: Returns all pending quote requests"""
        # Given: 5 pending, 3 completed quote requests
        # When: GET /admin/queues/quote-requests
        # Then: Only 5 pending returned
        # Assert: len(response.data) == 5
        
    def test_quote_requests_sorted_by_age(self):
        """OP.2: Oldest requests first"""
        # Given: Requests from day 1, 3, 5
        # When: GET /admin/queues/quote-requests
        # Then: Day 5 first, day 1 last
        # Assert: response.data[0].age_days >= response.data[1].age_days
        
    def test_get_pending_support_tickets(self):
        """OP.3: Returns open support tickets"""
        # Given: 3 open, 2 closed tickets
        # When: GET /admin/queues/support-tickets
        # Then: Only 3 open returned
        # Assert: All have status != 'closed'
        
    def test_tickets_sorted_by_priority(self):
        """OP.4: High priority first"""
        # Given: Mix of priorities
        # When: GET /admin/queues/support-tickets
        # Then: Urgent > High > Normal > Low
        # Assert: Priority order correct
        
    def test_awaiting_user_queue(self):
        """OP.5: Returns quotes awaiting user response"""
        # Given: 2 quotes user hasn't responded to
        # When: GET /admin/queues/awaiting-user
        # Then: 2 items returned
        # Assert: All have quotes but no acceptance
        
    def test_stuck_items_over_7_days(self):
        """OP.6: Flags items over 7 days old"""
        # Given: Item 10 days old
        # When: GET /admin/queues/quote-requests
        # Then: Item flagged as stuck
        # Assert: item.is_stuck == True
        
    # === ACTIVITY STREAM ===
    
    def test_activity_stream_returns_recent(self):
        """OP.7: Returns last 100 activities"""
        # Given: 150 activities
        # When: GET /admin/activity/stream
        # Then: 100 returned, most recent first
        # Assert: len(response.data) == 100
        
    def test_activity_stream_filter_by_type(self):
        """OP.8: Can filter by activity type"""
        # Given: Mix of signups, quotes, emails
        # When: GET /admin/activity/stream?type=signup
        # Then: Only signups returned
        # Assert: All have type='signup'
        
    def test_activity_stream_search(self):
        """OP.9: Can search by user/provider"""
        # Given: Activity for "Peter Hansen"
        # When: GET /admin/activity/stream?q=Peter
        # Then: Matching activities returned
        # Assert: "Peter" in results
        
    # === QUICK ACTIONS ===
    
    def test_send_reminder_action(self):
        """OP.10: Send reminder creates email"""
        # Given: Quote request without response
        # When: POST /admin/queues/{id}/send-reminder
        # Then: Email sent to provider
        # Assert: EmailLog created
        
    def test_mark_resolved_action(self):
        """OP.11: Mark resolved updates status"""
        # Given: Open support ticket
        # When: POST /admin/queues/{id}/resolve
        # Then: Status = 'resolved'
        # Assert: ticket.status == 'resolved'
        
    def test_escalate_action(self):
        """OP.12: Escalate increases priority"""
        # Given: Normal priority ticket
        # When: POST /admin/queues/{id}/escalate
        # Then: Priority = 'high'
        # Assert: ticket.priority == 'high'
```

```typescript
// tests/admin/e2e/operations.spec.ts

describe('Admin Operations Dashboard', () => {
  
  test('OP.13: Dashboard shows queue counts', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page.locator('[data-testid="pending-quotes-count"]')).toBeVisible()
    await expect(page.locator('[data-testid="open-tickets-count"]')).toBeVisible()
  })
  
  test('OP.14: Click queue item opens detail', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await page.click('[data-testid="queue-item"]')
    await expect(page.locator('[data-testid="item-detail-panel"]')).toBeVisible()
  })
  
  test('OP.15: Quick action buttons work', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await page.click('[data-testid="queue-item"]')
    await page.click('text=Send Rykker')
    await expect(page.getByText('Rykker sendt')).toBeVisible()
  })
})
```

---

## 2️⃣ BRUGERSTYRING (CRM)

Komplet kunde-relationsstyring.

### 2.1 Brugerliste
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Søgbar Tabel** | Navn, email, telefon, agent_email | 🔴 Kritisk |
| **Filtre** | Status, signup-dato, kategori, selskab | 🔴 Kritisk |
| **Hurtig Statistik** | Total brugere, aktive, churned | 🟡 Høj |
| **Eksport** | CSV download til marketing | 🟢 Medium |

### 2.2 Bruger Detailvisning
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Profil Info** | Alle brugerdata, redigerbar | 🔴 Kritisk |
| **Kontrakter** | Alle nuværende + historiske kontrakter | 🔴 Kritisk |
| **Tilbudshistorik** | Alle forespørgsler + svar | 🔴 Kritisk |
| **Aktivitetstidslinje** | Hver handling brugeren har foretaget | 🟡 Høj |
| **Emails** | Alle sendte/modtagne emails for denne bruger | 🟡 Høj |
| **Support Tickets** | Alle sager med fuld samtale | 🟡 Høj |
| **Noter** | Interne admin-noter om brugeren | 🟢 Medium |
| **Impersonate** | "Se som Bruger" til debugging | 🟢 Medium |

### 2.3 GDPR Værktøjer
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Eksportér Data** | Download alle brugerdata som JSON | 🔴 Kritisk (Lovkrav) |
| **Slet Bruger** | Komplet datasletning | 🔴 Kritisk (Lovkrav) |
| **Samtykke Log** | Hvornår/hvad brugeren samtykke til | 🟡 Høj |

### Backend Endpoints
```
GET    /admin/users                    → Liste med søgning/filtre
GET    /admin/users/{id}               → Fuld brugerdetalje
PUT    /admin/users/{id}               → Opdater bruger
DELETE /admin/users/{id}               → Slet bruger (GDPR)
GET    /admin/users/{id}/activity      → Brugerens aktivitetslog
GET    /admin/users/{id}/emails        → Brugerens emails
GET    /admin/users/{id}/export        → GDPR eksport
POST   /admin/users/{id}/impersonate   → Login som bruger
```

### Frontend Sider
```
/admin/users              → Brugerliste med søgning
/admin/users/[id]         → Bruger detailvisning
/admin/users/[id]/edit    → Rediger bruger
```

**🧪 TEST CASES: User Management (CRM)**

```python
# tests/admin/test_users.py

class TestUserManagement:
    """Tests for Admin User Management"""
    
    # === USER LIST ===
    
    def test_list_users_paginated(self):
        """USR.1: Returns paginated user list"""
        # Given: 150 users
        # When: GET /admin/users?page=1&limit=50
        # Then: 50 users, pagination info
        # Assert: len(data) == 50, total == 150
        
    def test_search_users_by_name(self):
        """USR.2: Search finds matching users"""
        # Given: User "Peter Hansen"
        # When: GET /admin/users?q=Peter
        # Then: Matching users returned
        # Assert: "Peter" in user.name
        
    def test_search_users_by_email(self):
        """USR.3: Search by email works"""
        # Given: User with email "peter@example.com"
        # When: GET /admin/users?q=peter@example
        # Then: User found
        # Assert: User in results
        
    def test_search_users_by_agent_email(self):
        """USR.4: Search by agent email works"""
        # Given: User with agent_email "peter.abc@agent.fa.dk"
        # When: GET /admin/users?q=peter.abc
        # Then: User found
        # Assert: User in results
        
    def test_filter_users_by_status(self):
        """USR.5: Filter by active/inactive"""
        # Given: 80 active, 20 inactive users
        # When: GET /admin/users?status=active
        # Then: Only active users
        # Assert: len(data) == 80
        
    def test_filter_users_by_signup_date(self):
        """USR.6: Filter by date range"""
        # Given: Users from various dates
        # When: GET /admin/users?from=2024-01-01&to=2024-01-31
        # Then: Only Jan 2024 users
        # Assert: All dates in range
        
    # === USER DETAIL ===
    
    def test_get_user_detail(self):
        """USR.7: Returns complete user data"""
        # Given: User with contracts, quotes
        # When: GET /admin/users/{id}
        # Then: All data included
        # Assert: Keys for profile, contracts, quotes present
        
    def test_get_user_activity(self):
        """USR.8: Returns user activity timeline"""
        # Given: User with 50 activities
        # When: GET /admin/users/{id}/activity
        # Then: Activities returned chronologically
        # Assert: Newest first
        
    def test_get_user_emails(self):
        """USR.9: Returns all user emails"""
        # Given: User with sent/received emails
        # When: GET /admin/users/{id}/emails
        # Then: All emails returned
        # Assert: Both inbound and outbound
        
    # === USER EDIT ===
    
    def test_update_user_profile(self):
        """USR.10: Can update user fields"""
        # Given: User with name "Peter"
        # When: PUT /admin/users/{id} with name="Peter Nielsen"
        # Then: Name updated
        # Assert: user.name == "Peter Nielsen"
        
    def test_update_logs_to_audit(self):
        """USR.11: Changes logged to audit trail"""
        # Given: Any user update
        # When: PUT /admin/users/{id}
        # Then: AuditLog entry created
        # Assert: AuditLog with action="updated_user"
        
    # === GDPR ===
    
    def test_export_user_data(self):
        """USR.12: Export returns complete data"""
        # Given: User with all data types
        # When: GET /admin/users/{id}/export
        # Then: JSON with all data
        # Assert: All tables represented
        
    def test_delete_user_removes_all(self):
        """USR.13: Delete cascades properly"""
        # Given: User with contracts, emails, etc.
        # When: DELETE /admin/users/{id}
        # Then: All related data removed
        # Assert: No orphan records
        
    def test_delete_requires_superadmin(self):
        """USR.14: Only superadmin can delete"""
        # Given: Admin with role='editor'
        # When: DELETE /admin/users/{id}
        # Then: 403 Forbidden
        # Assert: Response status 403
        
    # === IMPERSONATE ===
    
    def test_impersonate_creates_session(self):
        """USR.15: Impersonate logs in as user"""
        # Given: Admin user
        # When: POST /admin/users/{id}/impersonate
        # Then: Session created for target user
        # Assert: Can access user's dashboard
        
    def test_impersonate_logs_action(self):
        """USR.16: Impersonation logged"""
        # Given: Admin impersonates user
        # When: POST /admin/users/{id}/impersonate
        # Then: Audit log entry
        # Assert: AuditLog with action="impersonated_user"
```

```typescript
// tests/admin/e2e/users.spec.ts

describe('Admin User Management', () => {
  
  test('USR.17: User list shows key fields', async ({ page }) => {
    await page.goto('/admin/users')
    await expect(page.locator('th:has-text("Navn")')).toBeVisible()
    await expect(page.locator('th:has-text("Email")')).toBeVisible()
    await expect(page.locator('th:has-text("Oprettet")')).toBeVisible()
  })
  
  test('USR.18: Search updates results live', async ({ page }) => {
    await page.goto('/admin/users')
    await page.fill('[data-testid="search-input"]', 'Peter')
    await page.waitForResponse('**/admin/users?q=Peter*')
    await expect(page.getByText('Peter')).toBeVisible()
  })
  
  test('USR.19: Click row opens user detail', async ({ page }) => {
    await page.goto('/admin/users')
    await page.click('[data-testid="user-row"]')
    await expect(page).toHaveURL(/\/admin\/users\//)
  })
  
  test('USR.20: User detail shows tabs', async ({ page }) => {
    await page.goto('/admin/users/123')
    await expect(page.getByRole('tab', { name: 'Profil' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Kontrakter' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Aktivitet' })).toBeVisible()
  })
})
```

---

## 3️⃣ SELSKABSSTYRING (Partner Portal)

Styring af B2B-relationer.

### 3.1 Selskabsliste
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Alle Selskaber** | Sorterbar efter performance | 🔴 Kritisk |
| **Scorecard Visning** | Svartid, konverteringsrate | 🔴 Kritisk |
| **Status Filter** | Aktiv, Pauset, Sortlistet | 🟡 Høj |

### 3.2 Selskab Detailvisning
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Firma Info** | Navn, kontakt, emails, website | 🔴 Kritisk |
| **Produkter/Planer** | Deres tilbud (Mobil 10GB, osv.) | 🟡 Høj |
| **Performance Stats** | Gns. svartid, win rate | 🔴 Kritisk |
| **Lead Historik** | Alle kunder sendt til dem | 🟡 Høj |
| **Omsætning** | Kommission tjent fra dem | 🟡 Høj |
| **Noter** | Interne noter om relationen | 🟢 Medium |

### 3.3 Selskab Handlinger
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Tilføj Selskab** | Onboard ny partner | 🔴 Kritisk |
| **Rediger Selskab** | Opdater kontaktinfo | 🔴 Kritisk |
| **Pausér Selskab** | Stop midlertidigt med at sende leads | 🟡 Høj |
| **Sortlistér** | Marker som "anbefales ikke" | 🟡 Høj |
| **Send Test Lead** | Verificer deres email virker | 🟢 Medium |

### 3.4 Kommissionsstyring
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Kommissionsrater** | Per selskab, per produkt | 🟡 Høj |
| **Ventende Udbetalinger** | Hvad selskaber skylder os | 🟡 Høj |
| **Betalingshistorik** | Modtagne kommissioner | 🟡 Høj |

### Backend Endpoints
```
GET    /admin/providers                → Liste med performance
POST   /admin/providers                → Opret nyt selskab
GET    /admin/providers/{id}           → Selskab detaljer
PUT    /admin/providers/{id}           → Opdater selskab
DELETE /admin/providers/{id}           → Slet selskab
GET    /admin/providers/{id}/leads     → Leads sendt til selskab
GET    /admin/providers/{id}/revenue   → Omsætning fra selskab
POST   /admin/providers/{id}/test-lead → Send test-email
PUT    /admin/providers/{id}/commission → Opdater kommission
POST   /admin/providers/{id}/pause     → Pausér selskab
POST   /admin/providers/{id}/blacklist → Sortlistér selskab
```

### Frontend Sider
```
/admin/providers          → Selskabsliste med scorecards
/admin/providers/new      → Opret nyt selskab
/admin/providers/[id]     → Selskab detailvisning
/admin/providers/[id]/edit → Rediger selskab
```

**🧪 TEST CASES: Provider Management**

```python
# tests/admin/test_providers.py

class TestProviderManagement:
    """Tests for Admin Provider Management"""
    
    # === PROVIDER LIST ===
    
    def test_list_providers_with_stats(self):
        """PRV.1: Returns providers with performance stats"""
        # Given: Providers with various stats
        # When: GET /admin/providers
        # Then: Each has avg_response_time, leads_sent
        # Assert: Stats fields present
        
    def test_sort_providers_by_response_time(self):
        """PRV.2: Sort by response time works"""
        # Given: Providers with different response times
        # When: GET /admin/providers?sort=avg_response_time
        # Then: Sorted ascending
        # Assert: Order correct
        
    def test_filter_providers_by_status(self):
        """PRV.3: Filter active/paused/blacklisted"""
        # Given: Mix of statuses
        # When: GET /admin/providers?status=active
        # Then: Only active returned
        # Assert: All is_active=True
        
    def test_filter_providers_by_category(self):
        """PRV.4: Filter by category"""
        # Given: Energy, mobile, internet providers
        # When: GET /admin/providers?category=energy
        # Then: Only energy providers
        # Assert: All have category='energy'
        
    # === PROVIDER DETAIL ===
    
    def test_get_provider_detail(self):
        """PRV.5: Returns complete provider data"""
        # Given: Provider with leads, revenue
        # When: GET /admin/providers/{id}
        # Then: All data included
        # Assert: Keys for info, stats, leads present
        
    def test_get_provider_leads(self):
        """PRV.6: Returns all leads sent to provider"""
        # Given: Provider with 20 leads
        # When: GET /admin/providers/{id}/leads
        # Then: All leads returned
        # Assert: len(data) == 20
        
    def test_get_provider_revenue(self):
        """PRV.7: Returns revenue breakdown"""
        # Given: Provider with commissions
        # When: GET /admin/providers/{id}/revenue
        # Then: Total and per-deal breakdown
        # Assert: total_revenue > 0
        
    # === PROVIDER ACTIONS ===
    
    def test_create_provider(self):
        """PRV.8: Can create new provider"""
        # Given: Valid provider data
        # When: POST /admin/providers
        # Then: Provider created
        # Assert: 201 response, provider in DB
        
    def test_create_provider_validates_email(self):
        """PRV.9: Rejects invalid email"""
        # Given: Invalid quote_email
        # When: POST /admin/providers
        # Then: 400 error
        # Assert: "Invalid email" in error
        
    def test_update_provider(self):
        """PRV.10: Can update provider"""
        # Given: Existing provider
        # When: PUT /admin/providers/{id}
        # Then: Fields updated
        # Assert: Changes persisted
        
    def test_pause_provider(self):
        """PRV.11: Pause stops lead sending"""
        # Given: Active provider
        # When: POST /admin/providers/{id}/pause
        # Then: is_active=False
        # Assert: Provider excluded from quote requests
        
    def test_blacklist_provider(self):
        """PRV.12: Blacklist marks as do-not-recommend"""
        # Given: Provider with bad service
        # When: POST /admin/providers/{id}/blacklist
        # Then: is_blacklisted=True, reason logged
        # Assert: Provider shown with warning to users
        
    def test_send_test_lead(self):
        """PRV.13: Test lead sends verification email"""
        # Given: Provider with quote_email
        # When: POST /admin/providers/{id}/test-lead
        # Then: Test email sent
        # Assert: EmailLog with type='test_lead'
        
    # === SCORECARD ===
    
    def test_scorecard_updates_on_response(self):
        """PRV.14: Response updates avg_response_time"""
        # Given: Provider responds to quote request
        # When: Response recorded
        # Then: avg_response_time recalculated
        # Assert: New average includes latest
        
    def test_slow_responder_auto_flagged(self):
        """PRV.15: 7+ days = slow responder"""
        # Given: Provider doesn't respond for 7 days
        # When: Nudge bot runs
        # Then: is_slow_responder=True
        # Assert: Flag set
        
    def test_reputation_score_decreases_on_slow(self):
        """PRV.16: Slow response decreases score"""
        # Given: Provider flagged as slow
        # When: Score updated
        # Then: reputation_score decreased
        # Assert: score < previous_score
```

```typescript
// tests/admin/e2e/providers.spec.ts

describe('Admin Provider Management', () => {
  
  test('PRV.17: Provider list shows scorecards', async ({ page }) => {
    await page.goto('/admin/providers')
    await expect(page.locator('[data-testid="response-time-badge"]')).toBeVisible()
    await expect(page.locator('[data-testid="reputation-score"]')).toBeVisible()
  })
  
  test('PRV.18: Create provider form validates', async ({ page }) => {
    await page.goto('/admin/providers/new')
    await page.click('text=Opret')
    await expect(page.getByText('Navn er påkrævet')).toBeVisible()
  })
  
  test('PRV.19: Blacklist requires confirmation', async ({ page }) => {
    await page.goto('/admin/providers/123')
    await page.click('text=Sortlistér')
    await expect(page.locator('[data-testid="blacklist-confirm-modal"]')).toBeVisible()
  })
  
  test('PRV.20: Lead history shows conversion rate', async ({ page }) => {
    await page.goto('/admin/providers/123')
    await page.click('text=Leads')
    await expect(page.getByText(/Konverteringsrate:/)).toBeVisible()
  })
})
```

---

## 4️⃣ ANALYTICS & RAPPORTERING (Business Intelligence)

Spor virksomhedens sundhed.

### 4.1 KPI Dashboard
| Metrik | Beskrivelse | Prioritet |
|:-------|:------------|:----------|
| **Signups I dag/Uge/Måned** | Brugeranskaffelse | 🔴 Kritisk |
| **Aktive Jagter** | Tilbudsforespørgsler i gang | 🔴 Kritisk |
| **Konverteringsrate** | Signup → Tilbud → Accept | 🔴 Kritisk |
| **Total Besparelse** | Penge sparet for kunder | 🟡 Høj |
| **Omsætning** | Tjent kommission | 🟡 Høj |
| **Gns. Svartid** | Hvor hurtigt selskaber svarer | 🟡 Høj |

### 4.2 Funnel Analyse
| Stage | Tracking |
|:------|:---------|
| Besøg → Signup | Konvertering % |
| Signup → Tilbudsforespørgsel | Aktivering % |
| Forespørgsel → Modtaget Tilbud | Selskab svar % |
| Modtaget Tilbud → Accepteret | Kunde beslutning % |
| Accepteret → Aktiv Kontrakt | Gennemførelse % |

### 4.3 Rapporter
| Rapport | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Daglig Opsummering** | Auto-email med nøgletal | 🟡 Høj |
| **Selskab Performance** | Månedlig selskab-ranking | 🟡 Høj |
| **Omsætningsrapport** | Månedlig kommissionsopdeling | 🟡 Høj |
| **Churn Rapport** | Brugere der forlod os, hvorfor | 🟢 Medium |

### 4.4 Grafer & Diagrammer
| Graf | Beskrivelse | Prioritet |
|:-----|:------------|:----------|
| **Signups Over Tid** | Linjediagram | 🟡 Høj |
| **Tilbud per Kategori** | Cirkeldiagram (energi/mobil/internet) | 🟡 Høj |
| **Selskab Svartider** | Søjlediagram | 🟡 Høj |
| **Omsætningstrend** | Linjediagram | 🟡 Høj |

### Backend Endpoints
```
GET /admin/analytics/kpis                    → Nøgletal
GET /admin/analytics/funnel                  → Funnel data
GET /admin/analytics/signups?period=week     → Signup trend
GET /admin/analytics/revenue?period=month    → Omsætning trend
GET /admin/analytics/providers/performance   → Selskab ranking
GET /admin/analytics/categories              → Fordeling per kategori
```

### Frontend Sider
```
/admin/analytics          → KPI dashboard med grafer
/admin/analytics/funnel   → Detaljeret funnel-visning
/admin/analytics/reports  → Generer rapporter
```

**🧪 TEST CASES: Analytics & Reporting**

```python
# tests/admin/test_analytics.py

class TestAnalytics:
    """Tests for Admin Analytics"""
    
    # === KPIs ===
    
    def test_kpi_signups_today(self):
        """ANA.1: Returns today's signup count"""
        # Given: 5 signups today
        # When: GET /admin/analytics/kpis
        # Then: signups_today == 5
        # Assert: Correct count
        
    def test_kpi_signups_week(self):
        """ANA.2: Returns this week's signup count"""
        # Given: 25 signups this week
        # When: GET /admin/analytics/kpis
        # Then: signups_week == 25
        # Assert: Correct count
        
    def test_kpi_active_hunts(self):
        """ANA.3: Returns active quote requests"""
        # Given: 15 pending quote requests
        # When: GET /admin/analytics/kpis
        # Then: active_hunts == 15
        # Assert: Correct count
        
    def test_kpi_conversion_rate(self):
        """ANA.4: Calculates conversion rate correctly"""
        # Given: 100 signups, 30 accepted quotes
        # When: GET /admin/analytics/kpis
        # Then: conversion_rate == 30%
        # Assert: Math correct
        
    def test_kpi_total_savings(self):
        """ANA.5: Sums all user savings"""
        # Given: Users with calculated savings
        # When: GET /admin/analytics/kpis
        # Then: total_savings = sum of all
        # Assert: Aggregation correct
        
    # === FUNNEL ===
    
    def test_funnel_all_stages(self):
        """ANA.6: Returns all funnel stages"""
        # Given: Users at various stages
        # When: GET /admin/analytics/funnel
        # Then: All 5 stages returned
        # Assert: Keys for each stage present
        
    def test_funnel_percentages_correct(self):
        """ANA.7: Stage percentages calculated correctly"""
        # Given: 100 signups, 50 with quotes, 25 accepted
        # When: GET /admin/analytics/funnel
        # Then: signup_to_quote=50%, quote_to_accept=50%
        # Assert: Math correct
        
    def test_funnel_filter_by_period(self):
        """ANA.8: Can filter funnel by date range"""
        # Given: Data from multiple months
        # When: GET /admin/analytics/funnel?period=last_30_days
        # Then: Only last 30 days data
        # Assert: Dates within range
        
    # === TRENDS ===
    
    def test_signup_trend_daily(self):
        """ANA.9: Returns daily signup counts"""
        # Given: Signups over 7 days
        # When: GET /admin/analytics/signups?period=week
        # Then: 7 data points
        # Assert: One per day
        
    def test_revenue_trend_monthly(self):
        """ANA.10: Returns monthly revenue"""
        # Given: Revenue over 6 months
        # When: GET /admin/analytics/revenue?period=6months
        # Then: 6 data points
        # Assert: One per month
        
    # === PROVIDER PERFORMANCE ===
    
    def test_provider_ranking(self):
        """ANA.11: Ranks providers by conversion"""
        # Given: Providers with different conversion rates
        # When: GET /admin/analytics/providers/performance
        # Then: Sorted by conversion rate desc
        # Assert: Best performer first
        
    def test_provider_response_times(self):
        """ANA.12: Returns avg response times"""
        # Given: Providers with response data
        # When: GET /admin/analytics/providers/performance
        # Then: avg_response_time for each
        # Assert: Times in hours
```

```typescript
// tests/admin/e2e/analytics.spec.ts

describe('Admin Analytics Dashboard', () => {
  
  test('ANA.13: KPI cards display correctly', async ({ page }) => {
    await page.goto('/admin/analytics')
    await expect(page.locator('[data-testid="kpi-signups"]')).toBeVisible()
    await expect(page.locator('[data-testid="kpi-conversion"]')).toBeVisible()
    await expect(page.locator('[data-testid="kpi-revenue"]')).toBeVisible()
  })
  
  test('ANA.14: Charts render without errors', async ({ page }) => {
    await page.goto('/admin/analytics')
    await expect(page.locator('[data-testid="signup-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="funnel-chart"]')).toBeVisible()
  })
  
  test('ANA.15: Date range picker updates data', async ({ page }) => {
    await page.goto('/admin/analytics')
    await page.click('[data-testid="date-range-picker"]')
    await page.click('text=Sidste 7 dage')
    await page.waitForResponse('**/analytics/**')
    // Data refreshed
  })
  
  test('ANA.16: Export report downloads CSV', async ({ page }) => {
    await page.goto('/admin/analytics')
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('text=Eksporter rapport')
    ])
    expect(download.suggestedFilename()).toContain('.csv')
  })
})
```

---

## 5️⃣ SYSTEM SUNDHED (DevOps View)

Overvåg systemperformance.

### 5.1 API Overvågning
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Endpoint Stats** | Hits per endpoint, svartider | 🟡 Høj |
| **Fejl Log** | Seneste 500-fejl med stack traces | 🔴 Kritisk |
| **Langsomme Forespørgsler** | Database queries der tager >1s | 🟢 Medium |

### 5.2 Email Sundhed
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Leveringsstatistik** | Sendt, leveret, bounced, åbnet | 🔴 Kritisk |
| **Fejlede Emails** | Liste over fejlede emails | 🔴 Kritisk |
| **Indgående Kø** | Ventende webhook-behandling | 🟡 Høj |

### 5.3 Baggrundsjobs
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **CRON Status** | Kører nudge bot? | 🟡 Høj |
| **Job Historik** | Seneste kørsler, success/fail | 🟡 Høj |
| **Manuel Trigger** | "Kør nudge bot nu" knap | 🟢 Medium |

### 5.4 Database Sundhed
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Tabel Størrelser** | Users: 1.234 rækker, osv. | 🟢 Medium |
| **Connection Pool** | Aktive forbindelser | 🟢 Medium |

### Backend Endpoints
```
GET  /admin/system/health          → Samlet sundhedsstatus
GET  /admin/system/errors          → Seneste fejl
GET  /admin/system/emails/stats    → Email statistik
GET  /admin/system/jobs            → Job status
POST /admin/system/jobs/{name}/run → Manuel job-kørsel
GET  /admin/system/database        → Database info
```

### Frontend Sider
```
/admin/system             → Sundhedsoversigt
/admin/system/errors      → Fejl log
/admin/system/jobs        → Baggrundsjob status
```

**🧪 TEST CASES: System Health**

```python
# tests/admin/test_system.py

class TestSystemHealth:
    """Tests for Admin System Health"""
    
    # === HEALTH CHECK ===
    
    def test_health_endpoint_returns_status(self):
        """SYS.1: Health check returns all components"""
        # Given: System running
        # When: GET /admin/system/health
        # Then: Status for DB, Redis, Email service
        # Assert: All components have status
        
    def test_health_detects_db_issues(self):
        """SYS.2: Detects database connection issues"""
        # Given: DB connection failing
        # When: GET /admin/system/health
        # Then: database.status = 'unhealthy'
        # Assert: Issue flagged
        
    def test_health_detects_email_issues(self):
        """SYS.3: Detects email service issues"""
        # Given: Resend API unreachable
        # When: GET /admin/system/health
        # Then: email.status = 'unhealthy'
        # Assert: Issue flagged
        
    # === ERROR LOG ===
    
    def test_error_log_returns_recent(self):
        """SYS.4: Returns recent errors"""
        # Given: 50 errors in last 24h
        # When: GET /admin/system/errors
        # Then: Errors returned newest first
        # Assert: Sorted by timestamp desc
        
    def test_error_includes_stack_trace(self):
        """SYS.5: Error includes full stack trace"""
        # Given: 500 error occurred
        # When: GET /admin/system/errors
        # Then: Stack trace in details
        # Assert: traceback field present
        
    def test_error_filter_by_endpoint(self):
        """SYS.6: Can filter errors by endpoint"""
        # Given: Errors from various endpoints
        # When: GET /admin/system/errors?endpoint=/users
        # Then: Only /users errors
        # Assert: All match filter
        
    # === EMAIL STATS ===
    
    def test_email_stats_delivery_rate(self):
        """SYS.7: Returns email delivery stats"""
        # Given: 100 sent, 95 delivered
        # When: GET /admin/system/emails/stats
        # Then: delivery_rate = 95%
        # Assert: Math correct
        
    def test_email_stats_bounce_rate(self):
        """SYS.8: Returns bounce rate"""
        # Given: 100 sent, 3 bounced
        # When: GET /admin/system/emails/stats
        # Then: bounce_rate = 3%
        # Assert: Math correct
        
    def test_email_stats_by_type(self):
        """SYS.9: Stats broken down by email type"""
        # Given: Various email types sent
        # When: GET /admin/system/emails/stats
        # Then: Stats per type (quote_request, welcome, etc.)
        # Assert: Breakdown present
        
    # === BACKGROUND JOBS ===
    
    def test_jobs_status(self):
        """SYS.10: Returns all job statuses"""
        # Given: Nudge bot, cleanup jobs
        # When: GET /admin/system/jobs
        # Then: Status for each job
        # Assert: All jobs listed
        
    def test_job_last_run_time(self):
        """SYS.11: Shows last run time"""
        # Given: Nudge bot ran 2 hours ago
        # When: GET /admin/system/jobs
        # Then: last_run shows correct time
        # Assert: Timestamp accurate
        
    def test_manual_job_trigger(self):
        """SYS.12: Can manually trigger job"""
        # Given: Nudge bot not running
        # When: POST /admin/system/jobs/nudge_bot/run
        # Then: Job executes
        # Assert: 200 response, job ran
        
    # === DATABASE ===
    
    def test_database_table_sizes(self):
        """SYS.13: Returns table row counts"""
        # Given: Various tables
        # When: GET /admin/system/database
        # Then: Row counts for each table
        # Assert: users, contracts, etc. have counts
        
    def test_database_connection_pool(self):
        """SYS.14: Returns connection pool status"""
        # Given: Pool configured for 10 connections
        # When: GET /admin/system/database
        # Then: Shows active/available connections
        # Assert: pool_size, active_connections present
```

```typescript
// tests/admin/e2e/system.spec.ts

describe('Admin System Health', () => {
  
  test('SYS.15: Health dashboard shows status badges', async ({ page }) => {
    await page.goto('/admin/system')
    await expect(page.locator('[data-testid="db-status"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-status"]')).toBeVisible()
  })
  
  test('SYS.16: Error log shows expandable rows', async ({ page }) => {
    await page.goto('/admin/system/errors')
    await page.click('[data-testid="error-row"]')
    await expect(page.locator('[data-testid="stack-trace"]')).toBeVisible()
  })
  
  test('SYS.17: Manual job trigger shows confirmation', async ({ page }) => {
    await page.goto('/admin/system/jobs')
    await page.click('text=Kør nu')
    await expect(page.getByText('Er du sikker')).toBeVisible()
  })
})
```

---

## 6️⃣ KOMMUNIKATION (Skabeloner & Logs)

Styr al udgående kommunikation.

### 6.1 Email Skabeloner
| Skabelon | Formål | Prioritet |
|:---------|:-------|:----------|
| **Tilbudsforespørgsel** | Email sendt til selskaber | 🔴 Kritisk |
| **Rykker (Dag 3)** | Påmindelse til langsomme selskaber | 🔴 Kritisk |
| **Advarsel (Dag 7)** | Sidste advarsel til selskaber | 🟡 Høj |
| **Velkommen Bruger** | Efter signup | 🟡 Høj |
| **Tilbud Modtaget** | Notificer bruger om nyt tilbud | 🟡 Høj |
| **Skift Bekræftelse** | Efter bruger accepterer | 🟡 Høj |

### 6.2 Skabelon Editor
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Visuel Editor** | WYSIWYG email design | 🟢 Medium |
| **Variabler** | `{{user.name}}`, `{{provider.name}}` | 🔴 Kritisk |
| **Preview** | Se renderet email | 🟡 Høj |
| **Test Send** | Send til admin email | 🟡 Høj |

### 6.3 Email Log
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Alle Emails** | Søgbar log over hver email | 🟡 Høj |
| **Gensend** | Gensend en fejlet email | 🟡 Høj |
| **Se Indhold** | Se præcis email der blev sendt | 🟡 Høj |

### Backend Endpoints
```
GET    /admin/templates              → Liste over skabeloner
GET    /admin/templates/{id}         → Hent skabelon
PUT    /admin/templates/{id}         → Opdater skabelon
POST   /admin/templates/{id}/preview → Forhåndsvis
POST   /admin/templates/{id}/test    → Send test
GET    /admin/emails                 → Email log
GET    /admin/emails/{id}            → Email detaljer
POST   /admin/emails/{id}/resend     → Gensend email
```

### Frontend Sider
```
/admin/templates          → Skabelon liste
/admin/templates/[id]     → Rediger skabelon
/admin/emails             → Email log
/admin/emails/[id]        → Email detaljer
```

**🧪 TEST CASES: Communications**

```python
# tests/admin/test_communications.py

class TestCommunications:
    """Tests for Admin Communications"""
    
    # === EMAIL TEMPLATES ===
    
    def test_list_templates(self):
        """COM.1: Returns all email templates"""
        # Given: 6 templates defined
        # When: GET /admin/templates
        # Then: All templates returned
        # Assert: len(data) == 6
        
    def test_get_template_detail(self):
        """COM.2: Returns template with content"""
        # Given: quote_request template
        # When: GET /admin/templates/quote_request
        # Then: subject, body_html, variables returned
        # Assert: All fields present
        
    def test_update_template(self):
        """COM.3: Can update template content"""
        # Given: Existing template
        # When: PUT /admin/templates/{id} with new body
        # Then: Content updated
        # Assert: Changes persisted
        
    def test_update_template_logs_change(self):
        """COM.4: Template changes logged"""
        # Given: Template update
        # When: PUT /admin/templates/{id}
        # Then: Audit log entry
        # Assert: AuditLog with action="updated_template"
        
    def test_preview_template(self):
        """COM.5: Preview renders with sample data"""
        # Given: Template with {{user.name}}
        # When: POST /admin/templates/{id}/preview
        # Then: Rendered HTML returned
        # Assert: "Sample User" in output (not {{user.name}})
        
    def test_test_send_template(self):
        """COM.6: Test send delivers to admin"""
        # Given: Admin email configured
        # When: POST /admin/templates/{id}/test
        # Then: Email sent to admin
        # Assert: EmailLog created
        
    # === EMAIL LOG ===
    
    def test_email_log_returns_all(self):
        """COM.7: Returns all sent emails"""
        # Given: 500 emails sent
        # When: GET /admin/emails
        # Then: Paginated list
        # Assert: Pagination info correct
        
    def test_email_log_search(self):
        """COM.8: Can search by recipient"""
        # Given: Emails to various recipients
        # When: GET /admin/emails?q=peter@example.com
        # Then: Matching emails
        # Assert: All match query
        
    def test_email_log_filter_by_type(self):
        """COM.9: Can filter by email type"""
        # Given: Various email types
        # When: GET /admin/emails?type=quote_request
        # Then: Only quote requests
        # Assert: All have type='quote_request'
        
    def test_email_log_filter_by_status(self):
        """COM.10: Can filter by delivery status"""
        # Given: Delivered and failed emails
        # When: GET /admin/emails?status=failed
        # Then: Only failed
        # Assert: All have sent=False
        
    def test_email_detail_shows_content(self):
        """COM.11: Email detail shows full content"""
        # Given: Sent email
        # When: GET /admin/emails/{id}
        # Then: Full HTML body visible
        # Assert: body_html present
        
    def test_resend_email(self):
        """COM.12: Can resend failed email"""
        # Given: Failed email
        # When: POST /admin/emails/{id}/resend
        # Then: Email re-sent
        # Assert: New EmailLog entry
```

```typescript
// tests/admin/e2e/communications.spec.ts

describe('Admin Communications', () => {
  
  test('COM.13: Template list shows all templates', async ({ page }) => {
    await page.goto('/admin/templates')
    await expect(page.getByText('Tilbudsforespørgsel')).toBeVisible()
    await expect(page.getByText('Velkommen')).toBeVisible()
    await expect(page.getByText('Rykker')).toBeVisible()
  })
  
  test('COM.14: Template editor shows variables', async ({ page }) => {
    await page.goto('/admin/templates/quote_request')
    await expect(page.locator('[data-testid="variables-list"]')).toBeVisible()
    await expect(page.getByText('{{user.name}}')).toBeVisible()
  })
  
  test('COM.15: Preview button shows rendered email', async ({ page }) => {
    await page.goto('/admin/templates/quote_request')
    await page.click('text=Forhåndsvis')
    await expect(page.locator('[data-testid="preview-iframe"]')).toBeVisible()
  })
  
  test('COM.16: Email log shows delivery status', async ({ page }) => {
    await page.goto('/admin/emails')
    await expect(page.locator('[data-testid="status-badge"]')).toBeVisible()
  })
  
  test('COM.17: Resend button shows on failed emails', async ({ page }) => {
    await page.goto('/admin/emails?status=failed')
    await expect(page.locator('text=Gensend')).toBeVisible()
  })
})
```

---

## 7️⃣ KONFIGURATION (Indstillinger)

Systemdækkende indstillinger.

### 7.1 Forretningsindstillinger
| Indstilling | Beskrivelse | Prioritet |
|:------------|:------------|:----------|
| **Standard Kommission %** | Basis kommissionsrate | 🟡 Høj |
| **Nudge Bot Timing** | Dag 3, Dag 7 konfigurerbar | 🟡 Høj |
| **Auto-sortliste Grænse** | Score under X = sortlistet | 🟢 Medium |

### 7.2 Feature Flags
| Flag | Beskrivelse | Prioritet |
|:-----|:------------|:----------|
| **Aktivér MitID** | Toggle MitID-krav | 🟡 Høj |
| **Aktivér Chat** | Toggle AI chat | 🟢 Medium |
| **Vedligeholdelsestilstand** | Deaktiver signups midlertidigt | 🟡 Høj |

### 7.3 Admin Brugere
| Feature | Beskrivelse | Prioritet |
|:--------|:------------|:----------|
| **Admin Liste** | Hvem har admin-adgang | 🔴 Kritisk |
| **Inviter Admin** | Tilføj ny admin-bruger | 🔴 Kritisk |
| **Tilladelser** | Role-baseret adgang (viewer/editor/superadmin) | 🟢 Medium |
| **Audit Log** | Hvem gjorde hvad, hvornår | 🟡 Høj |

### Backend Endpoints
```
GET  /admin/settings              → Alle indstillinger
PUT  /admin/settings              → Opdater indstillinger
GET  /admin/admins                → Admin brugerliste
POST /admin/admins/invite         → Inviter ny admin
PUT  /admin/admins/{id}           → Opdater admin
DELETE /admin/admins/{id}         → Fjern admin
GET  /admin/audit-log             → Audit log
```

### Frontend Sider
```
/admin/settings           → Indstillinger
/admin/settings/admins    → Admin brugerstyring
/admin/settings/audit     → Audit log
```

**🧪 TEST CASES: Configuration**

```python
# tests/admin/test_config.py

class TestConfiguration:
    """Tests for Admin Configuration"""
    
    # === SETTINGS ===
    
    def test_get_all_settings(self):
        """CFG.1: Returns all system settings"""
        # Given: Configured settings
        # When: GET /admin/settings
        # Then: All settings returned
        # Assert: Keys for commission, nudge_timing, etc.
        
    def test_update_setting(self):
        """CFG.2: Can update setting value"""
        # Given: default_commission = 10
        # When: PUT /admin/settings with commission=15
        # Then: Setting updated
        # Assert: New value persisted
        
    def test_update_setting_logs_change(self):
        """CFG.3: Setting change logged"""
        # Given: Any setting change
        # When: PUT /admin/settings
        # Then: Audit log entry
        # Assert: AuditLog with action="updated_setting"
        
    def test_setting_validation(self):
        """CFG.4: Invalid values rejected"""
        # Given: commission = -5 (invalid)
        # When: PUT /admin/settings
        # Then: 400 error
        # Assert: "must be positive" in error
        
    # === FEATURE FLAGS ===
    
    def test_get_feature_flags(self):
        """CFG.5: Returns all feature flags"""
        # Given: MitID, Chat flags
        # When: GET /admin/settings/features
        # Then: All flags returned
        # Assert: enable_mitid, enable_chat present
        
    def test_toggle_feature_flag(self):
        """CFG.6: Can toggle feature"""
        # Given: enable_chat = true
        # When: PUT /admin/settings/features/enable_chat = false
        # Then: Feature disabled
        # Assert: Flag toggled
        
    def test_feature_flag_affects_app(self):
        """CFG.7: Disabled feature hidden from users"""
        # Given: enable_chat = false
        # When: User visits dashboard
        # Then: Chat menu item hidden
        # Assert: Chat link not visible
        
    # === ADMIN USERS ===
    
    def test_list_admin_users(self):
        """CFG.8: Returns all admin users"""
        # Given: 3 admin users
        # When: GET /admin/admins
        # Then: All admins returned
        # Assert: len(data) == 3
        
    def test_invite_admin(self):
        """CFG.9: Can invite new admin"""
        # Given: Valid email
        # When: POST /admin/admins/invite
        # Then: Invite email sent, pending admin created
        # Assert: 201 response
        
    def test_invite_requires_superadmin(self):
        """CFG.10: Only superadmin can invite"""
        # Given: Admin with role='editor'
        # When: POST /admin/admins/invite
        # Then: 403 Forbidden
        # Assert: Permission denied
        
    def test_update_admin_role(self):
        """CFG.11: Can change admin role"""
        # Given: Admin with role='viewer'
        # When: PUT /admin/admins/{id} with role='editor'
        # Then: Role updated
        # Assert: New role persisted
        
    def test_delete_admin(self):
        """CFG.12: Can remove admin access"""
        # Given: Admin user
        # When: DELETE /admin/admins/{id}
        # Then: Admin deactivated
        # Assert: is_active=False
        
    def test_cannot_delete_self(self):
        """CFG.13: Cannot delete own admin account"""
        # Given: Logged in admin
        # When: DELETE /admin/admins/{self.id}
        # Then: 400 error
        # Assert: "Cannot delete yourself"
        
    # === AUDIT LOG ===
    
    def test_audit_log_returns_all(self):
        """CFG.14: Returns all audit entries"""
        # Given: Various admin actions
        # When: GET /admin/audit-log
        # Then: All entries returned
        # Assert: Chronological order
        
    def test_audit_log_filter_by_admin(self):
        """CFG.15: Can filter by admin user"""
        # Given: Actions from multiple admins
        # When: GET /admin/audit-log?admin_id=123
        # Then: Only that admin's actions
        # Assert: All have admin_id=123
        
    def test_audit_log_filter_by_action(self):
        """CFG.16: Can filter by action type"""
        # Given: Various action types
        # When: GET /admin/audit-log?action=updated_user
        # Then: Only user updates
        # Assert: All have action='updated_user'
```

```typescript
// tests/admin/e2e/config.spec.ts

describe('Admin Configuration', () => {
  
  test('CFG.17: Settings page shows all sections', async ({ page }) => {
    await page.goto('/admin/settings')
    await expect(page.getByText('Forretningsindstillinger')).toBeVisible()
    await expect(page.getByText('Feature Flags')).toBeVisible()
    await expect(page.getByText('Admin Brugere')).toBeVisible()
  })
  
  test('CFG.18: Feature flag toggle works', async ({ page }) => {
    await page.goto('/admin/settings')
    await page.click('[data-testid="toggle-mitid"]')
    await expect(page.getByText('Gemt')).toBeVisible()
  })
  
  test('CFG.19: Invite admin opens modal', async ({ page }) => {
    await page.goto('/admin/settings/admins')
    await page.click('text=Inviter admin')
    await expect(page.locator('[data-testid="invite-modal"]')).toBeVisible()
  })
  
  test('CFG.20: Audit log shows recent actions', async ({ page }) => {
    await page.goto('/admin/settings/audit')
    await expect(page.locator('[data-testid="audit-entry"]')).toBeVisible()
    await expect(page.locator('text=opdaterede')).toBeVisible()
  })
})
```

---

## 🧪 KOMPLET ADMIN TEST MATRIX

### Oversigt over alle admin tests

| Modul | Test Fil | Antal Tests | Type |
|:------|:---------|:-----------:|:-----|
| Operations | `test_operations.py` + `operations.spec.ts` | 15 | Backend + E2E |
| Users | `test_users.py` + `users.spec.ts` | 20 | Backend + E2E |
| Providers | `test_providers.py` + `providers.spec.ts` | 20 | Backend + E2E |
| Analytics | `test_analytics.py` + `analytics.spec.ts` | 16 | Backend + E2E |
| System | `test_system.py` + `system.spec.ts` | 17 | Backend + E2E |
| Communications | `test_communications.py` + `communications.spec.ts` | 17 | Backend + E2E |
| Configuration | `test_config.py` + `config.spec.ts` | 20 | Backend + E2E |
| **TOTAL** | | **125** | |

### Test Kommandoer

```bash
# Kør ALLE admin tests
./scripts/run_admin_tests.sh

# Kør kun backend admin tests
pytest tests/admin/ -v

# Kør kun E2E admin tests
npx playwright test tests/admin/e2e/

# Kør specifikt modul
pytest tests/admin/test_users.py -v
npx playwright test tests/admin/e2e/users.spec.ts

# Kør med coverage
pytest tests/admin/ --cov=app.api.v1.endpoints.admin --cov-report=html
```

### Admin Test Fixtures

```python
# tests/admin/fixtures.py

import pytest

@pytest.fixture
def superadmin_client(db):
    """Client authenticated as superadmin"""
    admin = AdminUser(email="super@test.com", role="superadmin")
    db.add(admin)
    db.commit()
    return create_test_client(admin)

@pytest.fixture  
def editor_client(db):
    """Client authenticated as editor"""
    admin = AdminUser(email="editor@test.com", role="editor")
    db.add(admin)
    db.commit()
    return create_test_client(admin)

@pytest.fixture
def viewer_client(db):
    """Client authenticated as viewer"""
    admin = AdminUser(email="viewer@test.com", role="viewer")
    db.add(admin)
    db.commit()
    return create_test_client(admin)

@pytest.fixture
def sample_users(db):
    """Create sample users for testing"""
    users = [
        User(name=f"Test User {i}", email=f"user{i}@test.com")
        for i in range(10)
    ]
    db.add_all(users)
    db.commit()
    return users

@pytest.fixture
def sample_providers(db):
    """Create sample providers for testing"""
    providers = [
        Provider(name="Norlys", category="energy"),
        Provider(name="TDC", category="mobile"),
        Provider(name="YouSee", category="internet"),
    ]
    db.add_all(providers)
    db.commit()
    return providers
```

### Playwright Admin Config

```typescript
// playwright.admin.config.ts

import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/admin/e2e',
  use: {
    baseURL: 'http://localhost:4411',
    storageState: 'tests/admin/.auth/admin.json', // Pre-authenticated admin
  },
  projects: [
    {
      name: 'admin-setup',
      testMatch: /admin\.setup\.ts/,
    },
    {
      name: 'admin-tests',
      dependencies: ['admin-setup'],
    },
  ],
})
```

---

## 📊 DATABASE TILFØJELSER

Nye modeller der skal oprettes:

### AdminUser Model
```python
class AdminUser(Base):
    __tablename__ = "admin_users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="viewer")  # viewer, editor, superadmin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
```

### AuditLog Model
```python
class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    admin_id = Column(String, ForeignKey("admin_users.id"), nullable=False)
    action = Column(String, nullable=False)  # "updated_user", "blacklisted_provider"
    target_type = Column(String, nullable=True)  # "user", "provider"
    target_id = Column(String, nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### EmailTemplate Model
```python
class EmailTemplate(Base):
    __tablename__ = "email_templates"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, nullable=False)  # "quote_request", "nudge_day3"
    display_name = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    body_html = Column(Text, nullable=False)
    body_text = Column(Text, nullable=True)
    variables = Column(JSON, default=list)  # ["user.name", "provider.name"]
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### SystemMetric Model
```python
class SystemMetric(Base):
    __tablename__ = "system_metrics"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    metric_name = Column(String, nullable=False, index=True)  # "signups", "quotes_sent"
    metric_value = Column(Float, nullable=False)
    dimensions = Column(JSON, default=dict)  # {"category": "energy"}
    recorded_at = Column(DateTime, default=datetime.utcnow, index=True)
```

### SystemSetting Model
```python
class SystemSetting(Base):
    __tablename__ = "system_settings"
    
    key = Column(String, primary_key=True)
    value = Column(JSON, nullable=False)
    description = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by = Column(String, ForeignKey("admin_users.id"), nullable=True)
```

---

## ⏱️ TIDSESTIMAT

| Modul | Endpoints | UI Sider | Timer |
|:------|:---------:|:--------:|------:|
| Operations Center | 5 | 3 | 8t |
| Brugerstyring | 8 | 3 | 12t |
| Selskabsstyring | 10 | 4 | 10t |
| Analytics | 6 | 3 | 8t |
| System Sundhed | 5 | 3 | 6t |
| Kommunikation | 7 | 3 | 8t |
| Konfiguration | 6 | 3 | 4t |
| **TOTAL** | **47** | **22** | **~56t** |

---

## 🚀 IMPLEMENTERINGSPLAN

### FASE A: Minimum Viable Admin (Uge 1)
**Mål:** Kunne manuelt drive forretningen

```
[ ] 1. Admin authentication (separat login)
[ ] 2. Admin dashboard med kø-oversigt
[ ] 3. Brugerliste + detailvisning
[ ] 4. Selskabsliste + tilføj/rediger
[ ] 5. Grundlæggende email log
```

**Resultat:** Du kan manuelt håndtere alt

### FASE B: Operations (Uge 2)
**Mål:** Effektiv daglig drift

```
[ ] 6. Aktivitetsstrøm (live feed)
[ ] 7. Support ticket management
[ ] 8. Selskab scorecards
[ ] 9. Manuelle handlinger (send rykker, løs sag)
[ ] 10. Opgavestyring
```

**Resultat:** Hurtig daglig arbejdsgang

### FASE C: Analytics (Uge 3)
**Mål:** Forretningsindsigt

```
[ ] 11. KPI dashboard
[ ] 12. Funnel tracking
[ ] 13. Omsætningsrapportering
[ ] 14. Grafer og visualiseringer
[ ] 15. Automatiske daglige rapporter
```

**Resultat:** Datadrevet beslutningstagning

### FASE D: Avanceret (Uge 4)
**Mål:** Fuld platform

```
[ ] 16. Email skabelon editor
[ ] 17. Feature flags
[ ] 18. Audit log
[ ] 19. Roller og tilladelser
[ ] 20. GDPR værktøjer
```

**Resultat:** Enterprise-klar admin platform

---

## 📁 FIL STRUKTUR

### Backend
```
backend/app/
├── api/v1/endpoints/
│   └── admin/
│       ├── __init__.py
│       ├── auth.py           # Admin login/logout
│       ├── dashboard.py      # Kø-oversigt
│       ├── users.py          # Brugerstyring
│       ├── providers.py      # Selskabsstyring
│       ├── analytics.py      # KPIs og rapporter
│       ├── system.py         # Sundhedscheck
│       ├── templates.py      # Email skabeloner
│       ├── settings.py       # Konfiguration
│       └── audit.py          # Audit log
├── models/
│   ├── admin_user.py
│   ├── audit_log.py
│   ├── email_template.py
│   ├── system_metric.py
│   └── system_setting.py
└── services/
    ├── admin_auth_service.py
    ├── analytics_service.py
    └── audit_service.py
```

### Frontend
```
frontend/src/app/admin/
├── layout.tsx              # Admin layout med sidebar
├── page.tsx                # Dashboard (redirect)
├── login/
│   └── page.tsx            # Admin login
├── dashboard/
│   └── page.tsx            # Kø-oversigt
├── users/
│   ├── page.tsx            # Brugerliste
│   └── [id]/
│       └── page.tsx        # Bruger detaljer
├── providers/
│   ├── page.tsx            # Selskabsliste
│   ├── new/
│   │   └── page.tsx        # Opret selskab
│   └── [id]/
│       └── page.tsx        # Selskab detaljer
├── analytics/
│   └── page.tsx            # KPI dashboard
├── system/
│   └── page.tsx            # System sundhed
├── templates/
│   ├── page.tsx            # Skabelon liste
│   └── [id]/
│       └── page.tsx        # Rediger skabelon
├── emails/
│   └── page.tsx            # Email log
└── settings/
    └── page.tsx            # Indstillinger
```

---

## 🔐 SIKKERHED

### Authentication
- Separat admin login (ikke Auth0)
- Password hashing med bcrypt
- JWT tokens med kort levetid (1 time)
- Refresh tokens for længere sessioner

### Authorization
- Role-based access control (RBAC)
- Tre roller: `viewer`, `editor`, `superadmin`
- Endpoint-niveau permissions
- UI skjuler ikke-tilladte handlinger

### Audit
- Alle ændringer logges
- IP-adresse tracking
- Admin-id på alle handlinger
- Eksporterbar audit trail

---

## ✅ DEFINITION OF DONE

Admin Panel er færdig når:

- [ ] Admin kan logge ind med separate credentials
- [ ] Admin kan se og søge i alle brugere
- [ ] Admin kan se og redigere alle selskaber
- [ ] Admin kan se ventende sager og handle på dem
- [ ] Admin kan se email log og gensende fejlede emails
- [ ] Admin kan se KPIs og grundlæggende analytics
- [ ] Admin kan se og redigere email skabeloner
- [ ] Admin kan invitere nye admins
- [ ] Alle handlinger logges i audit log
- [ ] GDPR eksport og slet fungerer

---

*Sidst opdateret: 2025-12-11*








