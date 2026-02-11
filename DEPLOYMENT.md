# 🚀 Panduan Deployment ke Vercel

## Persiapan

### 1. Push ke GitHub (jika belum)

```bash
# Pastikan sudah di folder project
cd d:\Vibe coding (bisnis)\Aplikasi PKM careerpath.id\careerpath-id

# Inisialisasi git (jika belum)
git init

# Buat .gitignore (sudah ada dari Next.js)

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit: CareerPath.id - PKM Demo"

# Tambahkan remote (ganti dengan repo kamu)
git remote add origin https://github.com/USERNAME/careerpath-id.git

# Push ke GitHub
git push -u origin main
```

---

## Deployment ke Vercel

### Opsi A: Via Vercel CLI (Cepat)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login ke Vercel
vercel login

# 3. Deploy!
vercel

# 4. Ikuti instruksi:
#    - Set up and deploy? Y
#    - Which scope? (pilih akun kamu)
#    - Link to existing project? N
#    - Project name? careerpath-id
#    - Directory? ./
#    - Override settings? N

# 5. Setelah deploy, set environment variables:
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste: https://ibagmveiwjewxtlyjovz.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste: (anon key dari Supabase)

# 6. Redeploy dengan env vars
vercel --prod
```

### Opsi B: Via Dashboard Vercel (Mudah)

1. **Buka [vercel.com](https://vercel.com)** dan login/signup

2. **Klik "Add New..." → "Project"**

3. **Import repositori GitHub:**
   - Connect ke GitHub
   - Pilih repository `careerpath-id`
   - Klik "Import"

4. **Konfigurasi Project:**
   - Framework Preset: `Next.js` (otomatis terdeteksi)
   - Root Directory: `./` (biarkan default)
   
5. **Set Environment Variables:**
   Klik "Environment Variables" dan tambahkan:
   
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://ibagmveiwjewxtlyjovz.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` (anon key lengkap) |

6. **Klik "Deploy"** 🚀

---

## Setelah Deploy

### 1. Update Supabase Auth Settings

Buka Supabase Dashboard → Authentication → URL Configuration:

- **Site URL:** `https://careerpath-id.vercel.app` (ganti dengan URL Vercel kamu)
- **Redirect URLs:** 
  - `https://careerpath-id.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback` (untuk development)

### 2. Verifikasi Deployment

Buka URL yang diberikan Vercel dan test:
- [ ] Landing page tampil
- [ ] Register user baru
- [ ] Login
- [ ] Dashboard dengan Skill Gap Analysis
- [ ] Wellness check (GAD-7)
- [ ] Skill Challenge dengan confetti

---

## Tips untuk Demo PKM

### URL yang Bisa Ditampilkan:
- **Landing:** `https://[your-app].vercel.app`
- **Dashboard:** `https://[your-app].vercel.app/dashboard`
- **Wellness:** `https://[your-app].vercel.app/dashboard/wellness`

### Demo Flow yang Disarankan:
1. Tampilkan landing page (hero section)
2. Register user demo
3. Complete onboarding
4. Pilih karier → tunjukkan skill gap analysis
5. Klik skill → demo weekly challenge
6. Complete skill → **CONFETTI!** 🎊
7. Buka wellness → demo GAD-7

### Troubleshooting:

**Build Error:**
```bash
# Cek error lokal dulu
npm run build
```

**Env Vars Tidak Terdeteksi:**
- Pastikan prefix `NEXT_PUBLIC_` untuk variabel yang diakses di client
- Redeploy setelah menambah env vars

**Auth Redirect Gagal:**
- Pastikan URL di Supabase Auth Settings sudah diupdate

---

## 🎉 Selamat!

Aplikasi CareerPath.id kamu sudah live dan siap untuk demo PKM!

**URL Production:** `https://[project-name].vercel.app`
