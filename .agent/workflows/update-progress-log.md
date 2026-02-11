---
description: How to update the progress log when making changes
---

# Update Progress Log Workflow
// turbo-all

**IMPORTANT**: Setiap kali membuat, memodifikasi, atau menyelesaikan fitur, WAJIB update `PROGRESS-LOG.md`.

## File Location
```
d:\Vibe coding (bisnis)\Aplikasi PKM careerpath.id\careerpath-id\blueprints\PROGRESS-LOG.md
```

## When to Update

Update progress log ketika:
1. Membuat file/komponen baru
2. Menyelesaikan fitur dari TODO list
3. Menambah API endpoint baru
4. Menjalankan database migration
5. Memperbaiki bug atau enhancement
6. Memulai development session baru
7. Mengubah blueprint documents

## How to Update

### 1. Update Implementation Status Table
Ubah status di tabel "IMPLEMENTATION STATUS PER PHASE":
```diff
-| Feature Name | 🔲 TODO | |
+| Feature Name | ✅ Done | Description of what was done |
```

Status options: `✅ Done`, `⚠️ Partial`, `🔲 TODO`

### 2. Add Session Log Entry
Tambahkan entry BARU di PALING ATAS section "SESSION LOG" (terbaru di atas):
```markdown
### YYYY-MM-DD — [Focus Area]
**Focus:** [Main focus area]
**Changes:**
- [What was done 1]
- [What was done 2]
- [What was done 3]
```

### 3. Update Quick Status Dashboard
Update angka-angka di tabel "QUICK STATUS DASHBOARD":
```markdown
| **Pages** | XX | XX | ✅ 100% |
| **API Routes** | XX+ | XX+ | ✅ 100% |
```

### 4. Update Known Issues (if applicable)
Jika menemukan issue baru, tambahkan ke "KNOWN ISSUES & TECH DEBT".
Jika menyelesaikan issue, hapus dari tabel.

### 5. Update Page/API Inventory (if new pages/routes added)
Jika menambah page atau API route baru:
- Tambahkan ke "PAGE INVENTORY" section
- Tambahkan ke "API ROUTE INVENTORY" section
- Update total count di Quick Status

## Verification Checklist
Sebelum commit, pastikan:
- [ ] Session log entry ditambahkan
- [ ] Status tabel di-update
- [ ] Quick Status numbers akurat
- [ ] Last Updated timestamp di-update
- [ ] Overall Progress percentage akurat
