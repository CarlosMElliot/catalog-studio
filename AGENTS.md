# Working on Catalog Studio

Read README.md, docs/CODE-MAP.md and docs/ARCHITECTURE.md before editing.

- Keep the two portals separate: `/app` → `features/customer`; `/admin` → `features/admin`; `/` is the founder chooser.
- Do not put administrative controls, links or admin imports in the customer feature tree. Shared pricing belongs in `features/shared` and primitives in `components/ui`.
- Preserve server-side founder authorization in app/admin/layout.tsx and every admin API. Editable profile fields and browser state must never grant access.
- Server helpers belong in lib/server. Never import those into client components.
- Persistence/import semantics: lib/catalog.ts. Quotas/pricing: lib/plans.ts and app/api/media. PDF export: lib/pdf-export.ts.
- Keep item codes and UPC leading zeros; imports match by item code and preserve images and blank/unmapped values.
- Preserve account-scoped local recovery and legacy owner migration. Never wipe an existing workspace or reseed a saved empty catalog during upgrades.
- Keep destructive actions explicitly scoped and confirmed. Clearing a catalog does not automatically delete stored images.
- Test with pnpm exec tsc --noEmit, node --experimental-strip-types --test tests/*.test.ts, python tests/storage-quota.py, and pnpm build.
- Do not claim browser, production multi-account or physical-scanner verification unless performed.
- Preserve DB/R2 ownership checks and atomic quota reservations, including pending upload bytes. Applied migrations are immutable.
- Billing is not connected. Do not present plan assignment as a real charge or manual active status as a verified payment.
- The public repo contains approved sample data only. Never add credentials, .dev.vars, private backups, customer records or hosted project identity.
- GitHub and Sites deployment remain separate; do not add automatic deployment unless requested.
- Portable images live in source-assets/images-*.json and restore through scripts/restore-assets.mjs. Preserve hydration hooks and checksum validation. The hosted checkout may retain materialized assets directly.
