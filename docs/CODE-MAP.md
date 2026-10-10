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
Open **Customer app → Brand & cover → Find your catalog style**. The survey asks five questions: business, purpose, visual design, visible details and barcodes. Other preferences are available under Optional settings on the last step. Back/Next preserves current answers; Close without applying leaves the saved design intact. Saving choices preserves the answers and design with that catalog, including cloud recovery and backups. Reopen to review or change choices.

Three recommendations offer cover, product and index previews using existing products. Customize layout, fonts, palette and Letter/A4 before applying. Six implemented PDF layouts: four-card showcase, nine-card balanced, sixteen-card wholesale, one-product editorial, three wide technical panels, and mixed (one hero page per category followed by nine-card grids). Specifications/benefits use the existing description field; this does not add variant, MOQ, discount or comparison-table data models. Technical panels are not automatic specification comparison tables. Layout thumbnails are illustrative, not exact PDF proofs.

Five Google Fonts pairings are requested from Google Fonts; installed fallback fonts are used if those resources are unavailable. The app waits for selected fonts before export. Five palette presets plus the existing brand color are available. App UI themes remain independent of PDF design. Larger layouts preserve high-resolution rendering, vector barcodes and export cancellation. Source photos determine actual image detail.

Implementation: `lib/catalog-style.ts` defines questions, validated settings and deterministic recommendations; `features/customer/components/catalog-style-survey.tsx` presents the survey and previews; `lib/pdf-export.ts` implements designs. No external AI or paid template service is used. Recommendation tests, persistence validation and mixed-layout pagination tests live in `tests/catalog-style.test.ts`. Browser visual verification remains outstanding.


## Automatic catalog setup: expanded survey
New catalog actions now open a five-question setup survey with the catalog name in the same dialog. Applying a design creates a new empty catalog and returns to Products; cancelling creates nothing. There is no visual page editor. Import products, upload/match images, and export from the existing workflow.

Legacy saved answers retain explicit choices for barcode source, photo placement, description length, cover, contents, product sorting, tags/dietary notes, contact details, missing-code handling, and reuse of branding. Existing ten-answer catalogs remain valid and can reopen the expanded questionnaire. Settings are saved with each catalog and included in backups.

Eight layout engines include the original six plus a four-dish restaurant menu and four-card café showcase. Every layout uses `lib/pdf-card.ts` and supports optional vector CODE128 barcodes. Users choose UPC/barcode field, SKU, or no barcode; missing UPC behavior is omit, SKU fallback or stop with a product-specific error. Choosing SKU does not assign or validate retail UPCs and never changes stored product identifiers. Barcode source and missing-code rules apply to PDF exports; the product library continues to display the actual UPC/barcode field.

Menu rows reserve room for optional barcodes and use aligned prices. Product photos can sit above/beside details or be omitted. Brief descriptions explicitly use the first 180 characters with an ellipsis; full saved text remains unchanged. Dietary notes use user-entered tags and are never inferred. Cover/contents choices load with the catalog; normal export options can override page inclusion for an export. Sort choices operate on a copy of products. Hidden contact settings remove contact data from PDF cover/footer/index. Blank-branding choice applies only when creating a new catalog.

Overflow is reported rather than clipping or overlapping barcode areas. Physical barcode scanning and browser visual verification have not been completed. Tests cover every layout’s barcode markup, source selection, missing-code rules, leading zeros, description behavior and legacy answers. Restaurant positioning can be further refined from user-supplied PDF/image references; none are required to complete setup.
