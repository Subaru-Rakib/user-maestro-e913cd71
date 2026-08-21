# PDF Report: Printed-by Name + Clean, Sundor Design

Stock Report / Vendor Price List print (PDF) ekhon simple ache — ke print korlo tar nam nei, ar browser-er nijer header/footer (URL, date, "about:blank", page number) PDF-e chole ashe.

## 1. "Printed by" info

- Report header-er right side-e Generated time-er sathe jog hobe:
  - `Printed by: <user name> (<role>)`
  - `Email: <user email>`
- Value ashbe already-existing `state.user` (name, role, email) theke — kono notun data field/storage lagbe na.
- Report paper-er niche ekta footer block: bam dike `Printed by ... · <date time>`, dan dike `Authorized Signature` line (dotted line), ar majhe company name. Ei footer sudhu print/PDF-e dekhabe.

## 2. Browser-er "habi jabi" lekha bondho

- `@page { size: A4; margin: 12mm }` set korbo — margin declare korle Chrome/Edge default header-footer area chole jay, ar amader nijer clean margin thake.
- Print CSS-e `#reportPaper`-er `position:absolute` hack sorie `display:none` based approach nebo (sudhu report paper print hobe), jate content 2nd page-e kata na pore.
- Table row/header page break e vange na — `thead` repeat, `tr{break-inside:avoid}`.
- Note: Chrome print dialog-e "Headers and footers" checkbox off thakle URL/date puropuri jabe; `@page margin` diye eta almost sob khetre chole jay. Print button click korle ekta chhoto hint toast dekhabo prothom bar ("More settings > Headers and footers off korun") — sudhu ekbar.

## 3. PDF design sundor kora (print-only styling)

- Header: company logo + name boro, address niche, dan dike report title box (light background, border), Generated + Printed by info.
- Title-er niche ekta accent color rule line (company brand feel).
- Summary pills print-e flat bordered chips hobe (screen-er shadow/round-heavy look chara), grade wise color-coded (A/B/B2/C) but print-safe light tint.
- Table: zebra striping, thin borders, right-aligned number/money column, bold TOTAL row with top double border, font-size 10.5pt jate sob column A4-e fit kore.
- Landscape hint: Stock Report-e column onek — print CSS-e `@page` A4 landscape korbo sudhu stock report-er jonno (Vendor Price List portrait thakbe).
- Screen-er UI/color kono change hobe na — shob change `@media print` block ar report paper-er markup-e.

## Technical

Shob kaj `public/app/index.html`-e: `@media print` CSS block rewrite + `@page` rule, `render.reports()` ar `render.vendors()`-er `#reportPaper` header/footer markup update (`state.user` info + signature footer). Kono data structure, storage ba business logic change hobe na.
