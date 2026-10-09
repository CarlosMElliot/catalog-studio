# Customer application guide

Open `/app` for these features. Administrative tools live separately at `/admin`.

## Excel import template

Choose **Download import template** in the sidebar or **Download Excel template** inside the importer. Fill the blank **Products** sheet and select it when importing. **Examples** contains fictional rows and **Instructions** explains each rule. Item Code and Item Name are required. Codes and UPCs use Text formatting to preserve leading zeros. Upload images separately, named by item code. The first 1,000 rows have prepared formats and a Yes/No Active dropdown; you can add more rows.

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
- Click **Apply images** to decode and validate all eligible files before updating products. A decoding error prevents the batch from applying. Catalog autosave then persists the new images.
- **Download images** exports selected, currently filtered, or all products with images in a ZIP. Files use item code + product name; `image-map.json` records each filename, original item code, and product name. Re-upload that ZIP to match by its mapping file.
- Limits: 10 MB per image, 2,000 images and 150 MB expanded per upload batch; ZIP input up to 50 MB. Image downloads are limited to 150 MB; filter/select smaller groups when needed. Product photos remain one image per product. New uploads preserve original image resolution and format. Previously reduced images need to be replaced with better originals; downloads cannot recover missing detail.

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


## PDF generation progress

After clicking Download PDF, the export options are replaced by a separate progress popup. It shows the stage, percentage and completed pages, with no filters or redundant Generating button. Keep the tab open without refreshing: PDF generation runs in this browser, so leaving interrupts it and requires restarting the export. The app requests the browser's standard leave/refresh warning while work is active; browsers decide whether to display that warning.

Large catalogs can take a few minutes because images and pages are processed individually, and speed depends on the device. Once complete, the popup shows Done and points to the browser downloads/save dialog. Errors offer Try again and Back to export options. Saved catalog data is not cleared by an export failure.

### PDF quality and cancellation
PDF pages render at 300 DPI; CODE128 barcodes are drawn as vector bars and text so they remain sharp when zoomed or printed. Photo quality still depends on the original upload. Larger originals consume more storage. High-resolution exports take longer and create larger files.

The standalone progress dialog offers **Cancel export** until final download preparation. Cancellation stops after the current page finishes, discards the partial PDF and keeps your catalog unchanged. Restart from export options or Try again. Keep the window open and avoid refresh while exporting. Once the browser download handoff starts, cancellation is unavailable. No pause/resume is provided.


## Catalog style survey
Open **Customer app → Brand & cover → Find your catalog style**. The survey (now expanded to 20 questions) covers industry, audience, goal, range size, layout, required fields, photos, typography, palette and viewing format. Back/Next preserves current answers; Close without applying leaves the saved design intact. Applying a recommendation saves the answers and design with that catalog, including cloud recovery and backups. Reopen to review or retake it.

Three recommendations offer cover, product and index previews using existing products. Customize layout, fonts, palette and Letter/A4 before applying. Six implemented PDF layouts: four-card showcase, nine-card balanced, sixteen-card wholesale, one-product editorial, three wide technical panels, and mixed (one hero page per category followed by nine-card grids). Specifications/benefits use the existing description field; this does not add variant, MOQ, discount or comparison-table data models. Technical panels are not automatic specification comparison tables. Layout thumbnails are illustrative, not exact PDF proofs.

Five Google Fonts pairings are requested from Google Fonts; installed fallback fonts are used if those resources are unavailable. The app waits for selected fonts before export. Five palette presets plus the existing brand color are available. App UI themes remain independent of PDF design. Larger layouts preserve high-resolution rendering, vector barcodes and export cancellation. Source photos determine actual image detail.

Implementation: `lib/catalog-style.ts` defines questions, validated settings and deterministic recommendations; `features/customer/components/catalog-style-survey.tsx` presents the survey and previews; `lib/pdf-export.ts` implements designs. No external AI or paid template service is used. Recommendation tests, persistence validation and mixed-layout pagination tests live in `tests/catalog-style.test.ts`. Browser visual verification remains outstanding.


## Automatic catalog setup: expanded survey
New catalog actions now open a 20-question setup survey with the catalog name in the same dialog. Applying a design creates a new empty catalog and returns to Products; cancelling creates nothing. There is no visual page editor. Import products, upload/match images, and export from the existing workflow.

The original ten questions are followed by explicit choices for barcode source, photo placement, description length, cover, contents, product sorting, tags/dietary notes, contact details, missing-code handling, and reuse of branding. Existing ten-answer catalogs remain valid and can reopen the expanded questionnaire. Settings are saved with each catalog and included in backups.

Eight layout engines include the original six plus a four-dish restaurant menu and four-card café showcase. Every layout uses `lib/pdf-card.ts` and supports optional vector CODE128 barcodes. Users choose UPC/barcode field, SKU, or no barcode; missing UPC behavior is omit, SKU fallback or stop with a product-specific error. Choosing SKU does not assign or validate retail UPCs and never changes stored product identifiers. Barcode source and missing-code rules apply to PDF exports; the product library continues to display the actual UPC/barcode field.

Menu rows reserve room for optional barcodes and use aligned prices. Product photos can sit above/beside details or be omitted. Brief descriptions explicitly use the first 180 characters with an ellipsis; full saved text remains unchanged. Dietary notes use user-entered tags and are never inferred. Cover/contents choices load with the catalog; normal export options can override page inclusion for an export. Sort choices operate on a copy of products. Hidden contact settings remove contact data from PDF cover/footer/index. Blank-branding choice applies only when creating a new catalog.

Overflow is reported rather than clipping or overlapping barcode areas. Physical barcode scanning and browser visual verification have not been completed. Tests cover every layout’s barcode markup, source selection, missing-code rules, leading zeros, description behavior and legacy answers. Restaurant positioning can be further refined from user-supplied PDF/image references; none are required to complete setup.
