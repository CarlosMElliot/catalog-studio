# Setup and deployment

## Access the existing preview

- Customer application: https://nova-catalog-studio.notmethekingofmyownl.chatgpt.site/app
- Founder dashboard: https://nova-catalog-studio.notmethekingofmyownl.chatgpt.site/admin
- Founder chooser: https://nova-catalog-studio.notmethekingofmyownl.chatgpt.site/

Sign in with the configured founder account. The current Site remains owner-private. The founder can open both portals; customers never gain admin permission from knowing its URL.

## Local PC development

Requirements: Node.js 22.13+ and pnpm (the pinned version is in package.json). Python 3 is needed only for the quota test or extraction tools.

```sh
git clone https://github.com/CarlosMElliot/catalog-studio.git
cd catalog-studio
pnpm install
```

The install step restores bundled images with checksum verification. Do not remove the restoration script or its postinstall/dev/build hooks.

Create a local `.dev.vars` file by copying `.dev.vars.example`. Its example founder is `seedy@sites.test`, matching the starter's **loopback-only development sign-in**. This is not a real user or a production login. The example file contains no secret. Do not commit `.dev.vars`.

Build once to produce the local Worker configuration:

```sh
pnpm build
```

On a **fresh local database only**, apply the two existing migrations in order:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_nebulous_snowbird.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_tense_wolf_cub.sql
pnpm dev
```

Open the loopback URL printed by the server (normally `http://localhost:5173`). Sign in through the local development flow, then use `/`, `/app`, or `/admin`. Apply each migration once; for an existing local database, apply only pending migrations. Local and hosted databases are separate. The development sign-in does not grant access to the real hosted Site.

## Hosted configuration

The app requires D1 binding `DB`, R2 binding `BUCKET`, and runtime `CATALOG_ADMIN_EMAIL` set to the founder's verified sign-in email. The hosted manifest declares the bindings; the portable GitHub copy intentionally contains no Site project ID. Existing hosted deployments must retain their own ID.

The current auth adapter reads trusted headers supplied by the Sites gateway. Do not deploy it as an unprotected public server on another provider: ordinary request headers are not authentication. Before using a different host, replace `app/chatgpt-auth.ts` with verified session/token handling and retain all server authorization checks. The code is not a drop-in Vercel deployment.

On Sites, pending schema migrations are applied during publication. Set runtime variables through hosting configuration rather than source files. Deploy after environment changes. Keep `.dev.vars` and real credentials out of source archives.

## Validation

```sh
pnpm exec tsc --noEmit
node --experimental-strip-types --test tests/*.test.ts
python tests/storage-quota.py
pnpm build
```

These cover static typing, catalog logic, founder identity policy, portal import separation and quota SQL including concurrent reservations. Browser interactions and customer cross-account runtime sessions have not been verified in this environment. Existing PDF/scanner limitations are described in the customer guide.

## Production launch work

Creating a user record does not send an invitation or change hosted sharing. Deliberately configure customer access when ready. Payment collection is not connected: follow the provider integration requirements in [Admin and billing](ADMIN-AND-BILLING.md) before charging customers. Do not treat manual `active` status as payment proof.
