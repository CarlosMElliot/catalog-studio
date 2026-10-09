# Working on Catalog Studio

Read README.md and docs/ARCHITECTURE.md before changing behavior.

- Main UI: app/page.tsx; responsive styling: app/globals.css.
- Persistence and import semantics: lib/catalog.ts.
- PDF export: lib/pdf-export.ts. App themes must not change catalog/PDF branding.
- Bulk images: components/image-manager.tsx and lib/image-matching.ts.
- Product barcode display: components/product-barcode.tsx.
- Preserve string item codes and UPC leading zeros; imports match by item code and keep images and existing values for blank cells.
- Keep local IndexedDB data and profile settings compatible. Never wipe a workspace or reseed an existing empty catalog during upgrades.
- Keep destructive actions explicitly scoped and confirmed in the UI.
- Validate with pnpm exec tsc --noEmit, node --experimental-strip-types --test tests/catalog.test.ts, and pnpm build when changing executable code.
- Do not claim browser or physical-scanner verification unless performed. Existing delivery used type/build checks, logic tests, and encoding validation.
- This public repository includes approved sample catalog data. Never add credentials, environment secrets, or personal workspace backups.
- GitHub source changes do not deploy the hosted Site automatically. Preserve deployment separation unless explicitly asked to configure automation.

- Bundled images live in source-assets/images-*.json and are restored by scripts/restore-assets.mjs on install/dev/build. Preserve this hydration step and checksum validation.
