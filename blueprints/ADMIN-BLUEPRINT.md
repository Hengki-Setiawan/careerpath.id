# 🛡️ Admin Dashboard "God Mode" Blueprint
## Dokumen Arahan Pengembangan Admin Panel — CareerPath.id

> **Status:** Active Directive  
> **Last Updated:** 2026-02-11  
> **Priority:** CRITICAL — Dokumen ini adalah sumber kebenaran untuk semua pengembangan admin panel.

---

## 1. 🎯 FILOSOFI & PRINSIP

Admin Dashboard adalah **Cockpit Super-Control** dari CareerPath.id. Bukan hanya untuk melihat statistik — ini adalah **pusat komando** untuk mengontrol seluruh ekosistem platform secara real-time. Semua operasi terhubung langsung ke **Supabase PostgreSQL** sebagai single source of truth.

### Core Principles

| # | Prinsip | Deskripsi |
|---|---------|-----------|
| 1 | **Omnipotence** | Kemampuan untuk mengelola SEMUA entitas tanpa batasan (User, Job, Career, Skill, Course, Post, Consultant, dll) |
| 2 | **Speed** | Quick actions (Ban User, Pin Post, Approve Job) dapat diakses dalam < 2 klik |
| 3 | **Visibility** | Dashboard menampilkan health check seluruh platform dalam satu pandangan |
| 4 | **Content Authority** | Admin adalah satu-satunya yang bisa mengisi/mengubah seluruh konten website — dari landing page hingga setiap fitur dashboard |
| 5 | **Audit Trail** | Setiap aksi admin tercatat di `admin_audit_logs` table di Supabase |
| 6 | **Data-Driven** | Semua metrik tersedia sebagai laporan yang bisa diunduh (CSV/PDF/Excel) |
| 7 | **Full Supabase Integration** | Setiap modul CRUD terhubung langsung ke tabel Supabase — TIDAK ADA mock/hardcode data |

### Arsitektur Data

```
┌──────────────────────────────────────────────────────┐
│                  ADMIN DASHBOARD                      │
│          (Next.js App Router + Server Actions)        │
├──────────────────────────────────────────────────────┤
│                                                       │
│   ┌─── API Routes (/api/admin/*) ───┐                │
│   │  • /api/admin/users              │                │
│   │  • /api/admin/careers            │                │
│   │  • /api/admin/skills             │                │
│   │  • /api/admin/jobs               │                │
│   │  • /api/admin/courses     (🆕)   │                │
│   │  • /api/admin/community   (🆕)   │                │
│   │  • /api/admin/consultants (🆕)   │                │
│   │  • /api/admin/analytics          │                │
│   │  • /api/admin/reports     (🆕)   │                │
│   │  • /api/admin/gamification(🆕)   │                │
│   └────────────┬─────────────────────┘                │
│                │                                      │
│                ▼                                      │
│   ┌─── Supabase PostgreSQL ──────────┐               │
│   │  ✅ users, profiles              │               │
│   │  ✅ skills, user_skills          │               │
│   │  ✅ career_paths                 │               │
│   │  ✅ jobs                         │               │
│   │  ✅ wellness_logs                │               │
│   │  ✅ site_settings                │               │
│   │  ✅ page_contents                │               │
│   │  ✅ contact_messages             │               │
│   │  ✅ admin_audit_logs             │               │
│   │  🆕 courses, course_modules      │               │
│   │  🆕 community_posts, reports     │               │
│   │  🆕 consultants, bookings        │               │
│   │  🆕 badges, xp_rules            │               │
│   │  🆕 mood_entries, journals       │               │
│   │  🆕 portfolios, projects         │               │
│   │  🆕 job_applications             │               │
│   │  🆕 subscriptions, payments      │               │
│   └──────────────────────────────────┘               │
└──────────────────────────────────────────────────────┘
```

---

## 2. 📊 MODUL 1: DASHBOARD OVERVIEW (`/admin`)

**File:** `src/app/admin/page.tsx`  
**Status:** ✅ Implemented — Fetches real data from Supabase  
**Supabase Tables:** `users`, `career_paths`, `skills`, `wellness_logs`

### Stat Cards yang Ada
- Total Users, New Users This Week, Admin Users, Regular Users
- Total Careers, Total Skills, Total Mental Health Logs

### ⚡ YANG HARUS DITAMBAHKAN

| Stat Card | Supabase Table | Query |
|-----------|---------------|-------|
| Total Jobs (Active) | `jobs` | `SELECT COUNT(*) WHERE status = 'active'` |
| Total Courses | `courses` (🆕) | `SELECT COUNT(*) WHERE is_published = true` |
| Total Community Posts | `community_posts` (🆕) | `SELECT COUNT(*)` |
| Total Consultants | `consultants` (🆕) | `SELECT COUNT(*) WHERE is_active = true` |
| Pending Approvals | multiple tables | Aggregate pending items |
| Total Revenue | `payments` (🆕) | `SELECT SUM(amount) WHERE status = 'paid'` |
| Active Subscriptions | `subscriptions` (🆕) | `SELECT COUNT(*) WHERE status = 'active'` |

- [ ] **Recent Activity Feed** — 10 aktivitas terbaru dari `admin_audit_logs` + user signups
- [ ] **Quick Actions Panel** — tombol cepat ke semua modul CRUD
- [ ] **System Health Indicators** — API status, DB connection, error rate
- [ ] **Today's Highlights** — new users, new applications, flagged content

---

## 3. 👥 MODUL 2: USER MANAGEMENT (`/admin/users`)

**File:** `src/app/admin/users/page.tsx`  
**Status:** ✅ Implemented — Full CRUD with Supabase  
**Supabase Tables:** `users` (direct query), `auth.users` (Supabase Auth)

### Fitur yang Ada
- Tabel user dengan Search & Filter (role-based)
- Pagination
- View Detail, Edit Role (user ↔ admin), Delete User

### ⚡ YANG HARUS DITAMBAHKAN

#### A. User Detail View (Deep Profile)
Admin harus bisa melihat **SEMUA data per user** dalam satu halaman:

| Data Section | Supabase Table | Deskripsi |
|-------------|---------------|-----------|
| Profile | `users` | Nama, email, universitas, jurusan, semester, kota, avatar |
| Onboarding | `users` | Status onboarding, data yang dipilih, career interests |
| Skills | `user_skills` JOIN `skills` | Semua skill yang di-track, level, progress |
| Courses | `user_courses` JOIN `courses` (🆕) | Courses enrolled, progress, completion |
| Jobs Applied | `job_applications` (🆕) | Semua lamaran, status masing-masing |
| Portfolio | `portfolios`, `projects` (🆕) | Projects, certificates |
| Wellness | `wellness_logs` | GAD-7 history, anxiety scores overtime |
| Mood | `mood_entries` (🆕) | Daily mood log, journal entries |
| Community | `community_posts` (🆕) | Posts dibuat, reports received |
| Consultations | `consultation_bookings` (🆕) | Booking history, reviews given |
| Gamification | `user_xp`, `user_badges` (🆕) | XP total, level, badges earned |
| Subscription | `subscriptions` (🆕) | Status premium, payment history |
| Activity Log | `user_activity_logs` (🆕) | Login history, feature usage |

#### B. User Actions
- [ ] **Ban/Suspend User** — set `users.status = 'banned'` tanpa menghapus data
- [ ] **Unban User** — reactivate banned account
- [ ] **Reset Password** — trigger Supabase Auth password reset email
- [ ] **Manual XP Adjustment** — UPDATE `user_xp SET total_xp = total_xp ± X`
- [ ] **Grant/Revoke Badge** — INSERT/DELETE dari `user_badges`
- [ ] **Force Premium** — manually set premium subscription tanpa payment
- [ ] **Impersonate User** — login sebagai user untuk debugging (with audit log)
- [ ] **Export User Data** — generate JSON/CSV semua data user (GDPR compliance)
- [ ] **Delete Account** — cascade delete semua data user (right to be forgotten)
- [ ] **Bulk Actions** — multi-select untuk bulk ban/role change/delete/export

---

## 4. 💼 MODUL 3: JOB MANAGEMENT (`/admin/jobs`)

**File:** `src/app/admin/jobs/page.tsx` + `src/app/admin/jobs/new/page.tsx`  
**Status:** ✅ Implemented — CRUD from `jobs` table  
**Supabase Tables:** `jobs`

### Fitur yang Ada
- List, Search, Create, Edit, Delete jobs dari Supabase

> [!CAUTION]
> **KRITIS:** Dashboard user (`/dashboard/jobs`) menampilkan **100% MOCK DATA hardcoded** — data `jobs` dari admin CRUD BELUM tersambung! Dashboard user (`/dashboard/applications`) juga **100% MOCK DATA**.

### ⚡ YANG HARUS DITAMBAHKAN
- [ ] **Koneksi ke Dashboard User** — `/dashboard/jobs` HARUS fetch dari `jobs` table
- [ ] **Job Applications View** — lihat semua lamaran per job dari `job_applications` table
- [ ] **Job Status Toggle** — active/inactive/expired toggle langsung di list
- [ ] **Job Analytics** — views count, bookmarks, applications per job
- [ ] **Rich Text Editor** — WYSIWYG untuk deskripsi job (bukan plain text)
- [ ] **Bulk Import** — import lowongan via CSV/Excel
- [ ] **Job Expiry** — auto-expire jobs setelah deadline
- [ ] **Application Funnel** — applied → reviewing → interview → offered → hired pipeline

### Supabase Tables Needed
```sql
-- Extend existing
ALTER TABLE jobs ADD COLUMN views_count INTEGER DEFAULT 0;
ALTER TABLE jobs ADD COLUMN expires_at TIMESTAMP;

-- New table
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  job_id UUID REFERENCES jobs(id),
  status TEXT DEFAULT 'applied', -- applied, reviewing, interview, offered, rejected, hired
  cover_letter TEXT,
  resume_url TEXT,
  match_score INTEGER,
  applied_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY, user_id UUID, job_id UUID, saved_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. 🎯 MODUL 4: CAREER MANAGEMENT (`/admin/careers`)

**File:** `src/app/admin/careers/page.tsx`  
**Status:** ✅ Implemented — Full CRUD via API  
**Supabase Tables:** `career_paths`

### Fitur yang Ada
- List, Search, Create, Edit, Delete careers (title, description, industry, salary, job type, experience, demand, growth, icon, color)

### ⚡ YANG HARUS DITAMBAHKAN
- [ ] **Skill-Career Mapping** — `career_requirements` table (career_id → skill_id + required_level)
- [ ] **Career Pathway** — define progression path (Junior → Mid → Senior → Lead)
- [ ] **Related Jobs** — link careers ke job listings yang relevan
- [ ] **Career Popularity Stats** — berapa user yang memilih career ini (FROM `users` WHERE career interests)
- [ ] **AI Recommendation Config** — weights dan rules untuk AI career recommender

---

## 6. ⚡ MODUL 5: SKILL MANAGEMENT (`/admin/skills`)

**File:** `src/app/admin/skills/page.tsx`  
**Status:** ✅ Implemented — Full CRUD via API  
**Supabase Tables:** `skills`

### Fitur yang Ada
- List, Filter (Hard/Soft), Search, Create, Edit, Delete skill

### ⚡ YANG HARUS DITAMBAHKAN
- [ ] **Skill-Career Mapping** — link skill ke career requirements (`career_requirements` table)
- [ ] **Skill-Course Mapping** — link skill ke courses yang mengajarkannya
- [ ] **Skill Popularity** — `SELECT COUNT(*) FROM user_skills WHERE skill_id = X` per skill
- [ ] **Skill Level Definitions** — define Beginner/Intermediate/Advanced/Expert criteria per skill
- [ ] **Bulk Import** — import skills via CSV

---

## 7. 📚 MODUL 6: COURSE/LEARNING MANAGEMENT (🆕 BELUM ADA)

**Status:** ❌ BELUM DIBUAT — Admin page belum ada  
**User Dashboard:** `/dashboard/learning` — fetches from `courses` table tapi **tabel mungkin kosong** karena tidak ada cara admin mengisi data

> [!IMPORTANT]
> Dashboard user sudah siap fetch dari Supabase tapi butuh admin panel untuk mengisi konten courses.

### HARUS DIBUAT: `/admin/courses`
- [ ] **Course List** — search, filter by category/level/status, pagination
- [ ] **Create Course Form:**
  | Field | Type | Required |
  |-------|------|----------|
  | title | TEXT | ✅ |
  | description | TEXT (rich) | ✅ |
  | category | ENUM (Programming, Design, Business, Data, Marketing) | ✅ |
  | level | ENUM (Beginner, Intermediate, Advanced) | ✅ |
  | duration_hours | INTEGER | ✅ |
  | xp_reward | INTEGER | ✅ |
  | thumbnail_url | TEXT (image upload) | ❌ |
  | source_url | TEXT (external link) | ❌ |
  | provider | TEXT (Coursera, YouTube, etc) | ❌ |
  | is_published | BOOLEAN | ✅ |
  | skill_ids | UUID[] (multi-select relation) | ❌ |

- [ ] **Edit & Delete Course**
- [ ] **Module/Lesson Management** — nested CRUD per course
- [ ] **Course Analytics** — enrollment count, completion rate, avg rating
- [ ] **Bulk Import** — CSV upload untuk batch create courses
- [ ] **Bulk Publish/Archive** — toggle multiple courses

### Supabase Schema
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  level TEXT DEFAULT 'Beginner',
  duration_hours INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 50,
  thumbnail_url TEXT,
  source_url TEXT,
  provider TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  "order" INTEGER DEFAULT 0,
  type TEXT DEFAULT 'lesson' -- lesson, quiz, assignment
);

CREATE TABLE course_skills (
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, skill_id)
);

CREATE TABLE user_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  progress INTEGER DEFAULT 0,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  xp_earned INTEGER DEFAULT 0
);
```

---

## 8. 💬 MODUL 7: COMMUNITY MANAGEMENT (🆕 BELUM ADA)

**Status:** ❌ BELUM DIBUAT  
**User Dashboard:** `/dashboard/community` — **100% HARDCODED posts**

> [!IMPORTANT]
> Community page di dashboard user menampilkan data hardcoded. Butuh backend + admin CRUD sepenuhnya.

### HARUS DIBUAT: `/admin/community`
- [ ] **Post List** — semua posts dengan filter (reported, pinned, recent, by category)
- [ ] **Moderate Posts** — approve/reject, pin/unpin, hide/show, delete
- [ ] **Create Announcement** — admin bisa membuat post pengumuman resmi
- [ ] **Report Queue** — list post yang dilaporkan user + actions (dismiss, warn, delete)
- [ ] **Category/Topic Management** — CRUD kategori diskusi
- [ ] **Community Guidelines** — editable rules page
- [ ] **User Moderation** — mute/warn users yang melanggar aturan

### Supabase Schema
```sql
CREATE TABLE community_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, description TEXT, icon TEXT, color TEXT, "order" INTEGER DEFAULT 0
);

CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  category_id UUID REFERENCES community_categories(id),
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  is_announcement BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id),
  reporter_id UUID REFERENCES users(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, reviewed, dismissed
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 9. 🧑‍⚕️ MODUL 8: CONSULTANT MANAGEMENT (🆕 BELUM ADA)

**Status:** ❌ BELUM DIBUAT  
**User Dashboard:** `/dashboard/consultation` — **100% HARDCODED** (4 dummy consultants)

> [!IMPORTANT]
> Halaman konsultasi menampilkan data palsu. Booking system disimulasikan. Admin harus bisa mengelola data konsultan melalui admin panel.

### HARUS DIBUAT: `/admin/consultants`
- [ ] **Consultant List** — semua konsultan terdaftar
- [ ] **Create/Edit Consultant:**
  | Field | Type | Description |
  |-------|------|-------------|
  | name | TEXT | Nama lengkap + gelar |
  | title | TEXT | Jabatan/title (e.g., "Psikolog Klinis") |
  | type | ENUM | Psikolog / Konselor / Mentor |
  | specializations | TEXT[] | Array of specialization tags |
  | rating | DECIMAL | Rating 1-5 |
  | reviews_count | INTEGER | Jumlah review |
  | price | INTEGER | Harga per sesi (Rupiah) |
  | experience_years | INTEGER | Tahun pengalaman |
  | avatar_url | TEXT | URL foto |
  | bio | TEXT | Deskripsi singkat |
  | is_active | BOOLEAN | Status aktif/nonaktif |

- [ ] **Schedule Management** — CRUD jadwal ketersediaan per konsultan
- [ ] **Booking Dashboard** — lihat semua bookings, filter by status/consultant/date
- [ ] **Booking Actions** — approve, reject, reschedule, cancel, complete
- [ ] **Review Management** — lihat rating & feedback dari user
- [ ] **Revenue Tracking** — total pendapatan dari konsultasi

### Supabase Schema
```sql
CREATE TABLE consultants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, title TEXT, type TEXT NOT NULL,
  specializations TEXT[] DEFAULT '{}',
  rating DECIMAL DEFAULT 0, reviews_count INTEGER DEFAULT 0,
  price INTEGER DEFAULT 99000, experience_years INTEGER DEFAULT 0,
  avatar_url TEXT, bio TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE consultant_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES consultants(id) ON DELETE CASCADE,
  day_of_week INTEGER, -- 0=Sunday, 6=Saturday
  start_time TIME, end_time TIME, is_available BOOLEAN DEFAULT true
);

CREATE TABLE consultation_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  consultant_id UUID REFERENCES consultants(id),
  scheduled_date DATE, scheduled_time TIME,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  payment_status TEXT DEFAULT 'unpaid',
  session_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE consultation_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES consultation_bookings(id),
  user_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 10. 🧠 MODUL 9: WELLNESS & MOOD MONITORING (🆕 BELUM ADA untuk admin)

**Status:** ⚠️ Partial — Data wellness sudah tersimpan di Supabase, mood masih mock  
**Supabase Tables:** `wellness_logs` (sudah ada), `mood_entries` (🆕)  
**User Dashboard:** `/dashboard/wellness` (GAD-7 → Supabase), `/dashboard/mood` (100% MOCK)

### HARUS DIBUAT: `/admin/wellness`

#### A. Wellness Overview (Platform-wide)
- [ ] **Aggregate Statistics:**
  - Average GAD-7 score: `SELECT AVG(total_score) FROM wellness_logs`
  - Distribution: Minimal / Ringan / Sedang / Berat
  - Trend chart over time (weekly/monthly)
  - Total check-ins per period
- [ ] **Flagged Users Alert** — Users dengan score ≥ 15 (kecemasan berat)
  - Auto-generate list: `SELECT u.full_name, w.total_score FROM wellness_logs w JOIN users u ON w.user_id = u.id WHERE w.total_score >= 15 ORDER BY w.created_at DESC`
  - One-click action: notify counselor, send support message
- [ ] **Individual User History** — lihat riwayat wellness per user
- [ ] **Wellness Resources Editor** — CRUD rekomendasi/saran yang diberikan setelah asesmen

#### B. Mood Monitoring
- [ ] **Mood Trends** — aggregate daily mood scores across all users
- [ ] **Journal Review** — admin bisa melihat journal entries (dengan privacy control)
- [ ] **Sentiment Analysis Dashboard** — AI-powered mood analysis trends

### Supabase Schema (extend)
```sql
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  mood INTEGER CHECK (mood BETWEEN 1 AND 5),
  note TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  mood INTEGER,
  tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 11. 📁 MODUL 10: PORTFOLIO MANAGEMENT (🆕 BELUM ADA untuk admin)

**Status:** ❌ BELUM DIBUAT untuk admin  
**User Dashboard:** `/dashboard/portfolio` — **100% MOCK DATA** (dummy projects + certificates)

### HARUS DIBUAT: `/admin/portfolios`
- [ ] **Portfolio Overview** — lihat berapa user yang memiliki portfolio
- [ ] **Featured Projects** — curate/pin project terbaik sebagai showcase
- [ ] **Certificate Verification** — verify uploaded certificates (OCR check future)
- [ ] **Portfolio Templates** — CRUD portfolio template layouts
- [ ] **Project Categories** — manage project categories

### Supabase Schema
```sql
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE,
  slug TEXT UNIQUE, bio TEXT, is_public BOOLEAN DEFAULT true,
  template TEXT DEFAULT 'default', created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  title TEXT NOT NULL, description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  image_url TEXT, live_url TEXT, github_url TEXT,
  category TEXT, is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL, issuer TEXT, issue_date DATE,
  skill_tags TEXT[] DEFAULT '{}', image_url TEXT,
  is_verified BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 12. 📝 MODUL 11: CONTENT MANAGEMENT (`/admin/content`)

**File:** `src/app/admin/content/page.tsx`  
**Status:** ✅ Implemented — JSON editor for 4 pages via Supabase `page_contents`

### Halaman yang Dikelola Saat Ini
| Page Key | Nama |
|----------|------|
| `about` | Tentang Kami |
| `features` | Fitur |
| `privacy` | Kebijakan Privasi |
| `terms` | Syarat & Ketentuan |

### ⚡ YANG HARUS DITAMBAHKAN — EDITOR KONTEN WEBSITE LENGKAP

#### A. Landing Page Content Editor (KRITKAL)
Admin HARUS bisa mengedit SEMUA konten homepage tanpa coding:

| Section | Editable Fields |
|---------|----------------|
| **Hero** | Badge text, headline, sub-headline, CTA button text & URL |
| **Value Props** | 3 cards: icon, title, description per card |
| **Cara Kerja** | 4 steps: step number, title, description |
| **Statistics** | 4 counters: number, label (e.g., "1500+ Pengguna Aktif") |
| **Testimonials** | Array: name, role, avatar, rating, quote |
| **CTA Bottom** | Headline, description, button text & URL |
| **Footer** | Links, social media URLs, copyright text |

#### B. Dashboard Content Editor
- [ ] **Roadmap Content** — `/dashboard/roadmap` currently 100% hardcoded. Admin should CRUD roadmap steps
- [ ] **Guide Content** — `/dashboard/guide` is hardcoded. Admin should edit guide sections
- [ ] **Evaluation Templates** — edit evaluation criteria and scoring weights

#### C. Enhanced Editor Features
- [ ] **Visual Form Editor** — upgrade dari raw JSON ke visual form builder
- [ ] **Rich Text / Markdown Editor** — untuk content yang panjang
- [ ] **Image Upload** — inline image upload ke Supabase Storage
- [ ] **SEO Settings per Page** — meta title, meta description, og:image per halaman
- [ ] **Preview Mode** — preview perubahan sebelum publish
- [ ] **Version History** — rollback ke versi sebelumnya
- [ ] **Media Library** — kelola semua uploaded images/assets

#### D. Banner & Announcement System
- [ ] **Create Banner** — tampil di homepage/dashboard sebagai announcement bar
- [ ] **Schedule Banner** — set start/end date untuk banner
- [ ] **Target Audience** — show banner to all users / new users / premium users

---

## 13. 📈 MODUL 12: ANALYTICS & REPORTING (`/admin/analytics`)

**File:** `src/app/admin/analytics/page.tsx`  
**Status:** ⚠️ Partial — API exists tapi **fallback ke MOCK DATA** jika gagal

### Fitur yang Ada
- Stat cards (Total Users, Active Users, Courses Completed, Job Applications)
- Top Career Interests, Most Tracked Skills (bar charts — data only, no real chart library)

### ⚡ OVERHAUL TOTAL — REAL ANALYTICS + REPORTING

#### A. Real-Time Dashboard (Supabase Direct Queries)

| Metrik | Query | Visualization |
|--------|-------|---------------|
| User Growth | `SELECT DATE_TRUNC('day', created_at), COUNT(*) FROM users GROUP BY 1` | Line chart |
| Active Users (DAU/MAU) | Last login within 1/30 days | Gauge + trend |
| Onboarding Funnel | Started vs Completed onboarding | Funnel chart |
| Course Enrollment | `SELECT course_id, COUNT(*) FROM user_courses GROUP BY 1` | Bar chart |
| Course Completion Rate | Completed / Total enrolled | Percentage gauge |
| Job Application Stats | Status distribution across `job_applications` | Doughnut chart |
| Skill Popularity | `SELECT skill_id, COUNT(*) FROM user_skills GROUP BY 1 ORDER BY 2 DESC` | Horizontal bar |
| Wellness Distribution | GAD-7 score categories from `wellness_logs` | Pie chart |
| Revenue | Monthly revenue from `payments` | Line + bar combo |
| Premium Conversion | Premium users / Total users | Percentage |
| Retention Rate | Users active this month who were active last month | Line chart |

#### B. Exportable Reports 📄
- [ ] **User Report** — export semua data user ke CSV/Excel
- [ ] **Engagement Report** — feature usage, session duration, page views
- [ ] **Monthly Summary** — auto-generated monthly report (PDF)
- [ ] **Career Insights** — popular careers, skill gaps, job market trends
- [ ] **Wellness Report** — aggregate mental health statistics
- [ ] **Financial Report** — revenue, subscriptions, consultation income
- [ ] **Custom Report Builder** — select metrics → generate custom report
- [ ] **Schedule Reports** — auto-email weekly/monthly reports ke admin

#### C. Chart Library
- [ ] Implementasi **Recharts** atau **Chart.js** untuk semua visualisasi
- [ ] Date range filter (7d, 30d, 90d, 1y, custom)
- [ ] Compare periods (this month vs last month)

---

## 14. 📨 MODUL 13: MESSAGES (`/admin/messages`)

**File:** `src/app/admin/messages/page.tsx`  
**Status:** ✅ Implemented  
**Supabase Tables:** `contact_messages`

### Fitur yang Ada
- Inbox dengan filter status (Baru/Dibaca/Dibalas/Arsip)
- Detail, update status, reply via mailto

### ⚡ YANG HARUS DITAMBAHKAN
- [ ] **In-app Reply** — balas langsung dari panel, simpan ke `message_replies` table
- [ ] **Template Responses** — pre-defined jawaban untuk FAQ
- [ ] **Email Notification** — auto-notify admin via email saat ada pesan baru
- [ ] **Assign to Admin** — assign pesan ke admin tertentu
- [ ] **Priority Tagging** — tag pesan sebagai urgent/normal/low
- [ ] **Search Messages** — full-text search di subject dan content

---

## 15. 📜 MODUL 14: AUDIT LOGS (`/admin/logs`)

**File:** `src/app/admin/logs/page.tsx`  
**Status:** ✅ Implemented  
**Supabase Tables:** `admin_audit_logs`

### Fitur yang Ada
- Paginated list, action type icons, color-coded actions, admin name, target ID, IP, timestamp

### ⚡ YANG HARUS DITAMBAHKAN
- [ ] **Filter by Action** — CREATE / UPDATE / DELETE
- [ ] **Filter by Admin** — dropdown admin users
- [ ] **Filter by Target Type** — User / Job / Career / Skill / etc
- [ ] **Date Range Filter** — calendar picker
- [ ] **Search** — by target ID or admin name
- [ ] **Log Detail Modal** — show full `details` JSON
- [ ] **Export Logs** — CSV export untuk compliance/audit

---

## 16. ⚙️ MODUL 15: SETTINGS (`/admin/settings`)

**File:** `src/app/admin/settings/page.tsx`  
**Status:** ✅ Implemented  
**Supabase Tables:** `site_settings`

### Settings yang Ada
| Section | Settings |
|---------|----------|
| Umum | `site_name`, `site_description` |
| Keamanan | `maintenance_mode` (toggle), `allow_registration` (toggle) |
| AI Config | `groq_model` (dropdown) |

### ⚡ YANG HARUS DITAMBAHKAN

| Category | Settings |
|----------|----------|
| **Branding** | Logo upload, favicon, brand colors, tagline |
| **Social Media** | Instagram, LinkedIn, Twitter, YouTube URLs |
| **Email** | SMTP config, notification templates, sender name/email |
| **Onboarding** | Toggle onboarding steps, customize questions |
| **Gamification** | XP multiplier, level thresholds, streak config |
| **Premium/Payment** | Midtrans config, pricing, trial period, features gating |
| **AI Configuration** | Groq API key (encrypted), model selection, temperature, system prompts |
| **Notification** | Push notification settings, email frequency |
| **Admin Management** | CRUD admin accounts, permission levels per admin |
| **Backup** | Manual database export, scheduled backups |

---

## 17. 🎮 MODUL 16: GAMIFICATION MANAGEMENT (🆕 BELUM ADA)

**Status:** ❌ BELUM DIBUAT  
**User Dashboard:** Skills page has XP/level system hardcoded, Leaderboard fetches from Supabase

> Masterplan menyebutkan gamification system (XP, Badges, Levels, Streaks). Admin perlu mengelola parameter ini.

### HARUS DIBUAT: `/admin/gamification`

#### A. Badge Management
- [ ] CRUD badges: name, description, icon/image, trigger condition, XP reward, rarity
- [ ] **Trigger Types:** course_complete, streak_days, skills_mastered, jobs_applied, community_posts

#### B. XP Rules Configuration
| Action | Default XP | Admin Editable |
|--------|-----------|----------------|
| Complete onboarding | 100 | ✅ |
| Daily login | 10 | ✅ |
| Complete course | 50-200 | ✅ |
| Add skill | 25 | ✅ |
| Apply to job | 30 | ✅ |
| Wellness check-in | 15 | ✅ |
| Post in community | 20 | ✅ |
| Complete evaluation | 75 | ✅ |

#### C. Level Configuration
- [ ] Define level tiers and XP thresholds
- [ ] Level names (currently hardcoded: Newbie → Learner → Rising Star → ... → Grandmaster)
- [ ] Level rewards/perks

#### D. Leaderboard Settings
- [ ] Toggle public/private leaderboard
- [ ] Reset period (weekly/monthly/never)
- [ ] Privacy settings (show real names vs anonymous)
- [ ] Manual reward — give XP/badge to specific user

### Supabase Schema
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, description TEXT, icon TEXT,
  trigger_type TEXT NOT NULL, trigger_value INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 50, rarity TEXT DEFAULT 'common',
  is_active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE xp_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT UNIQUE NOT NULL,
  xp_amount INTEGER NOT NULL,
  description TEXT, is_active BOOLEAN DEFAULT true
);

CREATE TABLE user_xp_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT, xp_earned INTEGER,
  source_id UUID, source_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 18. 💳 MODUL 17: PREMIUM & PAYMENT MANAGEMENT (🆕 BELUM ADA untuk admin)

**Status:** ❌ Admin view belum ada  
**User Dashboard:** `/dashboard/premium` — Midtrans Snap integration exists

### HARUS DIBUAT: `/admin/premium`
- [ ] **Subscription Overview** — total active subs, revenue, churn rate
- [ ] **Subscriber List** — all premium users, plan type, start/end date, payment status
- [ ] **Payment History** — semua transaksi dari Midtrans
- [ ] **Plan Management** — CRUD subscription plans (pricing, features, duration)
- [ ] **Promo Codes** — create & manage discount codes
- [ ] **Manual Subscription** — grant/revoke premium status manually
- [ ] **Revenue Charts** — MRR, ARR, growth trends
- [ ] **Refund Management** — process refund requests

### Supabase Schema
```sql
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, price INTEGER NOT NULL,
  duration_months INTEGER DEFAULT 1,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'active', -- active, expired, cancelled
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  payment_method TEXT
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded
  midtrans_order_id TEXT,
  midtrans_transaction_id TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER,
  discount_amount INTEGER,
  max_uses INTEGER, used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP, valid_until TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

---

## 19. 🗺️ MODUL 18: ROADMAP & EVALUATION CONTENT (🆕 BELUM ADA)

**Status:** ❌ Admin view belum ada  
**User Dashboard:**  
- `/dashboard/roadmap` — **100% HARDCODED** roadmap steps  
- `/dashboard/evaluation` — **MOCK DATA** evaluation metrics

### HARUS DIBUAT: `/admin/roadmap`
- [ ] **Roadmap Template Editor** — CRUD roadmap steps/milestones
- [ ] **Default Roadmaps** — per career path (e.g., "Data Analyst 6-month roadmap")
- [ ] **Step Configuration** — month, title, description, skills involved, courses recommended
- [ ] **Assign to Career** — link roadmap template ke career path

### Evaluation Admin
- [ ] **Evaluation Criteria** — edit scoring weights and categories
- [ ] **User Evaluation Overview** — aggregate evaluation scores platform-wide
- [ ] **Monthly Report Template** — customize auto-generated monthly evaluation format

---

## 20. 🔐 KEAMANAN & AKSES

### Current Implementation
- Middleware (`src/middleware.ts`) protects `/admin/*` routes
- Role check: only `role = 'admin'` can access
- Admin layout with separate sidebar navigation

### ⚡ SECURITY ENHANCEMENTS

#### A. Multi-level Admin Roles
| Role | Akses |
|------|-------|
| `super_admin` | Akses PENUH ke semua modul tanpa batas |
| `content_admin` | Content, Courses, Community, Roadmap, Landing Page |
| `user_admin` | Users, Messages, Wellness, Consultations |
| `analytics_admin` | Analytics, Logs (READ-ONLY) |
| `finance_admin` | Premium, Payments, Revenue (READ-ONLY + refund) |

#### B. Security Features
- [ ] **2FA for Admin** — two-factor authentication (TOTP) wajib
- [ ] **Session Timeout** — auto-logout setelah 30 menit inaktif (sudah ada `SessionTimeout` component)
- [ ] **IP Whitelist** — optional restriction
- [ ] **Login History** — semua admin login tercatat
- [ ] **Password Policy** — minimum strength requirements
- [ ] **Rate Limiting** — prevent brute force pada admin endpoints

---

## 21. 🏗️ FINAL SIDEBAR NAVIGATION

```
📊 Dashboard           ← overview + stats + quick actions
👥 Users               ← user management + deep profile
💼 Jobs                ← job listings CRUD + applications
🎯 Careers             ← career paths CRUD + skill mapping
⚡ Skills              ← skill database CRUD
📚 Courses             ← 🆕 course/learning CRUD
💬 Community           ← 🆕 post moderation + categories
🧑‍⚕️ Consultants        ← 🆕 consultant CRUD + bookings
🧠 Wellness            ← 🆕 mental health monitoring
📁 Portfolio           ← 🆕 project oversight + certificates
🗺️ Roadmap             ← 🆕 roadmap template editor
🎮 Gamification        ← 🆕 badges/XP/levels/leaderboard
💳 Premium             ← 🆕 subscriptions + payments + promos
📝 Content             ← page content + landing page editor
📈 Analytics           ← reports + charts + export
📨 Messages            ← contact messages inbox
📜 Logs                ← audit trail
⚙️ Settings            ← site configuration + admin management
```

---

## 22. ⚠️ PLACEHOLDER AUDIT LENGKAP — STATUS SEMUA FITUR

### Dashboard User Pages — Koneksi ke Data

| Halaman User | Status Data | Admin Module | Action Required |
|-------------|-------------|--------------|-----------------|
| `/dashboard` (main) | 🟢 Supabase | Dashboard | — |
| `/dashboard/profile` | 🟢 Supabase | Users | — |
| `/dashboard/settings` | 🟢 Supabase | Settings | — |
| `/dashboard/careers` | 🟢 Supabase | Careers ✅ | — |
| `/dashboard/skills` | 🟢 Supabase (user_skills) | Skills ✅ | — |
| `/dashboard/learning` | 🟡 Supabase (tapi table mungkin kosong) | 🆕 Courses | Admin isi courses |
| `/dashboard/wellness` | 🟢 Supabase (wellness_logs) | 🆕 Wellness Monitor | Admin monitoring |
| `/dashboard/leaderboard` | 🟢 Supabase (XP data) | 🆕 Gamification | Admin config |
| `/dashboard/premium` | 🟡 Midtrans (payment simulated) | 🆕 Premium | Admin subscriptions |
| `/dashboard/jobs` | 🔴 **100% MOCK** | Jobs ✅ | ⚡ Sambungkan ke `jobs` table |
| `/dashboard/applications` | 🔴 **100% MOCK** | Jobs | ⚡ Buat `job_applications` table |
| `/dashboard/community` | 🔴 **100% HARDCODED** | 🆕 Community | ⚡ Buat backend + admin |
| `/dashboard/consultation` | 🔴 **100% HARDCODED** | 🆕 Consultants | ⚡ Buat backend + admin |
| `/dashboard/portfolio` | 🔴 **100% MOCK** | 🆕 Portfolio | ⚡ Buat backend + admin |
| `/dashboard/mood` | 🔴 **100% MOCK** | 🆕 Wellness | ⚡ Buat `mood_entries` table |
| `/dashboard/roadmap` | 🔴 **100% HARDCODED** | 🆕 Roadmap | ⚡ Buat backend + admin |
| `/dashboard/evaluation` | 🔴 **MOCK DATA** | 🆕 Roadmap | ⚡ Build real evaluation |
| `/dashboard/guide` | 🟡 Hardcoded (acceptable) | Content | Optional: make editable |

### Landing Page
| Section | Status | Admin Module |
|---------|--------|--------------|
| Hero | 🟡 Hardcoded in JSX | Content → Landing Editor |
| Features / Value Props | 🟡 Hardcoded | Content → Landing Editor |
| How It Works | 🟡 Hardcoded | Content → Landing Editor |
| Stats Counter | 🟡 Hardcoded | Content → Landing Editor |
| Testimonials | 🟡 Hardcoded | Content → Landing Editor |
| CTA | 🟡 Hardcoded | Content → Landing Editor |
| Footer | 🟡 Hardcoded | Content → Landing Editor |

---

## 23. 📋 PRIORITAS IMPLEMENTASI

### 🔴 P0 — Critical (Broken/Placeholder Features)
1. **Fix Dashboard Jobs** — sambungkan `/dashboard/jobs` ke `jobs` table yang sudah ada
2. **Course Management** — buat admin CRUD + isi `courses` → fix `/dashboard/learning`
3. **Community Backend** — buat tables + admin CRUD → fix `/dashboard/community`
4. **Consultant Backend** — buat tables + admin CRUD → fix `/dashboard/consultation`
5. **Portfolio Backend** — buat tables → fix `/dashboard/portfolio`
6. **Mood Backend** — buat `mood_entries` table → fix `/dashboard/mood`
7. **Job Applications** — buat table + connect → fix `/dashboard/applications`

### 🟡 P1 — Important (Feature Enhancement)
8. **Landing Page Content Editor** — admin edit homepage tanpa coding
9. **User Detail View** — deep profile per user
10. **Wellness Monitoring** — admin monitor mental health scores
11. **Real Analytics** — hapus mock, implementasi Recharts + export
12. **Roadmap Editor** — admin manage roadmap templates
13. **Exportable Reports** — CSV/PDF/Excel reports semua modul

### 🟢 P2 — Polish (Nice to Have)
14. **Gamification Management** — badges, XP rules, leaderboard config
15. **Premium Management** — subscriptions, payments, promos
16. **Multi-level Admin Roles** — granular permissions
17. **2FA & Security** — enhanced admin security
18. **Visual Content Editor** — upgrade dari JSON ke form builder
19. **Scheduled Reports** — auto-email weekly/monthly reports
20. **Notification System** — admin in-app + email notifications

---

> **Dokumen ini harus di-update setiap kali modul baru selesai. Tandai checkbox `[x]` untuk item yang sudah selesai.**  
> **Semua data HARUS mengalir ke/dari Supabase PostgreSQL — TIDAK ADA mock data di production.**
