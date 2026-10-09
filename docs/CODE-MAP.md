# Code map and change guide

## Portal ownership

- `app/page.tsx`: founder-only workspace chooser. Authenticated non-founders redirect to `/app`.
- `app/app/page.tsx` → `features/customer/components/catalog-app.tsx`: customer application. Do not import admin components here.
- `app/admin/layout.tsx` → `app/admin/page.tsx` → `features/admin/components/admin-dashboard.tsx`: founder console. Keep server authorization at the layout and API boundaries.
- `features/shared/components/plan-cards.tsx`: pricing reused by both portals; contains no admin actions.

## Common changes

| Change | Files |
| --- | --- |
| Founder authorization | `lib/auth/access-policy.ts`, `lib/server/account.ts`, `app/admin/layout.tsx` |
| Account creation / plan assignment | `app/api/admin/accounts/route.ts`, admin dashboard |
| Prices / quotas | `lib/plans.ts`; update docs and consider migration of existing account quotas |
| Product editing / filters / catalog controls | `features/customer/components/catalog-app.tsx` |
| Bulk image mapping | `features/customer/components/image-manager.tsx`, `lib/image-matching.ts` |
| Barcode display | `features/customer/components/product-barcode.tsx` |
| PDF layout / index | `lib/pdf-export.ts` |
| Cloud image quota enforcement | `app/api/media/route.ts` and `app/api/media/[id]/route.ts` |
| Cloud snapshot validation | `app/api/workspace/route.ts` |
| Import semantics / recovery / profile settings | `lib/catalog.ts` |
| Styles / themes | `app/globals.css`, `lib/themes.ts` |
| Schema changes | `db/schema.ts`, generate and commit `drizzle/` migrations |
| Authentication provider | `app/chatgpt-auth.ts`; replace only with an equivalent verified server identity adapter |

## Dependency direction

Route files connect server guards to feature entry points. Customer and admin modules may import shared UI and domain helpers. Customer modules must not import admin modules. Client modules must not import `lib/server/`. Every API request is authorized independently of navigation visibility.

D1/R2 bindings and auth environment values are server-only. Keep `CATALOG_ADMIN_EMAIL` in runtime configuration. Never promote a user based on their editable profile role or local storage.

## Source/deployment workflow

The public GitHub repository is the portable source distribution. The ChatGPT Site is a separate deployed environment. A GitHub commit alone does not publish it. Preserve both route entry points when syncing. The portable hosting manifest declares DB/BUCKET without copying the existing Site project ID. Secrets, account records, backups and generated local state must never be copied to GitHub.

When producing a future release, run the checks in SETUP.md, review migration history, then publish the matching build. Keep billing-unconnected messaging until payment collection and signed webhook verification actually exist.


## Catalog style survey
Open **Customer app → Brand & cover → Find your catalog style**. The ten-question survey covers industry, audience, goal, range size, layout, required fields, photos, typography, palette and viewing format. Back/Next preserves current answers; Close without applying leaves the saved design intact. Applying a recommendation saves the answers and design with that catalog, including cloud recovery and backups. Reopen to review or retake it.

Three recommendations offer cover, product and index previews using existing products. Customize layout, fonts, palette and Letter/A4 before applying. The initial six PDF layouts (expanded below): four-card showcase, nine-card balanced, sixteen-card wholesale, one-product editorial, three wide technical panels, and mixed (one hero page per category followed by nine-card grids). Specifications/benefits use the existing description field; this does not add variant, MOQ, discount or comparison-table data models. Technical panels are not automatic specification comparison tables. Layout thumbnails are illustrative, not exact PDF proofs.

Five Google Fonts pairings are requested from Google Fonts; installed fallback fonts are used if those resources are unavailable. The app waits for selected fonts before export. Five palette presets plus the existing brand color are available. App UI themes remain independent of PDF design. Larger layouts preserve high-resolution rendering, vector barcodes and export cancellation. Source photos determine actual image detail.

Implementation: `lib/catalog-style.ts` defines questions, validated settings and deterministic recommendations; `features/customer/components/catalog-style-survey.tsx` presents the survey and previews; `lib/pdf-export.ts` implements designs. No external AI or paid template service is used. Recommendation tests, persistence validation and mixed-layout pagination tests live in `tests/catalog-style.test.ts`. Browser visual verification remains outstanding.


## Guided design workspace (October 2026)
- **New catalog** opens the ten-question survey immediately, with the name field in the same flow. Nothing is created until a design is applied; closing leaves existing catalogs intact. A new catalog inherits the current business branding but starts without products or sections.
- **Design studio** provides a page rail, illustrative live preview and contextual inspector. Edit cover text/logo, select products to open the editor, rename/reorder categories, or add introductions, featured products, notes/comments, ordering instructions and contact sections. Notes are catalog content, not collaborative comment threads.
- Sections can be moved earlier/later and placed before or after product pages. Delete requires confirmation. Text is limited to 1,800 characters per section; add more sections for longer content. Category divider pages, cover and contents are optional. Up to 40 custom sections are supported.
- Table-of-contents entries and final page numbers are generated from the same `documentPlan` as the exported PDF, including sections, divider pages and mixed layouts. Preview pagination assumes the entire catalog; exporting from Design studio resets product filters. Library exports retain their current filters.
- The gallery contains 15 industry presets over nine layout engines. Restaurant/café layouts group dishes by product category, align prices and use the existing tags field for dietary notes (entered by the business, never inferred). Classic menus omit photographs; café menus include them. Comparison pages support the selected product fields in a table.
- Survey palette choice **Recommend for my business** maps industry to a curated palette. These are design recommendations, not measured popularity rankings. Presets were informed by Canva restaurant/café menu galleries and Flipsnack industry catalog galleries. References: https://www.canva.com/menus/templates/cafe/ and https://www.flipsnack.com/templates/catalogs . No third-party template assets are copied.
- App theme colors are unchanged. Design choices apply to the catalog. The default startup screen for new preferences is Design studio; previously saved startup preferences still apply. Advanced workspace tools are collapsed by default.
- Data model: optional `Catalog.document` holds validated sections and page switches; optional `Catalog.style.template` identifies a preset. Existing catalogs require no migration. Both objects persist in cloud snapshots, recovery copies and JSON backups.
- Source: `features/customer/components/design-workspace.tsx`, `catalog-style-survey.tsx`, `lib/catalog-document.ts`, `lib/catalog-style.ts`, and `lib/pdf-export.ts`. Tests cover multi-page contents offsets, category dividers, section order, storage validation and all preset configurations.
- Preview is illustrative, not pixel-identical to the PDF. There is no free-position drag-and-drop editor or collaborative review system. Export detects overflowing text rather than silently clipping it. Google Fonts needs network access; installed fallback fonts apply if unavailable. Browser visual/scanner verification remains outstanding.
