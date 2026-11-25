# Coverage map: staging → this build

Source of truth: `staging-original/thinkinnov-nexgen/`. This file answers one question: where did each thing the original site had end up? Nothing the original had was dropped unless it is listed under "Removed on purpose" at the end.

Text that does **not** come from staging is listed separately in `notes/CLAIM-REGISTER.md`. Japanese strings are listed in `notes/JAPANESE-REGISTER.md`.

## Site-wide

| Original | Now | Notes |
|---|---|---|
| Header logo and 9 navigation pages | Header with the same logo, a mega menu (What we do, Products, Industries, Company), language switch and Contact button | Every original page is one click from the menu. Mobile uses a full-screen menu; without scripts the menu button is a link to `sitemap.html`. |
| EN / JP toggle (client-side dictionary) | Real URLs: English at `/`, Japanese at `/ja/`, same page on switch | `lang`, canonical and `hreflang` (`en`, `ja`, `x-default`) on every page. |
| Footer Quick Links / Explore / Locate Us | Footer with head office, four offices, What we do, Products, Company, privacy, accessibility, sitemap, language switch | Map link kept. |
| Footer statement ("We enable customers to innovate more and faster…") | Footer, under the logo | Capitalisation normalised, words unchanged. |
| "Siemens Solution Partner" badge | Home hero and footer | Wording unchanged. See open question 3 in `notes/REVIEW.md`. |
| Footer © `2014 - 2026 ThinkInnov-NexGen Corporation` | `© 2026 ThinkInnov-NexGen` | Unchanged from the previous pass. Open question 6. |
| Email `info@thinkinnovnexgen.com` | `info@thinkinnovnexgen.co.jp` | Unchanged from the previous pass (business cards). Open question 2. |
| Phone `+03-3525-8197` | `+81 3-3525-8197`, `tel:+81335258197` | Same number in international form. |
| Address (unformatted staging string) | `15th Floor, Harumi Prime Square, 2-1-40 Harumi, Chuo-ku, Tokyo 104-0053, Japan`; Japanese pages use the staging Japanese address | Same address. |
| Branch offices Nagaoka, Coimbatore, Chennai | Home (hero facts and presence section), About profile, Contact, footer | |

## Routes

Every original URL still resolves. Old query-string URLs are handled by three redirect stubs and by `.htaccess` 301 rules.

| Original | Now |
|---|---|
| `index.html` | `index.html` |
| `page.html?page=about` (`#identity` `#principles` `#gallery` `#leadership`) | `about.html` (same anchors, plus `#partnership` `#profile`) |
| `page.html?page=plm` (`#benefits` `#business-size` `#npd` `#why`) | `plm.html` (same anchors, plus `#deployment`) |
| `page.html?page=services` | `services.html` (`#pre-implementation` `#implementation` `#post-implementation`) |
| `page.html?page=digital-transformation` | `digital-transformation.html` (`#pdmm` `#outcomes`) |
| `page.html?page=products` | `products.html` (`#nx` `#solid-edge` `#capital` `#teamcenter` `#tecnomatix` `#mendix`) |
| `page.html?page=solutions` | `solutions.html` (`#finder`, `#all-solutions`, one anchor per solution and per business need) |
| `page.html?page=industries` | `industries.html` (one anchor per industry) |
| `page.html?page=behind-the-brand` (`#problem` `#team`) | `behind-the-brand.html` (same anchors) |
| `page.html?page=careers` | `careers.html` (`#culture` `#roles`) |
| `jobdetails.html?id=N` | `careers/<nn-slug>.html`, 18 pages |
| `application.html` (`?id=`) | `apply.html` (`?job=<slug>`) |
| Home `#contact` form | `contact.html`; the home page keeps a `#contact` section that leads to it |
| — | `privacy.html`, `accessibility.html`, `sitemap.html`, `404.html` (new) |
| — | `/ja/` copy of every page above |

Anchors that existed in the previous pass of this repo (`#home`, `#about`, `#problem`, `#plm`, `#services`, `#products`, `#solutions`, `#industries`, `#customers`, `#testimonials`, `#contact` on the home page, and the page anchors above) all still exist. `improved-src/check-site.py` fails the build check if one disappears.

## Home page

| Original | Now |
|---|---|
| Hero slider, three messages (Siemens Solution Partner / innovate more and faster / Mendix) | A single headline composed from staging wording, with the three original messages kept in full as a three-column strip directly under the hero |
| About intro and photo | Section 01 `#about`: the staging heading and sentences, with the four words consulting, mapping, implementation, adoption |
| "We help companies effectively address the critical business issues of new product development" and four problems | Section 02 `#problem`, all four, each linked to the finder |
| "Collect, analyse and visualize data and processes throughout the product lifecycle…" | Section 03 `#plm`, as the introduction to the lifecycle diagram |
| PLM On premises / On cloud / SaaS | Kept on the home page inside section 08 ("PLM your way"), and also on `plm.html#deployment` |
| Services Pre / Implementation / Post lists | Section 04 `#services`, all three phases with every item |
| Product catalogue, six monograms | Section 05 `#products`, six rows, each linking to its section on `products.html` |
| Solutions preview, nine cards | Section 06 `#solutions`, the same nine, plus a link to all 15 |
| Industries | Section 07 `#industries`, all 11 as links |
| PLM for every business size | Section 08 `#plm-for-everyone`, three sizes |
| Customers, 21 logos | Section 09 `#customers`, the same 21, as a static grid (no marquee) |
| Testimonials, four | Section 10 `#testimonials`, verbatim, including "Thinkin(g) No(w)" |
| — | Section 11 `#presence`: head office and three branches, onsite / offshore, from the staging company profile |
| Contact form | `#contact` invitation leading to `contact.html` |

## About

| Original | Now |
|---|---|
| Who We Are and three cards | `#identity` |
| Vision / Mission / Values | `#principles` |
| Gallery, 12 photos | `#gallery`, all 12, with a keyboard-operable viewer |
| Leadership, four people | `#leadership` |
| Partnership panel and five value drivers | `#partnership`, wording unchanged (Siemens Certified "Expert Partner - PLM") |
| Company profile table | `#profile`, every row; company name left as staging prints it ("ThinkInnov-NexGen Corporation") |

## Other pages

| Page | What it carries |
|---|---|
| PLM For Everyone | Benefits (4), business sizes (3), new product development process (3), deployment options (3), why ThinkInnov-NexGen (3) |
| Services | Pre-Implementation, Implementation, Post-Implementation with every nested list |
| Digital Transformation | PDMM L1–L4 and three digital outcomes; a diagram drawn in SVG |
| Products | Six Siemens products, each with the staging tagline and category, plus related solutions and careers |
| Solutions | All 15 solutions in five groups, and the finder |
| Industries | All 11, each with its staging description and the original infographic (I1–I11), enlargeable |
| Behind the Brand | Four problems and four team members |
| Careers | Culture text and all 18 roles with filters; a job page for each role with responsibilities and skills |
| Apply | Every original field, role selector, CV upload |
| Contact | Enquiry form, head office, branches |

## Assets

| Original | Now |
|---|---|
| Logo SVG | `assets/img/logo.svg`, unchanged artwork |
| 21 customer logos (including the two with broken paths on staging) | `assets/img/customers/`, WebP, artwork unchanged |
| Leadership, team and gallery photographs | WebP, resized and cropped only |
| I1–I11 industry infographics | `assets/img/industries/infographic-XX.webp` |
| Generic stock-style illustrations on staging | Not used |
| Generated visuals added in the previous pass | 30 deleted because nothing used them. One remains (`visuals/siemens-digital-industry`), on the home industries section, labelled "Conceptual image". Open question 13. |
| Favicon | ico, 32px PNG, 180px touch icon |
| Fonts (referenced but never loaded on staging) | Manrope and Inter, self-hosted WOFF2 |

## Corrections made to staging text

These are spelling and capitalisation fixes carried over from the previous pass. The meaning is unchanged except where noted.

- "Bussiness process re-Engineering" → "Business process re-engineering"
- "Solution evalution Consulting" → "Solution evaluation consulting"
- "Sustenance support" → "ongoing support (sustenance)"
- "Production Development" → "Production deployment" in the Enhancements list. This one changes a word, not just spelling. Open question 10.
- Title case and sentence case made consistent in service lists and the footer statement.

## Removed on purpose

| Original | Why |
|---|---|
| GoDaddy `tccl` tracking script | Injected by the old host; not content. |
| Fake "I'm not a robot" checkbox | Replaced by a hidden field, a time check, a rate limit and a consent checkbox. |
| Auto-rotating hero slider | The three messages are shown together instead, so none is hidden. |
| Scrolling customer logo marquee | Replaced by a static grid of the same 21 logos. |
| Magnetic buttons and animated number counters | Decoration with no content. |
| Generic Japanese filler sentence that staging repeated for every solution, industry and job | Each item now has its own Japanese text (see the translation register). |
