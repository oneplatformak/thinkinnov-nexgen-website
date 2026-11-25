# Coverage map: staging → this build

Source of truth: `staging-original/thinkinnov-nexgen/`. This file answers one question: where did each thing the original site had end up? Nothing the original had was dropped unless it is listed under "Removed on purpose" at the end.

`improved-src/tools/check-source.py` compares the built site with the original and fails if one of these differs: the four testimonials, the 21 customer logos, the eleven industry entries and their images (the original's eleven images less the two removed by the owner's decision, listed under "Removed on purpose"), the 18 role titles, the 18 careers-list summaries (character for character), and every English sentence of the original (242 of them, from `page-data.js`, `jobs.js` and the four HTML files), which must be on the English site with the same words in the same order. Capitals and punctuation are not compared. The twelve exceptions are written into the check and explained under "Wording: what is the original's, and what is not" below.

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
| Footer statement ("We enable Customers to Innovate More and Faster by effectively re-using their Knowledge Acquired during Product Lifecycle through Our Innovative Digital Solutions.") | Footer, under the logo | Capitalisation normalised, words unchanged. An earlier pass had dropped "their" and added "the"; both are restored. |
| "Siemens Solution Partner" (home hero badge) | Home hero only and once only, as in the original | Wording unchanged; the Japanese is the original site's own. Not in the footer, page descriptions or structured data. Confirmed as official wording by the Nexware package. |
| Footer `© 2014 - 2026 ThinkInnov-NexGen Corporation` and `ThinkInnov-NexGen. All Rights Reserved.` | The same two lines, as printed, at the foot of every page in both languages | Restored. An earlier pass showed `© 2026 ThinkInnov-NexGen` because the legal name and what 2014 refers to are open client questions; the independent verifier pointed out that this departs from the original, and the original's own line is what the owner has approved so far. The questions stay open in `notes/REVIEW.md`. |
| Footer "ThinkInnov-NexGen Technologies Pvt Ltd" | Not shown | Same reason: three forms of the company name are in the original. The company profile on About keeps "ThinkInnov-NexGen Corporation" as the original prints it. |
| Email `info@thinkinnovnexgen.com` | `info@thinkinnovnexgen.co.jp` | **This is a change from the original, made before this build on the strength of the company's business cards, and it is not confirmed.** Both copies of the original show only `.com`. If the `.co.jp` mailbox does not exist, enquiries and applications go nowhere. Launch-blocking question in `notes/REVIEW.md`. |
| — | Trademark line in the footer | New. Says the six products are Siemens' and that the names are Siemens trademarks. Source in `notes/CLAIM-REGISTER.md`. |
| Phone `+03-3525-8197` | `+81 3-3525-8197`, `tel:+81335258197` | **Kept as a necessary correction.** The original's `+03-…` is not a number that can be dialled: `+` introduces a country code and Japan's is 81, after which the leading 0 of the Tokyo area code is dropped. The digits are the original's; only the prefix is written correctly, so the link works from a phone anywhere. To be confirmed by the client with the number itself (`notes/REVIEW.md`). |
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
| Hero slider, three messages (Siemens Solution Partner / innovate more and faster / Mendix) | A single headline composed from staging wording, with the three original messages kept as a three-column strip directly under the hero: each headline and text in full, and the lines above the second and third. The line above the first, "Siemens Solution Partner", is the hero badge and is not printed a second time in the strip |
| About intro and photo | Section 01 `#about`: the staging heading and sentences, with the four words consulting, mapping, implementation, adoption |
| "We help companies to effectively address the critical business issues of New Product Development." and four problems | Section 02 `#problem`, all four, each linked to the finder. Words as the original has them (an earlier pass had dropped "to" and four "the"s; restored) |
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
| Industries | All 11 entries, each with its staging title and description, related solutions and an enquiry link that carries the industry. Nine are shown with the original's image, enlargeable (I1, I3–I10). **Entry 2, "Siemens SW PDM to PLM": the image (I2) was removed by the owner's decision; the entry stays, without an image.** **Entry 11, "Teamcenter X: The business value of cloud-based SaaS PLM": the image (I11) was removed by the owner's decision; the entry stays, without an image.** See "Removed on purpose" |
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
| I1, I3–I10 industry infographics (nine) | `assets/img/industries/infographic-XX.webp` |
| I2 industry infographic (shown with "Siemens SW PDM to PLM") | **Not published. Image removed by the owner's decision, 25 November 2026.** The original stays in `staging-original/` |
| I11 industry infographic (shown with "Teamcenter X: The business value of cloud-based SaaS PLM") | **Not published. Image removed by the owner's decision, 25 November 2026.** The original stays in `staging-original/` |
| Stock-style illustrations on staging (`about-digital-engineering.png`, `hero-collaboration.jpeg`, `mendix-image.png`, `PLM_bg.png`, `seimens_partner.png`) | Not used. They are generic illustrations, not pictures of the company; `seimens_partner.png` is a globe-and-city illustration with no Siemens mark. Listed in `notes/ASSET-REGISTER.md` |
| Generated visuals added in an earlier pass | All deleted. Nothing generated for this rebuild is on the site. (The nine industry images that are published come from the original site and their origin is unknown: `notes/ASSET-REGISTER.md` §3) |
| Favicon | ico, 32px PNG, 180px touch icon |
| Fonts (referenced but never loaded on staging) | Manrope and Inter, self-hosted WOFF2 |

## Wording: what is the original's, and what is not

The rule: the original's sentences are shown with the original's words in the original's order. `check-source.py` enforces it for all 242 English sentences of the original and fails on a changed, added or dropped word.

**Restored after the independent verification (25 November 2026).** Each of these had been reworded slightly in an earlier pass and now reads as the original does:

| Where | Was | Now, as the original |
|---|---|---|
| Services, closing block | "…grouped for clearer reading." | "…grouped for easier reading." |
| Solutions, Design Verification Management | "Parts designed and requirements defined…" | "Part designed and requirements defined…" |
| Careers list, nine summaries (roles 3, 5, 7, 8, 9, 10, 12, 16, 18) | tidied capitals, "1 year of experience", "a Teamcenter administration role, with…", "Set up", no serial comma | Character for character the original's card text, for example "1 Yr Experience in Mentor Graphics/Capital software (logic and Harness XC)." |
| Home hero strip, first headline | "Your partner for innovation and digital transformation" | "Your partners for innovation and digital transformation solutions." (one word supplied, see below) |
| Home, services introduction | "From startup to enterprise — we guide you to the right software solution, manage implementation, and provide training and ongoing support (sustenance)…" | "Start-up to enterprise — we have the expertise to guide you to the right software solution, manage the implementation, and provide the training and sustenance support so that you will get the best value from your investment." |
| Home and Behind the Brand, problem statements | "to" and four "the"s dropped | Words as the original |
| About, profile introduction | "Key ThinkInnov-NexGen details…" | "Key ThinkInnov-NexGen Corporation details…" |
| About, partnership heading | "…KK — A Strategic Partnership…" | "…KK - A Strategic Partnership…" |
| Careers, culture text | "…enriching — one that…" | "…enriching, one that…" |
| Footer statement | "…re-using knowledge acquired during the product lifecycle…" | "…re-using their knowledge acquired during product lifecycle…" |
| Footer legal lines | "© 2026 ThinkInnov-NexGen" | "© 2014 - 2026 ThinkInnov-NexGen Corporation" and "ThinkInnov-NexGen. All Rights Reserved." |
| Industries, eleventh title | "Teamcenter X — Cloud-based SaaS PLM" | "Teamcenter X: The business value of cloud-based SaaS PLM" |
| Application form | "How did you find this vacancy?" | "How did you come across this vacancy?" |
| Job pages | heading "Responsibilities" | "Key responsibilities" |
| Home, products section | label "Siemens Portfolio" | "Our Catalogue of Products" ("Siemens Portfolio" stays on the Products page, where the original has it) |
| Solutions finder, "What our site says" | eleven of the sixteen lines were shortened or paraphrased | Each is now a whole sentence shown elsewhere on the site, word for word; `check-source.py` compares them in both languages |

**Kept different from the original, and why.**

| Original | Now | Why |
|---|---|---|
| "Bussiness process re-Engineering", "Solution evalution Consulting" | "Business process re-engineering", "Solution evaluation consulting" | Spelling mistakes. |
| "Expertise:- MCAD, … IIOT, …" | "Expertise: MCAD, … IIoT, …" | Punctuation slip and the usual spelling of the abbreviation. |
| "…digital foundation and Vision, lack of it reduces…" | "…digital foundation and vision; lack of it reduces…" | Two sentences joined by a comma; the words are unchanged. |
| "Your partners for innovation digital transformation solutions." | "Your partners for innovation and digital transformation solutions." | The sentence lacks a word. The original's own Japanese for it reads "innovation and DX solutions" (イノベーションとDXソリューションのパートナーです。), so "and" is supplied and nothing else is touched. |
| Phone "+03-3525-8197" | "+81 3-3525-8197" | Not a diallable number as written; see Site-wide above. |
| Address "104-0053, 1-40 Harumi Prime Square, 15th Floor 2-Chome, Harumi, Chuo-ku, Tokyo" | "15th Floor, Harumi Prime Square, 2-1-40 Harumi, Chuo-ku, Tokyo 104-0053, Japan" | The same address in the usual English order; Japanese pages use the original's Japanese address. |
| "ThinkInnov-NexGen Technologies Pvt Ltd" above the footer address | Not shown | Three forms of the company name are in the original; which is the legal name of which entity is an open client question. |
| Capital letters in the middle of sentences ("New Product Development", "Requirement Gathering, Solution Signoff…") | Sentence case in running text and lists | One typographic convention across the site. Words unchanged. The careers-list summaries are the exception: they are shown exactly as printed, capitals included. |
| The word "Infographic" at the end of each industry title | Titles without it; the word is in the caption of each image ("Infographic: …") | The title now heads a section that contains more than the image. |
| "Production Development" (Enhancements list) | Unchanged | An earlier pass had made it "Production deployment"; reversed, because that changed a word. What the term means is an open client question. |

**Added by this site, and labelled as such.**

| What | Where | Why it is there |
|---|---|---|
| "Discipline" of a role (six groups) and three experience ranges | Careers list: the filter and one chip per role. Not on the job pages; the facts of a role there are the original's three (experience, location, employment type) | The owner's brief asks for working filters, and the delegation specifies "discipline derived from the titles, experience band, text search". The original has no such classification, so the list carries a note under it: the grouping is this site's, made from the role titles and the experience each role states, and is not part of the job descriptions. The verifier listed it as a departure; it is kept for the filter and no longer presented as a fact about the vacancy. |
| "Onsite" / "Offshore" labels, nine lifecycle stage sentences, the home headline | See `notes/CLAIM-REGISTER.md` | Disclosed there with their sources. |

**Headings, menu labels and buttons.** These are interface text, rewritten with the new structure; the content they lead to is the original's. The ones that differ: the old menu's "Vision Mission Values" (now the heading "Vision, Mission and Values"), "Gallery Media" ("Gallery"), the menu panel sentence "ThinkInnov-NexGen profile, mission, values, gallery, leadership and company profile." (the menu has no descriptions now), the job page heading "Job Information" (the three facts are shown without it), the button "Send Message" ("Send enquiry"), and the form controls "Select your gender *" and "Choose File *" (a labelled, optional field and the browser's own file control).

**Japanese pages: text that was left in Latin letters.** Ordinary words are now Japanese: "SMBs" → 中堅・中小企業; "UAT" → ユーザー受け入れテスト（UAT）; "PoC development" → 概念実証（PoC）の開発; "MD & Founder" → マネージングディレクター・創業者 (the original's own Japanese for "Managing Director"); the industry title "Siemens SW PDM to PLM" → Siemens SW：PDMからPLMへ. Left in Latin letters because they are names, or are written that way in Japanese business use: company, product and people's names; the solution names "Teamcenter Gateway for SAP Business Suite" and "Teamcenter Gateway for Oracle E-Business Suite"; "Expert Partner - PLM"; "Siemens Industry Software Inc."; "Head, Heart and Hand" (kept in English by the original's own Japanese, with its Japanese gloss); "PDMM L1–L4"; "LinkedIn"; abbreviations such as PLM, ERP, MES, CAD, SaaS, PM/PMO, WBS (glossed), CTC and LPA (glossed); the two footer legal lines; and the four testimonials, which are English with a Japanese rendering under each.

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
| **Two industry images: `assets/I2.png` and `assets/I11.png`** | **Removed by the owner's decision (AK, 25 November 2026), as an explicit, owner-approved exception to "nothing dropped".** I2 carries a Siemens wordmark. I11 prints five unsourced figures about a Siemens product ("20–30% faster time to market", "15–25% lower IT & infrastructure costs", "30–50% improvement in team productivity", "20–40% reduction in change cycle time", "99.9%+ cloud reliability and availability"). Both are inherited images of unknown origin and rights. Only the images are gone: the two industry entries keep their titles, text, relations and links, in English and Japanese. `check-source.py` names these two as the only missing images and fails if any other goes missing or if either comes back. `notes/ASSET-REGISTER.md` §3, `notes/CLAIM-REGISTER.md` §6. |
