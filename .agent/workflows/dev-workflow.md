---
description: Standard development workflow for CareerPath.id project
---

# CareerPath.id Development Workflow
// turbo-all

## Before Starting Any Work

1. **Read the progress log** to understand current state:
   ```
   View: blueprints/PROGRESS-LOG.md
   ```

2. **Check the blueprint documents** for context:
   - `blueprints/MASTERPLAN-BLUEPRINT.md` — Architecture, AI Modules, Roadmap
   - `blueprints/ADMIN-BLUEPRINT.md` — Admin panel modules & Supabase schema
   - `blueprints/UI-UX-BLUEPRINT.md` — Design system & page patterns
   - `blueprints/OPTIMIZATION-BLUEPRINT.md` — Performance & optimization guide
   - `blueprints/STANDAR-FEATURE-BLUEPRINT.md` — Standard features checklist

3. **Check next priorities** in PROGRESS-LOG.md → "NEXT PRIORITIES" section

## During Development

1. Follow implementation phases from MASTERPLAN-BLUEPRINT.md
2. Use existing patterns from completed features
3. Follow design system from UI-UX-BLUEPRINT.md
4. Test changes with `npm run dev` at http://localhost:3000
5. Check for TypeScript errors: `npx tsc --noEmit`

## After Completing Work

1. **Update PROGRESS-LOG.md** using the `/update-progress-log` workflow:
   - Add session log entry (terbaru di atas)
   - Update implementation status tables
   - Update quick status numbers
   - Update known issues if applicable

2. **Verify build** (optional):
   ```powershell
   npm run build
   ```

## Key File Locations

| Purpose | Location |
|---------|----------|
| Blueprints | `blueprints/*.md` |
| Dashboard pages | `src/app/dashboard/*/page.tsx` |
| Admin pages | `src/app/admin/*/page.tsx` |
| API endpoints | `src/app/api/*/route.ts` |
| Components | `src/components/*.tsx` |
| Layout components | `src/components/layout/*.tsx` |
| Supabase client | `src/lib/supabase/` |
| Utilities | `src/lib/utils.ts` |
| E2E tests | `tests/*.spec.ts` |
| Next.js config | `next.config.ts` |

## Environment Variables

All required env vars are in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `GROQ_API_KEY` — Groq AI API key
- `MIDTRANS_SERVER_KEY` — Midtrans payment (sandbox)
- `MIDTRANS_CLIENT_KEY` — Midtrans client key

## Quick Commands

```powershell
# Development server
npm run dev

# Type check
npx tsc --noEmit

# Build production
npm run build

# Run E2E tests
npx playwright test

# Database push
npx supabase db push
```
