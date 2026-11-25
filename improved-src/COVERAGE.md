# Coverage map: staging → this build

Source of truth: `staging-original/thinkinnov-nexgen/`. This file answers one question: where did each thing the original site had end up? Nothing the original had was dropped unless it is listed under "Removed on purpose" at the end.

`improved-src/tools/check-source.py` compares the built site with the original for the four testimonials, the 21 customer logos and the 18 role titles, and fails if one differs.

## Two copies of the original

There are two copies of the original site, and they are not identical.

| Copy | Where | What it is |
|---|---|---|
| The crawl | `staging-original/thinkinnov-nexgen/` (in this repository, left exactly as it was) | Fetched from the staging host. Every HTML file in it carries a script that the host (GoDaddy cPanel) injects into pages as it serves them (`_trfq`, `tccl.min.js`). It is not part of the website. |
| The official package | Supplied by Nexware, kept outside this repository | The files as the developer delivered them. The four HTML files differ from the crawl only by that injected script, which they do not have. 60 of the 62 images are byte-for-byte the same as the crawl's. |

What the official package added to this build:

- **Two photographs**, `assets/gallery-09.jpg` and `assets/gallery-10.jpg` (1200 × 1600 each). They are in the package but the original gallery list did not show them. They are now the last two photographs in the About gallery (`gallery-13` from `gallery-09.jpg`, `gallery-14` from `gallery-10.jpg`), and the second was also the photograph in the home page's Global Presence section until 25 November 2026, when the owner replaced it there with the office-opening ribbon-cutting photograph (`docs/assets/img/office-opening.webp`, cut from the original site's `assets/Aboutus_TI.jpeg`). The one generated image that was still on the home page (in the Industries section) was removed in the same change, so the home page now shows real photographs only. The untouched originals are in `notes/nexware-official-src/`; the site uses resized WebP copies (`docs/assets/img/gallery/gallery-13`, `gallery-14`). Whether the people in them have agreed to appear is an open client question (`notes/ASSET-REGISTER.md`).
- **Confirmation that the tracker is not the site's own.** The built site contains none of it; `check-site.py` fails if any of 14 tracker strings or any resource from another host appears in `docs/`.
- **Confirmation of the partner wording** and where the original places it (next table).

Everything else in the package that differs from the crawl is listed in `notes/REVIEW.md` with what was done about it.

Text that does **not** come from staging is listed separately in `notes/CLAIM-REGISTER.md`. Japanese strings are listed in `notes/JAPANESE-REGISTER.md`.

## Site-wide

| Original | Now | Notes |
|---|---|---|
| Header logo and 9 navigation pages | Header with the same logo, a mega menu (What we do, Products, Industries, Company), language switch and Contact button | Every original page is one click from the menu. Mobile uses a full-screen menu; without scripts the menu button is a link to `sitemap.html`. |
| EN / JP toggle (client-side dictionary) | Real URLs: English at `/`, Japanese at `/ja/`, same page on switch | `lang`, canonical and `hreflang` (`en`, `ja`, `x-default`) on every page. |
| Footer Quick Links / Explore / Locate Us | Footer with head office, four offices, What we do, Products, Company, privacy, accessibility, sitemap, language switch | Map link kept. |
| Footer statement ("We enable customers to innovate more and faster…") | Footer, under the logo | Capitalisation normalised, words unchanged. |
| "Siemens Solution Partner" (home hero badge) | Home hero only, as in the original | Wording unchanged; the Japanese is the original site's own. Not in the footer, page descriptions or structured data. Confirmed as official wording by the Nexware package. |
| Footer © `2014 - 2026 ThinkInnov-NexGen Corporation` | `© 2026 ThinkInnov-NexGen` | The legal name and what 2014 refers to are open client questions, so the footer names neither. |
| Footer "ThinkInnov-NexGen Technologies Pvt Ltd" | Not shown | Same reason: three forms of the company name are in the original. The company profile on About keeps "ThinkInnov-NexGen Corporation" as the original prints it. |
| Email `info@thinkinnovnexgen.com` | `info@thinkinnovnexgen.co.jp` | **This is a change from the original, made before this build on the strength of the company's business cards, and it is not confirmed.** Both copies of the original show only `.com`. If the `.co.jp` mailbox does not exist, enquiries and applications go nowhere. Launch-blocking question in `notes/REVIEW.md`. |
| — | Trademark line in the footer | New. Says the six products are Siemens' and that the names are Siemens trademarks. Source in `notes/CLAIM-REGISTER.md`. |
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
| `page.html?page=digital-transformation` | `digital-transformation.html` (`#pdmm` `#outcomes`, plus `#start` `#digital-thread` `#integration` `#digital-factory` `#views`) |
| `page.html?page=products` | `products.html` (`#nx` `#solid-edge` `#capital` `#teamcenter` `#tecnomatix` `#mendix`, plus `#stage-map`) |
| — | `products/nx.html`, `solid-edge.html`, `capital.html`, `teamcenter.html`, `tecnomatix.html`, `mendix.html` (new: one page per product) |
| `page.html?page=solutions` | `solutions.html` (`#finder`, `#all-solutions`, one anchor per solution and per business need) |
| `page.html?page=industries` | `industries.html` (one anchor per industry) |
| `page.html?page=behind-the-brand` (`#problem` `#team`) | `behind-the-brand.html` (same anchors) |
| `page.html?page=careers` | `careers.html` (`#culture` `#roles`) |
| `jobdetails.html?id=N` | `careers/<nn-slug>.html`, 18 pages |
| `application.html` (`?id=`) | `apply.html` (`?job=<slug>`) |
| Home `#contact` form | `contact.html`; the home page keeps a `#contact` section that leads to it |
| — | `privacy.html`, `accessibility.html`, `sitemap.html`, `search.html`, `404.html` (new) |
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
| Product catalogue, six monograms | Section 05 `#products`, six rows, each linking to that product's own page |
| Solutions preview, nine cards | Section 06 `#solutions`, the same nine, plus a link to all 15 |
| Industries | Section 07 `#industries`, all 11 as links |
| PLM for every business size | Section 08 `#plm-for-everyone`, three sizes, followed by the three "Why ThinkInnov-NexGen for PLM" reasons from the original PLM page (`#why`) |
| Customers, 21 logos | Section 09 `#customers`, the same 21, as a static grid (no marquee) |
| Testimonials, four | Section 10 `#testimonials`, verbatim, including "Thinkin(g) No(w)" |
| — | Section 11 `#presence`: head office and three branches, onsite / offshore, from the staging company profile |
| Contact form | `#contact` invitation leading to `contact.html` |

## About

| Original | Now |
|---|---|
| Who We Are and three cards | `#identity` |
| Vision / Mission / Values | `#principles` |
| Gallery, 12 photos | `#gallery`, all 12, plus the two from the official package (14), with a keyboard-operable viewer |
| Leadership, four people | `#leadership` |
| Partnership panel and five value drivers | `#partnership`, wording unchanged: the heading "ThinkInnov-NexGen KK - A Strategic Partnership in Japan" and the sentence with Siemens Certified "Expert Partner - PLM". Neither appears anywhere else. |
| Company profile table | `#profile`, every row; company name left as staging prints it ("ThinkInnov-NexGen Corporation") |

## Other pages

| Page | What it carries |
|---|---|
| PLM For Everyone | Benefits (4), business sizes (3), new product development process (3), deployment options (3), why ThinkInnov-NexGen (3) |
| Services | Pre-Implementation, Implementation, Post-Implementation with every nested list |
| Digital Transformation | PDMM L1–L4 and three digital outcomes, unchanged. Around them: where to start, the digital thread, integration with enterprise systems, the digital factory, and a reading for executives and one for engineers, all assembled from wording elsewhere in the original. Two SVG diagrams, each labelled "Conceptual diagram" |
| Products | Six Siemens products, each with the staging tagline and category, a table of products against lifecycle stages, and a link to each product's page |
| Product pages (6) | The staging tagline and category; one sentence from Siemens' own website saying what the product is, with its source; where the product sits on the lifecycle; which of the company's services, solutions, business needs and roles mention it; an enquiry link that carries the product |
| Solutions | All 15 solutions in five groups, each with the staging paragraph, the business needs it answers, related products, services and industries, and an enquiry link; and the finder |
| Industries | All 11, each with its staging description and the original infographic (I1–I11), enlargeable, plus related solutions and an enquiry link that carries the industry |
| Behind the Brand | Four problems and four team members |
| Careers | Culture text and all 18 roles with filters; a job page for each role with responsibilities and skills |
| Apply | Every original field, role selector, CV upload. Gender, current CTC, expected CTC and notice period are now optional |
| Search | New. Searches page titles, descriptions, solutions, business needs, industries, services and lifecycle stages from a file built with the site; nothing is sent to a server |
| Contact | Enquiry form, head office, branches |

## Assets

| Original | Now |
|---|---|
| Logo SVG | `assets/img/logo.svg`, unchanged artwork |
| 21 customer logos (including the two with broken paths on staging) | `assets/img/customers/`, WebP, artwork unchanged |
| Leadership, team and gallery photographs | WebP, resized and cropped only |
| — | Two more gallery photographs from the official Nexware package (see the top of this file) |
| I1–I11 industry infographics | `assets/img/industries/infographic-XX.webp` |
| Stock-style illustrations on staging (`about-digital-engineering.png`, `hero-collaboration.jpeg`, `mendix-image.png`, `PLM_bg.png`, `seimens_partner.png`) | Not used. They are generic illustrations, not pictures of the company; `seimens_partner.png` is a globe-and-city illustration with no Siemens mark. Listed in `notes/ASSET-REGISTER.md` |
| Generated visuals added in an earlier pass | All deleted. Nothing generated for this rebuild is on the site. (The eleven industry images come from the original site and their origin is unknown: `notes/ASSET-REGISTER.md` §3) |
| Favicon | ico, 32px PNG, 180px touch icon |
| Fonts (referenced but never loaded on staging) | Manrope and Inter, self-hosted WOFF2 |

## Corrections made to staging text

These are spelling and capitalisation fixes carried over from the previous pass. The meaning is unchanged except where noted.

- "Bussiness process re-Engineering" → "Business process re-engineering"
- "Solution evalution Consulting" → "Solution evaluation consulting"
- "Sustenance support" → "ongoing support (sustenance)"
- "Production Development" in the Enhancements list is kept as the original has it. An earlier pass had changed it to "Production deployment"; that was reversed, because it changed a word and not just spelling. What the term means is an open client question.
- Title case and sentence case made consistent in service lists and the footer statement.

## Removed on purpose

| Original | Why |
|---|---|
| GoDaddy `tccl` tracking script | Injected by the old host; not content. The official package confirms the site never contained it. |
| Five-star symbols (★★★★★) above each testimonial | The original printed five stars over every quote. They are not a rating anyone gave, so they are not shown, and no rating markup is used. |
| Fake "I'm not a robot" checkbox | Replaced by a hidden field, a time check, a rate limit and a consent checkbox. |
| Auto-rotating hero slider | The three messages are shown together instead, so none is hidden. |
| Scrolling customer logo marquee | Replaced by a static grid of the same 21 logos. |
| Magnetic buttons and animated number counters | Decoration with no content. |
| Generic Japanese filler sentence that staging repeated for every solution, industry and job | Each item now has its own Japanese text (see the translation register). |
