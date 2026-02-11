# CareerPath.id

<p align="center">
  <strong>🚀 Career Operating System untuk Gen Z Indonesia</strong>
</p>

<p align="center">
  Platform all-in-one untuk perencanaan karier, skill tracking, dan kesehatan mental.
  <br />
  Dirancang khusus untuk Gen Z di Makassar yang ingin sukses tanpa burnout.
</p>

---

## 📘 Project Blueprints (Source of Truth)

Dokumen-dokumen berikut adalah **acuan utama** pengembangan proyek ini. Semua AI agent dan developer wajib merujuk ke file ini:

1.  **[MASTER-IMPLEMENTATION-PLAN.md](./MASTER-IMPLEMENTATION-PLAN.md)** - Grand design, roadmap fase, dan arsitektur teknis.
2.  **[plan.md](./plan.md)** - Detail user journey, spesifikasi modul AI, dan logika bisnis.
3.  **[plan-flowcharts.md](./plan-flowcharts.md)** - Diagram alur sistem dan visualisasi proses.
4.  **[standard-features-plan.md](./standard-features-plan.md)** - Blueprint fitur standar aplikasi web (Admin, Security, Notification).
5.  **[PROGRESS-LOG.md](./PROGRESS-LOG.md)** - Status pengerjaan real-time dan log perubahan.

---

## 🎯 Tentang CareerPath.id

CareerPath.id adalah solusi inovatif untuk mengatasi tingkat pengangguran tinggi dan kecemasan (anxiety) yang dihadapi Gen Z di Makassar. Platform ini menggabungkan tiga pilar utama:

1. **Career Planning** - Petakan jalur kariermu dengan AI-powered recommendations
2. **Skill Tracking** - Lacak perkembangan skill dan dapatkan learning path yang personalized
3. **Mental Wellness** - Jaga kesehatan mentalmu dengan mood tracker dan mindfulness exercises

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend/DB**: Supabase (Auth, Database, Storage)

## 📁 Struktur Proyek

```
careerpath-id/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles & design system
│   │   ├── layout.tsx          # Root layout with Navbar & Footer
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   └── layout/
│   │       ├── Navbar.tsx      # Navigation bar
│   │       └── Footer.tsx      # Footer
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts       # Browser-side Supabase client
│   │       ├── server.ts       # Server-side Supabase client
│   │       └── middleware.ts   # Auth session refresh helper
│   └── middleware.ts           # Next.js middleware
├── .env.local.example          # Environment variables template
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm atau yarn
- Akun Supabase (gratis di [supabase.com](https://supabase.com))

### Installation

1. Clone repository ini:
   ```bash
   git clone https://github.com/yourusername/careerpath-id.git
   cd careerpath-id
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

4. Edit `.env.local` dengan kredensial Supabase kamu:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. Jalankan development server:
   ```bash
   npm run dev
   ```

6. Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📦 Dependencies

```json
{
  "@supabase/supabase-js": "^2.x",
  "@supabase/ssr": "^0.x",
  "lucide-react": "^0.x",
  "next": "^14.x",
  "react": "^18.x",
  "tailwindcss": "^4.x"
}
```

## 🎨 Design System

CareerPath.id menggunakan design system modern dengan:

- **Primary Color**: Violet (#8b5cf6)
- **Secondary Color**: Indigo (#6366f1)
- **Gradients**: Violet to Indigo untuk elemen utama
- **Glassmorphism**: Untuk efek modern pada Navbar
- **Animations**: Smooth transitions dan micro-interactions

## 📄 License

Proyek ini adalah bagian dari Program Kreativitas Mahasiswa (PKM).

---

<p align="center">
  Dibuat dengan ❤️ di Makassar
</p>
