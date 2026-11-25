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
- EN/JP UI toggle removed; staging JP dictionary copied to `i18n-jp-dictionary-from-staging.js`.
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
