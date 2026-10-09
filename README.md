# Catalog Studio

A product catalog platform with **two separate portals**: a customer application and a private founder dashboard. Both share one code repository and backend, while navigation, feature code and administrative authorization are separated.

## Open the application

| Portal | Live link | Who can access it |
| --- | --- | --- |
| Founder workspace chooser | [Open both workspaces](https://nova-catalog-studio.notmethekingofmyownl.chatgpt.site/) | Configured founder only; customers redirect to their app |
| Customer application | [Open catalog app](https://nova-catalog-studio.notmethekingofmyownl.chatgpt.site/app) | Authenticated account; founder can use their own workspace too |
| Founder administration | [Open admin dashboard](https://nova-catalog-studio.notmethekingofmyownl.chatgpt.site/admin) | Configured founder only, enforced on the server |
| Pricing | [View plans](https://nova-catalog-studio.notmethekingofmyownl.chatgpt.site/plans) | Subject to hosted Site access |

The current preview is **owner-private**. A customer record does not automatically grant access to the hosted Site. GitHub contains the source; it does not host the running application or deploy commits automatically.

## What belongs where?

| Customer application — `/app` | Founder administration — `/admin` |
| --- | --- |
| Create and manage product catalogs | Create and edit customer accounts |
| Import Excel/CSV with field mapping | Assign monthly plans |
| Add products, images and barcodes | Enable, trial, pause or suspend account writes |
| Bulk upload/match/download images | View storage usage across accounts |
| Filter products and export branded PDFs | Reject downgrades below current usage |
| Manage own profile, themes and storage | Review plan value and billing connection status |

Customers have no admin navigation or admin client imports. `/admin` has a server-side founder guard; `/api/admin/*` independently authorizes every request. User-entered profile roles do not grant privileges.

## Monthly plans

| Plan | USD / month | Hard image storage limit |
| --- | ---: | ---: |
| Starter | $40 | 500 MB |
| Essential | $60 | 1 GB |
| Professional | $80 | 2 GB |
| Business | $160 | 10 GB |
| Custom | Assigned per business | Founder-configured GB |

500 MB is the assumed allowance for the $40 plan. Units are decimal. All tiers include the same catalog tools. **Billing is not connected**: no real charges, checkout or automatic renewals occur. The founder's complimentary workspace is excluded from customer monthly plan value.

Custom plans let the founder set storage GB and monthly USD price per customer in **Admin → Create user / Edit account → Custom**. Existing usage must fit before lowering an allowance.

Download the [Excel import template](https://nova-catalog-studio.notmethekingofmyownl.chatgpt.site/templates/catalog-import-template.xlsx), or find it in **Customer app → Import spreadsheet**. The blank Products sheet is ready for your data; Examples and Instructions explain the supported fields.

## Find the code

| Path | Responsibility |
| --- | --- |
| `app/page.tsx` | Founder chooser; customer redirect |
| `app/app/page.tsx` | Authenticated customer entry point |
| `app/admin/layout.tsx` | Founder-only route boundary |
| `app/admin/page.tsx` | Admin entry point |
| `features/customer/components/` | Catalog editor, bulk images, barcodes, plan/storage screen |
| `features/admin/components/` | Founder dashboard and customer management |
| `features/shared/components/` | Shared plan presentation |
| `components/ui/` | Reusable UI primitives |
| `app/api/admin/` | Founder API endpoints |
| `app/api/account/`, `app/api/workspace/`, `app/api/media/` | Account-scoped customer APIs |
| `lib/server/` | Server authorization, database and object-storage helpers |
| `lib/auth/` | Shared, testable access-policy logic |
| `lib/catalog.ts` | Catalog models, import rules, cloud persistence and local recovery |
| `lib/plans.ts` | Prices and enforced byte allowances |
| `lib/pdf-export.ts` | PDF generation and page/index planning |
| `db/`, `drizzle/` | D1 schema and committed migrations |
| `tests/` | Catalog behavior, founder policy and storage quota checks |
| `docs/` | Setup, user guide, architecture and billing specifications |

## Start here

1. **Use either portal:** open the links above with the founder account.
2. **Run or deploy the source:** follow [Setup and deployment](docs/SETUP.md).
3. **Work on code:** read [Code map](docs/CODE-MAP.md) and [AGENTS.md](AGENTS.md).
4. **Learn customer features:** read [Customer guide](docs/USER-GUIDE.md).
5. **Manage users/plans:** read [Admin and billing specifications](docs/ADMIN-AND-BILLING.md).
6. **Understand the design:** read [Architecture and functional requirements](docs/ARCHITECTURE.md).

## Stack and current state

React, TypeScript, Next.js App Router conventions, Tailwind, shadcn components, Lucide, SheetJS, JsBarcode and html2pdf.js, served through Vinext/Cloudflare. D1 stores accounts and image reservations; R2 stores private images and catalog snapshots. IndexedDB holds device preferences and a recovery copy.

The GitHub source distribution reconstructs the 1,408 bundled product images and logo from checksum-verified `source-assets/images-*.json` using `scripts/restore-assets.mjs` during install/dev/build. The hosted checkout can retain those materialized assets directly. Approved Nova and Excel sample data are included; production account records and secrets are not.

Type checks, catalog tests and quota SQL checks have passed. Browser interaction, customer launch and real billing remain separate verification/integration work. See [Setup](docs/SETUP.md) before exposing this app on another host: its trusted identity adapter requires the Sites gateway or a replacement verified authentication implementation.


## Catalog style survey
Open **Customer app → Brand & cover → Find your catalog style**. The ten-question survey covers industry, audience, goal, range size, layout, required fields, photos, typography, palette and viewing format. Back/Next preserves current answers; Close without applying leaves the saved design intact. Applying a recommendation saves the answers and design with that catalog, including cloud recovery and backups. Reopen to review or retake it.

Three recommendations offer cover, product and index previews using existing products. Customize layout, fonts, palette and Letter/A4 before applying. Six implemented PDF layouts: four-card showcase, nine-card balanced, sixteen-card wholesale, one-product editorial, three wide technical panels, and mixed (one hero page per category followed by nine-card grids). Specifications/benefits use the existing description field; this does not add variant, MOQ, discount or comparison-table data models. Technical panels are not automatic specification comparison tables. Layout thumbnails are illustrative, not exact PDF proofs.

Five Google Fonts pairings are requested from Google Fonts; installed fallback fonts are used if those resources are unavailable. The app waits for selected fonts before export. Five palette presets plus the existing brand color are available. App UI themes remain independent of PDF design. Larger layouts preserve high-resolution rendering, vector barcodes and export cancellation. Source photos determine actual image detail.

Implementation: `lib/catalog-style.ts` defines questions, validated settings and deterministic recommendations; `features/customer/components/catalog-style-survey.tsx` presents the survey and previews; `lib/pdf-export.ts` implements designs. No external AI or paid template service is used. Recommendation tests, persistence validation and mixed-layout pagination tests live in `tests/catalog-style.test.ts`. Browser visual verification remains outstanding.



## Automatic catalog setup: expanded survey
New catalog actions now open a 20-question setup survey with the catalog name in the same dialog. Applying a design creates a new empty catalog and returns to Products; cancelling creates nothing. There is no visual page editor. Import products, upload/match images, and export from the existing workflow.

The original ten questions are followed by explicit choices for barcode source, photo placement, description length, cover, contents, product sorting, tags/dietary notes, contact details, missing-code handling, and reuse of branding. Existing ten-answer catalogs remain valid and can reopen the expanded questionnaire. Settings are saved with each catalog and included in backups.

Eight layout engines include the original six plus a four-dish restaurant menu and four-card café showcase. Every layout uses `lib/pdf-card.ts` and supports optional vector CODE128 barcodes. Users choose UPC/barcode field, SKU, or no barcode; missing UPC behavior is omit, SKU fallback or stop with a product-specific error. Choosing SKU does not assign or validate retail UPCs and never changes stored product identifiers. Barcode source and missing-code rules apply to PDF exports; the product library continues to display the actual UPC/barcode field.

Menu rows reserve room for optional barcodes and use aligned prices. Product photos can sit above/beside details or be omitted. Brief descriptions explicitly use the first 180 characters with an ellipsis; full saved text remains unchanged. Dietary notes use user-entered tags and are never inferred. Cover/contents choices load with the catalog; normal export options can override page inclusion for an export. Sort choices operate on a copy of products. Hidden contact settings remove contact data from PDF cover/footer/index. Blank-branding choice applies only when creating a new catalog.

Overflow is reported rather than clipping or overlapping barcode areas. Physical barcode scanning and browser visual verification have not been completed. Tests cover every layout’s barcode markup, source selection, missing-code rules, leading zeros, description behavior and legacy answers. Restaurant positioning can be further refined from user-supplied PDF/image references; none are required to complete setup.
