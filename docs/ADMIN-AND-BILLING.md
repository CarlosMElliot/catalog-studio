# Customer accounts, plans and storage

## Price schedule

| Plan | USD / month | Image allowance |
| --- | ---: | ---: |
| Starter | $40 | 500 MB |
| Essential | $60 | 1 GB |
| Professional | $80 | 2 GB |
| Business | $160 | 10 GB |

The original request did not specify the $40 allowance; 500 MB is the chosen default. MB and GB are decimal. Prices are subscription list prices; no tax calculation, money collection or automatic renewal is implemented. The owner's complimentary Business workspace is excluded from customer counts and monthly plan value. All tiers include the existing catalog features. Storage is the differentiator.

## Portal separation

The founder opens `/` to choose `/admin` or `/app`. Customers are redirected to `/app`; its navigation contains no admin entry. The `/admin` route layout enforces the founder check, and each admin API handler checks again. Modules live under `features/admin` and `features/customer`; shared pricing and primitive UI live outside both. This is one deployable app with separate portals, not two separate hosting services.

## Screens and requirements

- `/admin`: separate founder-only overview, customer directory, search/status filters, create and edit accounts, plan assignment, manual pending/trial/active/suspended access, and storage usage.
- `/plans`: pricing presentation and explicit billing-unconnected notice.
- `/app` sidebar → Plan & storage: account allowance, usage meter, plan comparison, and uploaded-image management.
- User creation adds an account record for a sign-in email. It does not create a password, send an email invitation, grant Site sharing access or charge a customer.
- Pending/suspended accounts cannot upload images or save cloud catalog changes. Read/download remains available to retrieve existing work. Local editing is not proof of saved cloud changes.
- Downgrades fail while current image usage is above the requested allowance.
- Profile and display preferences are device-local and namespaced by account. Catalogs and uploaded images are account-scoped cloud records. The owner's existing browser catalog/settings are migrated on first use if no cloud workspace exists.

## Architecture and data flow

The Next-compatible Vinext app runs on a Cloudflare Worker. Sites trusted authentication supplies identity. `CATALOG_ADMIN_EMAIL`, stored in runtime configuration, identifies the administrator. It must be configured independently on a new deployment. All admin endpoints authorize this identity server-side; profile text or client flags cannot grant access. Customer email records bind to a stable trusted user ID on first sign-in. This app depends on the Sites authentication gateway; direct GitHub/Vercel deployment requires replacing that identity adapter with verified authentication before exposing it.

D1 `accounts` stores plan, byte allowance, access status and user binding. D1 `media` stores ownership, actual bytes, MIME type, creation time and upload state. R2 stores private image bytes and account-scoped catalog JSON snapshots. Tracked Drizzle migrations create the database schema. No customer data or secrets are seeded in migrations.

Every upload is checked on the server, limited to 10,000,000 bytes, checked for JPEG/PNG/WebP signatures, hashed, and deduplicated within the account. A single conditional SQL statement reserves bytes only when the account is enabled and the new total fits its quota. Pending reservations count toward usage, including during concurrent uploads and plan changes. Failed uploads release their reservation. Owner limits are enforced like customer limits. Image reads and deletes require the owning account. Mutation endpoints require a same-origin request.

The browser normalizes uploads to JPEG at a maximum dimension of 1000 pixels, then sends them to the media endpoint. Compressed stored bytes count toward allowance. Bulk uploads, individual product photos, logos, restored images and profile photos use the same storage path. Shared original sample assets do not consume individual allowances. Removing a product or wiping its catalog does not delete a reusable image; delete the stored image explicitly from Plan & storage to reclaim space. Image deletion can break existing references, so the UI warns before deletion.

Catalog snapshots are limited to 20 MB of metadata and use last-save-wins semantics. The app retains an account-scoped browser recovery copy and supports portable backup. Do not edit the same account simultaneously in multiple tabs/devices if you need merge semantics. A restored backup uploads its embedded images during cloud save. If quota is insufficient, local recovery data remains and the save error is shown. Images successfully uploaded before a later bulk operation fails remain visible in storage for cleanup.

## Billing integration still required

There is deliberately no fake checkout or stored card form. Before charging customers:

1. Choose/configure a payment provider such as Stripe in your merchant account.
2. Create four recurring monthly USD prices matching `lib/plans.ts` and store provider price IDs/server secrets in runtime configuration.
3. Add a server-created checkout session for the authenticated account and selected allowlisted price. Never accept amount or quota from the client.
4. Add signature-verified, idempotent subscription/payment webhooks. Update access and plan from verified provider events, not the checkout return URL. Handle delayed/out-of-order events, failed renewal, cancellation, refunds and grace policy explicitly.
5. Add a provider billing portal for card changes and cancellations, and define downgrade behavior when usage exceeds the new plan. Retain read/download access during suspension.
6. Complete sandbox payment and webhook tests before enabling live collection. Display actual collected revenue only from verified payment records.
7. Explicitly enable customer access through Site sharing or a production deployment with equivalent verified authentication. This preview stays owner-private.

## Verification

`node node_modules/typescript/bin/tsc --noEmit`

`node --experimental-strip-types --test tests/catalog.test.ts`

`python tests/storage-quota.py`

The SQLite test exercises the actual production reservation and downgrade SQL, including concurrent reservations, exact limits, overflow, account separation, duplicates, suspension and rejection of undersized plans. Browser interaction, payment-provider integration and production customer onboarding require further verification; payment collection is not implemented.
