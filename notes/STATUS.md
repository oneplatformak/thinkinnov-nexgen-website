# Status of every page and feature

The six labels are the brief's (`notes/MASTER_PROMPT.txt`, L2497–2500 and L5061–5073). What each means here:

| Label | Meaning |
| --- | --- |
| **Implemented** | Built and in the repository. No test exercises it, or it is a document. |
| **Tested** | Implemented, and covered by an automated test that ran on the final build and passed. The test is named; its output is in `notes/test-output/`. |
| **Verified** | Tested, and the author also looked at it in the final Chrome screenshots (which pages, and how much of each, is in `notes/TEST-EVIDENCE.md` §5). |
| **Requires Business Approval** | Works, but the content needs a decision or confirmation from the client or a lawyer. "Q" numbers are the questions in `notes/REVIEW.md` §9. |
| **Requires External Integration** | Cannot be finished or proven without a system this work may not touch: the production host, a mailbox. |
| **Not Implemented** | Not built. The reason is given. |

An item can carry more than one label. "Verified" never means approved by the client, tested in a browser other than Chrome, or read by a native Japanese speaker. Nobody other than the author has checked anything.

Tests named below: **site** = `improved-src/check-site.py`; **source** = `tools/check-source.py`; **layout** = `tools/test-layout.js` (ten widths); **interactions** = `tools/test-interactions.js` (389 checks); **forms** = `tools/test-forms.sh` (58 checks); **axe** = `tools/test-axe.js`; **Lighthouse** = Lighthouse 12, 44 local runs. Every page in the table passes site, layout and axe, so those three are not repeated on each row.

## Pages

Each exists in English and at the same path under `/ja/`: 41 pages per language.

| Page | Status | Notes |
| --- | --- | --- |
| Home `index.html` | Verified (interactions: menus, lifecycle; Lighthouse) · Requires Business Approval | Q3 logos and quotes, Q7 partner wording, Q9 Ohmium and Lectrix |
| About `about.html` | Verified (interactions: photo viewer; Lighthouse) · Requires Business Approval | Q1 legal name, Q8 titles, Q10 the year 2014, Q12 positioning, Q13 profile facts, Q20 consent for photographs |
| PLM For Everyone `plm.html` | Tested | Not in the Lighthouse set; not read in the final screenshots |
| Services `services.html` | Tested · Requires Business Approval | Q14 "Production Development", Q16 support. Not in the Lighthouse set |
| Digital Transformation `digital-transformation.html` | Verified (Lighthouse) | Three diagrams drawn in code. No Digital Twin section (`REVIEW.md` §8) |
| Products `products.html` | Verified (interactions: product pages; Lighthouse) · Requires Business Approval | Q17 product naming, Q18 lifecycle placement, Q20 product tiles |
| Teamcenter `products/teamcenter.html` | Verified (interactions: product pages, journey 1; Lighthouse) · Requires Business Approval | Q17, Q18. One sentence from Siemens' site, logged in `CLAIM-REGISTER.md` §1 |
| NX, Solid Edge, Capital, Tecnomatix, Mendix `products/*.html` | Tested (interactions: product pages) · Requires Business Approval | Same template as Teamcenter. Solid Edge and Mendix were looked at one build earlier. Q17, Q18 |
| Solutions `solutions.html` | Verified (interactions: finder, journeys; Lighthouse) · Requires Business Approval | Fifteen solutions and the finder. Q18 |
| Industries `industries.html` | Verified (interactions: photo viewer, journeys; Lighthouse) · Requires Business Approval | Q19 origin of the eleven images; they contain untranslated English text |
| Behind the Brand `behind-the-brand.html` | Tested · Requires Business Approval | Q20. Not in the Lighthouse set |
| Careers `careers.html` | Tested (interactions: career filters; Lighthouse) · Requires Business Approval | Q4 whether the roles are open |
| 18 role pages `careers/*.html` | Tested (source: titles match the original; Lighthouse on one) · Requires Business Approval | One template. Q4 |
| Apply `apply.html` | Verified (interactions: application form; forms) · Requires External Integration · Requires Business Approval | Delivery of the email and CV is unproven. Q2 mailbox, Q21 optional fields |
| Contact `contact.html` | Verified (interactions: contact form, journeys; forms; Lighthouse) · Requires External Integration | Delivery unproven. Q2 mailbox |
| Search `search.html` | Tested (interactions: search; Lighthouse) | Looked at one build earlier |
| Privacy notice `privacy.html` | Tested · Requires Business Approval | Q5 legal review. States no retention period, legal basis or compliance |
| Accessibility `accessibility.html` | Tested · Requires Business Approval | Q26. Says what was tested and what was not; claims no conformance |
| Sitemap `sitemap.html` | Tested | |
| 404 `404.html` | Tested · Requires External Integration | Apache's `ErrorDocument` is untested |
| Stub pages `page.html`, `jobdetails.html`, `application.html` (English only) | Tested (interactions: old addresses, 18 checks) · Requires External Integration | They forward the original site's addresses in the browser. The 301 versions in `.htaccess` are untested |
| Terms of use | Not Implemented | Legal text. Q25 |
| Company history | Not Implemented | The source has one year and no milestones. Q10 |
| Case studies, customer success pages | Not Implemented | No approved project outcomes exist |
| Resources, articles, FAQ | Not Implemented | No such material in the source. Phase 2 (`REVIEW.md` §7) |
| A page per service, per solution, per digital-transformation topic | Not Implemented | A sentence or two each in the source. Each has an anchor on its overview page |
| PLM readiness assessment | Not Implemented | Optional in the brief. The finder gives direction without scoring the visitor |

## Features

| Feature | Status | Notes |
| --- | --- | --- |
| Static generator; CSS and JS built from `improved-src/` | Tested (two builds in a row change no file) | |
| Design system | Verified | `notes/DESIGN-SYSTEM.md`. Japanese seen in one font only |
| Desktop menus (hover, click, keyboard, Escape) | Tested (interactions: 15 per language) | |
| Mobile menu (focus held inside, Escape, plain link without scripts) | Tested (interactions: 10 per language) | |
| Breadcrumbs with `BreadcrumbList` data | Tested (site; source: JSON-LD parses) | Not checked in an external validator |
| Language switch to the same page; remembered choice; no redirect of direct links | Tested (interactions: 11) | |
| No cookie set | Tested (interactions: language switch) | |
| Lifecycle diagram: nine stages, tabs, arrow keys, text alternative | Verified (interactions: 14 per language at each of two widths) · Requires Business Approval | Q18 |
| Finder by business need: sixteen needs, hand-over to the contact form | Verified (interactions: 16 per language) · Requires Business Approval | Q18 |
| The brief's three example journeys, from industry or need to an enquiry with context | Tested (interactions: 9, 6 and 6 per language) | |
| Product pages: lifecycle position, related solutions, needs, industries and roles | Tested (interactions: 28 per language) | |
| Search in both languages, built at build time, run in the browser | Tested (interactions: 9 per language) | Nothing is sent to a server |
| Career filters (discipline, experience, keyword) | Tested (interactions: 11 per language) | |
| Photo viewer for gallery and industry images | Tested (interactions: 11 per language) | |
| Pages with scripts turned off | Tested (interactions: 10 per language) | |
| Contact form in the browser: messages tied to fields, context from links, success only on the server's confirmation, email fallback on a static host | Verified (interactions: 14 per language) | |
| Application form in the browser, with gender, current and expected CTC and notice period optional | Verified (interactions: 7 per language) · Requires Business Approval | Q21 |
| `contact.php` | Tested (forms) · Requires External Integration | PHP's built-in server and a stand-in for `sendmail`. No real email |
| `apply.php` with CV upload | Tested (forms) · Requires External Integration | Same |
| `.htaccess`: HTTPS, 301s, headers, Content-Security-Policy, caching, blocked folders, 404 | Implemented · Requires External Integration | Never run on Apache. The same headers were served locally and all 389 interaction checks pass under them |
| Japanese on every page | Tested (build: 0 untranslated; site: language pairs) · Requires Business Approval | Q24 native review |
| Japanese line breaking at phrase boundaries | Verified | Chrome, one font |
| Titles, descriptions, canonical, `hreflang`, XML sitemap, robots | Tested (site; Lighthouse SEO 100 on the pages run) | Not checked in Search Console |
| `Organization`, `WebSite`, `BreadcrumbList` structured data; no `legalName`, no `JobPosting`, no review or rating markup | Tested (source) | Not checked in an external validator |
| Open Graph tags and image | Implemented | Not checked in a preview tool |
| Reduced motion | Tested (interactions: lifecycle) | |
| Layout at ten widths from 320 to 2560 | Tested (layout: 82 pages × 10) | Emulated |
| Automated accessibility scan | Tested (axe: 0 violations on 164 scans; 36 colour-contrast results undecided) | Not a conformance claim |
| Performance, accessibility, best-practice and SEO audits | Tested (Lighthouse: 11 pages × 2 languages × 2 presets) | Lab numbers |
| No tracker, nothing loaded from another host | Tested (site: 0 and 0; interactions under the production CSP) | |
| Testimonials, logos and role titles identical to the original; partner wording only where the source has it | Tested (source: 87 checks) · Requires Business Approval | Q3, Q7 |
| Claim, customer, asset and Japanese registers | Implemented · Requires Business Approval | Written by the build |
| Acceptance mapping, traceability, test evidence, executive review | Implemented | `notes/` |
| Interaction to Next Paint | Requires External Integration | Field data only |
| Screen-reader testing | Not Implemented | None available here |
| Safari, Firefox, Edge, physical phones | Not Implemented | Only Chrome on Linux was available |
| Content management, authentication, dashboards | Not Implemented | Phase 2. Content is edited in `improved-src/content/` and rebuilt |
| CRM integration, analytics, campaign attribution | Not Implemented | Phase 2 |
| Acknowledgement email to the sender | Not Implemented | Phase 2: needs a confirmed sending domain |
| `JobPosting` data | Not Implemented | Excluded; vacancy status and dates are unknown |
| Pricing | Not Implemented | None in the source |
| Competitor analysis document | Not Implemented | Not done |
