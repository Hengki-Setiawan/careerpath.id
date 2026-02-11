# ⚡ CareerPath.id — OPTIMIZATION BLUEPRINT
## Panduan Optimalisasi Performa, Kecepatan & Efisiensi Website

> **Status:** Active Directive  
> **Last Updated:** 2026-02-11  
> **Priority:** HIGH — Website yang cepat = retensi user yang tinggi  
> **Target:** Lighthouse Score ≥ 90 di semua kategori

---

## 1. 🎯 TUJUAN & PRINSIP

### Mengapa Optimalisasi Penting?
- **53% user** meninggalkan website yang loading > 3 detik (Google Research)
- **SEO Ranking** — Google Core Web Vitals langsung mempengaruhi ranking search
- **User Experience** — website yang responsif meningkatkan engagement 2x lipat
- **Bandwidth** — pengguna mobile di Indonesia sering memiliki koneksi terbatas

### Core Web Vitals Target

| Metrik | Target | Deskripsi |
|--------|--------|-----------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Konten utama harus ter-render dalam 2.5 detik |
| **FID** (First Input Delay) | < 100ms | Respons terhadap interaksi pertama < 100ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Tidak boleh ada pergeseran layout saat loading |
| **TTFB** (Time to First Byte) | < 800ms | Server response cepat |
| **INP** (Interaction to Next Paint) | < 200ms | Setiap interaksi responsif |

---

## 2. 🔴 MASALAH KRITIS SAAT INI

### Audit Hasil Analisis Codebase

| # | Masalah | Severitas | Impact |
|---|---------|-----------|--------|
| 1 | **50+ halaman `'use client'`** — hampir semua page adalah client-side rendered | 🔴 Critical | Bundle JS besar, SEO lemah, render lambat |
| 2 | **0 lazy loading** — tidak ada `next/dynamic` import di seluruh codebase | 🔴 Critical | Semua library (Recharts, Framer Motion) diload di awal |
| 3 | **Hanya 3 file pakai `next/image`** — mayoritas gambar pakai `<img>` biasa | 🔴 Critical | Gambar tidak terkompresi, tidak responsive |
| 4 | **Tidak ada image config** di `next.config.ts` | 🟡 High | WebP/AVIF conversion tidak aktif |
| 5 | **Heavy dependencies** loaded everywhere: `framer-motion` (130KB), `recharts` (200KB+), `canvas-confetti` | 🟡 High | Bundle size membengkak |
| 6 | **Tidak ada PWA / Service Worker** | 🟡 Medium | Tidak bisa offline, tidak installable |
| 7 | **Tidak ada caching strategy** untuk API calls ke Supabase | 🟡 Medium | Setiap navigasi = fetch ulang |
| 8 | **4 loading.tsx saja** — banyak route tanpa loading state | 🟢 Low | Flash of empty content |

---

## 3. 📦 CLIENT-SIDE vs SERVER-SIDE OPTIMIZATION

### 3.1 Konversi ke Server Components

> [!IMPORTANT]
> Next.js App Router defaultnya adalah **Server Component**. Halaman yang hanya menampilkan data (no interactivity) HARUS tetap sebagai Server Component untuk mengurangi JS yang dikirim ke browser.

#### Strategi Hybrid Rendering

| Page Type | Rendering | Contoh |
|-----------|-----------|--------|
| **Static Pages** | Server Component (SSG) | Landing page, About, Features, FAQ, Privacy, Terms |
| **Data Display** | Server Component + fetch | `/dashboard/careers`, `/dashboard/learning` (list view) |
| **Interactive Pages** | Client Component | `/dashboard/skills` (radar chart), `/onboarding` |
| **Admin Pages** | Client Component (acceptable) | Semua admin pages karena butuh real-time CRUD |

#### Implementasi Pattern: "Island Architecture"

```tsx
// ❌ SEBELUM: Seluruh halaman adalah client component
'use client'
import { RadarChart } from 'recharts'
// ... 500 lines of component including static text

// ✅ SESUDAH: Server component + client islands
// page.tsx (Server Component — NO 'use client')
import SkillRadarChart from './SkillRadarChart' // client island
import SkillsList from './SkillsList'           // client island

export default async function SkillsPage() {
  const skills = await fetchSkills() // server-side fetch
  return (
    <div>
      <h1>Skill Saya</h1>                    {/* Static — no JS */}
      <SkillRadarChart data={skills} />       {/* Client island */}
      <SkillsList initialData={skills} />     {/* Client island */}
    </div>
  )
}
```

#### Halaman yang Bisa Dikonversi ke Server Component

- [ ] **Landing Page** (`/page.tsx`) — sebagian besar static content
- [ ] **About** (`/about/page.tsx`)
- [ ] **Features** (`/features/page.tsx`)
- [ ] **FAQ** (`/faq/page.tsx`)
- [ ] **Privacy** (`/privacy/page.tsx`)
- [ ] **Terms** (`/terms/page.tsx`)
- [ ] **Blog** (`/blog/page.tsx`)
- [ ] **Contact** (`/contact/page.tsx`) — form bisa jadi client island
- [ ] **Dashboard Careers** (`/dashboard/careers`) — data display + search island
- [ ] **Dashboard Learning** (`/dashboard/learning`) — data display + filter island
- [ ] **Dashboard Guide** (`/dashboard/guide`) — mostly static text

---

## 4. 🖼️ IMAGE OPTIMIZATION

### 4.1 Next.js Image Configuration

**Tambahkan ke `next.config.ts`:**

```typescript
const nextConfig: NextConfig = {
  images: {
    // Aktifkan otomatis konversi ke format modern
    formats: ['image/avif', 'image/webp'],
    
    // Domain gambar yang diizinkan (Supabase Storage)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
        pathname: '/storage/v1/object/public/**',
      },
    ],

    // Responsive image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimize quality untuk kompresi
    minimumCacheTTL: 2592000, // 30 days cache
  },
  // ... existing headers config
};
```

### 4.2 Penggunaan `next/image` Component

```tsx
// ❌ SEBELUM: Raw img tag — tidak teroptimasi
<img src="/hero-image.png" alt="Hero" />

// ✅ SESUDAH: Next/Image — auto WebP/AVIF, lazy load, responsive
import Image from 'next/image'

<Image
  src="/hero-image.png"
  alt="CareerPath Hero"
  width={1200}
  height={630}
  priority           // untuk above-the-fold images
  quality={80}       // 80% quality = 60% smaller file
  placeholder="blur" // blur placeholder saat loading
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

#### Checklist Migrasi ke next/image
- [ ] Landing page hero image (`hero-image.png`)
- [ ] User avatars di leaderboard, community, consultation
- [ ] Consultant photos
- [ ] Course thumbnails
- [ ] Portfolio project images
- [ ] Certificate images
- [ ] Blog post images

### 4.3 Kompresi Gambar Static

| Format | Kompresi | Kapan Digunakan |
|--------|----------|-----------------|
| **AVIF** | 50% lebih kecil dari JPEG | Browser modern (Chrome, Firefox) |
| **WebP** | 30% lebih kecil dari JPEG | Fallback untuk Safari older |
| **SVG** | Scalable, tiny filesize | Icons, logos, illustrations |
| **PNG** | Lossless | Screenshots, text-heavy images |

**Tools untuk Kompresi:**
- `sharp` (built-in Next.js) — otomatis via `next/image`
- `@squoosh/lib` — manual batch compression
- `svgo` — compress SVG files

### 4.4 Gambar di Supabase Storage

```sql
-- Buat bucket dengan auto-resize
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('images', 'images', true, 5242880); -- 5MB limit

-- Policy: auto-serve WebP via Supabase Image Transformation
-- URL: /storage/v1/render/image/public/{bucket}/{file}?width=400&quality=80
```

**Supabase Image Transformation URL pattern:**
```
https://[project].supabase.co/storage/v1/render/image/public/images/avatar.png
  ?width=200
  &height=200
  &resize=cover
  &quality=80
```

---

## 5. 📦 BUNDLE SIZE OPTIMIZATION

### 5.1 Current Heavy Dependencies

| Package | Size (gzipped) | Used Where |
|---------|---------------|------------|
| `framer-motion` | ~130KB | Animations di semua dashboard pages |
| `recharts` | ~200KB | Skill radar chart, analytics charts |
| `canvas-confetti` | ~25KB | Confetti effect (onboarding completion?) |
| `groq-sdk` | ~50KB | AI API calls |
| `@supabase/supabase-js` | ~40KB | Database client |

### 5.2 Lazy Loading dengan `next/dynamic`

```tsx
// ❌ SEBELUM: Import langsung — loaded di initial bundle
import { RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

// ✅ SESUDAH: Dynamic import — loaded hanya saat dibutuhkan
import dynamic from 'next/dynamic'

// Lazy load Recharts — hanya di-load di halaman yang butuh chart
const SkillRadarChart = dynamic(
  () => import('@/components/charts/SkillRadarChart'),
  { 
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />,
    ssr: false // tidak perlu SSR untuk interactive chart
  }
)

// Lazy load Canvas Confetti — hanya di-load saat trigger
const triggerConfetti = () => {
  import('canvas-confetti').then(mod => {
    mod.default({ particleCount: 100, spread: 70 })
  })
}
```

#### Komponen yang HARUS di-lazy load:
- [ ] **Recharts** components (RadarChart, BarChart, LineChart) — hanya load di pages yang pakai chart
- [ ] **Framer Motion** AnimatePresence — lazy load wrapper
- [ ] **Canvas Confetti** — dynamic import saat trigger only
- [ ] **AI Chat Component** — lazy load, hanya mount saat user klik FAB
- [ ] **Notification Center** — lazy load, mount saat bell icon clicked
- [ ] **Modal Components** — lazy load, mount saat triggered

### 5.3 Tree Shaking

```tsx
// ❌ SEBELUM: Import seluruh lucide-react (huge bundle)
import * as Icons from 'lucide-react'

// ✅ SUDAH BENAR (codebase sudah melakukan ini):
import { Briefcase, Search, Filter } from 'lucide-react'
// lucide-react sudah tree-shakeable ✅
```

### 5.4 Bundle Analyzer

**Tambahkan ke project:**
```bash
npm install --save-dev @next/bundle-analyzer
```

**next.config.ts:**
```typescript
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)
```

**Jalankan:**
```bash
ANALYZE=true npm run build
```

---

## 6. 🚀 CACHING & DATA FETCHING

### 6.1 Supabase Query Caching

```tsx
// ❌ SEBELUM: Fetch ulang setiap navigasi
useEffect(() => {
  const fetchData = async () => {
    const { data } = await supabase.from('careers').select('*')
    setCareers(data)
  }
  fetchData()
}, [])

// ✅ SESUDAH Opsi A: React Query / SWR untuk caching
import useSWR from 'swr'

const fetcher = async () => {
  const { data } = await supabase.from('careers').select('*')
  return data
}

const { data: careers, isLoading } = useSWR('careers', fetcher, {
  revalidateOnFocus: false,    // Jangan re-fetch saat tab focus
  dedupingInterval: 60000,     // Cache 1 menit
  revalidateOnReconnect: true, // Re-fetch saat online lagi
})

// ✅ SESUDAH Opsi B: Server Component fetch dengan cache
// page.tsx (Server Component)
export const revalidate = 300 // Revalidate setiap 5 menit

async function getCareers() {
  const supabase = createServerClient()
  const { data } = await supabase.from('careers').select('*')
  return data
}
```

### 6.2 Static Generation (SSG) untuk Halaman Statis

```tsx
// pages yang tidak berubah sering — generate saat build time
// landing page, about, features, FAQ, privacy, terms

export const dynamic = 'force-static'  // Generate at build time
export const revalidate = 3600         // Revalidate setiap 1 jam
```

### 6.3 API Route Caching

```tsx
// /api/admin/careers/route.ts
export async function GET() {
  const data = await fetchCareers()
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
```

### 6.4 Browser Caching Headers

**Tambahkan ke `next.config.ts`:**
```typescript
async headers() {
  return [
    // Cache static assets aggressively
    {
      source: '/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable', // 1 year
        },
      ],
    },
    // Cache API responses briefly
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, s-maxage=60, stale-while-revalidate=300',
        },
      ],
    },
    // ... existing security headers
  ]
}
```

---

## 7. 📱 PWA (Progressive Web App)

### 7.1 Web App Manifest

**Buat `public/manifest.json`:**
```json
{
  "name": "CareerPath.id",
  "short_name": "CareerPath",
  "description": "Career Operating System untuk Gen Z Indonesia",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4f46e5",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

**Tambahkan ke `layout.tsx`:**
```tsx
export const metadata: Metadata = {
  manifest: '/manifest.json',
  themeColor: '#4f46e5',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CareerPath.id',
  },
}
```

### 7.2 Service Worker (Offline Support)

**Install `next-pwa`:**
```bash
npm install next-pwa
```

**Strategi Caching:**

| Resource Type | Strategy | Deskripsi |
|--------------|----------|-----------|
| Static assets (CSS, JS, fonts) | **Cache First** | Serve dari cache, update di background |
| API responses | **Network First** | Coba network dulu, fallback ke cache |
| Images | **Stale While Revalidate** | Serve cache, fetch update |
| HTML pages | **Network First** | Selalu coba server terbaru |

### 7.3 Offline Fallback Page

Buat halaman offline yang menampilkan pesan "Kamu sedang offline" dengan kemampuan melihat data yang sudah di-cache.

---

## 8. ⚡ RENDERING & PERFORMANCE

### 8.1 Loading States untuk Setiap Route

**File `loading.tsx` yang ada:** 4 files — kurang coverage

**HARUS ditambahkan `loading.tsx` untuk:**
- [ ] Setiap route group di dashboard (careers, jobs, skills, learning, dll)
- [ ] Admin route groups
- [ ] Public pages yang fetch data

**Pattern Loading State:**
```tsx
// loading.tsx — skeleton loader instead of spinner
export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 bg-gray-200 rounded-3xl" /> {/* Header skeleton */}
      <div className="grid grid-cols-3 gap-4">
        <div className="h-24 bg-gray-200 rounded-2xl" />
        <div className="h-24 bg-gray-200 rounded-2xl" />
        <div className="h-24 bg-gray-200 rounded-2xl" />
      </div>
      <div className="h-64 bg-gray-200 rounded-2xl" /> {/* Content skeleton */}
    </div>
  )
}
```

### 8.2 Suspense Boundaries

```tsx
import { Suspense } from 'react'

// Wrap slow components in Suspense
<Suspense fallback={<ChartSkeleton />}>
  <AnalyticsChart />
</Suspense>

<Suspense fallback={<TableSkeleton />}>
  <UserTable />
</Suspense>
```

### 8.3 Optimistic Updates

```tsx
// Saat user melakukan action, update UI dulu sebelum server confirms
const addSkill = async (skillId: string) => {
  // ✅ Update UI immediately (optimistic)
  setUserSkills(prev => [...prev, { skill_id: skillId, loading: true }])
  
  // Then send to server
  const { error } = await supabase.from('user_skills').insert({ ... })
  
  if (error) {
    // Rollback if failed
    setUserSkills(prev => prev.filter(s => s.skill_id !== skillId))
    showToast('error', 'Gagal menambahkan skill')
  }
}
```

### 8.4 Virtual Scrolling untuk Long Lists

```tsx
// Untuk list panjang (leaderboard, community posts, audit logs)
// Install: npm install @tanstack/react-virtual

import { useVirtualizer } from '@tanstack/react-virtual'

// Hanya render items yang visible di viewport
// Mengurangi DOM nodes dari 1000+ menjadi ~20
```

---

## 9. 🎨 CSS & STYLING OPTIMIZATION

### 9.1 Tailwind CSS Purging

Tailwind v4 sudah auto-purge unused styles. Pastikan:
- [ ] Tidak ada class yang di-generate secara string concatenation
- [ ] Gunakan `clsx` atau `tailwind-merge` untuk conditional classes

### 9.2 Reduce Animation Overhead

```tsx
// ❌ SEBELUM: Framer Motion di setiap card, setiap page
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: idx * 0.05 }}
>

// ✅ SESUDAH: CSS animation untuk simple effects (lebih ringan)
// globals.css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}

// Hanya gunakan Framer Motion untuk complex animations:
// - AnimatePresence (exit animations)
// - Layout animations
// - Gesture-based animations
// - Shared layout transitions
```

### 9.3 Font Optimization

```tsx
// layout.tsx — preload fonts
import { GeistSans, GeistMono } from 'geist/font'

// Next.js auto-optimizes:
// ✅ Self-hosts fonts (no external requests)
// ✅ Preloads critical fonts
// ✅ Sets 'font-display: swap' (text visible immediately)
```

### 9.4 Critical CSS

```tsx
// Inline critical CSS for above-the-fold content
// Next.js does this automatically for CSS modules
// Pastikan global CSS file tidak terlalu besar (< 50KB ideal)
```

---

## 10. 🔧 NEXT.JS CONFIG OPTIMIZATION

### Recommended `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // === IMAGE OPTIMIZATION ===
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    minimumCacheTTL: 2592000,
  },

  // === COMPRESSION ===
  compress: true, // Enable gzip compression (default: true)

  // === PRODUCTION OPTIMIZATIONS ===
  reactStrictMode: true,
  poweredByHeader: false, // Remove X-Powered-By header

  // === EXPERIMENTAL FEATURES ===
  experimental: {
    optimizeCss: true,            // CSS optimization
    optimizePackageImports: [     // Only import what's used
      'lucide-react',
      'recharts', 
      'framer-motion',
    ],
  },

  // === SECURITY HEADERS ===
  async headers() {
    return [
      // Static asset caching
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2|js|css)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Security headers (existing)
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://app.midtrans.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in",
              "connect-src 'self' https://*.supabase.co https://*.supabase.in https://api.groq.com",
              "frame-src https://app.midtrans.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 11. 📊 MONITORING & ANALYTICS

### 11.1 Vercel Analytics (Built-in)

```tsx
// layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

<html>
  <body>
    {children}
    <Analytics />
    <SpeedInsights />
  </body>
</html>
```

### 11.2 Error Tracking (Sentry)

```bash
npx @sentry/wizard@latest -i nextjs
```

### 11.3 Custom Performance Metrics

```tsx
// Track key metrics
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Send to analytics
  if (metric.label === 'web-vital') {
    console.log(`${metric.name}: ${metric.value}`)
    // Send to Supabase analytics table
  }
}
```

---

## 12. 🌐 SEO OPTIMIZATION

### 12.1 Dynamic Metadata per Page

```tsx
// Setiap page.tsx harus export metadata
export const metadata: Metadata = {
  title: 'Eksplorasi Karier | CareerPath.id',
  description: 'Temukan karier yang cocok untukmu berdasarkan skill dan minat.',
  openGraph: {
    title: 'Eksplorasi Karier | CareerPath.id',
    description: 'Temukan karier yang cocok untukmu.',
    images: ['/og/careers.png'],
  },
}
```

### 12.2 Sitemap Auto-Generation

```tsx
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const careers = await fetchAllCareers()
  
  return [
    { url: 'https://careerpath.id', lastModified: new Date(), priority: 1.0 },
    { url: 'https://careerpath.id/features', priority: 0.8 },
    { url: 'https://careerpath.id/about', priority: 0.7 },
    ...careers.map(c => ({
      url: `https://careerpath.id/careers/${c.slug}`,
      lastModified: c.updated_at,
      priority: 0.6,
    })),
  ]
}
```

### 12.3 Robots.txt

```tsx
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/dashboard/', '/api/'] },
    ],
    sitemap: 'https://careerpath.id/sitemap.xml',
  }
}
```

### 12.4 Structured Data (JSON-LD)

```tsx
// Landing page — Organization schema
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CareerPath.id",
  "description": "Career Operating System untuk Gen Z Indonesia",
  "url": "https://careerpath.id",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
})}
</script>
```

---

## 13. 🔐 API & DATABASE OPTIMIZATION

### 13.1 Supabase Query Optimization

```tsx
// ❌ SEBELUM: Select semua kolom
const { data } = await supabase.from('users').select('*')

// ✅ SESUDAH: Select hanya kolom yang dibutuhkan
const { data } = await supabase
  .from('users')
  .select('id, full_name, avatar_url, total_xp')
  .order('total_xp', { ascending: false })
  .limit(50)
```

### 13.2 Pagination (bukan load semua data)

```tsx
// Gunakan range-based pagination
const PAGE_SIZE = 20
const { data, count } = await supabase
  .from('community_posts')
  .select('*', { count: 'exact' })
  .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
  .order('created_at', { ascending: false })
```

### 13.3 Database Indexing

```sql
-- Index untuk query yang sering digunakan
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_wellness_logs_user_id ON wellness_logs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX idx_courses_category ON courses(category, is_published);
```

### 13.4 Connection Pooling

Supabase handles connection pooling automatically via Supavisor. Pastikan:
- [ ] Gunakan `createClient()` per request (jangan singleton)
- [ ] Hindari long-running connections
- [ ] Batasi concurrent queries

---

## 14. 📋 IMPLEMENTASI CHECKLIST

### 🔴 P0 — Immediate (High Impact, Easy)
1. - [ ] **Tambahkan `images` config** ke `next.config.ts`
2. - [ ] **Migrasi `<img>` ke `<Image>`** — mulai dari landing page hero
3. - [ ] **Lazy load Recharts** — `next/dynamic` untuk chart components
4. - [ ] **Lazy load Canvas Confetti** — dynamic import on trigger
5. - [ ] **`optimizePackageImports`** — tambahkan ke next.config
6. - [ ] **Tambahkan `loading.tsx`** untuk setiap route group

### 🟡 P1 — Short-term (Medium Effort)
7. - [ ] **Konversi landing page** ke Server Component
8. - [ ] **Konversi static pages** (About, FAQ, Privacy, Terms) ke Server Component
9. - [ ] **Implementasi caching strategy** — SWR atau Server Component cache
10. - [ ] **Bundle analyzer** — identifikasi chunking opportunity
11. - [ ] **Dynamic sitemap + robots.txt** generation
12. - [ ] **SEO metadata** di setiap public page
13. - [ ] **Vercel Analytics** + SpeedInsights integration

### 🟢 P2 — Medium-term (Higher Effort)
14. - [ ] **PWA manifest + icons**
15. - [ ] **Service Worker** untuk offline support
16. - [ ] **Virtual scrolling** untuk long lists
17. - [ ] **CSS animation replacement** — ganti simple Framer Motion dengan CSS
18. - [ ] **Supabase query optimization** — select specific columns
19. - [ ] **Database indexing** — add indexes untuk frequent queries
20. - [ ] **Sentry integration** untuk error tracking

### 🔵 P3 — Long-term (Ongoing)
21. - [ ] **Lighthouse CI** — automated performance testing on every PR
22. - [ ] **Performance budget** — set max bundle size limits
23. - [ ] **A/B testing** — compare performance of optimized vs unoptimized pages
24. - [ ] **Edge caching** — Vercel Edge Config untuk frequently accessed config
25. - [ ] **ISR (Incremental Static Regeneration)** — untuk career pages, blog posts

---

## 15. 📈 EXPECTED IMPACT

| Optimization | Memory Saved | Load Time Improvement |
|-------------|-------------|----------------------|
| Lazy load Recharts | ~200KB JS | -0.5-1s initial load |
| Lazy load Framer Motion | ~130KB JS | -0.3-0.7s initial load |
| `next/image` conversion | 30-60% per image | -1-3s on image-heavy pages |
| Server Components | 40-60% less JS | -1-2s TTFB improvement |
| API caching (SWR) | 0 network on re-visit | Instant navigation |
| `optimizePackageImports` | ~50-100KB | -0.2-0.5s |
| PWA + Service Worker | Cache all assets | Offline capable, instant re-visits |

**Combined Estimated Impact:**
- **Initial Page Load:** 5-8s → **1.5-2.5s** (60-70% faster)
- **Subsequent Navigation:** 2-3s → **< 0.5s** (cached)
- **Lighthouse Performance Score:** ~50-60 → **90+**

---

> **Dokumen ini harus di-review setiap sprint dan di-update setelah setiap batch implementasi.**  
> **Gunakan Lighthouse CI dan Vercel Web Analytics untuk mengukur dampak nyata.**
