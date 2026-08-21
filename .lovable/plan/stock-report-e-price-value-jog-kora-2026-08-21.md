# Stock Report-e Price / Value jog kora

Apnar upload kora app (`edit-master-main.zip`) ei project-e nei — ekhon project fresh template. Tai prothome upload kora app ta project-e boshabo, tarpor text.txt-e cheye deya Stock Report price/value feature ta banabo.

## Step 1 — Upload kora app project-e boshano

- `public/app/index.html` (pura inventory app), `src/routes/index.tsx` (iframe wrapper + SEO meta), `src/styles.css` ar baki src file gulo project-e copy hobe (git metadata chara).
- Ei step-er por preview-e apnar current app tai dekhabe (Dashboard, Stock IN/OUT, Carton Tracking, Vendors, Stock Reports, Audit, Backup).

## Step 2 — Stock Reports page-e taka (Tk) jog

Ekhon Stock Reports table-e sudhu PCS ache. Vendor rate = Retail Price − Vendor Discount % (already `unitPriceFor()` te ache), oi rate diye value dekhabo.

1. Table-e notun column
   - `Unit Price` — oi carton-er vendor rate
   - `Stock Value` — Rem. PCS × Unit Price
   - Grade filter (A/B/B2/C) select thakle oi grade column-er niche grade value (grade pcs × unit price) dekhabe; "All" thakle protita grade column-e o value line thakbe.
2. Report paper-er upor-e summary pills
   - Total Stock Value (Tk), Cartons
   - Grade wise value: A / B / B2 / C (Tk)
   - Damage Value (Tk) = Grade C pcs × unit price, ar B2 value alada pill
   - Grade filter thakle oi grade-er pcs + value pill
3. Table footer-e total row — Total PCS, grade wise PCS, ar Total Stock Value.
4. Print / PDF — shob notun column ar total `#reportPaper`-er vitore thakbe, tai existing print CSS-ei PDF-e ashbe.
5. CSV Export — `Unit Price` / `Stock Value` / `Damage Value` already ache; filter kora grade onujayi grade value column jog kore report-er sathe milie debo.

## Technical note

Sudhu display change — kono data structure ba storage schema bodlabe na. Kaj hobe `public/app/index.html`-er `render.reports()` ar `exportCSV()`-e, `unitPriceFor(c)` + `money()` helper use kore. Product-e retail price ba vendor-e discount % na thakle unit price 0 dekhabe (existing behavior).
