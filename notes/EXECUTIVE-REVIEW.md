# Executive review

The brief asks for three reviews of the finished site. They overlap, so they are recorded together here:

- **Part B §23, "Virtual Executive Review"** (L2297–2351): twelve named reviewers, each answering one set question. Weaknesses are recorded and fixed, and the review is repeated.
- **Part C §35, "Multi-Persona Final Review"** (L4761–4865): forty areas scored from 0 to 100 "based on documented criteria". "Do not assign arbitrary perfect scores."
- **Part A §17, "Multiple Independent Expert Reviews"** (L543–578): twelve viewpoints, five of which are not in Part B's list (investor, psychologist, cybersecurity expert, accessibility expert, first-time non-technical visitor).

**What this is.** The builder of the site reading it as each of these people would, using the screenshots, the test outputs and the source. **What it is not.** It is not approval by the client, by Siemens or by a native Japanese reader, and no such person took part.

**Since then an independent verifier has checked the site** (25 November 2026, at commit `30c9b8a`). It scored six areas at least ten points lower than this review did, and it was right about the cause: the design scores rested on a layout test that could not see the faults that were there. Section 7 records its scores, what was fixed and the scores now. Sections 2 to 6 are left as they were written, as the record of the two rounds, apart from one correction marked in the table. Where a judgement really belongs to one of them, the score is capped and the cap is stated.

**After that, the owner decided the question of the inherited industry images** (25 November 2026): the two that carried a Siemens wordmark and unsourced figures about a Siemens product were removed; the other nine stay. Section 8 records what that changes in the scores. Sections 2 to 7 speak of eleven industry images because there were eleven when they were written.

Two rounds were run on 25 November 2026:

| Round | Build reviewed | Evidence used |
| --- | --- | --- |
| 1 | Commit `fbe9625`, with product pages, deeper solutions, Digital Transformation and Industries pages, search and the three scripted journeys in place | `test-output/axe-round1.txt`, `test-output/lighthouse-round1.txt`, the interaction, layout and form tests as they stood, and screenshots of the new pages |
| 2 | The final build (commit `45dbdd6` for the pages) | Everything in `TEST-EVIDENCE.md` dated after the fixes, and the screenshots in `screenshots-after/` |

## 1. How the scores are set

The scale, fixed before either round:

| Score | Means |
| --- | --- |
| 90–100 | Met in full, shown by a measurement or test, and nothing in the area is waiting on anyone outside this build |
| 75–89 | Met as far as the source material allows, and checked. What is missing is one named, bounded thing |
| 60–74 | Works, but a substantial part of what the brief asks for cannot be delivered from the source, or has not been checked by the person who would have to check it |
| 40–59 | Partly there |
| Below 40 | Largely absent |

Caps, also fixed beforehand:

- Anything that depends on the quality of the new Japanese cannot score above 75 until a native reader has reviewed it.
- Anything that depends on a fact only the client can confirm (legal name, titles, permissions, which roles are open) cannot score above 80.
- Anything tested in one browser only cannot score above 90 for behaviour and cannot score above 50 for "browser compatibility" itself.
- Anything that needs the real host (Apache, mail delivery) cannot score above 80 until it has run there.

The criterion for each area is in the score table in section 5, next to the score, so that each number can be checked against what it claims.

## 2. Round 1: the twelve reviewers (Part B §23)

Each answer ends with the weaknesses that reviewer would raise. A number in brackets is the fix in section 4.

**1. CEO.** *Does the website communicate a compelling business identity and establish corporate credibility?*
Identity, yes: the first screen says what the company does (PLM consulting, implementation and support), for which products (six, named), and where (head office in Tokyo, three branches). Credibility, partly: there is a company profile, four named leaders with photographs, 21 customer logos and four customer quotes. Weaknesses: the company's name appears in three forms; two people hold a "CEO" title; the only history is "since 2014"; there are no case studies or figures; the About page describes an IT services company while the home page leads with PLM. All of these come from the source and none can be settled without the client.

**2. Japanese customer.** *Would a Japanese manufacturing executive find the company trustworthy and professionally represented?*
They would find what they look for first: 会社概要 with the representative, address and business description, in Japanese, on every page a Japanese equivalent, and a Tokyo address and telephone number. Weaknesses: the new Japanese has not been read by a native speaker; the registered Japanese company name is not shown because it is not known; there is no 沿革 (history) or 代表挨拶 (message from the representative), which such a reader expects; the roles advertised are in Chennai and Bangalore, which says something about where delivery happens that the site does not explain.

**3. Siemens representative.** *Are Siemens products, trademarks and partnership details represented accurately and professionally?*
Product names are written as Siemens writes them, in Latin script on Japanese pages too. Each product page attributes its one descriptive sentence to Siemens and links to the page it came from. There is no Siemens logo. Partner wording is where the original has it and nowhere else. Weaknesses found: the NX page said Siemens "lists this name" among its trademarks, but Siemens' list has "Designcenter NX", not "NX" alone [1]; the footer trademark line said the names belong to "their respective owners" without saying plainly that the owner is Siemens [2]; one of the eleven inherited industry images carries a Siemens wordmark and nobody has confirmed the right to publish it; Siemens now sells NX and Solid Edge under the Designcenter name.

**4. Engineering director.** *Are the engineering solutions meaningful, technically accurate and relevant?*
Fifteen solutions, each with the source's own paragraph, the business needs it answers, and the products, services and industries it relates to. The lifecycle diagram and the stage table show where each product sits. Nothing claims a feature. Weaknesses: depth. One paragraph per solution and one line per product is all the source has. The placement of products on lifecycle stages is this build's reading and no PLM specialist at the company has confirmed it. "Production Development" in the support list is unclear even in the original.

**5. CFO.** *Can the visitor understand the potential business value and evaluate an investment discussion?*
Value is stated in the source's words (faster time to market, improved quality, cost reduction) and the Product Data Maturity Model gives a way to place one's own company. Weaknesses: no figures, no pricing, no project sizes or durations, no case studies. None exists in the source, and the brief forbids inventing them. A CFO can decide to have a conversation; they cannot evaluate an investment from the site.

**6. Procurement.** *Is there enough information to assess the company as a potential vendor?*
Enough to open a vendor record: name, address, telephone, representative, business description, offices, service scope by phase, a privacy notice. Weaknesses: not enough to complete an assessment. No registered name confirmed, no date of establishment, capital or corporate number, no certifications, no security statement, no terms. The site says none of these rather than guess.

**7. Sales director.** *Does the website generate relevant, actionable business inquiries?*
An enquiry arrives with its type, its topic (a named product, solution or service), and, when the visitor came through the finder or an industry, the business need, industry and company size. That is enough to route it and to open the conversation. Weaknesses: one recipient mailbox for everything; no CRM; no record of which page or campaign the visitor came from; and the mailbox address itself is unconfirmed, which is the most serious open item on the site.

**8. Customer.** *Is it easy to understand the offerings, find relevant information and contact the right team?*
Three ways in: by product, by business need (the finder), by industry. Every page ends in a next step, and search covers pages, solutions, needs, industries, services and stages. An existing customer can choose a support enquiry on the contact form and on the home page. Weaknesses: on every other page the support route was two steps away, with no link to it in the footer [9]; support has no hours, no telephone line of its own and no response time, because the source states none.

**9. Design director.** *Does the website demonstrate distinctive, internationally competitive visual quality?*
It has a point of view: paper, ink, one accent from the logo, hairline rules, numbered sections, diagrams drawn from the content. It does not look like a template and it does not look like a Siemens page. Weaknesses: photography is fourteen pictures of one office opening; there is no picture of the work itself; the eleven industry images are a different visual language (glossy, blue, with text in them) and sit awkwardly beside everything else; the home page is long.

**10. Technical architect.** *Is the implementation secure, maintainable and scalable?*
Static files and two small PHP handlers, no database, no runtime dependency, nothing loaded from elsewhere. Content is data, relations are data, and the build fails on a dangling relation or an untranslated string. Weaknesses found: the maintenance procedures existed only in the author's head [6]; `.htaccess` has never run on Apache; the generator has end-to-end tests but no unit tests of its own.

**11. Quality assurance.** *Are there broken flows, missing pages, inconsistent components or incomplete functionality?*
Links, layout at ten widths, interactions and form handling all passed. Found by scanning every page with axe-core, which had not been done before: 90 findings. 82 were the same one, three navigation landmarks with the same name on every page; the products page had a second landmark called "Products"; and the lifecycle panels on the home pages were given a tab-panel role on an element that may not carry one [3]. Found by Lighthouse: the search page shifted as it loaded (CLS 0.115 on mobile) [4]. Found by reading the registers against the pages: the claim register covered only text that was *not* from the original, and there was no register of customers or of images [5].

**12. Competitor.** *Where does the website remain weaker than competing enterprise technology companies?*
Proof and depth. A competitor's site would have case studies with named results, white papers, webinars, product demonstrations, certifications and a newsroom. This one has none, because the company has not supplied any. It is stronger than most on honesty about what it does and on getting from a problem to a conversation; it is weaker on everything that takes years of published work to accumulate.

### The five further viewpoints from Part A §17

**Investor (business credibility).** Would want the legal entity, ownership, history and scale. The site gives a profile table and declines to state the rest. Same weakness as the CEO and procurement reviews.

**Psychologist (user experience).** One primary action per screen, plain labels, results shown before any form, no countdowns, pop-ups or manufactured urgency, and the star symbols the original printed over every testimonial are gone because nobody gave those ratings. The finder shows what it found and why. Weakness: long pages ask for a lot of scrolling on a phone; the jump links help but do not remove it.

**Cybersecurity expert (risks).** Small attack surface: two handlers that accept a fixed list of fields, a fixed recipient, a honeypot, a time check, a rate limit, type and signature checks on the upload, and no storage. A strict Content-Security-Policy is written. Weaknesses: the headers and the blocked `inc/` folder are unproven on the real server; the rate limit is per IP address and file-based; CVs travel by email, which is only as safe as the mailbox.

**Accessibility expert (inclusivity).** Keyboard paths through the menus, lifecycle tabs, finder, filters, photo viewer and forms were scripted and pass; reduced motion is honoured; every form error is tied to its field. Weaknesses: see reviewer 11 for the landmark findings; no screen reader has been used; the industry images carry text that is only summarised in their alternative text; 36 items axe could not decide (mostly contrast on elements with background images and text inside SVG) need a person.

**First-time, non-technical visitor (clarity).** The lifecycle is explained stage by stage in plain sentences and the finder starts from problems, not product names. Weakness: ERP, MES, MCAD and ECAD are used as the source uses them, without explanation.

## 3. Round 1 findings that were not weaknesses of the build

Recorded so that nobody "fixes" them by inventing content: no case studies, no history, no figures, no certifications, no pricing, no support hours, no named methodology, no biographies, no Digital Twin section, no extra industries (energy, electric vehicles, agriculture). Each is absent from the source. They are client questions in `REVIEW.md`.

## 4. Fixes made between the rounds

| # | Finding | Fix | Commit |
| --- | --- | --- | --- |
| 1 | NX page said Siemens lists "this name"; the list has Designcenter NX | The NX page now says what the list contains. Source re-read the same day | `fbe9625` |
| 2 | Footer trademark line did not name the owner | Reworded: the six are Siemens products; Siemens and the product names are trademarks or registered trademarks of Siemens or its affiliates | `43caf0d` |
| 3 | 90 axe-core findings: duplicate landmark names on every page, a second "Products" landmark, a tab-panel role on `article` | The three language switches are named for where they are; the products jump navigation is named "Products on this page"; panels are `section` elements. Rescan: 0 | `43caf0d` |
| 4 | Search page layout shift (CLS 0.115, mobile) | The form is hidden by a style rule when scripts are off, instead of being revealed by script after load. CLS 0 | `43caf0d` |
| 5 | Registers covered only non-source text; no customer or asset register | Claim register extended to statements taken from the original; customer register and asset register added, all written by the build | `43caf0d`, `2348440` |
| 6 | Maintenance procedures unwritten | `ARCHITECTURE.md` and `DESIGN-SYSTEM.md` | `7462aa1` |
| 7 | The accessibility page did not mention the automated scan now done | Added, with what it does not prove | `2348440` |
| 8 | Nothing compared the published testimonials, logos and roles with the original mechanically | `tools/check-source.py`: 87 checks | `bc0636b` |
| 9 | Support route missing from the footer | "Ask about support" in the footer of every page, opening the contact form with the support type chosen | `43caf0d` |

## 5. Round 2

Round 2 repeated the reviews on the final build. Reviewers whose answer changed:

- **Siemens representative.** Findings 1 and 2 are closed. Still open, and not fixable here: the wordmark inside one inherited image, the Designcenter naming, and written confirmation of the two partner designations from Siemens' side. The official Nexware package confirms both designations as the company's own wording.
- **Technical architect.** The procedures are written. The Apache and unit-test points stand.
- **Quality assurance.** axe-core: 0 violations on 164 scans. Lighthouse: no layout shift on any of the 44 runs. A mechanical comparison with the original passes 87 checks. New in round 2, from reading the Japanese mobile screenshots: fact labels broke one character from the end (ライフサイクルの段 / 階), and a hero label broke inside a katakana word. Both fixed (commit `12c8dcf`): labels now break at phrase boundaries and the hero label is shorter. The screenshot tool was also photographing pages before their last images had been decoded, leaving grey boxes in two gallery pictures; the tool now waits, and records how many images had not loaded (0 on every page) (commit `45dbdd6`).
- **Customer.** Support is one step from every page.
- **Accessibility expert.** The landmark findings are closed. Everything about assistive technology stands.

The other reviewers' answers are unchanged, because what they found wanting is information the company has not published.

**No critical issue is known in the build.** One critical issue is known *about the launch*: the mailbox (see `REVIEW.md`).

### Scores

R1 and R2 are the two rounds. "Why not higher" is the reason the score stops where it does. The evidence columns give the test totals as they were at round 2. Nine of these scores were changed after the independent verification; the current ones are in section 7.

#### Business

| Area | Criterion | R1 | R2 | Evidence | Why not higher |
| --- | --- | --- | --- | --- | --- |
| Corporate credibility | A reader can establish who the company is, who leads it, where it is and who vouches for it, and each statement is confirmed | 62 | 62 | About: profile, leadership, offices; 21 logos; 4 testimonials, word for word (`check-source`) | Three forms of the name, two CEO titles, no history, permissions for logos and quotes unconfirmed (cap 80, and well short of it) |
| Business positioning | One clear statement of what the company is, consistent across pages | 70 | 70 | Home hero and title; services by phase; six product pages | About tells the source's IT-services story, home tells the PLM story; the client has not chosen |
| Customer value communication | Each offering is tied to a customer problem and a stated benefit | 72 | 72 | Four problems on home; 16 business needs in the finder; each solution lists the needs it answers | Benefits are qualitative only; no outcome from any real project |
| Commercial effectiveness | A visitor ready to talk can do so in one step, and the enquiry arrives usable | 74 | 74 | Journey tests: enquiry mailed with type, topic, need, industry, size | Mailbox unconfirmed; no CRM; no measurement of any kind |
| Competitive differentiation | The site shows, with evidence, why this company rather than another | 55 | 55 | "Why ThinkInnov-NexGen for PLM", five Key Value Drivers, as the source states them | The differentiators are assertions; the evidence that would back them is not in the source |

#### Japanese customer

| Area | Criterion | R1 | R2 | Evidence | Why not higher |
| --- | --- | --- | --- | --- | --- |
| Language quality | Natural, professional Japanese, reviewed by a native reader | 60 | 62 | 0 untranslated strings; register of every string; awkward label breaks fixed in round 2 | No native review (cap 75); written by a machine and likely to read as such in places |
| Professionalism | Nothing careless: consistent terms, no mixed-language leftovers, correct forms of address | 75 | 75 | Language-parity check; です・ます throughout; product names in Latin script | The cap of 75 applies. **Corrected:** this row was recorded as 78 and 80, both above the cap that section 1 sets for anything depending on the unreviewed Japanese. The independent verifier found the error. Score after the verification: 72 (section 7) |
| Trustworthiness | The facts a Japanese buyer checks first are present and confirmed | 66 | 66 | 会社概要, representative, address in Japanese form, Tokyo telephone | Registered name and titles unconfirmed; no 沿革 |
| Technical accuracy | PLM and product terms are the ones used in Japanese industry | 72 | 75 | Terms follow the original site's Japanese where it had any; trademark sentence corrected | No specialist has read it |
| Cultural appropriateness | Structure and manner fit a Japanese corporate site | 68 | 68 | Company information first-class in the menu; restrained design; no superlatives | No message from the representative, no history; delivery from India is implied, not explained |

#### Engineering

| Area | Criterion | R1 | R2 | Evidence | Why not higher |
| --- | --- | --- | --- | --- | --- |
| PLM explanation | A non-specialist can follow what PLM is and why it matters | 78 | 78 | Nine-stage lifecycle with a sentence per stage; PLM For Everyone | The stage sentences are new, general text awaiting a specialist's eye; acronyms unexplained |
| Product accuracy | Every statement about a Siemens product is true and sourced | 74 | 78 | One sentence per product with URL and supporting words in the claim register; trademark statements corrected | Designcenter naming open; nobody at Siemens or the client has confirmed |
| Solution accuracy | Every statement about a solution is the company's own, and relations between things are correct | 76 | 76 | Source paragraphs unchanged; every relation carries its basis in `relations.js` | Relations are this build's reading (cap 80) |
| Manufacturing relevance | A manufacturing leader sees their concerns addressed | 64 | 64 | Tecnomatix page, Digital Factory section, ERP/MES integration diagram | The source says little about the shop floor |
| Technical depth | An engineer finds enough to judge fit | 48 | 48 | Product and solution pages | One line per product and one paragraph per solution exist. More would have to be invented |

#### Design

| Area | Criterion | R1 | R2 | Evidence | Why not higher |
| --- | --- | --- | --- | --- | --- |
| Visual identity | Recognisable, original, consistent with the logo | 82 | 82 | `DESIGN-SYSTEM.md`; screenshots | A judgement by the builder only; no brand guideline exists to check against |
| Typography | Clear hierarchy in both scripts; no bad breaks | 84 | 86 | Phrase-aware breaking in headings, and now in fact labels | Japanese seen in one font on one system only |
| Layout | Ordered, readable at every width | 84 | 84 | Layout test, 82 pages × 10 widths, 0 failures | Long pages; some wide-screen sections leave a column empty under the heading |
| Imagery | Real, relevant, consistent | 62 | 62 | 14 real photographs; SVG diagrams from source wording; nothing generated for this rebuild | One event only; no picture of the work; eleven inherited images in another style, rights unconfirmed |
| Interaction quality | Every control behaves predictably by mouse, touch and keyboard | 84 | 86 | 389 interaction checks; panel role and search shift fixed | Chrome only (cap 90) |
| Responsive design | No overflow, clipping or unusable control at any width | 90 | 90 | Layout test; mobile menu tests | Emulated widths, not devices |
| Design consistency | Shared components, one set of tokens | 86 | 86 | One template per component; tokens in one file | The inherited industry images |

#### Sales

| Area | Criterion | R1 | R2 | Evidence | Why not higher |
| --- | --- | --- | --- | --- | --- |
| Product discovery | Each product is reachable from the menu, catalogue, lifecycle, finder and search, and has its own page | 82 | 82 | Product-page tests; search tests | Pages are thin |
| Solution discovery | A visitor can find a solution from a problem without knowing a product name | 84 | 84 | Finder tests, 16 needs | Relations await sign-off |
| Customer journeys | The brief's three worked journeys run end to end | 84 | 85 | `testJourneys`: all three pass, the first with the mailed enquiry checked line by line | One browser; real delivery unproven |
| Inquiry quality | An enquiry says who, about what, and in what context | 80 | 80 | Mail body in the journey test | No source or campaign; single mailbox; cap 80 until it runs on the host |
| Conversion clarity | Every page has one obvious next step | 82 | 82 | Page endings in the screenshots; no dead ends in the link check | No data on whether anyone takes it |

#### Technical

| Area | Criterion | R1 | R2 | Evidence | Why not higher |
| --- | --- | --- | --- | --- | --- |
| Architecture | The simplest thing that meets the need on the target host | 88 | 88 | `ARCHITECTURE.md`; no runtime dependency; deterministic build | Unproven on Apache |
| Code quality | Readable, small modules, no dead code | 82 | 82 | No source file over about 500 lines; build validates content | No linter and no unit tests for the generator |
| Maintainability | A new person can add a page, product, job or translation from written steps | 78 | 84 | Procedures in `ARCHITECTURE.md` | Nobody else has tried them |
| Performance | The brief's targets, measured | 92 | 93 | Lighthouse, 44 runs: lowest performance 99, highest LCP 2.1 s, CLS 0 (`test-output/lighthouse.txt`) | Lab numbers from a local server; no field data, so INP cannot be claimed |
| Security | Inputs validated, nothing exposed, headers set | 78 | 78 | 58 handler checks; credential scan; `npm audit` 0 | Headers and folder blocking unproven on the host (cap 80) |
| Accessibility | WCAG 2.2 AA as far as automated and scripted checks can show | 78 | 84 | axe-core 90 → 0; keyboard and reduced-motion tests | No screen reader; 36 undecided items; text inside inherited images |
| SEO | Every page indexable, uniquely described, correctly paired across languages | 86 | 86 | `check-site`: titles, descriptions, canonical, hreflang, sitemap all 0 failures; Lighthouse SEO 100 | Not validated in Search Console; no keyword data; redirects unproven |

#### Quality assurance

| Area | Criterion | R1 | R2 | Evidence | Why not higher |
| --- | --- | --- | --- | --- | --- |
| Functional completeness | Everything on the pages does what it says | 86 | 88 | 389 interaction checks, 58 form checks | One browser |
| Broken links | None | 95 | 95 | 4,091 internal links and assets resolved, 984 with a fragment; 0 missing | Outbound links are not fetched by the checker; old-URL redirects unproven on Apache |
| Missing content | Nothing from the original lost; nothing promised and absent | 80 | 80 | `COVERAGE.md`; `check-source` | What the brief asks for beyond the source is absent by design |
| Error handling | Failures are shown as failures, with a way forward | 86 | 86 | Form tests for 500, 429 and validation; 404 page; empty filter and search states | The 404 status itself needs Apache |
| Browser compatibility | Works in Chrome, Safari, Edge and Firefox | 40 | 40 | Chrome only | The other three were not available |
| Integration reliability | Mail arrives; nothing else is integrated | 50 | 50 | Handlers hand a correct message to a stand-in for `sendmail` | No real delivery; the mailbox may not exist |

No area is scored 100 (the scores as they stood after round 2; see section 7 for the nine that changed). The lowest scores are the honest ones to look at: technical depth (48), browser compatibility (40), integration reliability (50) and competitive differentiation (55). Three of the four cannot be raised by more building.

## 6. What remains after round 2

Fixable only by the client or a third party:

1. Confirm the mailbox, the legal name, the titles, the partner designations in writing, which roles are open, and permission for each logo, quote and photograph.
2. Native review of the Japanese.
3. A PLM specialist's sign-off on the relations in `relations.js`.
4. Material for depth: case studies, history, product detail approved by Siemens, real photography of the work.
5. A run on the real host: mail, redirects, headers, 404.
6. Safari, Edge, Firefox, real phones and a screen reader.

Still imperfect in the build itself, and left: long pages; the visual clash of the eleven inherited industry images; acronyms unexplained; no unit tests for the generator; 36 accessibility items that need a person.

## 7. After the independent verification

An independent verifier checked the whole site at commit `30c9b8a` on 25 November 2026: every page in both languages at 390 and 1440, with sideways overflow at eight widths, the interactions, the owner's rules, the build, the tests and these documents. Its report is summarised in `REVIEW.md` §12. It agreed with most of the scores above and put six at least ten points lower. Each of those is taken in turn here. The scores in the last column were set after the fixes, against the same scale and caps as before; none was simply put back.

| Area | Round 2 | Verifier | What the verifier found | What was done | Score now | Why not higher |
| --- | --- | --- | --- | --- | --- | --- |
| Responsive design | 90 | 72 | Words broke in the middle in headings between 900 and 1180 px on four kinds of page, and on Products at every desktop width. The finder hid its own button inside a scrolling panel at 1366×768. The 90 claimed "shown by a measurement" from a test that measured neither | Both fixed. The layout test now runs at sixteen widths, fails on a word split across lines and on controls under 24 px, and opens every finder result and lifecycle tab; a new interaction test checks the finder button at 1280×720, 1366×768 and 1440×900. Both tests were first run on the unfixed build and failed there | 84 | Emulated widths in one browser, no device. The word-break check depends on this machine's fonts. And the earlier 90 was wrong, so a figure in the 90s should wait until someone other than the author has looked again |
| Typography | 86 | 68 | The criterion names bad breaks, and there were many: English product names and service headings, Japanese page headings, a lead paragraph, the address, footer links | English headings no longer break inside a word at any tested width (sizes fitted to their columns, a breakpoint added between 900 and 1180 px). Japanese headings, labels, buttons and short text break only between phrases | 80 | Japanese paragraphs longer than 30 characters are left to the browser and can still break inside a word. Phrase breaking leaves some uneven line ends on phones. One Japanese font, one system, no native reader |
| Layout | 84 | 72 | Job facts wrapped differently from row to row on Careers at 1440; the finder panel; headings broken at tablet widths; and the empty columns already noted | Careers rows now use one arrangement at each width, tested for all 18 roles; finder panel grows with its content; a repeated sentence on Services and wrapped links in the product page strip were found and fixed while checking | 78 | Not changed, and the verifier is right about them: a very long home page, gallery columns that end unevenly at 1440, sections on four product pages that hold one link beside an empty area |
| Product accuracy | 78 | 62 | The site's text about Siemens products is sourced. The eleven inherited industry images are not: one prints five figures about Teamcenter X with no source, and one carries the Siemens wordmark | Nothing on the pages: the owner has decided to leave the images as they are for now. The figures are now in the claim register as inherited and unsourced, both images are noted in the asset register, and the matter is the first open question for the client | 62 | The verifier's score is accepted. The round 2 score looked only at text and missed what the images say. It cannot rise while the images are published without a source |
| Professionalism (Japanese) | 80, corrected to 75 | 68 | The score broke this document's own cap. English left in ordinary Japanese text ("SMBs", "UAT", a job title, an industry title); headings broken inside words | The cap is applied. The leftovers that were ordinary text are translated; names that are proper names in the source stay in Latin script. Heading breaks fixed as above | 72 | No native reader (cap 75). The browser's own "Choose File" label on the upload control is still English in an English browser. Three points below the cap because this area was overstated once already |
| Design consistency | 86 | 76 | The footer logo on a light plate on every page; the industry images; diagram captions labelled three different ways | All four drawn diagrams (the home hero and three on Digital Transformation) are now captioned "Conceptual diagram" / 概念図 in the same form in both languages, and `check-source.py` fails otherwise. The header logo is larger and the footer plate tidied. The logo itself is not recoloured: a version for dark backgrounds is a request to the client | 79 | The plate is still a plate, and the industry images are still in another style. Both wait on the client |

Three further scores were changed although the difference was smaller than ten:

| Area | Round 2 | Verifier | Score now | Reason |
| --- | --- | --- | --- | --- |
| Interaction quality | 86 | 80 | 84 | The finder panel is fixed and tested at three desktop sizes, and the failure message on the forms now links the address. But 389 checks had passed while a button was out of reach, which is a fault of the tests as much as of the page |
| Imagery | 62 | 55 | 55 | Accepted. Nothing about the imagery changed, and the verifier is right that the industry images look machine-made and are not labelled as illustrations |
| Performance | 93 | not rescored | 80 | The verifier measured the phone results with and without compression: the targets are met only with it on. This review's own cap says anything that needs the real host cannot score above 80 until it has run there, and the 93 ignored that. Laboratory figures with compression on are unchanged (`test-output/lighthouse.txt`) |

The other thirty-one scores stand as in round 2; the verifier put each within a few points of them.

After these changes: highest are broken links 95, architecture 88, functional completeness 88, SEO 86 and error handling 86. Lowest are browser compatibility 40, technical depth 48, integration reliability 50, competitive differentiation 55 and imagery 55. No area is scored 100, and none above 88 except broken links.

What the verifier recommended and was not done in this round, by the owner's decision, is listed in `REVIEW.md` §12.

## 8. After the owner's decision on the industry images

On 25 November 2026 the owner (AK) decided to remove two of the eleven inherited industry images: the one with the SIEMENS wordmark in it, and the one that printed five figures about Teamcenter X and a security and compliance sentence with no source. Both are gone from the English and the Japanese pages and the files are no longer served. The two industry entries stay, in a layout made for an entry without an image. The other nine images are unchanged. `REVIEW.md` §8, decision 22.

The author looked at the nine that remain, one by one: none carries the Siemens wordmark and none prints a figure. Seven carry the product name "Teamcenter X", four of them with an X-shaped symbol beside it, and four carry short phrases about what the product does. Who made them is still not known.

| Area | Verifier | After the fixes (§7) | Now | Reason |
| --- | --- | --- | --- | --- |
| Product accuracy | 62 | 62 | 70 | The verifier's reason for 62 was what two images said about a Siemens product, and those two are no longer published. Not back to the 78 of round 2: nine images of unknown origin still show the name of a Siemens product with phrases about what it does, four product pages are thin, and the product relations have not been read by a specialist. Set by the author; nobody independent has seen the site since the change |
| Imagery | 55 | 55 | 55 | Unchanged. There are fewer inherited images, but the nine that remain look machine-made, are not labelled as illustrations and are of unknown origin; two entries now have no picture at all |
| Design consistency | 76 | 79 | 79 | Unchanged. The two entries without an image are in the site's own style, but nine images in another style remain beside them |

No other score changes. Highest and lowest areas are as at the end of section 7.
