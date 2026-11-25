# Coverage map: staging → improved

Source of truth: `staging-original/thinkinnov-nexgen/`.

## Global / chrome

| Original | New | Notes |
|---|---|---|
| Header logo + 9 nav pages | Sticky solid header (full-colour logo) with Company / Offerings dropdowns + Industries; all 9 pages 1-click reachable | EN/JP restored as real URLs: English at `/`, Japanese at `/ja/`, with `lang` and `hreflang`. Japanese body copy only where staging already had it (`pageContentJp` + dictionary). UI labels translated. Strings without a Japanese source stay English (`notes/needs-japanese.md`). Generic filler sentences that replaced unique solution/industry/job copy were not used. |
| Contact us CTA → `#contact` | → `contact.html` (home still has `#contact` form) | |
| Mobile drawer | Full-screen drawer with Company/Offerings accordions, focus trap, Esc | |
| Footer Quick Links / Explore / Locate Us | Same links + map link; legal name from `config.js` | |
| Footer © `2014 - 2026 ThinkInnov-NexGen Corporation` | `© 2026 ThinkInnov-NexGen` | Dropped unexplained “2014 -” and “Corporation” inconsistency (legal name still in profile / config) |
| Email `info@thinkinnovnexgen.com` | `info@thinkinnovnexgen.co.jp` | Matches new business cards; single config constant |
| Phone `+03-3525-8197` / `tel:+0335258197` | `+81 3-3525-8197` / `tel:+81335258197` | |
| Address (messy staging string) | `15th Floor, Harumi Prime Square, 2-1-40 Harumi, Chuo-ku, Tokyo 104-0053, Japan` | Google Maps link kept |
| GoDaddy tccl script | **Removed** | Hosting injection; not re-included |
| Magnetic buttons / number counters | **Dropped** | Not real content |

## Routes

| Original | New |
|---|---|
| `index.html` | `index.html` |
| `page.html?page=about` (+ `#identity` `#principles` `#gallery` `#leadership`) | `about.html` (same anchors + `#partnership` `#profile`) |
| `page.html?page=plm` (+ `#benefits` `#business-size` `#npd` `#why`) | `plm.html` |
| `page.html?page=services` | `services.html` |
| `page.html?page=digital-transformation` | `digital-transformation.html` |
| `page.html?page=products` | `products.html` |
| `page.html?page=solutions` | `solutions.html` |
| `page.html?page=industries` | `industries.html` |
| `page.html?page=behind-the-brand` (`#problem` `#team`) | `behind-the-brand.html` |
| `page.html?page=careers` | `careers.html` |
| `jobdetails.html?id=N` | `careers/<nn-slug>.html` (18 roles) |
| `application.html` (+ `?id=`) | `apply.html` (+ `?job=<slug>`) |
| — | `contact.html` (new dedicated page; home contact retained) |
| — | `404.html` |
| Stub redirects | `page.html`, `jobdetails.html`, `application.html` + `.htaccess` 301s |

## Home sections

| Original section | New |
|---|---|
| Hero slider (3 slides: Siemens / innovate / Mendix) | Full-bleed hero + accessible tabbed pillars with pause control |
| About intro + `Aboutus_TI.jpeg` | About band + `assets/img/about-office.webp` |
| PLM On premises / On cloud / SaaS | Same three options |
| Services Pre / Implementation / Post lists | 3-stage timeline (same items; typos fixed) |
| Product catalogue 6 monograms | Same 6 (NX, SE, CAP, Tc, Tx, mx) |
| Solutions preview (9 cards) | Same 9 topics |
| Customers marquee (21 logos, duplicated track) | Same 21; fixed bae/bryka paths; duplicate track `aria-hidden` |
| Testimonials (4 verbatim) | Same 4 (incl. Thinkin(g) No(w)) |
| Contact form (name/email/message + fake robot) | Real form + company/phone/consent; posts to `contact.php` |

## About page

| Original | New |
|---|---|
| Who We Are + 3 cards | `#identity` |
| Vision / Mission / Values | `#principles` |
| Gallery 12 photos | `#gallery` + accessible lightbox |
| Leadership 4 | `#leadership` |
| Partnership panel + value drivers | `#partnership` |
| Company profile table | `#profile` (address corrected; Map link kept; company name left as staging “Corporation” in table, site legal name in config/footer) |

## Other pages

| Page | Coverage |
|---|---|
| PLM | Benefits 4, business size 3, NPD 3, why 3 |
| Services | Full Pre/Implementation/Post board with all nested lists |
| Digital Transformation | PDMM L1–L4 + 3 digital outcomes |
| Products | 6 Siemens products + copy |
| Solutions | All 15 solution cards |
| Industries | All 11 cards; new visual photos + “View infographic” opens original I1–I11 WebP in lightbox |
| Behind the Brand | 4 problems + 4 team members |
| Careers | Culture copy + all 18 job cards → individual job pages (responsibilities/skills from `jobs.js`) + register CTA → apply |
| Apply | All original fields + role select + CV upload |

## Assets

| Original | New |
|---|---|
| Customer logos (incl. broken bae-systems.png / bryka.png refs) | WebP under `assets/img/customers/` using `bae.png` / `bryka.jpeg` sources |
| Leadership / team / gallery | WebP optimized |
| I1–I11 industry infographics | `assets/img/industries/infographic-XX.webp` (kept for lightbox) |
| Generic AI illustrations | Replaced by `assets/img/visuals/*.webp` |
| Logo SVG | `assets/img/logo.svg` (svgo) |
| Favicon | ico / 32 png / apple-touch 180 |
| Fonts Inter/Manrope (referenced but never loaded) | Self-hosted woff2 variable latin |

## Intentionally changed (not dropped)

- Multi-page URLs + SEO meta / JSON-LD / sitemap host → thinkinnovnexgen.co.jp
- Design system fully new (not a restyle of staging layout)
- Language toggle removed from UI; dictionary archived for future JP site
- Fake “I'm not robot” checkbox replaced by honeypot + time-trap + consent
- Copyright year line simplified (see above)
