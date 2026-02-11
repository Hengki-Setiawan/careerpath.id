# 🧪 CareerPath.id — TESTING BLUEPRINT
## Strategi Testing, Skenario E2E, & QA Checklist

> **Status:** Active Directive  
> **Last Updated:** 2026-02-11  
> **Priority:** HIGH — Pastikan kualitas sebelum production launch  
> **Testing Framework:** Playwright (E2E), Manual QA Checklist  
> **Test Location:** `tests/` directory

---

## 1. 🏗️ TESTING ARCHITECTURE

### Testing Pyramid

```
          ┌──────────┐
          │   E2E    │  ← Playwright (critical user flows)
          │  Tests   │     ~15-20 test scenarios
         ┌┴──────────┴┐
         │ Integration │  ← API route testing
         │   Tests     │     ~30+ endpoint checks
        ┌┴────────────┴┐
        │   Component   │  ← React component testing (future)
        │    Tests      │     Vitest + React Testing Library
       ┌┴──────────────┴┐
       │   Unit Tests    │  ← Pure function testing (future)
       │  (Utils/Logic)  │     Vitest
       └────────────────┘
```

### Current State

| Layer | Tool | Status | Coverage |
|-------|------|--------|----------|
| E2E | Playwright | ✅ Configured | 1 test file |
| Integration | Manual | ⚠️ Partial | Via Postman/browser |
| Component | — | 🔲 Not Started | — |
| Unit | — | 🔲 Not Started | — |

### File Structure

```
careerpath-id/
├── tests/
│   └── e2e/
│       ├── qa-login.spec.ts          ← existing
│       ├── auth.spec.ts              ← planned
│       ├── onboarding.spec.ts        ← planned
│       ├── dashboard.spec.ts         ← planned
│       ├── ai-features.spec.ts       ← planned
│       ├── payment.spec.ts           ← planned
│       ├── admin.spec.ts             ← planned
│       ├── community.spec.ts         ← planned
│       └── accessibility.spec.ts     ← planned
├── playwright.config.ts
└── package.json  (scripts: "test:e2e")
```

---

## 2. 🎯 E2E TEST SCENARIOS

### 2.1 Authentication Flow

**File:** `tests/e2e/auth.spec.ts`

| # | Scenario | Steps | Expected Result |
|---|----------|-------|-----------------|
| 1 | Register with email | Go to /register → fill form → submit | Redirect to /onboarding or /dashboard |
| 2 | Register validation | Submit empty form | Show validation errors |
| 3 | Login with email | Go to /login → enter credentials → submit | Redirect to /dashboard |
| 4 | Login wrong password | Enter wrong password | Show error message |
| 5 | Login non-existent user | Enter non-existent email | Show error message |
| 6 | Logout | Click logout button | Redirect to /login |
| 7 | Session persistence | Login → close tab → reopen | Still logged in |
| 8 | Session timeout | Wait 30min inactive | Auto-redirect to /login |
| 9 | Password change | Settings → change password → submit | Success message |
| 10 | Protected route redirect | Visit /dashboard without login | Redirect to /login |

```typescript
// Example: auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@careerpath.id')
    await page.fill('[name="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.locator('text=Dashboard')).toBeVisible()
  })

  test('should show error on wrong password', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@careerpath.id')
    await page.fill('[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('.error-message')).toBeVisible()
  })

  test('should redirect unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})
```

---

### 2.2 Onboarding Flow

**File:** `tests/e2e/onboarding.spec.ts`

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 1 | Complete 10-step onboarding | Navigate all 10 steps | Redirect to /dashboard |
| 2 | Step navigation | Click next/prev buttons | Move between steps |
| 3 | Progress indicator | Complete steps | Progress bar updates |
| 4 | Status selection | Select 'Mahasiswa' | Save & proceed |
| 5 | Skill selection | Select 3+ skills | Show selected count |
| 6 | Career interest | Select interests | Trigger AI recommendation |
| 7 | AI career recommendation | Complete profile steps | Show top 3 careers |
| 8 | Target setting | Set monthly targets | Save targets to DB |
| 9 | Skip optional steps | Skip non-required steps | Still complete onboarding |
| 10 | Resume interrupted onboarding | Leave midway → return | Continue from last step |

---

### 2.3 Dashboard Flow

**File:** `tests/e2e/dashboard.spec.ts`

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 1 | Dashboard loads | Login → /dashboard | See overview stats |
| 2 | Sidebar navigation | Click each sidebar item | Navigate to correct page |
| 3 | Stats display | View dashboard | Show XP, level, progress |
| 4 | Quick actions work | Click quick action buttons | Navigate to feature |
| 5 | Career explorer | Browse careers | See career cards |
| 6 | Skill tracking | View skills page | See radar chart |
| 7 | Add/update skill | Add new skill | Skill appears in tracker |
| 8 | Job search | Search jobs → view detail | Show job listing |
| 9 | Job application | Click apply → confirm | Application submitted |
| 10 | Learning module | Browse courses | Show course cards |
| 11 | Start course | Click start → progress | Progress updates |
| 12 | Take quiz | Answer all questions → submit | Show score + XP |
| 13 | Portfolio view | View portfolio tab | Show projects |
| 14 | Upload certificate | Upload file | Certificate appears |
| 15 | Leaderboard | View leaderboard | Show ranked users |

---

### 2.4 AI Features Flow

**File:** `tests/e2e/ai-features.spec.ts`

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 1 | AI Chatbot opens | Click chat FAB | Chatbot panel opens |
| 2 | AI Chat responds | Send message | Get AI response |
| 3 | AI Chat context | Ask career question | Context-aware response |
| 4 | Career recommendation | Trigger from profile | Show top careers |
| 5 | Skill gap analysis | Select career → analyze | Show skill gaps |
| 6 | Roadmap generation | View roadmap | Show AI learning path |
| 7 | Cover letter | Generate for job | Show formatted letter |
| 8 | CV review | Submit CV text | Get feedback |
| 9 | Interview prep | Select job + round | Get questions & tips |
| 10 | Chat rate limit | Send 10+ messages quickly | Show rate limit message |

---

### 2.5 Payment Flow

**File:** `tests/e2e/payment.spec.ts`

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 1 | Premium page loads | Navigate to /dashboard/premium | Show plans & pricing |
| 2 | Select monthly plan | Click monthly plan | Midtrans Snap opens |
| 3 | Select yearly plan | Click yearly plan | Midtrans Snap opens |
| 4 | Payment success (sandbox) | Complete sandbox payment | Premium activated |
| 5 | Payment cancelled | Close Snap modal | Return to premium page |
| 6 | Premium features gated | Try premium feature (free user) | Show upgrade prompt |
| 7 | Consultation booking | Book + pay | Booking confirmed |

---

### 2.6 Admin Panel Flow

**File:** `tests/e2e/admin.spec.ts`

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 1 | Admin login | Login with admin account | Redirect to /admin |
| 2 | Admin access denied | Login as regular user → /admin | 401 / redirect |
| 3 | User management | View, search, filter users | Paginated user list |
| 4 | Ban user | Click ban → confirm | User banned |
| 5 | Job management | Create, edit, delete job | CRUD works |
| 6 | Career management | CRUD careers | CRUD works |
| 7 | Skill management | CRUD skills | CRUD works |
| 8 | Analytics dashboard | View analytics | Charts render |
| 9 | Content editor | Edit page content | Content saved |
| 10 | Audit logs | View admin logs | Show action history |
| 11 | System health | View health check | All services green |

---

### 2.7 Community & Social Flow

**File:** `tests/e2e/community.spec.ts`

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 1 | View community | Navigate to /dashboard/community | See post list |
| 2 | Create post | Write + submit post | Post appears |
| 3 | Comment on post | Write comment | Comment appears |
| 4 | Like post | Click like | Like count increases |
| 5 | Filter by category | Select category | Posts filtered |

---

### 2.8 Wellness Flow

**File:** `tests/e2e/wellness.spec.ts`

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 1 | Wellness check | Complete GAD-7 | Show score + severity |
| 2 | Mood entry | Log mood + journal | Entry saved |
| 3 | Mood trend | View over time | Chart shows trend |
| 4 | High stress alert | Score high on GAD-7 | Show support resources |

---

## 3. 🔌 API INTEGRATION TESTS

### Test Pattern

```typescript
// api-test-helper.ts
const API_BASE = 'http://localhost:3000/api'

async function testEndpoint(config: {
  method: string
  path: string
  body?: object
  auth?: 'user' | 'admin' | 'none'
  expectedStatus: number
  expectedShape?: object
}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  
  // Add auth cookie if needed
  if (config.auth === 'user') headers['Cookie'] = USER_SESSION_COOKIE
  if (config.auth === 'admin') headers['Cookie'] = ADMIN_SESSION_COOKIE
  
  const res = await fetch(`${API_BASE}${config.path}`, {
    method: config.method,
    headers,
    body: config.body ? JSON.stringify(config.body) : undefined
  })
  
  expect(res.status).toBe(config.expectedStatus)
  return res.json()
}
```

### API Test Checklist

| Endpoint | Auth Test | Valid Input | Invalid Input | Error Handling |
|----------|:---------:|:-----------:|:-------------:|:--------------:|
| AI Career Recommend | ✅ | ✅ | ✅ | ✅ |
| AI Chat | ✅ | ✅ | ✅ | ✅ |
| AI Skill Gap | ✅ | ✅ | ✅ | ✅ |
| Admin Users | ✅ | ✅ | ✅ | ✅ |
| Admin Careers | ✅ | ✅ | ✅ | ✅ |
| Careers List | — | ✅ | — | ✅ |
| Community | ✅ | ✅ | ✅ | ✅ |
| Payment Create | ✅ | ✅ | ✅ | ✅ |
| Payment Webhook | 🔐 | ✅ | ✅ | ✅ |
| User Export | ✅ | ✅ | — | ✅ |
| User Delete | ✅ | ✅ | — | ✅ |
| Search | ✅ | ✅ | ✅ | ✅ |

### Auth Boundary Tests

```typescript
// Every protected endpoint MUST be tested for:
test('rejects unauthenticated request', async () => {
  const res = await fetch('/api/dashboard/stats')
  expect(res.status).toBe(401)
})

test('rejects non-admin from admin endpoint', async () => {
  // Login as regular user
  const res = await fetch('/api/admin/users', { headers: userAuthHeaders })
  expect(res.status).toBe(401)
})

test('only super_admin can change roles', async () => {
  // Login as regular admin
  const res = await fetch('/api/admin/users', {
    method: 'PATCH',
    headers: adminAuthHeaders,
    body: JSON.stringify({ userId: 'xxx', updates: { role: 'admin' }})
  })
  expect(res.status).toBe(403)
})
```

---

## 4. ✅ PRE-DEPLOYMENT QA CHECKLIST

### 4.1 Critical Path (Must Pass Before Deploy)

- [ ] **Auth:** Login → Dashboard redirect works
- [ ] **Auth:** Register → Onboarding redirect works
- [ ] **Auth:** Logout clears session
- [ ] **Auth:** Protected routes redirect to /login
- [ ] **Onboarding:** All 10 steps navigable
- [ ] **Onboarding:** AI recommendation appears at step 7
- [ ] **Dashboard:** Overview page loads with stats
- [ ] **Dashboard:** All sidebar links work
- [ ] **AI Chat:** Chatbot opens, sends, receives messages
- [ ] **Payment:** Midtrans Snap opens correctly
- [ ] **Admin:** Admin panel accessible only by admin role
- [ ] **Mobile:** All pages responsive at 375px width

### 4.2 Feature Verification

- [ ] **Career Explorer:** Browse + detail view
- [ ] **Job Search:** List + filter + apply
- [ ] **Skill Tracking:** Add/update skill + radar chart
- [ ] **Learning:** Course list + quiz
- [ ] **Portfolio:** Project view + certificate upload
- [ ] **Community:** Post + comment + like
- [ ] **Wellness:** GAD-7 questionnaire + mood entry
- [ ] **Consultation:** Professional list + booking
- [ ] **Evaluation:** Monthly targets + report
- [ ] **Leaderboard:** XP rankings display
- [ ] **Profile:** Edit + save
- [ ] **Settings:** Change password
- [ ] **Premium:** Plans display + payment flow

### 4.3 Cross-Browser Testing

| Browser | Desktop | Mobile |
|---------|:-------:|:------:|
| Chrome | ✅ Required | ✅ Required |
| Firefox | ✅ Required | ⬜ Nice-to-have |
| Safari | ⬜ Nice-to-have | ✅ Required (iOS) |
| Edge | ⬜ Nice-to-have | ⬜ Nice-to-have |

### 4.4 Performance Baseline

| Metric | Target | Tool |
|--------|--------|------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse |
| FID (First Input Delay) | < 100ms | Lighthouse |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| TTI (Time to Interactive) | < 3.5s | Lighthouse |
| Bundle Size (JS) | < 500KB gzipped | `next build` |
| Lighthouse Performance | > 70 | Chrome DevTools |
| Lighthouse Accessibility | > 80 | Chrome DevTools |

### 4.5 Security Checklist

- [ ] **Headers:** CSP, HSTS, X-Frame present
- [ ] **Auth:** Session timeout works (30 min)
- [ ] **RLS:** Users can only access own data
- [ ] **Admin:** Only admin roles can access admin panel
- [ ] **Admin:** Only super_admin can change roles / delete admins
- [ ] **API:** Rate limiting active on AI endpoints
- [ ] **Payment:** Webhook signature verification active
- [ ] **Input:** No XSS possible in community posts
- [ ] **GDPR:** User can export data
- [ ] **GDPR:** User can delete account
- [ ] **Cookie:** Consent banner appears for new visitors

---

## 5. 🔄 CI/CD TEST INTEGRATION

### Recommended Pipeline

```yaml
# .github/workflows/test.yml (future)
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx tsc --noEmit

  build:
    runs-on: ubuntu-latest
    needs: type-check
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Test Commands

```powershell
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts

# Run with browser visible (debug mode)
npx playwright test --headed

# Run with Playwright Inspector
npx playwright test --debug

# Generate test report
npx playwright show-report

# TypeScript check (no tests, just type validation)
npx tsc --noEmit
```

---

## 6. 🧪 TEST DATA MANAGEMENT

### Test Users

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| `test-user@careerpath.id` | `TestUser123!` | user | General user flow tests |
| `test-admin@careerpath.id` | `TestAdmin123!` | admin | Admin panel tests |
| `test-super@careerpath.id` | `TestSuper123!` | super_admin | Super admin tests |
| `test-premium@careerpath.id` | `TestPremium123!` | user (premium) | Premium feature tests |
| `test-new@careerpath.id` | `TestNew123!` | user (no onboarding) | Onboarding flow tests |

### Test Data Seed

```sql
-- Create test users in Supabase Auth + profiles
-- This should be run once per test environment

INSERT INTO public.users (id, email, full_name, role, onboarding_completed, is_premium) VALUES
('test-user-uuid', 'test-user@careerpath.id', 'Test User', 'user', true, false),
('test-admin-uuid', 'test-admin@careerpath.id', 'Test Admin', 'admin', true, false),
('test-super-uuid', 'test-super@careerpath.id', 'Test Super', 'super_admin', true, false),
('test-premium-uuid', 'test-premium@careerpath.id', 'Test Premium', 'user', true, true);
```

### Test Environment

```env
# .env.test (separate from .env.local)
NEXT_PUBLIC_SUPABASE_URL=<test-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<test-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<test-service-key>
GROQ_API_KEY=<test-groq-key>
MIDTRANS_SERVER_KEY=<sandbox-server-key>
MIDTRANS_CLIENT_KEY=<sandbox-client-key>
```

---

## 7. 📋 IMPLEMENTATION PRIORITY

### Phase 1 — Now (Before PKM Demo)

| Task | Impact | Effort |
|------|--------|--------|
| Auth E2E tests (login, register, logout) | 🔴 Critical | 2-3 hours |
| Dashboard navigation test | 🔴 Critical | 1-2 hours |
| AI Chat basic test | 🟡 High | 1 hour |
| Admin access control test | 🟡 High | 1-2 hours |
| Pre-deploy QA checklist run | 🔴 Critical | 2 hours |

### Phase 2 — Post-PKM

| Task | Impact | Effort |
|------|--------|--------|
| Complete E2E test suite | 🟡 High | 1-2 days |
| API integration tests | 🟡 High | 1 day |
| CI/CD pipeline setup | 🟡 High | 3-4 hours |
| Performance baseline testing | 🟢 Medium | 2 hours |
| Cross-browser testing | 🟢 Medium | 2-3 hours |

### Phase 3 — Scale

| Task | Impact | Effort |
|------|--------|--------|
| Component unit tests (Vitest) | 🟢 Medium | 2-3 days |
| Load testing (k6 or Artillery) | 🟢 Medium | 1 day |
| Visual regression testing | 🟢 Medium | 1 day |
| Accessibility automated testing | 🟢 Medium | 1 day |

---

## 8. 📊 TEST COVERAGE TARGETS

| Phase | E2E Coverage | API Coverage | Type Safety | Lighthouse |
|-------|:-----------:|:------------:|:-----------:|:----------:|
| **PKM Demo** | 5 critical flows | Manual verify | `tsc --noEmit` pass | > 60 |
| **Post-PKM** | 15+ scenarios | 80% endpoints | Full pass | > 75 |
| **Production** | 30+ scenarios | 100% endpoints | Strict mode | > 85 |

---

> **Dokumen ini harus di-update setiap kali ada test baru, QA checklist berubah, atau target coverage di-update.**
