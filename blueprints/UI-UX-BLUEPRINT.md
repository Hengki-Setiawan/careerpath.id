# 🎨 CareerPath.id — UI/UX BLUEPRINT
## Comprehensive Design System & Interface Guidelines

> **Status:** Active Directive  
> **Last Updated:** 2026-02-11  
> **Theme:** Indigo-Cyan Glassmorphism + Premium Modern  
> **Priority:** CRITICAL — Semua halaman HARUS mengikuti blueprint ini untuk konsistensi visual.

---

## 1. 🎨 DESIGN SYSTEM

### 1.1 Color Palette

#### Primary Theme (Indigo-Cyan)
Warna utama untuk brand identity, active states, dan accent highlights.

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `hsl(221.2 83.2% 53.3%)` — Indigo Blue | Buttons, links, active nav |
| `--primary-hover` | `hsl(221.2 83.2% 45%)` | Button hover states |
| `--secondary` | `hsl(199 89% 48%)` — Cyan/Sky Blue | Gradient endpoints, badges |
| `--accent` | `hsl(210 40% 96.1%)` | Light backgrounds, hover states |

#### Neutral Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `hsl(0 0% 100%)` — White | Page background (light mode) |
| `--foreground` | `hsl(222.2 84% 4.9%)` — Dark Navy | Primary text |
| `--muted` | `hsl(210 40% 96.1%)` | Disabled, placeholder areas |
| `--muted-foreground` | `hsl(215.4 16.3% 46.9%)` | Secondary text, captions |
| `--border` | `hsl(214.3 31.8% 91.4%)` | Card borders, dividers |
| `--card` | `hsl(0 0% 100%)` | Card backgrounds |

#### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--destructive` | `hsl(0 84.2% 60.2%)` — Red | Delete, error states |
| `--success` | `hsl(142 76% 36%)` — Green | Success, completed |
| `--warning` | `hsl(38 92% 50%)` — Amber | Warnings, pending |
| `--info` | `hsl(199 89% 48%)` — Cyan | Information badges |

#### Gradient Presets
| Name | Value | Usage |
|------|-------|-------|
| `gradient-primary` | `from-violet-600 to-indigo-600` | Primary buttons, hero headers |
| `gradient-hero` | `from-indigo-600 via-purple-600 to-cyan-600` | Landing page hero, stat bars |
| `gradient-card` | `from-indigo-50 to-cyan-50` | Card backgrounds, highlights |
| `gradient-dark` | `from-gray-900 via-gray-800 to-gray-900` | Admin panel, dark sections |
| `gradient-skill` | `from-indigo-500 to-purple-500` | Skill progress bars |
| `gradient-xp` | `from-amber-300 to-orange-400` | XP bars, gamification |
| `gradient-wellness` | `from-emerald-500 to-teal-500` | Wellness/health indicators |

#### Proficiency Level Colors (Skills)
| Level | Style |
|-------|-------|
| Beginner | `bg-blue-50 text-blue-700 border-blue-200` |
| Intermediate | `bg-amber-50 text-amber-700 border-amber-200` |
| Advanced | `bg-purple-50 text-purple-700 border-purple-200` |
| Expert | `bg-emerald-50 text-emerald-700 border-emerald-200` |

#### Status Colors (Applications/Jobs)
| Status | Style |
|--------|-------|
| Applied | `bg-blue-50 text-blue-700 border-blue-200` |
| Reviewing | `bg-amber-50 text-amber-700 border-amber-200` |
| Interview | `bg-purple-50 text-purple-700 border-purple-200` |
| Offered | `bg-emerald-50 text-emerald-700 border-emerald-200` |
| Rejected | `bg-red-50 text-red-700 border-red-200` |

---

### 1.2 Typography

#### Font Family
| Type | Font | Fallback |
|------|------|----------|
| Sans Serif | `Geist Sans` | system-ui, -apple-system |
| Monospace | `Geist Mono` | monospace |

#### Hierarchy

| Element | Weight | Tracking | Line Height | Size Range | Usage |
|---------|--------|----------|-------------|------------|-------|
| H1 | Bold (700) | Tight (-0.025em) | 1.1 | 2xl–4xl | Page titles, hero headings |
| H2 | Semibold (600) | Normal | 1.3 | xl–2xl | Section headers |
| H3 | Semibold (600) | Normal | 1.4 | lg–xl | Card titles, subsection |
| Body | Regular (400) | Normal | 1.6 (relaxed) | sm–base | Paragraph text |
| Caption | Medium (500) | Normal | 1.4 | xs–sm | Labels, timestamps, badges |
| Stat Number | Black (900) | Tight | 1.0 | 2xl–4xl | Dashboard stat numbers |

---

### 1.3 Effects & Utilities

#### Glassmorphism
```css
/* Light Glass */
.glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.2); }

/* Dark Glass */
.glass-dark { background: rgba(17,24,39,0.8); backdrop-filter: blur(12px); border: 1px solid rgba(75,85,99,0.5); }

/* XP Panel Glass */
.glass-xp { background: rgba(0,0,0,0.2); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1); }
```

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards at rest |
| `shadow-card` | `0 4px 6px rgba(0,0,0,0.07)` | Cards, panels |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Elevated cards, hover |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `shadow-glow-indigo` | `0 0 20px rgba(99,102,241,0.3)` | Active/focus indigo elements |
| `shadow-glow-amber` | `0 0 10px rgba(251,191,36,0.5)` | XP bar glow |

#### Animations (Framer Motion patterns)
| Animation | Config | Usage |
|-----------|--------|-------|
| `fade-in-up` | `{ opacity: 0, y: 20 } → { opacity: 1, y: 0 }` | Card entrance |
| `scale-in` | `{ opacity: 0, scale: 0.9 } → { opacity: 1, scale: 1 }` | Modal entrance |
| `slide-in-right` | `{ opacity: 0, x: 50 } → { opacity: 1, x: 0 }` | Step transitions |
| `stagger-children` | `delay: idx * 0.05` per item | List/grid item entrance |
| `progress-bar` | `{ width: 0 } → { width: X% }` with easeOut | Progress bars, XP bars |
| `pulse-gradient` | CSS keyframe pulse | AI loading states |

#### Border Radius System
| Token | Value | Usage |
|-------|-------|-------|
| `rounded-lg` | `0.5rem` | Small buttons, badges |
| `rounded-xl` | `0.75rem` | Standard cards, inputs |
| `rounded-2xl` | `1rem` | Large cards, modals |
| `rounded-3xl` | `1.5rem` | Hero cards, feature sections |
| `rounded-full` | `9999px` | Avatars, pills, toggle buttons |

---

## 2. 🧩 COMPONENT PATTERNS

### 2.1 Buttons

| Variant | Style | Usage |
|---------|-------|-------|
| **Primary** | `bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-200` | Main CTA, submit |
| **Primary Hover** | `hover:shadow-xl hover:scale-[1.02] active:scale-95` | Interactive feedback |
| **Secondary** | `bg-gray-100 text-gray-700 hover:bg-gray-200` | Secondary actions |
| **Outline** | `border border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-600` | Tertiary actions |
| **Ghost** | `text-gray-500 hover:text-indigo-600 hover:bg-indigo-50` | Inline actions, nav items |
| **Destructive** | `bg-red-600 text-white hover:bg-red-700` | Delete, danger actions |
| **Icon Only** | `w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300` | Close buttons, toggles |
| **Pill/Badge Button** | `px-3 py-1 rounded-full text-xs font-medium` | Filter chips, tags |

### 2.2 Navigation — Dashboard Sidebar

**Structure:**
```
┌─────────────────────────────┐
│ 🎯 CareerPath.id    [✕]    │ ← Logo + Mobile Close
├─────────────────────────────┤
│ UTAMA                       │ ← Category heading (xs, uppercase, gray-400)
│  📊 Dashboard               │
│  👤 Profile                 │
├─────────────────────────────┤
│ KARIER                      │
│  🧭 Eksplorasi              │
│  💼 Lowongan                │
│  📝 Lamaran                 │
│  🗺️ Roadmap                 │
├─────────────────────────────┤
│ BELAJAR                     │
│  📈 Skill Saya              │
│  📖 Kursus                  │
│  📂 Portfolio               │
├─────────────────────────────┤
│ KESEHATAN                   │
│  🧠 Wellness                │
│  ❤️ Mood                    │
│  👩‍⚕️ Konsultasi              │
├─────────────────────────────┤
│ SOSIAL                      │
│  💬 Community               │
│  🏆 Leaderboard             │
├─────────────────────────────┤
│ ── Bottom Utility ──        │
│  ⚙️ Settings                │
│  📖 Guide                   │
│  ⭐ Evaluasi                │
│  👑 Premium (gold badge)    │
│  🌐 Lihat Website (icon)   │
│  🚪 Logout                  │
└─────────────────────────────┘
```

**States:**
| State | Style |
|-------|-------|
| Active | `bg-indigo-50 text-indigo-600 font-semibold border-l-3 border-indigo-600` |
| Inactive | `text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50` |
| Category Title | `text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-2` |
| Premium Indicator | `bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full px-2 py-0.5 text-[10px]` |

### 2.3 Navigation — Admin Sidebar

**Same structure as dashboard but with dark theme:**
| Token | Value |
|-------|-------|
| Background | `bg-gray-900` |
| Active Item | `bg-violet-600/20 text-violet-400 border-l-3 border-violet-500` |
| Inactive Item | `text-gray-400 hover:text-white hover:bg-gray-800` |
| Category Title | `text-gray-500 uppercase tracking-wider text-[10px]` |

```
Admin Sidebar Items:
📊 Dashboard, 👥 Users, 💼 Jobs, 🎯 Careers, ⚡ Skills,
📚 Courses, 💬 Community, 🧑‍⚕️ Consultants, 🧠 Wellness,
📁 Portfolio, 🗺️ Roadmap, 🎮 Gamification, 💳 Premium,
📝 Content, 📈 Analytics, 📨 Messages, 📜 Logs, ⚙️ Settings
```

### 2.4 Cards

| Variant | Style | Usage |
|---------|-------|-------|
| **Standard Card** | `bg-white rounded-2xl border border-gray-100 shadow-sm p-5` | Generic content card |
| **Hover Card** | Standard + `hover:shadow-lg transition-all group` | Interactive cards |
| **Stat Card** | `bg-white rounded-2xl border p-6` + icon circle + large number | Dashboard stats |
| **Gradient Card** | `bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl p-8` | Hero/feature cards |
| **Skill Card** | Standard + progress bar + XP indicator + proficiency badge | Skill list items |
| **Job Card** | Standard + match score badge + salary + location + skill tags | Job listings |
| **Course Card** | Standard + thumbnail + progress bar + category badge + duration | Course items |
| **Consultant Card** | Standard + avatar + rating stars + specialization tags + price | Consultant listings |

### 2.5 Forms

#### Input Fields
| Element | Style |
|---------|-------|
| Standard Input | `w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm` |
| Large Input (Auth) | `w-full px-5 py-4 rounded-2xl border bg-white/50` + left icon |
| Search Input | Standard + `pl-10` with Search icon absolutely positioned |
| Textarea | Same as input but `min-h-[100px] resize-y` |
| Select | Same as input + chevron icon |

#### Form States
| State | Style |
|-------|-------|
| Focus | `border-indigo-500 ring-2 ring-indigo-500/20` |
| Error | `border-red-500 ring-2 ring-red-500/20` + red error text below |
| Disabled | `opacity-50 cursor-not-allowed bg-gray-50` |
| Success | `border-green-500` + green checkmark icon |

### 2.6 Modals

| Element | Style |
|---------|-------|
| Overlay | `fixed inset-0 bg-black/60 backdrop-blur-sm z-50` |
| Modal Container | `bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl` |
| Modal Header | `p-6 border-b border-gray-100 bg-gray-50/50` + title + close button |
| Modal Body | `p-4 overflow-y-auto flex-1 custom-scrollbar` |
| Close Button | `w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300` + Plus icon rotated 45° |
| Entrance | Framer Motion `scale-in` animation |

### 2.7 Tables (Admin)

| Element | Style |
|---------|-------|
| Header Row | `bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider` |
| Body Row | `border-b border-gray-100 hover:bg-gray-50 transition-colors` |
| Cell | `px-4 py-3 text-sm text-gray-700` |
| Action Buttons | Ghost buttons with icons (Edit, Delete, View) |
| Status Badge | Color-coded pill badges per status |
| Pagination | `rounded-lg border px-3 py-1.5 text-sm` arrows + "Page X of Y" |

### 2.8 Badges & Tags

| Variant | Style |
|---------|-------|
| Category Badge | `px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600` |
| Status Badge | Color-coded per status (see Status Colors above) |
| Count Badge | `bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center` |
| Premium Badge | `bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full text-[10px]` |
| Level Badge | `bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-lg` |
| XP Display | `text-amber-500 font-bold text-xs` + Zap icon filled |

### 2.9 Charts & Visualizations

| Chart Type | Library | Usage |
|------------|---------|-------|
| **Radar Chart** | Recharts | Skill distribution map (skills page) |
| **Bar Chart** | Recharts | Analytics — career interests, skill popularity |
| **Line Chart** | Recharts | User growth, wellness trends |
| **Doughnut/Pie** | Recharts | Status distributions |
| **Progress Bar** | Custom | Skill mastery, course progress, XP to next level |
| **Stat Counter** | Custom | Landing page counters with animated numbers |

Chart Color Palette: `['#6366f1', '#818cf8', '#a78bfa', '#c4b5fd', '#e0e7ff']`

### 2.10 Loading States

| Type | Implementation |
|------|---------------|
| Page Loading | Centered `Loader2` icon with `animate-spin` + indigo color |
| Skeleton | `bg-gray-200 animate-pulse rounded-xl` blocks |
| AI Processing | Pulsing gradient animation + "Menganalisis..." text |
| Button Loading | Replace text with `Loader2` spin icon |
| Data Fetching | `CircleDotDashed` or skeleton cards |

### 2.11 Empty States

| Element | Style |
|---------|-------|
| Container | `text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200` |
| Icon | `bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4` with feature icon |
| Title | `text-lg font-bold text-gray-900 mb-1` |
| Description | `text-gray-500 max-w-xs mx-auto mb-6` |
| CTA Button | Primary button: "Tambah [Item] Pertama" |

### 2.12 Toast / Notifications

| Type | Style |
|------|-------|
| Success | Green left border + CheckCircle icon + message |
| Error | Red left border + XCircle icon + message |
| Warning | Amber left border + AlertTriangle icon + message |
| Info | Blue left border + Info icon + message |

---

## 3. 📐 LAYOUT STRUCTURES

### 3.1 Public/Landing Layout

```
┌──────────────────────────────────────────────────────┐
│ [Logo] ──── [Fitur] [Tentang] [Kontak] ── [Masuk] [Daftar] │ ← Sticky Navbar
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌── HERO SECTION ─────────────────────────────┐     │
│  │  [Badge: "Platform Career AI #1"]            │     │
│  │  [H1: Headline utama]                        │     │
│  │  [Subtitle paragraph]                        │     │
│  │  [CTA Button] [Secondary Button]             │     │
│  │                          [Hero Image/3D]     │     │
│  └──────────────────────────────────────────────┘     │
│                                                       │
│  ┌── VALUE PROPOSITIONS ───────────────────────┐     │
│  │  [Card 1: Icon+Title+Desc]                   │     │
│  │  [Card 2: Icon+Title+Desc]                   │     │
│  │  [Card 3: Icon+Title+Desc]                   │     │
│  └──────────────────────────────────────────────┘     │
│                                                       │
│  ┌── HOW IT WORKS ─────────────────────────────┐     │
│  │  Step 1 ─── Step 2 ─── Step 3 ─── Step 4    │     │
│  │  (connected by horizontal line/dots)          │     │
│  └──────────────────────────────────────────────┘     │
│                                                       │
│  ┌── STATS COUNTER (dark gradient bg) ─────────┐     │
│  │  [1500+ Users] [50+ Careers] [200+ Courses]  │     │
│  │  [Animated counting up on viewport enter]     │     │
│  └──────────────────────────────────────────────┘     │
│                                                       │
│  ┌── FEATURES SHOWCASE ────────────────────────┐     │
│  │  Grid of feature cards with icons             │     │
│  │  Each card: icon + title + description        │     │
│  └──────────────────────────────────────────────┘     │
│                                                       │
│  ┌── TESTIMONIALS ─────────────────────────────┐     │
│  │  Grid of review cards                         │     │
│  │  Each: avatar + name + role + stars + quote   │     │
│  └──────────────────────────────────────────────┘     │
│                                                       │
│  ┌── CTA BOTTOM (radial gradient bg) ──────────┐     │
│  │  [H2: Call to action headline]                │     │
│  │  [Description]                                │     │
│  │  [Large CTA Button]                           │     │
│  └──────────────────────────────────────────────┘     │
│                                                       │
│  ┌── FOOTER ───────────────────────────────────┐     │
│  │  [Logo + Tagline]  [Links Grid]  [Socials]   │     │
│  │  [Copyright]                                  │     │
│  └──────────────────────────────────────────────┘     │
│                                                       │
│  [WhatsApp Floating Button — bottom right]           │
└──────────────────────────────────────────────────────┘
```

**Navbar:**
- Sticky top, `bg-white/80 backdrop-blur-md border-b border-gray-100`
- Logo left, navigation links center, auth buttons right
- Mobile: hamburger menu → slide-in drawer

### 3.2 Authentication Layout (Login/Register)

```
┌──────────────────────────────────────────────────────┐
│            bg-[#030014] with ambient light orbs       │
│                                                       │
│  Desktop: Split Screen Layout                        │
│  ┌──── FORM AREA ────┬──── VISUAL AREA ────┐        │
│  │                    │                      │        │
│  │  [Logo]            │  [3D Elements]       │        │
│  │  [Welcome Text]    │  [Testimonials]      │        │
│  │                    │  [Stats Cards]       │        │
│  │  [Email Input]     │  [Floating Badges]   │        │
│  │  [Password Input]  │                      │        │
│  │  [Submit Button]   │  bg-gradient overlay │        │
│  │  [Social Login]    │  with particles      │        │
│  │  [Switch Link]     │                      │        │
│  │                    │                      │        │
│  └────────────────────┴──────────────────────┘        │
│                                                       │
│  Mobile: Full Card Layout (form only)                │
└──────────────────────────────────────────────────────┘
```

**Key Elements:**
- Rich dark background with animated orbs/particles
- Form inputs: large touch targets (`py-4`), rounded-2xl, left-aligned icons
- Social login buttons (Google, etc.) with brand colors
- Password visibility toggle
- Floating stats badges on visual side (responsive — hide on mobile)

### 3.3 Onboarding Flow (10-Step Wizard)

```
┌──────────────────────────────────────────────────────┐
│ [Logo]              Step X of 10            [Skip?]   │ ← Simple header
├──────────────────────────────────────────────────────┤
│ ████████████░░░░░░░░░░░░░░░░░░░   33%               │ ← Progress bar
│ (gradient: from-indigo-600 to-cyan-600)               │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌── STEP CARD (centered, max-w-2xl) ──────────┐    │
│  │  bg-white rounded-3xl shadow-xl                │    │
│  │                                                │    │
│  │  [Step Icon / Illustration]                    │    │
│  │  [H2: Step Title]                              │    │
│  │  [Subtitle / Instruction]                      │    │
│  │                                                │    │
│  │  ┌── CONTENT AREA ─────────────────────┐      │    │
│  │  │                                      │      │    │
│  │  │  Step 1: Status selection cards      │      │    │
│  │  │  Step 2: Career interest grid        │      │    │
│  │  │  Step 3: Skills assessment sliders   │      │    │
│  │  │  Step 4: Goals form                  │      │    │
│  │  │  Step 5: Mental health check (1-10)  │      │    │
│  │  │  Step 6: AI recommendations loading  │      │    │
│  │  │  Step 7: Skill gap radar chart       │      │    │
│  │  │  Step 8: Learning roadmap preview    │      │    │
│  │  │  Step 9: Monthly targets setting     │      │    │
│  │  │  Step 10: Profile completion         │      │    │
│  │  │                                      │      │    │
│  │  └──────────────────────────────────────┘      │    │
│  │                                                │    │
│  │  [← Kembali]              [Lanjut →]           │    │
│  └────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

**Interactions:**
- **Selection Cards:** Large touch targets with icons. Selected state: `border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20`
- **Step Transitions:** Framer Motion `slide-in-from-right` / `slide-out-to-left`
- **AI Loading:** Pulsing gradient + spinner + "AI sedang menganalisis..." text
- **Rating Inputs:** Star/slider input with color gradients

### 3.4 Dashboard Layout

```
┌──────────────────────────────────────────────────────┐
│ ┌── SIDEBAR (w-64, fixed) ──┬── MAIN AREA ─────────┐│
│ │                            │                       ││
│ │  [Logo]                    │ ┌── TOP BAR ────────┐ ││
│ │                            │ │ [☰] [Search] [🔔] │ ││
│ │  [Nav Groups]              │ │ [Avatar+Name]     │ ││
│ │  See Section 2.2           │ └───────────────────┘ ││
│ │                            │                       ││
│ │                            │ ┌── CONTENT ────────┐ ││
│ │                            │ │                    │ ││
│ │                            │ │  (Page Content)    │ ││
│ │                            │ │                    │ ││
│ │                            │ └───────────────────┘ ││
│ │  [Utility Links]           │                       ││
│ │  [Logout]                  │                       ││
│ └────────────────────────────┴───────────────────────┘│
│                                                       │
│ [AI Chat FAB — bottom right]                         │
│ [Notification Center — slide from right]             │
│ [Session Timeout — auto-logout component]            │
└──────────────────────────────────────────────────────┘
```

**Sidebar:** Fixed width `w-64` (desktop), collapsible to `w-16` or hidden on mobile  
**Mobile:** Sidebar → bottom sheet / hamburger menu overlay  
**Content Area:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`

### 3.5 Admin Panel Layout

Same grid as Dashboard but with **dark theme** optimized for data density.

| Element | Style |
|---------|-------|
| Sidebar BG | `bg-gray-900` |
| Content BG | `bg-gray-950` or `bg-gray-100` |
| Cards | `bg-gray-800 border-gray-700 rounded-xl` |
| Text | `text-gray-100` (primary), `text-gray-400` (secondary) |
| Accent | `violet-600`, `teal-500`, `emerald-500` |
| Tables | Dark-themed with `bg-gray-800` rows, `border-gray-700` |

---

## 4. 📄 PAGE-SPECIFIC UI PATTERNS

### 4.1 Dashboard Main (`/dashboard`)

| Component | Layout |
|-----------|--------|
| Welcome Banner | Gradient card with user name, progress %, streak count |
| Quick Stats | 4-column grid of stat cards |
| Today's Recommendations | AI-powered card list (courses, jobs, mood) |
| Recent Activity | Timeline-style list |
| Skill Radar | Small radar chart widget |

### 4.2 Skills Page (`/dashboard/skills`)

| Component | Style |
|-----------|-------|
| Header | Full-width gradient banner: `from-indigo-600 via-violet-600 to-fuchsia-600 rounded-3xl p-8` |
| XP Display | Trophy icon + Level name + XP count + progress bar to next level |
| Level Badge | `bg-yellow-400 text-yellow-900` positioned absolutely on trophy icon |
| Skill Radar Chart | Recharts RadarChart in white card, showing top 6 skills |
| Skill Cards Grid | 2-col grid, each card: name, category badge, mastery %, XP earned, "Latih" button |
| Controls Toolbar | Sticky search + category filter + "Tambah" button, white card with shadow |
| Add Skill Modal | Shows available skills with 4 proficiency buttons (Beginner→Expert) |

### 4.3 Career Exploration (`/dashboard/careers`)

| Component | Style |
|-----------|-------|
| Search + Filters | Industry, salary range, experience level dropdowns |
| Career Cards | Icon circle (colored) + title + industry + salary range + demand badge + growth outlook |
| Detail View | Full page: requirements, related skills, roadmap, salary data, related jobs |

### 4.4 Job Listings (`/dashboard/jobs`)

| Component | Style |
|-----------|-------|
| Job Cards | Company + title + location + salary + match score badge (`🎯 85%`) |
| Match Score | Circular percentage or badge with color gradient based on score |
| Skills Breakdown | ✅ have / ⚠️ need upgrade / ❌ don't have |
| Filter Sidebar | Type, location, salary, experience, remote toggle |
| Quick Actions | Save, Apply, Share buttons |

### 4.5 Applications Tracker (`/dashboard/applications`)

| Component | Style |
|-----------|-------|
| Kanban Board | 5 columns: Applied → Reviewing → Interview → Offered → Rejected |
| Application Card | Company logo + title + date + match score + status badge |
| Stats Row | Total apps, interview rate, response rate |
| Timeline View | Alternative list view with chronological order |

### 4.6 Learning/Courses (`/dashboard/learning`)

| Component | Style |
|-----------|-------|
| Course Cards | Thumbnail top + title + provider badge + duration + level + progress bar |
| Category Filter | Horizontal scroll pill buttons (All, Programming, Design, Data, Business) |
| Progress Tracking | Circular progress ring + lessons completed count |
| XP Reward Badge | Amber/gold XP badge on each course card |

### 4.7 Portfolio (`/dashboard/portfolio`)

| Component | Style |
|-----------|-------|
| Project Cards | Image + title + tech stack tags + live/github links |
| Certificate Cards | Issuer badge + title + date + skill tags |
| View Modes | Grid / List toggle |
| Add Project Modal | Form with image upload, URL fields, tech stack multi-select |
| Portfolio Score | Strength meter (X/10) with AI suggestions |

### 4.8 Wellness Check (`/dashboard/wellness`)

| Component | Style |
|-----------|-------|
| GAD-7 Form | 7 questions, each with 4 radio options (0-3) |
| Score Display | Large number + severity badge (Minimal/Ringan/Sedang/Berat) |
| Recommendations | Card list based on score (currently hardcoded) |
| History Log | Timeline with date + score + re-take button |
| Color Coding | Green (0-4), Yellow (5-9), Orange (10-14), Red (15-21) |

### 4.9 Mood Tracker (`/dashboard/mood`)

| Component | Style |
|-----------|-------|
| Mood Selector | 5 emoji buttons (😢→😁) with labels + color backgrounds |
| Calendar Heatmap | 7-day mood history with color-coded cells |
| Journal Entry | Textarea + mood tags (Badges: Produktif, Cemas, Senang, etc.) |
| Mood Trends | Simple line chart of mood over time |
| Quick Stats | Average mood, streak, best day |

### 4.10 Consultation (`/dashboard/consultation`)

| Component | Style |
|-----------|-------|
| Consultant Cards | Avatar + name + title + type badge + specializations + rating stars + price + available slots |
| Booking Modal | Calendar date picker + time slot selection + confirmation |
| Session Cards | Past/upcoming sessions with status badge |
| Type Filter | Psikolog / Konselor / Mentor tabs |

### 4.11 Community (`/dashboard/community`)

| Component | Style |
|-----------|-------|
| Post Cards | Avatar + author + timestamp + content + likes + comments count |
| Create Post | Modal with textarea + category select + tag input |
| Comment Thread | Nested comment list with reply button |
| Category Tabs | All / Per Career Path / Mental Health / Success Stories |
| Pinned Posts | Gold pin badge + highlighted border |

### 4.12 Leaderboard (`/dashboard/leaderboard`)

| Component | Style |
|-----------|-------|
| Top 3 Podium | Special cards with Crown (1st), Medal (2nd/3rd) icons |
| 1st Place | `bg-gradient-to-r from-amber-400 to-yellow-500` card |
| 2nd Place | `bg-gradient-to-r from-gray-300 to-gray-400` card |
| 3rd Place | `bg-gradient-to-r from-amber-700 to-amber-800` card |
| Table Below | Rank + avatar + name + XP + level + badges count |
| Period Filter | Weekly / Monthly / All Time tabs |

### 4.13 Roadmap (`/dashboard/roadmap`)

| Component | Style |
|-----------|-------|
| Timeline | Vertical timeline with month milestones |
| Step Card | Icon circle (✅ done / ▶️ current / 🔒 locked) + title + skills + courses |
| Progress Line | Completed = solid indigo, upcoming = dashed gray |
| Milestone Badge | Gold star marker at key checkpoints |
| Career Context | Header showing target career + estimated completion |

### 4.14 Premium (`/dashboard/premium`)

| Component | Style |
|-----------|-------|
| Plan Cards | 2 plans side by side, popular plan has gold border + "Populer" badge |
| Feature List | Checkmark list (✅ per feature) |
| Pricing | Large number + "/bulan" + strikethrough original price if discounted |
| CTA Button | Gold gradient `from-amber-500 to-orange-500` for premium |
| Payment | Midtrans Snap popup trigger |

### 4.15 Evaluation (`/dashboard/evaluation`)

| Component | Style |
|-----------|-------|
| Month Selector | Prev/Next month navigation |
| Score Overview | Large score number + star rating + grade badge (A-E) |
| Category Cards | 4 categories (Learning, Jobs, Portfolio, Wellbeing) with individual scores |
| Trend Indicators | ↑ green (improving), ↓ red (declining), → gray (stable) |
| AI Insights | Callout card with sparkle icon + AI-generated text |

### 4.16 Profile (`/dashboard/profile`)

| Component | Style |
|-----------|-------|
| Profile Card | Avatar (large) + name + university + major + bio |
| Stats Row | Total XP, Level, Skills Count, Courses Completed |
| Edit Modal | Form fields for all profile data |
| Career Interest | Tag list of selected career interests |

### 4.17 Guide (`/dashboard/guide`)

| Component | Style |
|-----------|-------|
| Accordion Sections | Expandable FAQ-style cards |
| Step Lists | Numbered steps with icons per feature |
| Category Cards | Grid of feature guides with icons + descriptions |
| External Links | OutLink buttons to resources |

---

## 5. 📱 RESPONSIVE BEHAVIOR

### Breakpoints
| Breakpoint | Value | Target |
|------------|-------|--------|
| Default | < 640px | Mobile phones |
| `sm` | 640px+ | Tablets (portrait) |
| `md` | 768px+ | Tablets (landscape) |
| `lg` | 1024px+ | Desktop (sidebar visible) |
| `xl` | 1280px+ | Wide desktop |
| `2xl` | 1536px+ | Ultra-wide |

### Responsive Adaptations

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Sidebar | Hidden → Hamburger menu overlay | Same | Fixed `w-64` |
| Grid Columns | 1 col | 2 cols | 3-4 cols |
| Stat Cards | 2 cols stacked | 2 cols | 4 cols row |
| Typography | H1: 2xl, Body: sm | H1: 3xl | H1: 4xl |
| Tables | Card layout / horizontal scroll | Compact table | Full table |
| Modals | Full screen | Centered card | Centered card |
| Charts | Full width, smaller height | Standard | Standard |
| Search Bar | Hidden (icon toggle) | Compact | Full width |
| Navbar (public) | Hamburger → drawer | Full links | Full links |

### Touch Targets
- Minimum tap target: `44px × 44px` (Apple HIG)
- Button padding: minimum `py-3 px-4` on mobile
- Card hover effects → replaced with active states on touch

---

## 6. 🖼️ ICONOGRAPHY

### Library
- **Primary:** `lucide-react` — outlined, 1.5-2px stroke
- **Consistent sizing:**
  | Context | Size |
  |---------|------|
  | Inline / text | `w-4 h-4` |
  | Card icon | `w-5 h-5` |
  | Feature icon (in circle) | `w-6 h-6` inside `w-10 h-10` circle |
  | Hero / empty state | `w-8-12 h-8-12` |
  | Nav icon | `w-5 h-5` |

### Icon Circle Pattern
```
bg-{color}-50 w-10 h-10 rounded-xl flex items-center justify-center
→ icon: w-5 h-5 text-{color}-600
```
Used in: stat cards, feature cards, dashboard widgets.

### Common Icons Reference
| Feature | Icon |
|---------|------|
| Dashboard | `LayoutDashboard` |
| Profile | `User` |
| Career | `Compass` |
| Jobs | `Briefcase` |
| Applications | `FileText` |
| Skills | `TrendingUp` |
| Learning | `Book` / `BookOpen` |
| Portfolio | `Folder` |
| Wellness | `Brain` |
| Mood | `Heart` |
| Consultation | `UserCheck` |
| Community | `MessageCircle` |
| Leaderboard | `Trophy` |
| Roadmap | `Map` |
| Premium | `Crown` |
| Settings | `Settings` |
| Guide | `HelpCircle` |
| Evaluation | `Award` |
| Notification | `Bell` |
| Search | `Search` |
| Logout | `LogOut` |
| XP | `Zap` (filled) |
| AI / Smart | `Sparkles` |
| Loading | `Loader2` (animate-spin) |

---

## 7. 🌙 ADMIN PANEL THEME

### Dark Theme Tokens

| Token | Value |
|-------|-------|
| Background | `bg-gray-950` |
| Sidebar BG | `bg-gray-900` |
| Card BG | `bg-gray-800` |
| Card Border | `border-gray-700` |
| Text Primary | `text-gray-100` |
| Text Secondary | `text-gray-400` |
| Accent | `violet-500`, `teal-500` |
| Active Item | `bg-violet-600/20 text-violet-400` |
| Table Header | `bg-gray-900/50 text-gray-300` |
| Input BG | `bg-gray-700 border-gray-600 text-gray-100` |
| Hover | `hover:bg-gray-700` |

### Admin-specific Components

| Component | Style |
|-----------|-------|
| Data Table | Dark themed, compact rows, color-coded action icons |
| Stat Card | `bg-gray-800 rounded-xl p-6` + colored left border accent |
| Action Buttons | Color-coded: Green (create), Blue (edit), Red (delete), Amber (view) |
| Search | `bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500` |
| Modal | `bg-gray-800 rounded-2xl` on `bg-black/80` overlay |

---

## 8. ♿ ACCESSIBILITY (A11y)

### Requirements (WCAG 2.1 Compliance)
- [ ] Color contrast ratio minimum 4.5:1 for text
- [ ] All interactive elements keyboard-navigable
- [ ] Focus indicators visible (ring styles)
- [ ] Alt text on all images
- [ ] ARIA labels on interactive elements
- [ ] Skip to content link
- [ ] Form labels for all inputs
- [ ] Error messages associated with inputs

### Focus Styles
```css
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  border-radius: inherit;
}
```

---

## 9. 🔔 GLOBAL COMPONENTS

### AI Chat (FAB - Floating Action Button)
- Position: `fixed bottom-6 right-6`
- Trigger: Circular button with `Sparkles` icon
- Panel: Slide-up chat panel with message history
- AI responses styled with gradient accent
- Collapsible to FAB when not in use

### Notification Center
- Trigger: `Bell` icon in top bar with unread count badge
- Panel: Slide-in drawer from right
- Items: icon + title + description + timestamp + read/unread indicator
- Actions: Mark as read, dismiss, navigate

### Session Timeout
- Auto-logout after 30 minutes inactivity
- Warning modal 5 minutes before timeout
- "Stay Logged In" button to reset timer

### WhatsApp Floating Button
- Position: `fixed bottom-6 right-6` (public pages only)
- Green WhatsApp icon with pulse animation
- Links to WhatsApp support chat

---

> **Note:** Dokumen ini harus di-update setiap kali ada perubahan UI/UX. Semua developer HARUS mengikuti blueprint ini untuk menjaga konsistensi visual di seluruh platform CareerPath.id.
