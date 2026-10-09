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
