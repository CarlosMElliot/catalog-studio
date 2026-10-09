# Customer application guide

Open `/app` for these features. Administrative tools live separately at `/admin`.

## Use it

1. Choose Nova Trading or the separate Excel product list from the catalog selector.
2. Search, filter by category, tag, active status, image availability, or positive stock.
3. Click a product to edit its code, description, brand, pack size, price, stock, tags, or image. Add products with **Add product**.
4. Choose **Import Excel**, select a worksheet and header row, map columns, review additions/updates/skipped rows, and import. Existing codes update; new codes append. Matching is trimmed and case-insensitive. Blank imported cells preserve existing values. Re-imports preserve product images. Item codes and names are required. Duplicate incoming codes and invalid numeric values are reported and skipped.
5. Edit **Brand & cover** to set the logo, contact details, cover title, subtitle, and color. The Nova reference logo can be restored at any time.
6. Click **Export catalog**. Choose all filtered products or the selected subset, 16 or 9 cards per page, cover, quick reference, and visible fields. Names are always shown. Customer PDFs do not import or expose cost price.
7. Download a workspace backup regularly. JSON backups embed uploaded and bundled images. Restore adds copies of catalogs rather than replacing current data.
8. Create or duplicate catalogs in **Catalogs**. Each has independent branding and products.

9. To start over, open **Settings**, choose the catalog, optionally keep branding, and select **Clear catalog & start over**. Type **CLEAR** in the confirmation. All products in that catalog are removed, even if hidden by filters. Other catalogs remain. The empty catalog autosaves and starter data does not reload. Download a backup before clearing if you need recovery.

## On-screen product barcodes

Every product with a UPC / barcode value displays a generated CODE128 SVG barcode in grid and list views. It updates automatically after manual edits or mapped spreadsheet imports. Click the barcode to open an enlarged black-on-white scanning view. The product editor also shows a live preview while entering the value. Empty values show **Add UPC / barcode**, and unsupported values show an error instead of a fabricated barcode. Leading zeros remain intact. These encode the supplied value as CODE128, consistent with the PDF export; they do not automatically create or validate a UPC-A checksum. Actual screen scanning depends on scanner support, screen size, brightness, and viewing distance.

## Bulk product images

Open **Bulk images** above the product library or **Bulk product images** in the sidebar.

- **Upload & match** accepts multiple JPG/JPEG/PNG/WebP files or a ZIP. Use `8110100.jpg`, `8110100__Product Name.jpg`, or an exact product-name filename. Matching prioritizes item codes, preserves leading zeros, and normalizes case/punctuation for product names. No fuzzy image/name guesses are made.
- Review the paginated preview. Search by item code or product name to correct a match. Uncheck images you do not want. Ambiguous and unmatched files require a manual selection or are skipped. Two checked images cannot target the same product. Existing images stay intact unless **Replace existing product images** is enabled.
- Click **Apply images** to decode and normalize all eligible files before updating products. A decoding error prevents the batch from applying. Catalog autosave then persists the new images.
- **Download images** exports selected, currently filtered, or all products with images in a ZIP. Files use item code + product name; `image-map.json` records each filename, original item code, and product name. Re-upload that ZIP to match by its mapping file.
- Limits: 10 MB per image, 2,000 images and 150 MB expanded per upload batch; ZIP input up to 50 MB. Image downloads are limited to 150 MB; filter/select smaller groups when needed. Product photos remain one image per product. The app normalizes uploaded images to JPEG at up to 1,000 pixels. Downloads contain those saved images, not a higher-resolution original.

## Profile and user preferences

Open **Settings** or click your profile at the bottom of the sidebar. Upload/remove a profile picture, set your display name, company, job title, contact email, phone, workspace name, and short bio. Click **Save settings** to apply; **Discard changes** restores the saved version. The sidebar shows your picture and name. Profile/contact fields do not change catalog branding or your sign-in account.

Under **App appearance**, select Original Sage, Navy & Teal, Charcoal & Amber, Indigo & Slate, Burgundy & Cream, Ocean Blue, or the Midnight & Mint dark theme. Clicking a palette immediately applies it throughout the app and saves it as your default for future visits. No Save button is needed for colors. Other unsaved profile edits stay separate; **Discard changes** does not undo a successfully saved theme. A failed theme save shows an error and restores the previous theme. The theme travels with profile backups, while product photos retain white backgrounds and catalog branding/PDF colors remain independent.

Choose a default grid/list view, 24/48/96 products per screen, startup page, default 9/16-card PDF layout, cover/index defaults, and success notifications. Errors stay visible. **Reset preferences** resets preference fields while retaining profile details, then Save applies the changes. Settings are kept in IndexedDB separately from catalogs, so clearing a catalog preserves your profile. New JSON backups include settings; restoring a backup offers a separate confirmation to apply its profile/preferences. Older backups remain supported.

## Persistence and recovery

Catalogs autosave to account-scoped cloud snapshots with an account-scoped IndexedDB recovery copy. Uploaded images are stored privately in the cloud and count toward your plan. Profile preferences remain device-local. Save failures are surfaced; do not assume local changes reached the cloud after an error. Keep portable downloaded backups in a PC folder.

## Included source data

- PDF: `NOVA TRADING USA CORP CATALOG (1).pdf`, 91 pages. Extracted 1,410 distinct 7-digit item codes, 1,408 product images, multilingual descriptions, pack specifications, and 12-digit barcode text.
- Six source categories: Philippines, Thailand, Korean, Vietnam, Chinese, Malaysia. The source spelling “Philppines” was normalized to Philippines; repeated header text was deduplicated.
- Two records have no detected embedded image: 8168200 (page 40) and 8176401 (page 47). They remain editable products with image placeholders.
- Excel: `stdrptProductsPrint (2).xls`, headers on row 3. Imported 1,031 records with both an item code and a name. Leading zeroes in textual item codes/UPCs are retained. Blank, footer, and unnamed rows are excluded.
- These are different product lists. The application does not guess correspondences or attach Nova photos to unrelated Excel products.
- PDF image extraction is a one-time preprocessing step for the supplied document. Arbitrary PDF-to-product import is not included. Future products come from Excel/CSV or manual entry.
- Image extraction uses the reference document's grid coordinates. Product details should be reviewed before customer distribution. The source barcode digits are retained; output uses CODE128 to represent those digits without silently changing potentially invalid source UPC checksums.

## Files

- `features/customer/components/catalog-app.tsx`: application UI, editing, import mapping, filtering, backup/restore.
- `app/globals.css`: responsive workspace styling.
- `lib/catalog.ts`: data types, defaults, merge behavior, image processing, cloud persistence and IndexedDB recovery.
- `lib/pdf-export.ts`: page plan, category index, cover, cards, image rendering, PDF download.
- `public/pdf-products.json`, `public/excel-products.json`, `public/products/`: extracted starter data/assets.
- `docs/ARCHITECTURE.md`: system architecture, portal separation, functional requirements and limits.
- `scripts/extract-sources.py`: reproducible extraction for the supplied source grid; adjust the input path for your PC. Requires Python, PyMuPDF, xlrd. Not required to run the app.
- `tests/catalog.test.ts`: merge, validation, and PDF index tests.

## Verification

Run `pnpm exec tsc --noEmit` and `node --experimental-strip-types --test tests/catalog.test.ts`.

Browser QA was unavailable in the build environment. End-to-end Excel import, IndexedDB persistence, backup restore, image upload, and PDF downloads need a browser smoke test on your PC. Build/type checks and data/merge/index tests are run during delivery. For large catalogs PDF generation can take several minutes; the progress indicator reports the current page. Each page is rasterized independently, avoiding one giant canvas. PDF text is image-based, not selectable or tagged for accessibility. Font coverage for Chinese depends on the browser/OS fonts.

## GitHub

Create an empty private GitHub repository, unpack this source, then run:

```sh
git init
git add .
git commit -m "Initial Catalog Studio application"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Do not commit personal workspace backups or secret keys. The bundled starter product catalog is included in the source; choose the repository's visibility accordingly. A GitHub repository or Supabase project has not been created on your behalf.

