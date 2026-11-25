# Status of every page and feature

What each label means here:

| Label | Meaning |
|---|---|
| **Implemented** | Built and in the repo. No test in this repo exercises it. |
| **Tested** | Implemented, and covered by an automated test that was run locally and passed (which test is named). |
| **Verified** | Tested, and also looked at by the author in Chrome screenshots at 390px and 1440px in both languages. |
| **Requires Business Approval** | Works technically, but the content or wording needs a decision from the owner, the client or a lawyer before launch. The question number refers to `notes/REVIEW.md`. |
| **Requires External Integration** | Cannot be finished or confirmed without a system this work was not allowed to touch (production host, mailbox, DNS). |
| **Not Implemented** | Not built. The reason is given. |

An item can carry more than one label. "Verified" never means approved by the client, tested in a browser other than Chrome, or reviewed by a native Japanese speaker.

Tests referred to: **links** = `improved-src/check-site.py`; **layout** = `tools/test-layout.js` (10 widths); **interactions** = `tools/test-interactions.js`; **forms** = `tools/test-forms.sh`; **Lighthouse** = Lighthouse 12, local.

## Pages (each exists in English and at the same path under `/ja/`)

| Page | Status | Notes |
|---|---|---|
| Home `index.html` | Verified (links, layout, interactions, Lighthouse) · Requires Business Approval | Q3 partner wording, Q9 "joint venture" wording absent, Q13 one conceptual image |
| About `about.html` | Verified (links, layout, interactions for the photo viewer, Lighthouse) · Requires Business Approval | Q1 legal name, Q3, Q4 positioning, Q5 titles, Q6 years |
| PLM For Everyone `plm.html` | Verified (links, layout) | Not run through Lighthouse |
| Services `services.html` | Verified (links, layout) · Requires Business Approval | Q10 "Production deployment"; not run through Lighthouse |
| Digital Transformation `digital-transformation.html` | Verified (links, layout) | Not run through Lighthouse |
| Products `products.html` | Verified (links, layout, Lighthouse) · Requires Business Approval | Six Siemens-sourced sentences (claim register), Q11 Designcenter naming, Q14 lifecycle placement |
| Solutions `solutions.html` | Verified (links, layout, interactions for the finder, Lighthouse) · Requires Business Approval | Q14 relationships shown by the finder |
| Industries `industries.html` | Verified (links, layout, interactions for the photo viewer, Lighthouse) | Infographics are images containing text (known limitation) |
| Behind the Brand `behind-the-brand.html` | Verified (links, layout) | Not run through Lighthouse |
| Careers `careers.html` | Verified (links, layout, interactions for the filters, Lighthouse) · Requires Business Approval | Q12 whether the 18 roles are open |
| 18 job pages `careers/*.html` | Tested (links, layout) · Requires Business Approval | Looked at in screenshots: role 01 (English, desktop) and role 07 (Japanese, desktop and mobile); all 18 share one template. One run through Lighthouse. Q12 |
| Apply `apply.html` | Verified (links, layout, interactions, forms) · Requires External Integration | Real delivery of the email and attachment is untested |
| Contact `contact.html` | Verified (links, layout, interactions, forms, Lighthouse) · Requires External Integration | Real delivery untested; Q2 mailbox |
| Privacy notice `privacy.html` | Verified (links, layout) · Requires Business Approval | Q16 legal review. Not legal advice |
| Accessibility statement `accessibility.html` | Verified (links, layout) · Requires Business Approval | Lists only what was tested; owner should confirm before publishing |
| HTML sitemap `sitemap.html` | Verified (links, layout) | |
| 404 `404.html` | Verified (links, layout) · Requires External Integration | Shown by the local preview server; Apache `ErrorDocument` untested |
| Redirect stubs `page.html`, `jobdetails.html`, `application.html` | Tested (links) | Client-side redirects for GitHub Pages; `.htaccess` 301s are the production path and are untested |
| Terms of use | Not Implemented | Needs a lawyer (Q17) |

## Features

| Feature | Status | Notes |
|---|---|---|
| Static generator, CSS and JS built from `improved-src/` | Tested | Build runs clean; every test below runs against its output |
| Design system (type, colour, spacing, icons, diagrams) | Verified | Japanese text was seen only in the Noto CJK font on Linux; Hiragino, Yu Gothic and Meiryo rendering is unverified |
| Mega menu (hover, click, keyboard, Escape) | Verified (interactions: 15 checks per language) | |
| Mobile menu (focus trap, Escape, link fallback without scripts) | Verified (interactions: 10 per language) | |
| Breadcrumbs with `BreadcrumbList` data | Tested (links) | Structured data not validated with Google's tool |
| Language switch to the same page; remembered preference; no redirect of direct links | Verified (interactions: 10) | |
| Footer | Verified (links, layout) | |
| Lifecycle diagram (nine stages, tabs, arrow keys, text fallback) | Verified (interactions: 14 per language at 390px and 1440px) · Requires Business Approval | Q14 |
| Finder by business need (16 needs, hand-off to contact form) | Verified (interactions: 16 per language) · Requires Business Approval | Q14 |
| Career filters (discipline, experience, keyword; full list without scripts) | Verified (interactions: 11 per language) | |
| Photo viewer for gallery and infographics | Verified (interactions: 11 per language) | |
| Pages with scripts turned off | Tested (interactions: 10 per language) | |
| Contact form in the browser (validation messages, context from URL, success only on server confirmation, email fallback on Pages) | Verified (interactions: 14 per language) | |
| Application form in the browser | Verified (interactions: 6 per language) | |
| `contact.php` | Tested (forms: 37 checks) · Requires External Integration | Run with PHP's built-in server and a fake `sendmail`. Not run on Apache, no real email sent |
| `apply.php` with CV upload | Tested (forms: 17 checks) · Requires External Integration | Same |
| `.htaccess` (HTTPS, 301s, headers, CSP, caching, blocked folders) | Implemented · Requires External Integration | Never run on Apache. The same headers were served by `tools/serve.js` and all 252 interaction checks passed under that CSP |
| Japanese on every page | Tested (build reports 0 untranslated strings) · Requires Business Approval | Q7 native review. 650 strings are new and unreviewed |
| Japanese phrase-aware line breaking | Verified | In Chrome only |
| Titles, descriptions, canonical, `hreflang`, XML sitemap, robots | Tested (links; Lighthouse SEO 100 on the pages run) | Not validated with Search Console |
| `Organization`, `WebSite`, `BreadcrumbList` structured data | Implemented | Present and parsed as JSON by the build; not validated with an external tool |
| Open Graph tags and image | Implemented | Not checked in a social preview tool |
| Reduced motion | Tested (interactions) | |
| Layout without overflow at 320–2560px | Tested (layout: 68 pages × 10 widths) | |
| Performance, accessibility, best practice and SEO audits | Tested (Lighthouse on 8 pages × 2 languages × 2 form factors) | Local lab numbers. See `notes/REVIEW.md` |
| Claim register | Implemented · Requires Business Approval | Generated by the build |
| Japanese translation register | Implemented · Requires Business Approval | Generated by the build |
| Real photography in place of the remaining generated visual | Requires Business Approval | Q13 |
| Screen-reader testing | Not Implemented | No screen reader was available in this environment |
| Testing in Safari, Firefox, Edge, and on physical phones | Not Implemented | Only Chrome on Linux was available |
| CMS or admin interface | Not Implemented | Out of scope in the brief; content is edited in `improved-src/content/` |
| Authentication, customer dashboards | Not Implemented | Out of scope in the brief |
| CRM integration | Not Implemented | Out of scope; would need an external system |
| Analytics | Not Implemented | Out of scope; would also change the privacy notice |
| Pricing | Not Implemented | No pricing exists in the source |
| Case studies | Not Implemented | No project outcomes exist in the source and none may be invented |
| Company history timeline | Not Implemented | The source gives one year (2014) and it is an open question (Q6) |
| Employee stories | Not Implemented | None in the source |
| AI features | Not Implemented | Out of scope in the brief |
| FAQ and "What is PLM" explainer | Not Implemented | Optional in the brief. Answers would be new company statements with no source |
| Articles / news | Not Implemented | Optional. No articles exist in the source |
| Site search | Not Implemented | Optional. The HTML sitemap, the finder and the career filters cover finding things on a site of 34 pages |
| Individual product detail pages | Not Implemented | Each product has its own section and anchor on `products.html`. The source has one tagline and one category per product, which is not enough for a page each without inventing content |
