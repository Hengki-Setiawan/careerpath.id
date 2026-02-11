# 🏗️ CareerPath.id — STANDAR FEATURE BLUEPRINT
## Fitur Standar Premium untuk Website Kelas Dunia

> **Status:** Active Directive  
> **Last Updated:** 2026-02-11  
> **Priority:** HIGH — Fitur ini membedakan website biasa dari website profesional  
> **Benchmark:** LinkedIn, Coursera, Glassdoor, Calm, MyAnimeList

---

## RINGKASAN

Dokumen ini berisi **semua fitur standar** yang wajib ada di website modern tingkat profesional. Fitur-fitur ini **melengkapi** fitur bisnis utama (Career & AI) yang ada di `masterplan.md` dan `plan.md`. Implementasi fitur-fitur ini akan membuat CareerPath.id **setara atau lebih baik** dari kompetitor.

---

## 1. 🛡️ SECURITY & AUTHENTICATION

### 1.1 Authentication System

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Email/Password Login | ✅ Ada | Supabase Auth |
| Email Verification | ✅ Ada | Configurable on/off |
| Password Reset | ✅ Ada | Via Supabase email |
| Social Login (Google) | 🔲 Belum | One-click login dengan Google OAuth |
| Social Login (GitHub) | 🔲 Belum | Populer untuk tech users |
| Magic Link Login | 🔲 Belum | Passwordless login via email link |
| MFA / 2FA (Admin) | 🔲 Belum | TOTP authenticator wajib untuk admin |
| Remember Me | 🔲 Belum | Extended session dengan "Ingat Saya" checkbox |
| Account Lockout | 🔲 Belum | Lock akun setelah 5x gagal login (30 menit) |

### 1.2 Session Management

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Session Timeout | ✅ Ada | Auto-logout 30 menit inaktif (`SessionTimeout` component) |
| Active Sessions View | 🔲 Belum | User bisa lihat semua device yang login |
| Logout All Devices | 🔲 Belum | One-click logout dari semua device |
| Login History | 🔲 Belum | Log: IP, device, browser, waktu, lokasi |

### 1.3 Infrastructure Security

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| HTTPS Enforcement | ✅ Ada | HSTS header di `next.config.ts` |
| Content Security Policy | ✅ Ada | CSP header configured |
| X-Frame-Options | ✅ Ada | DENY — mencegah clickjacking |
| XSS Protection | ✅ Ada | X-XSS-Protection header |
| Rate Limiting | 🔲 Belum | Mencegah brute force & API abuse (Upstash/Vercel) |
| DDOS Protection | 🔲 Belum | Vercel/Cloudflare edge protection |
| CORS Configuration | 🔲 Belum | Whitelist domain yang diizinkan |
| Input Sanitization | ⚠️ Partial | Perlu Zod validation di semua form |
| SQL Injection Prevention | ✅ Ada | Supabase parameterized queries |
| Dependency Scanning | 🔲 Belum | Automated `npm audit` di CI/CD |
| Secret Management | ✅ Ada | Environment variables (.env) |

### 1.4 Data Protection & Encryption

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Password Hashing | ✅ Ada | Supabase Auth (bcrypt) |
| Data at Rest Encryption | ✅ Ada | Supabase PostgreSQL encryption |
| Data in Transit (TLS) | ✅ Ada | HTTPS everywhere |
| PII Masking | 🔲 Belum | Mask sensitive data di logs & admin views |
| Backup & Recovery | 🔲 Belum | Automated daily database backups |
| API Key Rotation | 🔲 Belum | Periodic rotation of Groq/Supabase keys |

---

## 2. 📧 COMMUNICATION & NOTIFICATION SYSTEM

### 2.1 In-App Notification Center

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Bell Icon + Badge | ✅ Ada | `NotificationCenter` component di dashboard header |
| Real-time Notifications | ⚠️ Partial | Perlu Supabase Realtime subscription |
| Mark as Read | 🔲 Belum | Individual & bulk mark as read |
| Notification Preferences | 🔲 Belum | User pilih notifikasi apa yang mau mereka terima |
| Notification History | 🔲 Belum | Lihat semua notifikasi lama |

**Trigger Notifications yang HARUS ada:**
| Event | Notification |
|-------|-------------|
| New job matches user skills | "Ada 3 lowongan baru yang cocok untukmu!" |
| Course recommendation | "Kursus baru: React Advanced — cocok untuk roadmap-mu" |
| Wellness check reminder | "Sudah waktunya wellness check mingguan 🧠" |
| Monthly evaluation ready | "Evaluasi bulan Februari sudah tersedia" |
| Streak milestone | "🔥 7 hari streak! +50 XP" |
| Badge earned | "🏆 Badge baru: First Course Completed!" |
| Consultation reminder | "Konsultasi dengan Dr. Ahmad besok jam 10:00" |
| Community reply | "Seseorang membalas postmu di Community" |
| Application status change | "Update: Lamaranmu di Telkom sedang di-review" |
| System announcement | Admin-triggered broadcast |

### 2.2 Email System (Transactional)

| Email Type | Status | Trigger |
|------------|--------|---------|
| Welcome Email | 🔲 Belum | Setelah register + verifikasi |
| Password Reset | ✅ Ada | Via Supabase Auth |
| Account Verification | ✅ Ada | Via Supabase Auth |
| Monthly Progress Report | 🔲 Belum | Auto-generate & kirim setiap tanggal 1 |
| Consultation Reminder | 🔲 Belum | H-1 & H-1jam sebelum sesi |
| Application Status Update | 🔲 Belum | Saat status lamaran berubah |
| Dormant User Re-engagement | 🔲 Belum | Kirim setelah 7 hari tidak login |
| Achievement Notification | 🔲 Belum | Badge baru, level up, target tercapai |
| Newsletter / Updates | 🔲 Belum | Weekly/monthly career tips (opt-in) |

**Tech Stack:** Resend, SendGrid, atau Supabase Edge Functions + SMTP

### 2.3 Push Notifications (PWA)

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Web Push Subscription | 🔲 Belum | Browser push notification permission |
| Push for Reminders | 🔲 Belum | Wellness check, consultation, streak |
| Push for Updates | 🔲 Belum | New job, course recommendation |

---

## 3. 🔍 SEARCH & DISCOVERY

### 3.1 Global Search

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Search Bar di Dashboard | ✅ Ada | Di header dashboard layout |
| Multi-entity Search | ⚠️ Partial | Search harus mencakup: careers, jobs, courses, skills, community posts |
| Search Suggestions | 🔲 Belum | Auto-complete saat mengetik |
| Recent Searches | 🔲 Belum | History pencarian user |
| Search Results Page | 🔲 Belum | Dedicated page dengan filter & category tabs |
| Fuzzy Search | 🔲 Belum | Toleransi typo ("progrming" → "programming") |

### 3.2 Smart Filtering & Sorting

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Multi-filter Combination | ⚠️ Partial | Combine filters (category + level + salary) |
| Saved Filters | 🔲 Belum | User simpan filter favorit |
| Sort Options | ⚠️ Partial | Sort by: relevance, date, salary, match score |

### 3.3 Personalized Feed / Recommendations

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| "For You" Dashboard | 🔲 Belum | AI-curated recommendations based on user profile |
| "Trending" Section | 🔲 Belum | Popular careers/skills/courses among peers |
| "Similar To" Suggestions | 🔲 Belum | "Karena kamu suka Data Analyst, kamu mungkin juga suka..." |

---

## 4. 👤 USER PROFILE & PERSONALIZATION

### 4.1 Profile System

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Basic Profile | ✅ Ada | Name, email, university, major, avatar |
| Profile Completion Meter | 🔲 Belum | "Profilmu 60% lengkap — tambahkan skill!" |
| Public Profile Page | ✅ Ada | `/portfolio/[username]` |
| Profile Sharing | 🔲 Belum | Shareable link + QR code untuk portfolio |
| Avatar Upload | ⚠️ Partial | Perlu Supabase Storage integration |
| Profile Banner/Cover | 🔲 Belum | Customizable header banner |

### 4.2 User Preferences

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Theme Selection | 🔲 Belum | Light / Dark / System mode |
| Language Selection | 🔲 Belum | Bahasa Indonesia / English toggle |
| Notification Preferences | 🔲 Belum | Granular on/off per notification type |
| Dashboard Layout | 🔲 Belum | Customizable widget arrangement |
| Email Frequency | 🔲 Belum | Daily digest / weekly / individual |
| Privacy Settings | 🔲 Belum | Profile visibility: public / friends / private |

### 4.3 Dark Mode 🌙

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Dark Mode Toggle | 🔲 Belum | Switch di header atau settings |
| System Preference Detection | 🔲 Belum | Auto-detect OS dark mode |
| Persistent Preference | 🔲 Belum | Simpan pilihan di localStorage + Supabase |
| Per-page Styles | 🔲 Belum | Semua halaman harus support dark mode |

> [!TIP]
> Dark mode adalah fitur yang sangat diinginkan oleh Gen Z users. Implementasi ini akan langsung meningkatkan perceived quality website.

---

## 5. 📱 RESPONSIVE & CROSS-PLATFORM

### 5.1 Mobile Experience

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Mobile Responsive | ✅ Ada | Tailwind responsive classes |
| Touch-friendly UI | ⚠️ Partial | Minimum 44px tap targets |
| Swipe Gestures | 🔲 Belum | Swipe sidebar, swipe cards |
| Pull-to-Refresh | 🔲 Belum | Native-like refresh pattern |
| Bottom Navigation (Mobile) | 🔲 Belum | Fixed bottom nav bar di mobile |
| Offline Mode | 🔲 Belum | Basic offline support via Service Worker |

### 5.2 Progressive Web App (PWA)

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Web App Manifest | 🔲 Belum | Installable di home screen |
| App Icons (192/512) | 🔲 Belum | PWA icons |
| Splash Screen | 🔲 Belum | Loading screen saat buka PWA |
| Service Worker | 🔲 Belum | Asset caching, offline fallback |
| Install Prompt | 🔲 Belum | "Tambahkan ke Home Screen" banner |

### 5.3 Cross-Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome (Desktop/Mobile) | ✅ Full |
| Firefox | ✅ Full |
| Safari (iOS/macOS) | ⚠️ Test needed |
| Edge | ✅ Full |
| Samsung Internet | ⚠️ Test needed |

---

## 6. 📊 ANALYTICS, TRACKING & INSIGHTS

### 6.1 Web Analytics

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Vercel Web Analytics | 🔲 Belum | Page views, unique visitors, bounce rate |
| Vercel Speed Insights | 🔲 Belum | Core Web Vitals monitoring |
| Google Analytics 4 | 🔲 Belum | Advanced user behavior tracking |
| Event Tracking | 🔲 Belum | Button clicks, form submissions, page scroll |
| Conversion Funnel | 🔲 Belum | Register → Onboarding → Active → Premium |
| UTM Tracking | 🔲 Belum | Campaign tracking via URL parameters |

### 6.2 User Behavior Analytics

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Feature Usage Tracking | 🔲 Belum | Which features are most/least used |
| Session Duration | 🔲 Belum | Average time on each page |
| User Flow Tracking | 🔲 Belum | Path analysis: where users navigate |
| Drop-off Points | 🔲 Belum | Where users abandon (onboarding, payment) |
| A/B Testing Framework | 🔲 Belum | Test UI variants untuk conversion optimization |
| Heatmaps | 🔲 Belum | Click/scroll heatmaps (Hotjar/PostHog) |

### 6.3 Error Monitoring

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Error Tracking (Sentry) | 🔲 Belum | Catch & report JS errors automatically |
| Error Boundary Components | ✅ Ada | `error.tsx` exists |
| API Error Logging | 🔲 Belum | Log all API failures with context |
| Uptime Monitoring | 🔲 Belum | Alert when website goes down (UptimeRobot) |
| Health Check Endpoint | 🔲 Belum | `/api/health` endpoint for monitoring |

---

## 7. 🎮 GAMIFICATION & ENGAGEMENT

### 7.1 XP & Level System

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| XP Earning | ✅ Ada | XP from skills tracking |
| Level System | ✅ Ada | Hardcoded level tiers |
| XP Leaderboard | ✅ Ada | `/dashboard/leaderboard` |
| XP Notifications | 🔲 Belum | "+25 XP!" toast saat earning |
| Level Up Animation | 🔲 Belum | Special confetti/animation saat naik level |
| XP Multiplier Events | 🔲 Belum | "Double XP Weekend!" events |

### 7.2 Achievement & Badge System

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Badge Collection | 🔲 Belum | Earned badges displayed on profile |
| Achievement Unlocks | 🔲 Belum | "First Course Completed", "Streak Master", etc |
| Progress Toward Badges | 🔲 Belum | "3/5 courses completed for next badge" |
| Rare Badge System | 🔲 Belum | Common → Rare → Epic → Legendary rarity tiers |
| Badge Showcase | 🔲 Belum | User picks 3 badges to display prominently |

### 7.3 Streak & Habit Building

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Daily Login Streak | 🔲 Belum | "🔥 7 hari berturut-turut!" counter |
| Streak Freeze | 🔲 Belum | 1 skip per minggu tanpa reset streak |
| Weekly Goals | 🔲 Belum | "Selesaikan 3 aktivitas minggu ini" |
| Streak Calendar | 🔲 Belum | GitHub-style contribution calendar/heatmap |
| Streak Rewards | 🔲 Belum | Bonus XP setiap milestone (7d, 30d, 100d) |

### 7.4 Social & Competition

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Challenge System | 🔲 Belum | "Challenge teman: siapa duluan selesai course?" |
| Study Groups | 🔲 Belum | Create groups untuk belajar bareng |
| Peer Comparison | 🔲 Belum | "Kamu di atas 80% mahasiswa se-jurusan" |
| Referral Program | 🔲 Belum | Invite friend → both get XP bonus |

---

## 8. 💬 FEEDBACK & SUPPORT SYSTEM

### 8.1 User Feedback

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Contact Form | ✅ Ada | `/contact` page |
| In-app Feedback Widget | 🔲 Belum | "Kirim Masukan" floating button |
| Feature Request Board | 🔲 Belum | Users bisa vote fitur yang mereka mau |
| NPS Survey | 🔲 Belum | "Seberapa mungkin kamu merekomendasikan?" (0-10) |
| Post-interaction Rating | 🔲 Belum | Rate setelah konsultasi, course, dll |
| Bug Report Form | 🔲 Belum | Structured bug report with screenshot upload |

### 8.2 Help & Support

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Guide Page | ✅ Ada | `/dashboard/guide` |
| FAQ Page | ✅ Ada | `/faq` |
| WhatsApp Support | ✅ Ada | `FloatingWhatsApp` component |
| AI Chatbot (Support) | ✅ Ada | `AIChat` component |
| Knowledge Base | 🔲 Belum | Searchable help articles |
| Video Tutorials | 🔲 Belum | Embedded tutorial videos per fitur |
| Tooltip Onboarding | 🔲 Belum | Interactive tooltips saat user pertama kali buka fitur |
| Status Page | 🔲 Belum | Public page showing system status (up/down) |

---

## 9. ⚖️ LEGAL, PRIVACY & COMPLIANCE

### 9.1 Legal Pages

| Page | Status | Deskripsi |
|------|--------|-----------|
| Privacy Policy | ✅ Ada | `/privacy` |
| Terms of Service | ✅ Ada | `/terms` |
| Cookie Policy | 🔲 Belum | Dedicated cookie usage page |
| Disclaimer | 🔲 Belum | AI recommendations disclaimer |
| Refund Policy | 🔲 Belum | Untuk premium subscriptions |

### 9.2 User Data Rights (GDPR/UU PDP Compliance)

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Data Export | ✅ Ada | `/api/user/export` — download semua data sebagai JSON |
| Account Deletion | ✅ Ada | `/api/user/delete` — cascade delete semua data |
| Consent Management | 🔲 Belum | Granular consent: analytics, marketing, AI processing |
| Data Retention Policy | 🔲 Belum | Auto-delete inactive accounts setelah 2 tahun |
| Cookie Consent Banner | ✅ Ada | `CookieConsent` component — banner bottom page |

### 9.3 AI Ethics & Transparency

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| AI Disclaimer | 🔲 Belum | "Rekomendasi AI bersifat saran, bukan keputusan final" |
| AI Confidence Score | 🔲 Belum | Show confidence % pada rekomendasi AI |
| Human Override | 🔲 Belum | User bisa "Tidak setuju" dengan rekomendasi AI |
| AI Explanation | 🔲 Belum | "Alasan kami merekomendasikan ini: ..." |
| Bias Monitoring | 🔲 Belum | Monitor dan mitigasi bias di AI recommendations |

---

## 10. 🔄 CI/CD, DEVOPS & RELIABILITY

### 10.1 Deployment Pipeline

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Auto Deploy (Vercel) | ✅ Ada | Push to main → auto deploy |
| Preview Deployments | ✅ Ada | Vercel preview per PR |
| Environment Variables | ✅ Ada | Separate dev/staging/prod env vars |
| Build Notifications | 🔲 Belum | Slack/email alert on deploy success/failure |
| Rollback Capability | ✅ Ada | Vercel instant rollback |

### 10.2 Code Quality

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| ESLint | ✅ Ada | Configured |
| TypeScript Strict | ✅ Ada | Type safety enforcement |
| Automated Tests (E2E) | ✅ Ada | Playwright test suite |
| Unit Tests | 🔲 Belum | Jest/Vitest untuk utility functions |
| Code Coverage Report | 🔲 Belum | Minimum 70% coverage target |
| Pre-commit Hooks | 🔲 Belum | Husky + lint-staged: lint before commit |
| Conventional Commits | 🔲 Belum | Standardized commit messages |

### 10.3 Database Management

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Schema Migrations | 🔲 Belum | Version-controlled database schema changes |
| Seed Data | 🔲 Belum | Script untuk populate initial data |
| Automated Backups | 🔲 Belum | Daily automatic database backups |
| Point-in-time Recovery | 🔲 Belum | Supabase PITR (Pro plan) |
| Database Monitoring | 🔲 Belum | Query performance, slow query alerts |

---

## 11. 🌍 INTERNATIONALIZATION (i18n) & LOCALIZATION

### 11.1 Multi-language Support

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Bahasa Indonesia | ✅ Ada | Bahasa utama |
| English Support | 🔲 Belum | Toggle bahasa di header/settings |
| RTL Support | 🔲 Belum | Untuk ekspansi ke pasar Arab (future) |
| i18n Framework | 🔲 Belum | `next-intl` atau `next-i18next` integration |
| Content Translation | 🔲 Belum | Admin bisa input konten multi-bahasa |

### 11.2 Localization

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Date Format (ID) | ⚠️ Partial | "1 Januari 2026" format Indonesia |
| Currency Format | ⚠️ Partial | "Rp 5.000.000" formatting |
| Timezone Handling | 🔲 Belum | Auto-detect user timezone (WIB/WITA/WIT) |
| Local Job Market Data | ✅ Ada | Makassar-focused (expandable) |

---

## 12. 🎨 CONTENT MANAGEMENT SYSTEM (CMS)

### 12.1 Admin Content Editor

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Page Content Editor | ✅ Ada | `/admin/content` — JSON editor for 4 pages |
| Landing Page Editor | 🔲 Belum | Visual editor untuk semua section homepage |
| Rich Text Editor | 🔲 Belum | WYSIWYG (TipTap/Quill) untuk content panjang |
| Media Library | 🔲 Belum | Upload & manage images/files (Supabase Storage) |
| Blog/Article System | 🔲 Belum | Full blog engine dengan categories, tags, SEO |
| Version History | 🔲 Belum | Rollback ke versi konten sebelumnya |
| Draft/Publish Workflow | 🔲 Belum | Save as draft → preview → publish |
| Scheduled Publishing | 🔲 Belum | Schedule content to go live at specific time |

### 12.2 Dynamic Content

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Banner/Announcement System | 🔲 Belum | Dismissable banner di top of page |
| Testimonials Management | 🔲 Belum | CRUD testimonials shown on landing page |
| FAQ Management | 🔲 Belum | Admin CRUD FAQ entries |
| Changelog/Updates Page | 🔲 Belum | "What's New" page showing recent updates |
| Feature Flags | 🔲 Belum | Toggle features on/off tanpa deploy (Vercel Edge Config) |

---

## 13. 💳 PAYMENT & MONETIZATION

### 13.1 Payment System

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Midtrans Integration | ✅ Ada | Snap payment popup |
| Multiple Payment Methods | 🔲 Belum | Bank transfer, e-wallet (GoPay, OVO, DANA), QRIS, CC |
| Payment Success/Fail Pages | 🔲 Belum | Dedicated callback pages |
| Invoice Generation | 🔲 Belum | Auto-generate invoice PDF per payment |
| Receipt Email | 🔲 Belum | Auto-send receipt after successful payment |
| Refund Processing | 🔲 Belum | Admin-initiated refund workflow |

### 13.2 Subscription Management

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Plan Comparison Page | ✅ Ada | `/dashboard/premium` |
| Auto-renewal | 🔲 Belum | Automatic monthly/yearly renewal |
| Cancel Subscription | 🔲 Belum | Self-service cancellation flow |
| Downgrade/Upgrade | 🔲 Belum | Switch between plan tiers |
| Grace Period | 🔲 Belum | 3-day grace period after expiry |
| Promo Codes | 🔲 Belum | Admin-created discount codes |
| Trial Period | 🔲 Belum | 7-day free trial untuk premium |

### 13.3 Feature Gating

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Free vs Premium Features | 🔲 Belum | Clear feature limits per tier |
| Usage Limits (Free) | 🔲 Belum | e.g., 3 AI chats/day, 5 job applications/month |
| Upgrade Prompts | 🔲 Belum | Contextual "Upgrade to Premium" saat hit limit |
| Soft Paywall | 🔲 Belum | Blur/lock premium content with upgrade CTA |

---

## 14. 📤 EXPORT, SHARING & INTEGRATIONS

### 14.1 Data Export

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Portfolio Export (PDF) | 🔲 Belum | Download portfolio sebagai PDF yang cantik |
| Resume/CV Generator | 🔲 Belum | AI-generated CV berdasarkan profil & skills |
| Evaluation Report (PDF) | 🔲 Belum | Monthly evaluation as downloadable PDF |
| Skills Certificate | 🔲 Belum | Generate certificate saat skill reach Expert level |
| Progress Report | 🔲 Belum | Share progress report ke dosen/mentor |

### 14.2 Social Sharing

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Share Portfolio Link | 🔲 Belum | Clean shareable URL |
| Open Graph Meta Tags | ⚠️ Partial | OG image, title, description per page |
| Share to LinkedIn | 🔲 Belum | "Share ke LinkedIn" button untuk achievements |
| Share to WhatsApp | 🔲 Belum | "Bagikan ke WhatsApp" untuk job listings |
| QR Code Generator | 🔲 Belum | QR code untuk portfolio/profile sharing |
| Embeddable Badge | 🔲 Belum | "Powered by CareerPath.id" badge untuk portfolio |

### 14.3 Third-party Integrations

| Integration | Status | Deskripsi |
|-------------|--------|-----------|
| Google Calendar | 🔲 Belum | Sync consultation schedules |
| LinkedIn Profile Import | 🔲 Belum | Import profile data dari LinkedIn |
| GitHub Stats | 🔲 Belum | Show GitHub contribution stats di portfolio |
| Notion Export | 🔲 Belum | Export roadmap/notes ke Notion |
| Slack Notifications | 🔲 Belum | Admin notifications via Slack webhook |

---

## 15. ♿ ACCESSIBILITY (A11y)

### 15.1 WCAG 2.1 Compliance

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Color Contrast (4.5:1) | ⚠️ Partial | Perlu audit semua halaman |
| Alt Text on Images | ⚠️ Partial | Missing di beberapa tempat |
| ARIA Labels | ⚠️ Partial | Perlu ditambahkan ke semua interactive elements |
| Keyboard Navigation | ⚠️ Partial | Tab order perlu diverifikasi |
| Skip to Content Link | 🔲 Belum | Skip navigation langsung ke konten |
| Focus Indicators | ⚠️ Partial | Visible focus rings di semua elements |
| Screen Reader Support | 🔲 Belum | Test dengan NVDA/VoiceOver |
| Reduced Motion | 🔲 Belum | `prefers-reduced-motion` media query |
| Text Resizing | 🔲 Belum | Support browser zoom tanpa breaking layout |
| Form Error Announcements | 🔲 Belum | Aria-live for error messages |

---

## 16. 🚀 ADVANCED FEATURES (DIFFERENTIATORS)

> [!IMPORTANT]
> Fitur-fitur berikut ini akan membuat CareerPath.id **berbeda dari kompetitor** dan memberikan pengalaman yang unik.

### 16.1 AI-Powered Features (Beyond Basic)

| Fitur | Impact | Deskripsi |
|-------|--------|-----------|
| AI Career Coach Chat | 🔥 High | Real-time AI career advisor yang ingat konteks user |
| AI Resume Review | 🔥 High | Upload CV → AI memberikan review & improvement tips |
| AI Interview Prep | 🔥 High | Practice interview dengan AI interviewer + feedback |
| AI Skill Assessment | 🔥 High | AI-generated quiz untuk mengukur skill level |
| AI Weekly Digest | 🟡 Medium | AI-curated weekly email berdasarkan aktivitas user |
| AI Content Writer | 🟡 Medium | AI bantu tulis bio, cover letter, project descriptions |
| Smart Scheduling | 🟡 Medium | AI suggest optimal study time berdasarkan mood patterns |

### 16.2 Collaboration Features

| Fitur | Impact | Deskripsi |
|-------|--------|-----------|
| Study Buddy Matching | 🔥 High | AI match users dengan skill/career interest sama |
| Group Study Rooms | 🟡 Medium | Virtual rooms untuk belajar bareng (text chat) |
| Peer Code Review | 🟡 Medium | Submit project → peer memberikan feedback |
| Mentor-Mentee Pairing | 🔥 High | Senior mahasiswa bimbing junior (with XP reward) |

### 16.3 Career Intelligence

| Fitur | Impact | Deskripsi |
|-------|--------|-----------|
| Salary Calculator | 🔥 High | Estimasi gaji berdasarkan skill, experience, lokasi |
| Job Market Trends | 🔥 High | Real-time data: skill demand naik/turun |
| Company Reviews | 🟡 Medium | User review perusahaan (anonim) |
| Career Transition Map | 🔥 High | Visual: "Dari A kamu bisa pindah ke B, C, atau D" |
| Industry Report | 🟡 Medium | AI-generated quarterly industry insights |

### 16.4 Micro-learning & Quick Actions

| Fitur | Impact | Deskripsi |
|-------|--------|-----------|
| Daily Challenges | 🔥 High | "Tantangan Hari Ini: Selesaikan quiz Python" (+XP) |
| Flashcard System | 🟡 Medium | Quick review cards untuk skill concepts |
| 5-min Lessons | 🔥 High | Bite-sized lessons yang bisa selesai dalam 5 menit |
| Skill Tree Visualization | 🔥 High | Visual "skill tree" seperti game RPG |
| Progress Milestones | 🟡 Medium | Celebrate: "100 hari di CareerPath!" |

### 16.5 B2B University Features

| Fitur | Impact | Deskripsi |
|-------|--------|-----------|
| University Dashboard | 🔥 High | Dosen/kampus monitor progress mahasiswa |
| Bulk Student Import | 🔥 High | Upload Excel → auto-create student accounts |
| Class Tracking | 🟡 Medium | Track progress per kelas/jurusan |
| Career Placement Rate | 🔥 High | Report: berapa % mahasiswa yang dapat kerja |
| Custom Branding | 🟡 Medium | University logo + colors di student interface |

---

## 17. 📋 IMPLEMENTASI — PRIORITY MATRIX

### 🔴 P0 — Foundation (HARUS ada sebelum production)
1. - [ ] Social Login (Google OAuth) — reduce friction
2. - [ ] Cookie Consent Banner — legal compliance (UU PDP)
3. - [ ] Data Export + Account Deletion — user rights
4. - [ ] Input Validation (Zod) di semua forms
5. - [ ] Rate Limiting pada API routes
6. - [ ] Error Tracking (Sentry) integration
7. - [ ] Health Check endpoint (`/api/health`)

### 🟡 P1 — Polish (meningkatkan quality secara signifikan)
8. - [ ] Dark Mode toggle
9. - [ ] In-app Notification triggers (job match, streak, etc)
10. - [ ] Transactional Emails (welcome, monthly report)
11. - [ ] Profile Completion Meter
12. - [ ] Daily Login Streak + streak calendar
13. - [ ] Badge System with achievements
14. - [ ] AI Confidence Score + disclaimer
15. - [ ] Vercel Analytics + SpeedInsights

### 🟢 P2 — Differentiation (membuat LEBIH BAIK dari kompetitor)
16. - [ ] AI Resume Review
17. - [ ] AI Interview Prep
18. - [ ] Study Buddy Matching
19. - [ ] Salary Calculator
20. - [ ] Career Transition Map
21. - [ ] Daily Challenges + 5-min lessons
22. - [ ] Skill Tree Visualization
23. - [ ] CV/Portfolio PDF export

### 🔵 P3 — Growth (untuk scaling)
24. - [ ] Multi-language (English)
25. - [ ] B2B University Dashboard
26. - [ ] Referral Program
27. - [ ] Google Calendar integration
28. - [ ] LinkedIn Integration
29. - [ ] NPS Survey
30. - [ ] A/B Testing framework

---

## 18. 📊 KOMPETITOR BENCHMARK

| Fitur | CareerPath.id | LinkedIn | Coursera | Glassdoor | Calm |
|-------|:---:|:---:|:---:|:---:|:---:|
| AI Career Recommendation | ✅ | ❌ | ❌ | ❌ | ❌ |
| Skill Tracking + XP | ✅ | ❌ | ⚠️ | ❌ | ❌ |
| Mental Health Integration | ✅ | ❌ | ❌ | ❌ | ✅ |
| Community Forum | ✅ | ✅ | ⚠️ | ✅ | ❌ |
| Job Matching | ✅ | ✅ | ❌ | ✅ | ❌ |
| Gamification (Badges/XP) | ✅ | ❌ | ⚠️ | ❌ | ⚠️ |
| Consultation Booking | ✅ | ❌ | ❌ | ❌ | ✅ |
| University B2B | 🔲 | ✅ | ✅ | ❌ | ❌ |
| Dark Mode | 🔲 | ✅ | ✅ | ✅ | ✅ |
| PWA / Installable | 🔲 | ✅ | ❌ | ❌ | ✅ |
| AI Resume Review | 🔲 | ✅ | ❌ | ❌ | ❌ |
| Localized (Indonesia) | ✅ | ⚠️ | ⚠️ | ❌ | ❌ |

> **Unique Value Proposition:** CareerPath.id adalah satu-satunya platform yang menggabungkan **AI career guidance + mental health monitoring + gamification + local job market** dalam satu tempat, khusus untuk Gen Z Indonesia.

---

> **Dokumen ini harus di-update setiap kali fitur baru selesai diimplementasikan.**  
> **Ubah status dari 🔲 → ⚠️ (partial) → ✅ (done) sesuai progress.**  
> **Review per sprint untuk memastikan prioritas tetap relevan.**
