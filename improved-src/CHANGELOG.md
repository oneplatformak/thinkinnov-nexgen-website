# Changelog — staging → improved regeneration

## Content

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

## SEO

- Real multi-page HTML (content in HTML, not JS-rendered).
- Unique `<title>` + meta description per page; canonical on `https://thinkinnovnexgen.co.jp/`.
- Open Graph + Twitter tags; `assets/img/og-image.jpg` (1200×630).
- JSON-LD Organization (name, url, logo, address, telephone, email — no invented claims).
- One H1 per page; logical H2/H3 hierarchy.
- `sitemap.xml` lists all pages on thinkinnovnexgen.co.jp (staging wrongly used thinkinnovsolution.com).
- `robots.txt` with absolute sitemap URL.
- Favicon set + theme-color; `lang="en"`.

## Accessibility

- Skip link; header/nav/main/footer landmarks.
- Visible `:focus-visible` styles; contrast-safe orange `#C94A1C` for text/buttons on white.
- Real alt text (customer logos “\<Name\> logo”; decorative hero alt="").
- Mobile menu: aria-expanded, focus trap, Esc closes.
- Marquee duplicate list `aria-hidden`; `prefers-reduced-motion` disables marquee animation and reveals.
- Forms: labels, required validation, `aria-live` status, honeypot off-screen.
- Gallery/infographic lightbox: keyboard, Esc, arrows, focus return.
- Hero pillars as tabs with pause control (no inaccessible auto-only carousel).
- 44px tap targets on controls.

## Performance

- Rasters converted to WebP with max widths (hero/cards/logos/portraits/gallery/infographics).
- Self-hosted Inter + Manrope woff2 (`font-display: swap`).
- Logo SVG optimized with svgo (~53% smaller).
- Single `styles.css` + `site.js`; `loading="lazy"` / `decoding="async"`; hero `fetchpriority="high"`; width/height attributes.
- `.htaccess` gzip + long-cache for assets.

## Design

- New premium B2B layout (not a clone of staging).
- Brand orange accent + logo blue secondary; ink/cream surfaces; Manrope/Inter; CSS design tokens.
- Sticky translucent→solid header; grouped nav; full-bleed home hero; section rhythm; restrained motion.
- Industries: photo cards + “View infographic” for original Teamcenter X graphics.

## Forms / infra

- `contact.php` / `apply.php`: validation, honeypot, time-trap, rate-limit-lite, `mail()` to recipient constant, Reply-To visitor; apply accepts CV ≤5MB as attachment.
- JS mailto fallback when PHP unavailable; never claims sent without server JSON `ok`.
- `.htaccess`: HTTPS, old URL 301s, custom 404, security headers.
- Redirect stubs for GitHub Pages: `page.html`, `jobdetails.html`, `application.html`.
- Fixed broken customer image paths (bae, bryka); application page overflow addressed via responsive form grid.

## Polish pass

### Build
- `build.js` writes directly to `docs/`. The `improved` → `docs` symlink is removed.

### Design
- Header is always a frosted cream bar with the full-colour logo (no white invert on the photo).
- Home hero stacks on small screens (image band, then copy) so the photograph is not cropped under the headline. Desktop keeps an overlay with a stronger scrim and a higher subject position.
- Office portrait is cropped to a 420px frame instead of its full 1600px height.
- Solution cards use a short accent rule; home previews clamp to four lines while the full sentence stays in the HTML. Solutions page shows every sentence.
- Home service timeline lists every item again.
- Card grids use two columns until 1024px, then three.
- Footer is ink with the logo on a white plate.
- Inner page heroes no longer add a second header-height gap.
- Motion stays short fades; `prefers-reduced-motion` still disables it.

### Language
- `/ja/` mirrors every page. `lang`, canonical, and `hreflang` (`en`, `ja`, `x-default`) are set.
- Japanese text comes from the staging dictionary and `pageContentJp` only, plus UI chrome (navigation, buttons, form labels, aria).
- Unique body copy with no Japanese source stays English and is listed in `notes/needs-japanese.md`.

### Accessibility, performance, forms
- Eyebrow colour on ink sections lightened so orange-on-navy clears AA.
- 404 secondary button uses ink text on the light hero.
- Responsive `srcset` for visual WebP files that have a 640px sibling, including the office photo.
- Customer logos `hal.webp` and `sonalika.webp` recompressed under 30 KB. The master logo SVG stays ~35 KB; SVGO changed it by under 1% and further cuts would risk the mark.
- Contact and application mailers strip CR/LF from header fields. Application uploads must match an allowed MIME type.
- Preview forms still fall back to `mailto:` and do not claim success without JSON `ok`.
- Link orange on cream was 4.3:1; text/buttons now use `#B33E14` (passes AA on `#F7F5F1` and white-on-orange).
- Closed mobile drawer is `inert` so hidden links are not focusable. Hero pause control sits outside the tablist.
- Lighthouse (local preview, Lighthouse 12): home mobile 96/100/100/100, home desktop 100/100/100/100, about mobile 97/100/100/100, contact mobile 99/100/100/100, industries desktop 100/100/100/100, Japanese home mobile 96/100/100/100 (performance / accessibility / best practices / SEO).
