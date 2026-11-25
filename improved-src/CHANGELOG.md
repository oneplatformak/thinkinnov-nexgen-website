# Changelog

Newest first. The first section is the full rebuild; the sections under "Earlier passes" describe work it replaced or built on, and are kept as history.

## Completion against the master brief (25 November 2026, same branch)

The rebuild below stands. This round applies `notes/MASTER_PROMPT.txt` as far as a static site allows, and takes in the official files from the site's developer. Commits `45c5ec1` onwards.

### Pages and content

- Six product pages (`products/nx.html`, `solid-edge.html`, `capital.html`, `teamcenter.html`, `tecnomatix.html`, `mendix.html`), in both languages: what the product is (one neutral sentence from Siemens' own site, logged with its link), where it sits in the lifecycle, how the company works with it, and the related solutions, needs, industries and roles. No feature lists, compatibility, licensing or pricing.
- Solutions: each of the fifteen shows the business needs it relates to, its lifecycle stage, the Siemens product and related service where the source names one, the other solutions in its group, and a link that opens the contact form with that solution chosen.
- Digital Transformation: three diagrams drawn in code and a reading guide for management and for engineering. No "Digital Twin"; the source does not use the term.
- Industries: each of the eleven cards names the Siemens product, the related solutions and business needs, and a link that carries the industry into the contact form.
- Home: a "Why ThinkInnov-NexGen for PLM" block with the three reasons the source gives.
- Search page in both languages. The index is written by the build and searched in the browser; nothing is sent to a server.
- Application form: gender, current and expected CTC and notice period are optional. The privacy notice lists every field.
- "Ask about support" in every footer.

### From the official package

- Two photographs that the crawl did not have are now photographs 13 and 14 in the About gallery. Originals in `notes/nexware-official-src/`.
- Home, Global Presence: at the owner's request the photograph is the office-opening ribbon-cutting (`office-opening.webp`, a 4:5 crop of the original site's `Aboutus_TI.jpeg`), with the alt text he supplied in both languages. It replaced gallery photograph 14 in that section only.
- The last generated image was removed from the home page and the repository.
- Partner wording is kept only where the source has it: "Siemens Solution Partner" in the home hero, the Expert Partner sentence on About. It was removed from the footer, the home page description and the social image.
- `legalName` removed from the structured data. "Production Development" restored as the source has it. "Request a demonstration" became "Product enquiry".

### Checks

- `check-site.py` now fails on fourteen tracker strings, on anything loaded from another host, and on an English page without its Japanese pair (or the reverse).
- `tools/check-source.py` (new, 87 checks) compares testimonials, logo names and role titles with the original and looks for banned wording, excluded structured data and credentials.
- `tools/test-interactions.js` grew to 389 checks: product pages, the brief's three example journeys, search, the old addresses through the three stub pages, and that no cookie is set.
- `tools/test-axe.js` lists the results axe could not decide. `tools/snap.js` writes `index.json` and waits for lazy images.

### Defects fixed

- Product pages overflowed sideways below about 400 pixels (`cbef166`).
- 90 axe-core findings: landmarks with the same name, a tab-panel role on the wrong element (`43caf0d`).
- Layout shift on the search page, CLS 0.115 (`43caf0d`).
- The NX page misdescribed Siemens' trademark list (`fbe9625`). The footer trademark line did not name the owner (`43caf0d`).
- Japanese fact labels broke one character before the end; a hero label broke inside a word (`12c8dcf`).

### Documents

- New in `notes/`: `ACCEPTANCE.md`, `TRACEABILITY.md`, `TEST-EVIDENCE.md` with `test-output/`, `EXECUTIVE-REVIEW.md`, `PERSONA-MATRIX.md`, `KEYWORD-MAP.md`, `ARCHITECTURE.md`, `DESIGN-SYSTEM.md`, and two more registers written by the build, `CUSTOMER-REGISTER.md` and `ASSET-REGISTER.md`.
- Rewritten: `REVIEW.md`, `STATUS.md`, `README.md`, `COVERAGE.md`, `docs/README-DEPLOY.md`.
- `screenshots-after/` retaken from the final build with a machine-readable index.

Some statements in the section below describe the first rebuild and are no longer true: there are now 41 pages per language, products have their own pages, and no generated image remains.

## Rebuild (branch `cursor/site-polish-bilingual-637e`)

### Structure

- The single generator file (over 1,000 lines) was split into modules: `content/` (text and data), `pages/` (one file per page type), `lib/` (layout, navigation, footer, components, SEO, assets, registers), `features/` (lifecycle diagram, finder), `i18n/` (Japanese dictionaries), `styles/` and `scripts/` (CSS and JS sources, concatenated and minified into `docs/assets/styles.css` and `docs/assets/site.js`). No source file is longer than 500 lines.
- `content/relations.js` holds every link between lifecycle stages, business needs, products, solutions, services and industries, each with a note of the staging text it rests on. The build stops if a relation points at something that does not exist.
- Links to the CSS and JS files carry a content hash (`?v=`) so that long cache lifetimes are safe.
- The build writes `docs/inc/enquiry-options.php`, `notes/CLAIM-REGISTER.md` and `notes/JAPANESE-REGISTER.md`.

### Pages

- Home page rebuilt as one story: headline and three original messages, the problems, the connected lifecycle, before / during / after implementation, six products, solutions, industries, PLM for every business size, customers and testimonials, Japan and India presence, contact.
- New interactive lifecycle diagram (nine stages) on the home page. Works with a mouse, touch and the arrow keys; without scripts it is a list of the same nine stages.
- New finder on `solutions.html`: 16 business needs, each showing the staging sentence it comes from and the solutions, products, services and industries related to it. Nothing is scored. A need can be handed to the contact form.
- Every inner page redesigned: About, PLM For Everyone, Services, Digital Transformation, Products, Solutions, Industries, Behind the Brand, Careers, the 18 job pages, Apply, Contact, 404.
- Products: each product has its own section and anchor; every product tile on the site links to it. One sentence per product is sourced from Siemens' own website and logged in the claim register.
- Careers: filters by role family, experience and keyword. Without scripts the full list of 18 is shown.
- New pages: privacy notice, accessibility statement, HTML sitemap.
- Deleted 30 generated visuals that no page used. One remains, labelled "Conceptual image".

### Navigation

- Mega menu on desktop (hover, click and keyboard), full-screen menu on mobile, breadcrumbs on every inner page, language switch that goes to the same page in the other language, complete footer.
- Language preference is remembered in the browser's local storage and offered as a suggestion; a visitor who follows a direct link is never redirected.

### Japanese

- Every `/ja/` page is fully Japanese: 139 strings reused from staging, 650 strings and 6 sentence patterns newly written, 0 strings left untranslated. The build reports any English string on a Japanese page that has no entry.
- Headings are broken at phrase boundaries (BudouX at build time, `word-break: keep-all` in CSS).
- Testimonials show the original English with the staging Japanese beneath, labelled 参考訳.
- Product names, company names and people's names stay in Latin script.

### Forms

- `contact.php` rewritten as an enquiry handler: whitelisted enquiry type, topic, need, industry and company size; server-side validation with length limits; hidden-field and time checks; rate limit; header-injection stripping; fixed recipient; JSON or HTML response in the visitor's language.
- `apply.php` uses the same library and keeps its upload checks (size, extension, MIME type, file signature).
- Shared code in `docs/inc/form-lib.php`; `.htaccess` refuses direct requests to `inc/`.
- The page shows success only when the server confirms it. On GitHub Pages, where PHP does not run, the form offers a pre-filled email instead.

### Design

- New design system: paper and ink surfaces, hairline rules, one accent colour taken from the logo (`#B33E14`), a few dark sections, Manrope for headings and Inter for text (self-hosted), system Japanese fonts.
- One icon set, drawn inline as SVG. Diagrams (lifecycle, hero figure, data maturity steps) are SVG drawn in code.
- Motion is limited to short fades and is off under `prefers-reduced-motion`.

### SEO and headers

- Unique title and description on every page in both languages; canonical and `hreflang`; XML sitemap with language alternates; Open Graph; `Organization`, `WebSite` and `BreadcrumbList` structured data. No `JobPosting`, review or rating markup.
- `.htaccess`: Content-Security-Policy, one-year caching for hashed CSS, JS and fonts, 30 days for images, dotfiles blocked.

### Tests added

- `check-site.py` now also checks anchors, duplicate ids, image dimensions, titles, descriptions, canonical, `hreflang`, the legacy anchors and `sitemap.xml`.
- `tools/test-forms.sh` (54 checks of both PHP handlers, with mail captured to a file).
- `tools/test-layout.js` (68 pages at 10 widths).
- `tools/test-interactions.js` (252 checks of menus, lifecycle, finder, filters, photo viewer, language switch and forms).
- `tools/serve.js` (local server with the same headers as `.htaccess`) and `tools/snap.js` (screenshots).

### Defects found by those tests and fixed

- The CSS minifier removed the space inside `content: ", "`, which caused overflow at 320px.
- Lifecycle labels ran off screen at 1024px.
- The mega menu closed when clicked just after hover had opened it.
- Tall portrait photos overflowed the photo viewer.
- The mobile menu opener announced itself as a button when scripts were off.
- Two roles with the same title had the same page title.
- The privacy notice described language storage differently from what the code did; the code was simplified and the text corrected.
- The footer briefly showed a legal name next to the copyright line; removed, because the legal name is an open client question.

## Earlier passes

### First regeneration

#### Content

- Fixed typos: “Bussiness process re-Engineering” → “Business process re-engineering”; “Solution evalution Consulting” → “Solution evaluation consulting”; “Sustenance support” → “ongoing support (sustenance)”; “Production Development” → “Production deployment” in enhancements list; normalized Title/sentence case across service lists.
- Normalized random capitals in marketing sentences (hero/footer tagline).
- Phone display/link: `+81 3-3525-8197` / `tel:+81335258197`.
- Email: `info@thinkinnovnexgen.co.jp` (config + PHP recipient).
- Address rewritten to: “15th Floor, Harumi Prime Square, 2-1-40 Harumi, Chuo-ku, Tokyo 104-0053, Japan”; Maps link retained.
- Legal name centralized in `config.js` (`ThinkInnov-NexGen Technologies Pvt Ltd`); profile table keeps staging “ThinkInnov-NexGen Corporation”.
- Footer copyright: `© 2026 ThinkInnov-NexGen`.
- Testimonials kept verbatim (including “Thinkin(g) No(w)”).
- All 21 customer logos, 4 testimonials, 18 jobs, 15 solutions, 11 industries, gallery, leadership, team, partnership value drivers retained.
- EN/JP UI toggle removed in the first regeneration; staging JP dictionary copied to `i18n-jp-dictionary-from-staging.js`.
- Polish pass restored bilingual pages (see below).
- GoDaddy tccl tracking script removed.

#### SEO

- Real multi-page HTML (content in HTML, not JS-rendered).
- Unique `<title>` + meta description per page; canonical on `https://thinkinnovnexgen.co.jp/`.
- Open Graph + Twitter tags; `assets/img/og-image.jpg` (1200×630).
- JSON-LD Organization (name, url, logo, address, telephone, email — no invented claims).
- One H1 per page; logical H2/H3 hierarchy.
- `sitemap.xml` lists all pages on thinkinnovnexgen.co.jp (staging wrongly used thinkinnovsolution.com).
- `robots.txt` with absolute sitemap URL.
- Favicon set + theme-color; `lang="en"`.

#### Accessibility

- Skip link; header/nav/main/footer landmarks.
- Visible `:focus-visible` styles; contrast-safe orange `#C94A1C` for text/buttons on white.
- Real alt text (customer logos “\<Name\> logo”; decorative hero alt="").
- Mobile menu: aria-expanded, focus trap, Esc closes.
- Marquee duplicate list `aria-hidden`; `prefers-reduced-motion` disables marquee animation and reveals.
- Forms: labels, required validation, `aria-live` status, honeypot off-screen.
- Gallery/infographic lightbox: keyboard, Esc, arrows, focus return.
- Hero pillars as tabs with pause control (no inaccessible auto-only carousel).
- 44px tap targets on controls.

#### Performance

- Rasters converted to WebP with max widths (hero/cards/logos/portraits/gallery/infographics).
- Self-hosted Inter + Manrope woff2 (`font-display: swap`).
- Logo SVG optimized with svgo (~53% smaller).
- Single `styles.css` + `site.js`; `loading="lazy"` / `decoding="async"`; hero `fetchpriority="high"`; width/height attributes.
- `.htaccess` gzip + long-cache for assets.

#### Design

- New premium B2B layout (not a clone of staging).
- Brand orange accent + logo blue secondary; ink/cream surfaces; Manrope/Inter; CSS design tokens.
- Sticky translucent→solid header; grouped nav; full-bleed home hero; section rhythm; restrained motion.
- Industries: photo cards + “View infographic” for original Teamcenter X graphics.

#### Forms / infra

- `contact.php` / `apply.php`: validation, honeypot, time-trap, rate-limit-lite, `mail()` to recipient constant, Reply-To visitor; apply accepts CV ≤5MB as attachment.
- JS mailto fallback when PHP unavailable; never claims sent without server JSON `ok`.
- `.htaccess`: HTTPS, old URL 301s, custom 404, security headers.
- Redirect stubs for GitHub Pages: `page.html`, `jobdetails.html`, `application.html`.
- Fixed broken customer image paths (bae, bryka); application page overflow addressed via responsive form grid.

### Polish pass

#### Build
- `build.js` writes directly to `docs/`. The `improved` → `docs` symlink is removed.

#### Design
- Header is always a frosted cream bar with the full-colour logo (no white invert on the photo).
- Home hero stacks on small screens (image band, then copy) so the photograph is not cropped under the headline. Desktop keeps an overlay with a stronger scrim and a higher subject position.
- Office portrait is cropped to a 420px frame instead of its full 1600px height.
- Solution cards use a short accent rule; home previews clamp to four lines while the full sentence stays in the HTML. Solutions page shows every sentence.
- Home service timeline lists every item again.
- Card grids use two columns until 1024px, then three.
- Footer is ink with the logo on a white plate.
- Inner page heroes no longer add a second header-height gap.
- Motion stays short fades; `prefers-reduced-motion` still disables it.

#### Language
- `/ja/` mirrors every page. `lang`, canonical, and `hreflang` (`en`, `ja`, `x-default`) are set.
- Japanese text comes from the staging dictionary and `pageContentJp` only, plus UI chrome (navigation, buttons, form labels, aria).
- Unique body copy with no Japanese source stays English and is listed in `notes/needs-japanese.md`.

#### Accessibility, performance, forms
- Eyebrow colour on ink sections lightened so orange-on-navy clears AA.
- 404 secondary button uses ink text on the light hero.
- Responsive `srcset` for visual WebP files that have a 640px sibling, including the office photo.
- Customer logos `hal.webp` and `sonalika.webp` recompressed under 30 KB. The master logo SVG stays ~35 KB; SVGO changed it by under 1% and further cuts would risk the mark.
- Contact and application mailers strip CR/LF from header fields. Application uploads must match an allowed MIME type.
- Preview forms still fall back to `mailto:` and do not claim success without JSON `ok`.
- Link orange on cream was 4.3:1; text/buttons now use `#B33E14` (passes AA on `#F7F5F1` and white-on-orange).
- Closed mobile drawer is `inert` so hidden links are not focusable. Hero pause control sits outside the tablist.
- Lighthouse (local preview, Lighthouse 12): home mobile 96/100/100/100, home desktop 100/100/100/100, about mobile 97/100/100/100, contact mobile 99/100/100/100, industries desktop 100/100/100/100, Japanese home mobile 96/100/100/100 (performance / accessibility / best practices / SEO).
