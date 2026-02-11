# 🔌 CareerPath.id — API BLUEPRINT
## Dokumentasi Lengkap API Endpoints, Contracts & Standards

> **Status:** Active Directive  
> **Last Updated:** 2026-02-11  
> **Priority:** HIGH — Referensi untuk semua API development & debugging  
> **Base URL:** `http://localhost:3000/api` (dev) / `https://careerpath.id/api` (prod)

---

## 1. 📐 API STANDARDS

### Response Format

Semua API endpoint HARUS mengikuti format response standard:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE"
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### HTTP Status Codes

| Code | Usage |
|------|-------|
| `200` | Success (GET, PATCH) |
| `201` | Created (POST) |
| `400` | Bad Request — missing or invalid parameters |
| `401` | Unauthorized — not logged in |
| `403` | Forbidden — no permission (role-based) |
| `404` | Not Found |
| `429` | Rate Limited |
| `500` | Internal Server Error |

### Authentication

| Level | Description | How |
|-------|-------------|-----|
| **Public** | No auth required | — |
| **User** | Logged-in user required | Supabase session cookie |
| **Admin** | Admin role required | `checkAdminAccess()` |
| **Super Admin** | Super admin only | `role === 'super_admin'` |
| **Service** | Server-to-server (webhooks) | Signature verification |

### Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| AI endpoints | 10 req | per minute |
| Auth endpoints | 5 req | per minute |
| General API | 60 req | per minute |
| Payment webhooks | No limit | — |

---

## 2. 🤖 AI ENDPOINTS (11 Routes)

### POST `/api/ai/career-recommend`

**Auth:** User  
**AI Module:** 1 — Career Path Recommender  
**Rate Limit:** 10/min

```typescript
// Request
{
  "userProfile": {
    "major": "Teknik Informatika",
    "skills": ["Python", "SQL", "JavaScript"],
    "interests": ["data", "technology"],
    "status": "mahasiswa",
    "goals": "Menjadi Data Analyst"
  }
}

// Response (200)
{
  "success": true,
  "recommendations": [
    {
      "rank": 1,
      "career": {
        "id": "uuid",
        "title": "Data Analyst",
        "industry": "Technology",
        "description": "...",
        "salaryRange": { "min": 6000000, "max": 12000000 },
        "demand": "Very High",
        "requiredSkills": ["SQL", "Python", "Data Visualization"]
      },
      "matchScore": 85,
      "missingSkills": ["Tableau"],
      "estimatedReadyTime": "1-2 bulan"
    }
  ],
  "aiInsight": "Berdasarkan background IT dan skill Python..."
}
```

---

### POST `/api/ai/skill-gap`

**Auth:** User  
**AI Module:** 2 — Skill Gap Analyzer

```typescript
// Request
{
  "userSkills": [
    { "name": "Python", "level": 3 },
    { "name": "SQL", "level": 2 }
  ],
  "targetCareer": "Data Analyst",
  "targetSkills": [
    { "name": "Python", "requiredLevel": 4 },
    { "name": "SQL", "requiredLevel": 4 },
    { "name": "Tableau", "requiredLevel": 3 }
  ]
}

// Response (200)
{
  "success": true,
  "gaps": [
    { "skill": "SQL", "current": 2, "required": 4, "gap": 2, "priority": "high" },
    { "skill": "Tableau", "current": 0, "required": 3, "gap": 3, "priority": "critical" },
    { "skill": "Python", "current": 3, "required": 4, "gap": 1, "priority": "medium" }
  ],
  "roadmap": "...", // AI-generated learning roadmap text
  "estimatedTime": "3-4 bulan"
}
```

---

### POST `/api/ai/chat`

**Auth:** User  
**AI Module:** 6 — Career Chatbot  
**Rate Limit:** 10/min (Free: 3/day)

```typescript
// Request
{
  "message": "Skill apa yang harus saya pelajari untuk jadi Data Analyst?",
  "conversationHistory": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "userContext": {
    "name": "Nabila",
    "major": "Statistika",
    "careerTarget": "Data Analyst"
  }
}

// Response (200)
{
  "success": true,
  "reply": "Hai Nabila! Untuk menjadi Data Analyst, kamu perlu fokus pada...",
  "suggestedActions": [
    { "type": "course", "text": "Lihat kursus SQL", "link": "/dashboard/learning" },
    { "type": "skill", "text": "Update skill tracking", "link": "/dashboard/skills" }
  ]
}
```

---

### POST `/api/ai/learning-recommend`

**Auth:** User | **AI Module:** 3

```typescript
// Request: { "userId": "uuid", "skillGaps": [...], "timeAvailable": 10 }
// Response: { "success": true, "courses": [...], "weeklyPlan": "..." }
```

### POST `/api/ai/job-match`

**Auth:** User | **AI Module:** 4

```typescript
// Request: { "userId": "uuid", "jobId": "uuid" }
// Response: { "success": true, "matchScore": 85, "breakdown": {...}, "suggestions": [...] }
```

### POST `/api/ai/progress-predict`

**Auth:** User | **AI Module:** 5

```typescript
// Request: { "userId": "uuid" }
// Response: { "success": true, "prediction": {...}, "insights": [...] }
```

### POST `/api/ai/sentiment`

**Auth:** User | **AI Module:** 7

```typescript
// Request: { "text": "Hari ini saya merasa overwhelmed...", "userId": "uuid" }
// Response: { "success": true, "sentiment": "negative", "riskLevel": "moderate", "suggestion": "..." }
```

### POST `/api/ai/cover-letter`

**Auth:** User

```typescript
// Request: { "jobTitle": "...", "company": "...", "userProfile": {...} }
// Response: { "success": true, "coverLetter": "..." }
```

### POST `/api/ai/cv-review`

**Auth:** User

```typescript
// Request: { "cvText": "...", "targetCareer": "..." }
// Response: { "success": true, "score": 75, "feedback": [...], "improvements": [...] }
```

### POST `/api/ai/interview-prep`

**Auth:** User

```typescript
// Request: { "jobTitle": "...", "company": "...", "round": "technical" }
// Response: { "success": true, "questions": [...], "tips": [...] }
```

### POST `/api/ai/portfolio-review`

**Auth:** User

```typescript
// Request: { "portfolioData": {...} }
// Response: { "success": true, "score": 80, "suggestions": [...] }
```

---

## 3. 🛡️ ADMIN ENDPOINTS (8 Routes)

### GET `/api/admin`

**Auth:** Admin  
**Description:** Check admin access & get admin profile

```typescript
// Response (200)
{
  "isAdmin": true,
  "user": { "id": "uuid", "email": "...", "role": "admin" }
}

// Response (401)
{ "error": "Unauthorized — admin access required" }
```

---

### GET/PATCH/DELETE `/api/admin/users`

**Auth:** Admin  

```typescript
// GET — List users with pagination & search
// Query: ?page=1&limit=20&search=nabila&role=user
{
  "users": [...],
  "pagination": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }
}

// PATCH — Update user
// Body: { "userId": "uuid", "updates": { "role": "admin", "is_banned": true } }
// Note: Only super_admin can change roles
{ "success": true, "data": { ... } }

// DELETE — Delete user
// Query: ?userId=uuid
// Note: Cannot delete self. Only super_admin can delete admin users.
{ "success": true }
```

---

### GET/POST `/api/admin/careers`

**Auth:** Admin  

```typescript
// GET — List all careers
// POST — Create new career
// Body: { "title": "...", "category": "...", "salary_min": 5000000, ... }
```

### GET/POST `/api/admin/skills`

**Auth:** Admin  

```typescript
// GET — List all skills with filters
// POST — Create new skill
// Body: { "name": "Python", "category": "Programming", "type": "hard" }
```

### GET `/api/admin/analytics`

**Auth:** Admin  

```typescript
// Response
{
  "users": { "total": 1500, "active": 750, "premium": 150, "newThisMonth": 200 },
  "engagement": { "avgSessionDuration": "12min", "dailyActiveUsers": 250 },
  "revenue": { "totalRevenue": 15000000, "premiumUsers": 150, "consultations": 50 }
}
```

### GET `/api/admin/health`

**Auth:** Admin  

```typescript
// Response
{
  "status": "healthy",
  "database": "connected",
  "storage": "connected",
  "ai": "connected",
  "uptime": "99.9%"
}
```

### POST `/api/admin/mfa`

**Auth:** Admin  

```typescript
// Body: { "action": "setup" | "verify", "code": "123456" }
// Response: { "success": true, "qrCode": "..." } // for setup
```

### POST `/api/admin/bulk-upload`

**Auth:** Admin  

```typescript
// Body: FormData with CSV/Excel file
// Response: { "success": true, "imported": 50, "errors": 2, "details": [...] }
```

---

## 4. 📊 BUSINESS ENDPOINTS (20+ Routes)

### Careers

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/careers` | Public | List career paths |
| GET | `/api/careers/[id]` | Public | Career path detail |

### Courses

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/courses` | User | List courses with filters |

### Skill Gap

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/skill-gap/[careerId]` | User | Get skill gap for specific career |

### Community

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/community` | User | List posts (paginated) |
| POST | `/api/community` | User | Create new post |

### Consultation

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/consultation` | User | List professionals & bookings |
| POST | `/api/consultation` | User | Create booking |

### Contact

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/contact` | Public | Submit contact form |

### Dashboard

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/dashboard/stats` | User | Get dashboard statistics |

### Jobs

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/jobs/apply` | User | Apply for a job |

### Notifications

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/notifications` | User | Get user notifications |

### Portfolio

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/portfolio/certificates` | User | List user certificates |
| POST | `/api/portfolio/certificates` | User | Upload certificate |
| DELETE | `/api/portfolio/certificates/[id]` | User | Delete certificate |
| GET | `/api/portfolio/public/[username]` | Public | Get public portfolio |

### Search

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/search` | User | Global multi-entity search |

```typescript
// Query: ?q=python&type=all
// type: 'all' | 'careers' | 'jobs' | 'courses' | 'skills' | 'posts'
{
  "results": {
    "careers": [...],
    "jobs": [...],
    "courses": [...],
    "skills": [...],
    "posts": [...]
  },
  "totalResults": 25
}
```

---

## 5. 💳 PAYMENT ENDPOINTS (3 Routes)

### POST `/api/payment/create`

**Auth:** User

```typescript
// Request
{
  "planType": "premium_monthly", // | "premium_yearly" | "consultation"
  "amount": 49000,
  "consultationId": "uuid" // only for consultation payment
}

// Response (200)
{
  "success": true,
  "snapToken": "midtrans-snap-token-xxx",
  "orderId": "CP-userid-1707620000"
}
```

### GET `/api/payment/status`

**Auth:** User

```typescript
// Query: ?orderId=CP-userid-1707620000
{
  "success": true,
  "status": "paid", // 'pending'|'paid'|'failed'|'expired'|'refunded'
  "payment": { ... }
}
```

### POST `/api/payment/webhook`

**Auth:** Service (Midtrans signature verification)

```typescript
// Request (from Midtrans)
{
  "order_id": "CP-userid-1707620000",
  "transaction_status": "settlement",
  "fraud_status": "accept",
  "gross_amount": "49000.00",
  "status_code": "200",
  "signature_key": "sha512-hash",
  "payment_type": "gopay"
}

// Response (200)
{ "success": true, "status": "paid" }

// Side Effects:
// - Updates payment record status
// - If premium: sets user is_premium=true, premium_expires_at
// - If consultation: updates booking payment_status
// - Creates notification for user
```

---

## 6. 👤 USER ENDPOINTS (5 Routes)

### POST `/api/user/change-password`

**Auth:** User

```typescript
// Request
{ "currentPassword": "...", "newPassword": "..." }

// Response (200)
{ "success": true, "message": "Password updated successfully" }
```

### DELETE `/api/user/delete`

**Auth:** User

```typescript
// Response (200) — CASCADE deletes all user data
{ "success": true, "message": "Account deleted" }
```

### GET `/api/user/export`

**Auth:** User  
**Response:** Downloads JSON file containing all user data

```typescript
// Response: application/json download
{
  "exportInfo": { "exportedAt": "...", "userId": "...", "format": "JSON" },
  "profile": { ... },
  "skills": [ ... ],
  "careers": [ ... ],
  "learningHistory": [ ... ],
  "certificates": [ ... ],
  "jobApplications": [ ... ],
  "wellnessData": { "moodEntries": [...] },
  "goals": { "monthlyTargets": [...] }
}
```

### POST `/api/user/logout-all`

**Auth:** User  
**Description:** Logout dari semua perangkat (global sign out)

```typescript
// Response (200)
{ "success": true, "message": "Berhasil logout dari semua perangkat" }

// Side Effects:
// - Revokes all active sessions via Supabase Auth (scope: global)
// - Logs action to admin_audit_logs
```

### GET/POST/DELETE `/api/user/skills`

**Auth:** User  
**Description:** Manage user's tracked skills

```typescript
// GET — Fetch user's skills with details
{
  "skills": [
    {
      "userSkillId": "uuid",
      "skillId": "uuid",
      "name": "Python",
      "category": "Programming",
      "proficiency_level": "Intermediate",
      "progress_percentage": 60,
      "hours_practiced": 40
    }
  ],
  "totalSkills": 8
}

// POST — Add skill to user
// Body: { "skill_id": "uuid", "proficiency_level": "Beginner", "progress_percentage": 0 }
// Response: { "success": true, "data": { ... } }
// Error 409: "Skill sudah ditambahkan sebelumnya"

// DELETE — Remove skill
// Query: ?skill_id=uuid
// Response: { "success": true }
```

---

## 7. 🔗 INTEGRATION ENDPOINTS (2 Routes)

### GET `/api/integrations/linkedin`

**Auth:** User  
**Description:** Start LinkedIn OAuth 2.0 flow

```typescript
// Response: Redirect to LinkedIn authorization URL
```

### GET `/api/integrations/linkedin/callback`

**Auth:** System  
**Description:** Handle LinkedIn OAuth callback

```typescript
// Query: ?code=xxx&state=xxx
// Side Effect: Import LinkedIn profile data to user profile
// Response: Redirect to /dashboard/profile?linkedin=success
```

---

## 8. 🎮 GAMIFICATION ENDPOINTS (5 Routes)

### GET `/api/gamification/leaderboard`

**Auth:** User

```typescript
// Query: ?limit=50&period=all
{
  "leaderboard": [
    { "rank": 1, "userId": "uuid", "name": "Nabila", "avatarUrl": "...", "xp": 2500, "level": 6 }
  ]
}
```

### GET `/api/gamification/challenges`

**Auth:** User

```typescript
{
  "weeklyChallenges": [
    { "id": "uuid", "title": "SQL Sprint", "description": "...", "xpReward": 200, "progress": 60 }
  ]
}
```

### GET `/api/gamification/quizzes`

**Auth:** User — List available quizzes

### GET `/api/gamification/quizzes/[id]`

**Auth:** User — Get quiz detail with questions

### POST `/api/gamification/quizzes/[id]/submit`

**Auth:** User

```typescript
// Request
{ "answers": [0, 2, 1, 3, 0] } // selected option index per question

// Response (201)
{ "success": true, "score": 80, "passed": true, "xpEarned": 25, "feedback": [...] }
```

---

## 9. 📊 B2B ENDPOINTS (2 Routes)

### GET `/api/b2b/analytics`

**Auth:** Admin / B2B Account

```typescript
{
  "overview": { "totalStudents": 500, "activeUsers": 300, "avgEmployability": 68 },
  "skillGaps": [...],
  "topCareers": [...],
  "employmentRate": 72
}
```

### GET `/api/b2b/reports`

**Auth:** Admin / B2B Account

```typescript
// Query: ?format=json|csv&department=informatika&cohort=2022
// Response: Data download in requested format
```

---

## 10. 🩺 WELLNESS ENDPOINT (1 Route)

### GET/POST `/api/wellness`

**Auth:** User  
**Description:** Submit GAD-7 wellness check (AI-analyzed) and retrieve history

```typescript
// POST — Submit wellness check
// Request
{
  "gad7_score": 12,
  "mood": "anxious",
  "notes": "Banyak deadline minggu ini"
}

// Response (200) — AI-analyzed result via Groq
{
  "success": true,
  "analysis": {
    "score": 12,
    "recommendation": "Skor GAD-7 kamu menunjukkan...",
    "anxietyLevel": "moderate",
    "needsFollowUp": true,
    "suggestedActivities": ["breathing exercise", "journaling"]
  }
}

// GET — Fetch wellness history
// Query: ?limit=5
// Response: { "logs": [...] }
```

---

## 11. 🔧 UTILITY ENDPOINTS (2 Routes)

### POST `/api/email/send`

**Auth:** System/Admin

```typescript
// Request
{
  "to": "user@email.com",
  "template": "welcome", // | "monthly_report" | "consultation_reminder"
  "data": { "name": "Nabila", ... }
}
```

### GET `/api/test-supabase`

**Auth:** Public (dev only)  
**Description:** Test database connection

---

## 12. 🗺️ ENDPOINT SUMMARY MAP (56 Routes)

```
/api
├── ai/                          (11 routes)
│   ├── career-recommend    POST   [User]  Module 1
│   ├── skill-gap           POST   [User]  Module 2
│   ├── learning-recommend  POST   [User]  Module 3
│   ├── job-match           POST   [User]  Module 4
│   ├── progress-predict    POST   [User]  Module 5
│   ├── chat                POST   [User]  Module 6
│   ├── sentiment           POST   [User]  Module 7
│   ├── cover-letter        POST   [User]
│   ├── cv-review           POST   [User]
│   ├── interview-prep      POST   [User]
│   └── portfolio-review    POST   [User]
├── admin/                       (8 routes)
│   ├── (index)             GET    [Admin]
│   ├── users               GET/PATCH/DELETE [Admin]
│   ├── careers             GET/POST [Admin]
│   ├── skills              GET/POST [Admin]
│   ├── analytics           GET    [Admin]
│   ├── health              GET    [Admin]
│   ├── mfa                 POST   [Admin]
│   └── bulk-upload         POST   [Admin]
├── careers/                     (2 routes)
│   ├── (index)             GET    [Public]
│   └── [id]                GET    [Public]
├── courses/                GET    [User]
├── community/              GET/POST [User]
├── consultation/           GET/POST [User]
├── contact/                POST   [Public]
├── dashboard/stats         GET    [User]
├── jobs/apply              POST   [User]
├── notifications/          GET    [User]
├── payment/                     (3 routes)
│   ├── create              POST   [User]
│   ├── status              GET    [User]
│   └── webhook             POST   [Service]
├── portfolio/                   (3 routes)
│   ├── certificates/       GET/POST [User]
│   ├── certificates/[id]   DELETE [User]
│   └── public/[username]   GET    [Public]
├── search/                 GET    [User]
├── skill-gap/[careerId]    GET    [User]
├── user/                        (5 routes)
│   ├── change-password     POST   [User]
│   ├── delete              DELETE [User]
│   ├── export              GET    [User]
│   ├── logout-all          POST   [User]
│   └── skills              GET/POST/DELETE [User]
├── wellness/               GET/POST [User]
├── integrations/                (2 routes)
│   ├── linkedin            GET    [User]
│   └── linkedin/callback   GET    [System]
├── gamification/                (5 routes)
│   ├── leaderboard         GET    [User]
│   ├── challenges          GET    [User]
│   ├── quizzes/            GET    [User]
│   ├── quizzes/[id]        GET    [User]
│   └── quizzes/[id]/submit POST   [User]
├── b2b/                         (2 routes)
│   ├── analytics           GET    [Admin]
│   └── reports             GET    [Admin]
├── email/send              POST   [System]
└── test-supabase           GET    [Public]
```

---

## 12. 🚨 ERROR HANDLING STANDARD

### Standard Error Codes

| Code | Meaning | HTTP Status |
|------|---------|-------------|
| `AUTH_REQUIRED` | User not logged in | 401 |
| `ADMIN_REQUIRED` | Admin role required | 403 |
| `FORBIDDEN` | No permission for action | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `VALIDATION_ERROR` | Invalid input data | 400 |
| `RATE_LIMITED` | Too many requests | 429 |
| `AI_ERROR` | Groq API failure | 500 |
| `DB_ERROR` | Supabase query failure | 500 |
| `PAYMENT_ERROR` | Midtrans failure | 500 |
| `INTERNAL_ERROR` | Unexpected server error | 500 |

### Error Response Pattern

```typescript
// Consistent error handling in all API routes
export async function POST(request: NextRequest) {
  try {
    // ... logic
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'AUTH_REQUIRED' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({ success: true, data: result })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
```

---

> **Dokumen ini harus di-update setiap kali ada API endpoint baru atau perubahan contract.**
