# Acceptance criteria: status of each one

The brief (`notes/MASTER_PROMPT.txt`) contains 157 acceptance and definition-of-done criteria across its three parts. Each is listed here with where it is in the brief, a status, the evidence and a note. `L` numbers are lines in the brief. Criteria are quoted from it.

## How to read this

**Status** is one of the six the brief names (L2499–2500, L5063–5073):

| Status | Meaning here |
| --- | --- |
| Implemented | Built or written. Either no test can settle it (it is a judgement or a document), or none was run. |
| Tested | A test or scan was run on the final build and passed. The output file is named. |
| Verified | Tested, and the author also looked at the result in the final screenshots (the pages read are listed in `TEST-EVIDENCE.md` §5). It never means approved by the client, checked in a browser other than Chrome, or read by a native Japanese speaker. After the independent verification, four rows that had this status were moved to Tested, because the test behind them had not been able to see the faults that were there. |
| Requires Business Approval | Built, but whether the criterion is met depends on a fact, permission or review only the client can give. |
| Requires External Integration | Cannot be finished or proven without a system this work may not touch: the production host, a mailbox, real visitors. |
| Not Implemented | Not built, or not applicable. The reason is given. |

**Independent verification.** A verifier who did not build the site checked it at commit `30c9b8a` on 25 November 2026, including 41 of the 84 rows then marked Tested or Verified. It found the evidence held for 34 and that 7 were overstated: AC-N04 and AC-S06 (partner wording), AC-R03, AC-N11 and AC-L02 (layout), AC-P01 and AC-P05 (performance); it also noted AC-R07. Each has been set to what the evidence supports after the fixes, and its note says what changed. `REVIEW.md` §12 has the whole account.

**Owner's decision on the industry images, 25 November 2026.** Two of the eleven inherited industry images were removed: one carried a Siemens wordmark, the other printed unsourced figures about a Siemens product, and both were of unknown origin and rights. This is an owner-approved exception to the rule that nothing the original had is dropped. It is noted on the rows about preserving existing content (AC-D02, AC-N17, AC-S16) and on the rows about unsupported claims and Siemens marks (AC-N04, AC-N14, AC-S06, AC-S07). No status changed: the rows about content stay met, because the removal is intentional and recorded, and AC-N14 and AC-S07 stay open, because nine images of unknown origin and other inherited material remain. `REVIEW.md` §8, decision 22.

**Met?** says whether the criterion itself is satisfied: Yes, In part, No, or n/a. A row can be Tested and still only met in part, when the test covers less than the criterion asks. The note says what is missing.

**Evidence** names a file. Short names for the test outputs, all in `notes/test-output/` and described in `notes/TEST-EVIDENCE.md`:

| Short name | File | What it is |
| --- | --- | --- |
| T-build | `build.txt` | Two builds in a row, then `git status` |
| T-site | `check-site.txt` | Links, anchors, headings, ids, titles, descriptions, canonical, hreflang, sitemap, language pairs, trackers, third-party resources |
| T-src | `check-source.txt` | Comparison with the original site, including the industry images and the two approved removals; banned wording; excluded markup; credentials |
| T-forms | `forms.txt` | 62 checks of the two PHP handlers |
| T-layout | `layout.txt` | Every page at sixteen widths: overflow, off-screen content, clipped text, broken images, controls under 24 px, words broken across lines |
| T-int | `interactions.txt` | 445 interaction checks in Chrome |
| T-csp | `interactions-csp.txt` | The same 445 under the production Content-Security-Policy |
| T-axe | `axe.txt` | axe-core on every page at two widths |
| T-lh | `lighthouse.txt` | Lighthouse 12: 44 runs with compression on, 10 phone-preset runs with it off |
| T-audit | `npm-audit.txt` | Dependency audit |
| T-shots | `screenshots-after/index.json` | 164 full-page screenshots with overflow, H1 count and unloaded images |

## Tally

| Status | Criteria |
| --- | --- |
| Implemented | 49 |
| Tested | 77 |
| Verified | 7 |
| Requires Business Approval | 14 |
| Requires External Integration | 8 |
| Not Implemented | 2 |
| **Total** | **157** |

| Met? | Criteria |
| --- | --- |
| Yes | 103 |
| In part | 48 |
| No | 5 |
| n/a | 1 |

The criteria not met in full, each with its reason, are listed together in `notes/REVIEW.md` §3.

## 1. Final Acceptance Criteria (Part A §19, L601–634)

| ID | Brief | Criterion | Status | Met? | Evidence | Note |
| --- | --- | --- | --- | --- | --- | --- |
| AC-A01 | L605 | "Every relevant business requirement is addressed." | Implemented | In part | `TRACEABILITY.md`: all 255 requirement rows have a location or a reason | Requirements that need a backend or a client decision are recorded in `TRACEABILITY.md` and in `REVIEW.md` §7 and §9, and are not built. |
| AC-A02 | L607 | "Every relevant stakeholder journey is supported." | Tested | Yes | `PERSONA-MATRIX.md`; T-int (`journey 1`, `journey 2`, `journey 3`, `finder`, `product pages`) | Each persona has a page and a working action. What a persona cannot find (pricing, case studies, certifications) is listed in the matrix. |
| AC-A03 | L609 | "The brand identity is distinctive and consistent." | Implemented | Yes | `DESIGN-SYSTEM.md`; `screenshots-after/` | One token set, one template per component. The builder's judgement; no brand guideline exists to check against. |
| AC-A04 | L611 | "The website is visually exceptional." | Implemented | In part | `EXECUTIVE-REVIEW.md` design scores 55–84 after the independent verification (§7 there) | "Exceptional" is not claimed. Imagery scores 55: one event photographed, nine inherited industry images in another style, of unknown origin. (Two more, one with a Siemens wordmark and one with unsourced figures, were removed on 25 November 2026 by the owner's decision.) |
| AC-A05 | L613 | "The content is clear and persuasive." | Implemented | In part | `CLAIM-REGISTER.md`; T-src | English is the source's wording, tidied. Persuasion by evidence is limited to what the source has. Japanese awaits native review. |
| AC-A06 | L615 | "All implemented features are functional." | Tested | Yes | T-int 445/445; T-forms 62/62; T-site | In Chrome. |
| AC-A07 | L617 | "Mobile and desktop experiences are excellent." | Tested | In part | T-layout: 82 pages × 16 widths, 0 failures, including words broken across lines and controls under 24 px; T-int `finder result panel` at three desktop sizes; T-shots | Emulated widths in Chrome, not physical devices. "Excellent" is a judgement (responsive design scored 84 after the faults the independent verifier found were fixed). |
| AC-A08 | L619 | "Security and privacy controls are implemented." | Requires External Integration | In part | T-forms; T-src (credentials); `docs/.htaccess`; `privacy.html` | Handlers tested locally. Headers, the blocked `inc/` folder and HTTPS need the Apache host. Privacy notice needs legal review. |
| AC-A09 | L621 | "Critical user journeys are tested." | Tested | Yes | T-int: `journey 1` (enquiry sent and the email read back), `journey 2`, `journey 3`, `contact form`, `application form`, `language switch` |  |
| AC-A10 | L623 | "Accessibility and performance are measured." | Tested | Yes | T-axe; T-lh | Lab measurements. |
| AC-A11 | L625 | "No known critical defects remain." | Tested | Yes | All suites pass on the final build (`TEST-EVIDENCE.md`); defects and retests in `REVIEW.md` §5 | One launch-critical item is open and is not a defect of the build: the recipient mailbox is unconfirmed. |
| AC-A12 | L627 | "The codebase is maintainable and scalable." | Implemented | Yes | `ARCHITECTURE.md`; T-build (two builds, no change) | Nobody other than the author has followed the procedures. |
| AC-A13 | L629 | "The platform is ready for its intended production environment." | Requires External Integration | No | `docs/README-DEPLOY.md` | Never run on Apache or with real mail. Needs a test upload by someone with access to the host. |
| AC-A14 | L631–632 | "Provide a final report containing completed features, test results, actual performance metrics, outstanding limitations, deployment status, and recommended future improvements." | Implemented | Yes | `REVIEW.md`: features (§6, `STATUS.md`), test results and metrics (§2), limitations (§3, §4), deployment status (§1), phase 2 (§7) |  |
| AC-A15 | L634 | "Never claim that a requirement is complete if it has not been implemented or verified." | Implemented | Yes | This file; `STATUS.md` | Every Tested row names an output file. |

## 2. Definition of Done (Part C §38, L4976–5010)

| ID | Brief | Criterion | Status | Met? | Evidence | Note |
| --- | --- | --- | --- | --- | --- | --- |
| AC-D01 | L4979 | "Every discovered existing page has been accounted for." | Tested | Yes | `improved-src/COVERAGE.md` §Routes; T-site (`legacy anchors: 0`); T-int `old addresses` (18 checks) | The 301 versions in `.htaccess` are untested. |
| AC-D02 | L4981 | "Every existing valuable business capability has been preserved or intentionally migrated." | Tested | Yes | `COVERAGE.md`; T-src (testimonials, 21 logos, 18 roles and every sentence identical to the original; eleven industry entries; the original's eleven industry images less the two approved removals) | **One owner-approved exception to "nothing dropped".** On 25 November 2026 the owner (AK) decided to remove two of the eleven inherited industry images, I2 and I11, because one carries a Siemens wordmark and the other prints unsourced figures about a Siemens product, inside images of unknown origin and rights. This is intentional, not a loss: the two industry entries keep their titles, text, relations and links, and the check names these two images as the only ones allowed to be missing. `COVERAGE.md`, "Removed on purpose"; `ASSET-REGISTER.md` §3. |
| AC-D03 | L4983 | "Every approved new page has been implemented." | Requires Business Approval | In part | `STATUS.md` page list | Nobody has approved a page list. Built: everything the source supports, including six product pages and search. Not built for want of content: history, case studies, resources/FAQ, terms of use. |
| AC-D04 | L4985 | "Every required language version is complete." | Tested | In part | T-build (`0` untranslated); T-site (`language parity: 0`); `JAPANESE-REGISTER.md` | Complete by machine check. Not reviewed by a native reader. |
| AC-D05 | L4987 | "Every relevant customer journey is functional." | Tested | Yes | As AC-A09 |  |
| AC-D06 | L4989 | "Every essential interaction is verified." | Tested | Yes | T-int, including keyboard-only paths through menus, lifecycle, finder, viewer and forms |  |
| AC-D07 | L4991 | "Every major responsive layout has been inspected." | Tested | In part | T-layout; T-shots (164 files) | Every page was measured at sixteen widths. By eye, the author read the pages listed in `TEST-EVIDENCE.md` §5, not all 164 images. |
| AC-D08 | L4993 | "Every known critical security issue has been resolved." | Tested | In part | T-forms; T-src; T-audit (0 vulnerabilities) | No critical issue is known. Anything that depends on host configuration is unproven. |
| AC-D09 | L4995 | "Accessibility has been evaluated." | Tested | In part | T-axe (0 violations; 36 colour-contrast results it could not decide); T-int keyboard and reduced-motion checks | No screen reader was used. |
| AC-D10 | L4997 | "Performance has been measured." | Tested | Yes | T-lh |  |
| AC-D11 | L4999 | "Search engine discoverability has been verified." | Tested | In part | T-site (titles, descriptions, canonical, hreflang, sitemap: 0 failures); T-src (JSON-LD parses); T-int `scripts off`; T-lh SEO 100 | Not checked in Google Search Console or a structured-data validator. |
| AC-D12 | L5001 | "No known critical functional defects remain." | Tested | Yes | As AC-A11 |  |
| AC-D13 | L5003 | "Content requiring approval is clearly identified." | Implemented | Yes | `REVIEW.md` §9; `CLAIM-REGISTER.md`, `CUSTOMER-REGISTER.md`, `ASSET-REGISTER.md`, `JAPANESE-REGISTER.md` |  |
| AC-D14 | L5005 | "The website is maintainable." | Implemented | Yes | As AC-A12 |  |
| AC-D15 | L5007 | "Deployment requirements are documented." | Implemented | Yes | `docs/README-DEPLOY.md` | Covers cPanel and the GitHub Pages preview, mail settings and redirects. |
| AC-D16 | L5009–5010 | "Produce a traceability matrix connecting every requirement to its implementation and verification evidence." | Implemented | Yes | `TRACEABILITY.md` |  |

## 3. Non-Negotiable Requirements (Part B §25, L2417–2456)

| ID | Brief | Criterion | Status | Met? | Evidence | Note |
| --- | --- | --- | --- | --- | --- | --- |
| AC-N01 | L2419 | "No generic AI-generated website appearance." | Implemented | Yes | `DESIGN-SYSTEM.md`; `screenshots-after/` | No gradients, glow, glass, floating cards or particles, and nothing generated for this rebuild. The nine inherited industry images that are published are in another style. A judgement. |
| AC-N02 | L2421 | "No fake testimonials." | Tested | Yes | T-src: four quotes and attributions word for word, both languages | Whether each customer agreed to be quoted is a client question. |
| AC-N03 | L2423 | "No fabricated customer relationships." | Requires Business Approval | In part | T-src: the same 21 logos as the original; `CUSTOMER-REGISTER.md` | Nothing was added. Permission, the customer's correct name for four logos, and which entity holds each relationship are unconfirmed. |
| AC-N04 | L2425 | "No incorrect Siemens partnership claims." | Tested | Yes | T-src: "Siemens Solution Partner" exactly once on each home page, in the hero, and nowhere else; "Expert Partner - PLM" on About only; none in head, footer or structured data | At commit `30c9b8a` the phrase was printed twice on each home page, where the source has it once; the independent verifier found it. The second was removed (`6260296`) and the check now counts occurrences. Both wordings are in the company's official site package, in these two places. Siemens itself has not been asked. The Siemens wordmark that was inside inherited industry image 02 is no longer published: the image was removed on 25 November 2026 by the owner's decision, and T-src fails if it comes back (AC-S07). |
| AC-N05 | L2427 | "No placeholder content in production." | Tested | Yes | T-src: placeholder phrases absent; no empty headings |  |
| AC-N06 | L2429 | "No unfinished pages." | Verified | Yes | T-site: every page has one H1, a title and a description; T-shots |  |
| AC-N07 | L2430 | "No broken links." | Tested | Yes | T-site: 4,091 internal links and assets, 984 with a fragment, 0 missing | Outbound links are not fetched by the checker. |
| AC-N08 | L2432 | "No non-functional buttons." | Tested | Yes | T-int |  |
| AC-N09 | L2434 | "No fake contact form submissions." | Tested | Yes | T-forms (`mail failure is reported as failure (500)`); T-int `contact form` (success only on the server's confirmation; error and email fallback otherwise) |  |
| AC-N10 | L2436 | "No broken Japanese translations." | Requires Business Approval | In part | T-build; T-site | Nothing is untranslated or mixed. Whether the Japanese reads well needs a native reviewer. |
| AC-N11 | L2438 | "No inconsistent layouts." | Tested | In part | T-layout; T-int `career filters` (every role row laid out the same way at 1440, 1280 and 1024) and `finder result panel`; shared templates in `improved-src/lib/` | The inconsistencies the independent verifier found at tested widths are fixed and now tested: job facts wrapping differently from row to row, the finder panel, headings that broke inside a word. Not changed, and noted by the verifier: gallery columns that end unevenly at 1440, and sections on four product pages that hold one link beside a large empty area. |
| AC-N12 | L2440 | "No unnecessary visual clutter." | Implemented | Yes | `screenshots-after/` | A judgement. |
| AC-N13 | L2442 | "No inaccessible essential functionality." | Tested | In part | T-int keyboard paths; T-axe | No assistive technology was used. |
| AC-N14 | L2444 | "No unverified business claims." | Requires Business Approval | In part | `CLAIM-REGISTER.md`: every statement in the site's text has a source | Sourced is not the same as confirmed. The claims inherited from the original are listed for the client in register §5. **The five unsourced figures about Teamcenter X, and the security and compliance sentence, are no longer published:** the inherited image that printed them was removed on 25 November 2026 by the owner's decision (register §6), and T-src fails if the image or any of the figures appears on a page. The nine industry images that remain print no figure; four of them carry short phrases about what Teamcenter X does, with no numbers and no source (`ASSET-REGISTER.md` §3). |
| AC-N15 | L2446 | "No exposed credentials." | Tested | Yes | T-src: 0 credential patterns in tracked text files; no key or `.env` files |  |
| AC-N16 | L2448 | "No unnecessary paid dependencies." | Tested | Yes | T-audit: one direct build-time package, BudouX (Apache-2.0), with its own dependencies; nothing at run time; 0 known vulnerabilities | Test tools are free and installed outside the repository. |
| AC-N17 | L2450 | "No accidental loss of existing business content." | Tested | Yes | As AC-D02 | The two industry images were removed deliberately, by the owner's decision of 25 November 2026; see AC-D02. |
| AC-N18 | L2452 | "No unsupported claims of successful testing." | Implemented | Yes | `TEST-EVIDENCE.md` |  |
| AC-N19 | L2454 | "No unauthorized production deployment." | Implemented | Yes | `REVIEW.md` §1 | Nothing was deployed, merged or sent. The branch is pushed to GitHub only. |
| AC-N20 | L2456 | "Every important design and engineering decision must have a clear business justification." | Implemented | Yes | `ARCHITECTURE.md` (decisions table); `REVIEW.md` §8 |  |

## 4. Strict Non-Negotiable Requirements (Part C §37, L4931–4974)

| ID | Brief | Criterion | Status | Met? | Evidence | Note |
| --- | --- | --- | --- | --- | --- | --- |
| AC-S01 | L4933 | "No generic AI website templates." | Implemented | Yes | As AC-N01 |  |
| AC-S02 | L4935 | "No incomplete pages." | Verified | Yes | As AC-N06 |  |
| AC-S03 | L4937 | "No placeholder production content." | Tested | Yes | As AC-N05 |  |
| AC-S04 | L4939 | "No fake customer testimonials." | Tested | Yes | As AC-N02 |  |
| AC-S05 | L4941 | "No fabricated company claims." | Tested | In part | `CLAIM-REGISTER.md`; T-src (banned wording absent; no rating, award or certification wording) | Nothing was invented by this build. Claims the original makes are unconfirmed (AC-N14). |
| AC-S06 | L4943 | "No invented Siemens credentials." | Tested | Yes | As AC-N04 | No Siemens wordmark is published anywhere on the site: no Siemens logo was ever added, and the one inherited image that carried the wordmark was removed on 25 November 2026 by the owner's decision. Seven of the nine inherited images that remain carry the product name "Teamcenter X", four of them with an X-shaped symbol; where those pictures came from is not known (`ASSET-REGISTER.md` §3, by the author's reading, not a mechanical check). |
| AC-S07 | L4945 | "No unauthorized brand assets." | Requires Business Approval | No | `ASSET-REGISTER.md` §3; `CLAIM-REGISTER.md` §6; T-src (neither removed image present or named in `docs/`) | No brand asset was added. **Removed on 25 November 2026 by the owner's decision:** the inherited industry image with the Siemens wordmark in it, and the one printing unsourced figures about a Siemens product. Still inherited and unconfirmed, which is why this row is not met: 21 customer logos, photographs of identifiable people, and nine industry images of unknown origin, seven of which carry the product name "Teamcenter X" (four with an X-shaped symbol beside it). None of the nine carries the Siemens wordmark or a printed figure (`REVIEW.md` §9, question 19). |
| AC-S08 | L4947 | "No broken links." | Tested | Yes | As AC-N07 |  |
| AC-S09 | L4949 | "No non-functional buttons." | Tested | Yes | As AC-N08 |  |
| AC-S10 | L4951 | "No inaccessible essential interactions." | Tested | In part | As AC-N13 | No assistive technology was used. |
| AC-S11 | L4953 | "No misleading inquiry confirmations." | Tested | Yes | As AC-N09 |  |
| AC-S12 | L4955 | "No untranslated essential content." | Tested | Yes | T-build; T-site |  |
| AC-S13 | L4957 | "No unverified job vacancies." | Requires Business Approval | No | T-src: 18 roles, titles as in the original; no `JobPosting` markup | Whether any role is open today is unknown. |
| AC-S14 | L4959 | "No unnecessary infrastructure." | Implemented | Yes | `ARCHITECTURE.md` | Static files and two PHP handlers. |
| AC-S15 | L4961 | "No exposed credentials." | Tested | Yes | As AC-N15 |  |
| AC-S16 | L4963 | "No accidental deletion of existing business content." | Tested | Yes | As AC-D02 | As AC-N17. |
| AC-S17 | L4965 | "No unauthorized changes to production systems." | Implemented | Yes | As AC-N19 |  |
| AC-S18 | L4967 | "No claims of completed tests without evidence." | Implemented | Yes | As AC-N18 |  |

## 5. Measured targets (A §13 L460–479; B §19 L2098–2112; C §30 L4510–4523, L4549–4553; A §9 L357; C §29 L4474)

| ID | Brief | Criterion | Status | Met? | Evidence | Note |
| --- | --- | --- | --- | --- | --- | --- |
| AC-P01 | L462, L2100, L4512 | "Lighthouse Performance: 95+" | Tested | In part | T-lh: with compression on, 44 runs, lowest 99 (3 runs below 100). With compression off, 10 phone-preset runs, lowest 93 | Met in the laboratory with compression on. Whether the real host compresses is not known: `.htaccess` asks for it, but only where the module exists. `docs/README-DEPLOY.md` §6 says how to check after upload. |
| AC-P02 | L464, L2102, L4514 | "Lighthouse Accessibility: 95+" | Tested | Yes | T-lh: lowest 100 | Covers only what Lighthouse can check automatically. |
| AC-P03 | L466, L2104, L4516 | "Lighthouse Best Practices: 95+" | Tested | Yes | T-lh: lowest 100 |  |
| AC-P04 | L468, L2106, L4518 | "Lighthouse SEO: 95+" | Tested | Yes | T-lh: lowest 100 |  |
| AC-P05 | L470, L2108, L4520 | "Largest Contentful Paint: 2.5 seconds or less" | Tested | In part | T-lh, phone preset, simulated throttling: with compression on, LCP 1.6 to 2.1 s on 22 runs. With compression off, 2.6 to 3.2 s on 10 runs, 10 of them over 2.5 s | Met in the laboratory only with compression on; the independent verifier measured the same. The real host is unconfirmed, and its response time will add to either figure. |
| AC-P06 | L472, L2110, L4522 | "Interaction to Next Paint: 200 milliseconds or less" | Requires External Integration | No | T-lh: Total Blocking Time, highest 60 ms | INP is measured from real visitors. There are none yet, and no analytics. Total Blocking Time is the lab stand-in and is not INP. |
| AC-P07 | L474, L2112, L4523 | "Cumulative Layout Shift: 0.1 or less" | Tested | Yes | T-lh: highest CLS 0.000 |  |
| AC-P08 | L479, L2137, L4549–4553 | "Measure actual performance. Do not claim scores or metrics without testing them." "Distinguish laboratory measurements from real-user field data." | Tested | Yes | `test-output/lighthouse.txt` is headed "lab"; no field figure appears anywhere |  |
| AC-P09 | L357, L4474 | "Target WCAG 2.2 AA." | Tested | In part | T-axe: rules tagged WCAG 2.0 and 2.1 A and AA, WCAG 2.2 AA, and best practice; 0 violations on 164 scans | A target, not a conformance claim. 36 colour-contrast results need a person, and no assistive technology was used. |
| AC-P10 | L4504–4506 | "Automated scores alone are not proof of full accessibility compliance." | Implemented | Yes | `docs/accessibility.html`; `REVIEW.md` §4 | Both say what was tested and what was not, and neither claims conformance. |

## 6. Responsive and language "verify" lists (C §28 L4453–4471; B §12 L1836–1837; B §18 L2081, L2091–2092)

| ID | Brief | Criterion | Status | Met? | Evidence | Note |
| --- | --- | --- | --- | --- | --- | --- |
| AC-R01 | L4455 | "No overlapping elements." | Implemented | In part | T-shots; pages read by eye listed in `TEST-EVIDENCE.md` §5 | No script tests for overlap. None was seen in the screenshots read. |
| AC-R02 | L4457 | "No unintended horizontal scrolling." | Verified | Yes | T-layout: `overflow` 0 at all sixteen widths; T-shots `horizontalOverflow: no` on 164 |  |
| AC-R03 | L4459 | "No clipped typography." | Tested | Yes | T-layout: `clipped` 0 and `pages-with-broken-words` 0 on 82 pages at sixteen widths, with every finder result and lifecycle tab opened (`test-output/layout.txt`; the same check on the earlier build, `layout-wordbreak-before.txt`, failed) | Until this round the test measured only text cut off by its box, and words were being split across lines in headings, labels and buttons at several widths; the independent verifier found them. The test now also fails on a word or a short Japanese phrase split across lines. Its limits: one machine's fonts, and Japanese paragraphs of more than 30 characters are left to the browser's normal line breaking. Changed pages were looked at in Chrome at 390, 1024, 1366 and 1440; not every page at every width. |
| AC-R04 | L4461 | "No broken images." | Verified | Yes | T-layout: `broken-images` 0; T-shots `imagesNotLoaded: 0` |  |
| AC-R05 | L4463 | "No unusable navigation." | Tested | Yes | T-int `desktop menu`, `mobile menu` | Tested at 1440 and 390; keyboard and pointer. |
| AC-R06 | L4465 | "No inaccessible hover-only functionality." | Tested | Yes | T-int: menus open by click and by keyboard as well as hover |  |
| AC-R07 | L4467 | "No broken Japanese layouts." | Tested | In part | T-layout (41 Japanese pages, phrase breaks checked in headings, labels, buttons and other text of up to 30 characters); Japanese pages read in `TEST-EVIDENCE.md` §5 | One Japanese font on one system. The independent verifier found more breaks inside words than the two fixed earlier (page headings, a lead paragraph, the address, footer links, a job title); those are fixed and the test now covers them. Longer Japanese paragraphs break wherever the browser breaks them, which a native reader may still find awkward in places. |
| AC-R08 | L4469 | "No inconsistent spacing." | Implemented | Yes | `DESIGN-SYSTEM.md` tokens | A judgement. |
| AC-R09 | L4471, L2087–2089 | "Suitable for live sales demonstrations in corporate meeting rooms." | Tested | In part | T-layout at 1920 and 2560 | Measured, not looked at on a meeting-room display. The final screenshot set is 390 and 1440 only. |
| AC-R10 | L1836–1837 | "There must be no untranslated buttons, broken layouts, mixed-language placeholders or awkward Japanese typography." | Requires Business Approval | In part | T-build; T-site | "Awkward" needs a native reader. |
| AC-R11 | L2081, L4427–4445 | Tested at 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920 and 2560 px. | Tested | Yes | T-layout names the ten widths of the brief and six more (360, 900, 1000, 1100, 1180, 1366) |  |

## 7. QA "verify every" lists (A §16 L518–542; C §34 L4711–4759)

| ID | Brief | Criterion | Status | Met? | Evidence | Note |
| --- | --- | --- | --- | --- | --- | --- |
| AC-Q01 | L520, L4715 | Verify "Every page"; "Test every route in both languages." | Tested | Yes | T-site (85 files); T-layout (every page loaded at sixteen widths); T-shots (H1 count 1 on 164) |  |
| AC-Q02 | L522 | Verify "Every link". | Tested | Yes | As AC-N07 |  |
| AC-Q03 | L524 | Verify "Every button". | Tested | Yes | As AC-N08 |  |
| AC-Q04 | L526 | Verify "Every form". | Tested | Yes | T-forms; T-int `contact form`, `application form`, both languages |  |
| AC-Q05 | L528 | Verify "Every navigation path". | Tested | Yes | T-site (header, footer, breadcrumb and sitemap links on every page); T-int menus and language switch |  |
| AC-Q06 | L530 | Verify "Every relevant permission". | Not Implemented | n/a | — | Not applicable: the site has no accounts, roles or protected areas. |
| AC-Q07 | L532, L4753 | Verify "Every integration"; "Verify approved backend, CRM, email and recruitment integrations in appropriate test environments." | Requires External Integration | In part | T-forms; T-int | Mail was handed to a stand-in that writes a file. No CRM or recruitment system exists. Real delivery needs the host. |
| AC-Q08 | L534 | Verify "Every supported screen size". | Tested | Yes | As AC-R11 |  |
| AC-Q09 | L536 | Verify "Every important business workflow". | Tested | Yes | As AC-A09 |  |
| AC-Q10 | L516 | "Cover both successful and unsuccessful scenarios." | Tested | Yes | T-forms (refusals, rate limit, mail failure); T-int (empty filter, empty search, validation messages); 404 page |  |
| AC-Q11 | L538–540, L4713 | "Use actual browser rendering and screenshots wherever possible." "Do not assume the implementation works simply because the code compiles." | Verified | Yes | Every browser test runs in Chrome; `screenshots-after/` |  |
| AC-Q12 | L4719 | "Verify every button, link, form, navigation item, filter, menu, interactive diagram and user journey." | Tested | Yes | T-int groups: menus, lifecycle, finder, career filters, photo viewer, forms, product pages, journeys, search, language, old addresses |  |
| AC-Q13 | L4723–4725 | "Capture desktop and mobile screenshots of every major page. Inspect all screenshots for layout, spacing, typography, branding and content quality." | Tested | In part | T-shots | All captured. Read by eye: the pages listed in `TEST-EVIDENCE.md` §5, not every image. |
| AC-Q14 | L4728–4729 | "Verify routing, direct URL access, refresh behaviour, redirects, loading states, error states and content rendering." | Requires External Integration | In part | T-int `old addresses`, `scripts off`; T-site | Client-side forwarding, direct access and error states pass. True 301 and 404 status codes need Apache. |
| AC-Q15 | L4733 | "Verify complete Japanese and English content coverage." | Tested | Yes | As AC-D04 |  |
| AC-Q16 | L4737 | "Test appropriate validation, access control, headers, dependency security and form protection." | Requires External Integration | In part | T-forms; T-audit; T-csp | Validation, form protection and dependencies tested. The same headers were served by the preview server and all interaction tests pass under them; on Apache they are unproven. Access control: nothing to control. |
| AC-Q17 | L4741 | "Perform automated and representative manual accessibility testing." | Tested | In part | T-axe; T-int | Manual checks were scripted keyboard paths. No screen reader. |
| AC-Q18 | L4745 | "Measure representative pages on desktop and mobile configurations." | Tested | Yes | T-lh: 11 pages × 2 languages × mobile and desktop |  |
| AC-Q19 | L4749, L2286 | "Test available versions of Chrome, Safari, Edge and Firefox." | Tested | In part | All browser tests | Chrome only. Safari, Edge and Firefox were not available here. |
| AC-Q20 | L4757–4759 | "Maintain a test evidence register. Every known issue must be resolved or explicitly documented." | Implemented | Yes | `TEST-EVIDENCE.md`; `test-output/` |  |
| AC-Q21 | L542, L2293 | "Identify defects, fix them, retest, and repeat." "Fix issues and repeat the tests." | Tested | Yes | `test-output/axe-round1.txt` → `axe.txt`; `lighthouse-round1.txt` → `lighthouse.txt`; `EXECUTIVE-REVIEW.md` §4 |  |

## 8. Home page and outcome tests (A §6 L227–251; B Final Directive L2511–2523; C Final Instruction L5082–5100)

| ID | Brief | Criterion | Status | Met? | Evidence | Note |
| --- | --- | --- | --- | --- | --- | --- |
| AC-H01 | L229–241 | The home page immediately communicates: "Who we are. What we do. Who we help. What problem we solve. Why we are different. Why customers should trust us. What action visitors should take next." | Implemented | Yes | Table at the end of this file | "Why we are different" and "why trust us" are answered with the source's own statements. |
| AC-H02 | L243 | "Within the first five seconds, a new visitor should understand the fundamental value of the business." | Implemented | Yes | First-screen images at 1440 and 390, both languages, in `screenshots-after/` | A judgement: headline, one-sentence description, two actions, offices and products are on the first screen. |
| AC-H03 | L250–251 | "The homepage must not feel like a collection of disconnected sections." | Implemented | Yes | Home section order: problem → lifecycle → services → products → solutions → industries → business size → customers → presence → contact | A judgement. |
| AC-O01 | L2511, L5082 | "When a Japanese CEO opens the website, establish confidence." / "communicate strategic credibility." | Requires Business Approval | In part | `ja/about.html#profile`; `EXECUTIVE-REVIEW.md` reviewer 2 | Needs native review, the registered name and confirmed titles. |
| AC-O02 | L2513, L5084 | "When an engineer explores it, demonstrate technical credibility." / engineering manager: "communicate technical intelligence." | Requires Business Approval | In part | Product, solution and lifecycle pages; `improved-src/content/relations.js` | Needs a PLM specialist's sign-off on the relations. |
| AC-O03 | L5086 | "When a design engineer visits, provide meaningful product information." | Requires Business Approval | In part | Six product pages | Each says what the product is and how the company works with it. Depth needs content approved by the client or Siemens. |
| AC-O04 | L5088 | "When a manufacturing director visits, demonstrate connected manufacturing possibilities." | Implemented | In part | `digital-transformation.html#digital-factory`, `#integration`; `products/tecnomatix.html` | As far as the source goes on manufacturing. |
| AC-O05 | L2515, L5090 | "When a procurement manager evaluates it, communicate reliability." | Requires Business Approval | In part | `about.html#profile`; `services.html`; `privacy.html` | Legal name, establishment details and certifications are not available. |
| AC-O06 | L2517, L5092 | "When a Siemens representative reviews it, demonstrate professional representation." / "accurate professional representation." | Requires Business Approval | In part | T-src; `CLAIM-REGISTER.md` §1 and §6 | The text is accurate as far as this build can check. Siemens has not reviewed it. One inherited image carries a Siemens wordmark and another prints unsourced figures about Teamcenter X. |
| AC-O07 | L2519 | "When a potential customer discovers it, make the next step clear." | Tested | Yes | T-site (no dead ends); T-int journeys |  |
| AC-O08 | L5094 | "When an existing customer visits, make support accessible." | Implemented | In part | "Ask about support" in the footer of every page and on the home page | The route exists. The support service behind it (hours, contact, response) is the client's to define. |
| AC-O09 | L2521, L5096 | "When an employee shares it, make them proud of the company." / potential employee: "communicate authentic company culture." | Requires Business Approval | In part | `behind-the-brand.html`; `careers.html` | Four named team members with photographs and the problems the team solves; the values and fourteen event photographs are on About. More needs real stories. |
| AC-O10 | L5098 | "When a salesperson presents the website, make it an exceptional business presentation." | Implemented | In part | `digital-transformation.html` (`#views`: one reading for management, one for engineering) | Not tried in a meeting. |
| AC-O11 | L2523, L5100 | "When a competitor sees it, demonstrate a distinctive and credible market position." / "digital identity." | Implemented | In part | `EXECUTIVE-REVIEW.md` reviewer 12 | Distinct in manner. Weaker than competitors in proof and depth (scored 55). |

## 9. Review completion criteria (A §17 L571–578; B §23 L2349–2351; C §35 L4859–4865)

| ID | Brief | Criterion | Status | Met? | Evidence | Note |
| --- | --- | --- | --- | --- | --- | --- |
| AC-V01 | L2299–2347 | The twelve Virtual Executive Review questions have each been answered against the implemented site. | Implemented | Yes | `EXECUTIVE-REVIEW.md` §2 |  |
| AC-V02 | L2349 | "Record identified weaknesses and improve the implementation." | Implemented | Yes | `EXECUTIVE-REVIEW.md` §4, §6 |  |
| AC-V03 | L2351 | "Repeat the review until no known critical issues remain and all acceptance criteria have been evaluated." | Implemented | Yes | `EXECUTIVE-REVIEW.md` (two rounds); this file has no empty status | No critical issue known in the build. The mailbox is the one critical launch item. |
| AC-V04 | L4765 | "Score each applicable area from 0 to 100 based on documented criteria." | Implemented | Yes | `EXECUTIVE-REVIEW.md` §5: 40 areas, each with its criterion |  |
| AC-V05 | L4859–4861 | "Do not assign arbitrary perfect scores. Base assessments on observable implementation and test results." | Implemented | Yes | `EXECUTIVE-REVIEW.md` §1 (scale and caps), §5 (evidence per score) | No area scores 100. |
| AC-V06 | L4863–4865 | "Fix identified deficiencies and repeat relevant reviews. Target exceptional quality while accurately reporting remaining limitations." | Implemented | Yes | `EXECUTIVE-REVIEW.md` §4–§6 |  |
| AC-V07 | L545–578 | Part A's twelve separate expert reviews done; "Implement meaningful improvements and conduct another review. Do not settle for the first acceptable result." | Implemented | Yes | `EXECUTIVE-REVIEW.md` §2, five further viewpoints |  |

## 10. Deliverables (B §26 L2458–2502; C §39 L5012–5075)

| ID | Brief | Criterion | Status | Met? | Evidence | Note |
| --- | --- | --- | --- | --- | --- | --- |
| AC-L01 | L2462, L5018 | "Complete production-ready website source code." | Verified | In part | T-build; `improved-src/`, `docs/` | Complete and deterministic. "Production-ready" is not claimed until it has run on the host. |
| AC-L02 | L2464, L5020 | "Fully responsive English website." | Tested | Yes | T-layout (41 English pages × 16 widths: overflow, off-screen, clipped text, broken words, broken images and small controls all 0); T-int `finder result panel`, `mobile menu`; T-site | The earlier "Verified" rested on a test that could not see words broken across lines or a button hidden inside a scrolling panel; both are fixed and tested. Emulated widths in Chrome, not devices (AC-A07). |
| AC-L03 | L2466, L5022 | "Fully responsive Japanese website." | Requires Business Approval | In part | T-layout; T-build | Complete and responsive. Awaits native review. |
| AC-L04 | L2468, L5024 | "Complete reusable design system." | Implemented | Yes | `DESIGN-SYSTEM.md`; `improved-src/styles/` |  |
| AC-L05 | L5026 | "Verified route inventory." | Tested | Yes | `COVERAGE.md` §Routes; `docs/sitemap.xml`; T-site |  |
| AC-L06 | L2470, L5027 | "All approved business pages." / "All implemented page designs." | Implemented | In part | `STATUS.md` | See AC-D03. |
| AC-L07 | L2472, L5031 | "Interactive engineering and lifecycle experiences." / "Interactive engineering visualizations." | Tested | Yes | T-int `lifecycle 1440px`, `lifecycle 390px`; all nine stages readable with scripts off (`scripts off`) |  |
| AC-L08 | L2474, L5029 | "Product and solution discovery functionality." / "Product and solution experiences." | Tested | Yes | T-int `finder`, `product pages`, `search` |  |
| AC-L09 | L2476, L5033 | "Functional business inquiry workflows." / "Contact and inquiry workflows." | Requires External Integration | In part | T-forms; T-int | Real delivery unproven. |
| AC-L10 | L2478, L5035 | "Appropriate content management functionality." | Not Implemented | No | — | Phase 2. Content is edited in `improved-src/content/` and rebuilt (`ARCHITECTURE.md`). |
| AC-L11 | L2480, L5037 | "Technical SEO implementation." | Tested | In part | As AC-D11 | Not checked in Search Console or a structured-data validator. |
| AC-L12 | L2481, L5039 | "Security controls." / "Security implementation." | Requires External Integration | In part | As AC-A08 | Headers and the blocked folder are unproven on Apache. |
| AC-L13 | L2483 | "Browser testing results." | Tested | In part | `TEST-EVIDENCE.md` | Chrome only. |
| AC-L14 | L2485, L5041 | "Accessibility testing results." | Tested | Yes | T-axe; `docs/accessibility.html` |  |
| AC-L15 | L2487, L5043 | "Actual performance measurements." | Tested | Yes | T-lh |  |
| AC-L16 | L5045 | "Desktop and mobile screenshots." | Verified | Yes | T-shots: 82 pages × 390 and 1440 |  |
| AC-L17 | L5047 | "Test reports." | Implemented | Yes | `TEST-EVIDENCE.md`; `test-output/` |  |
| AC-L18 | L2493, L5049 | "Verified content and asset inventory." / "Content and asset approval register." | Implemented | Yes | `INVENTORY.md`, `COVERAGE.md`, the four registers |  |
| AC-L19 | L5051 | "Architecture documentation." | Implemented | Yes | `ARCHITECTURE.md` |  |
| AC-L20 | L2489, L5053 | "Deployment instructions." | Implemented | Yes | `docs/README-DEPLOY.md`; `README.md` |  |
| AC-L21 | L2491, L5055 | "Maintenance documentation." | Implemented | Yes | `ARCHITECTURE.md` §Maintenance |  |
| AC-L22 | L5057 | "Known limitations." | Implemented | Yes | `REVIEW.md` §3, §4 |  |
| AC-L23 | L2495, L5059 | "Outstanding approval and dependency list." / "Remaining external dependencies." | Implemented | Yes | `REVIEW.md` §7 (phase 2), §9 (client questions) |  |
| AC-L24 | L2497–2500, L5061–5073 | Final page-by-page completion report with the statuses Implemented / Tested / Verified / Requires Business Approval / Requires External Integration / Not Implemented. | Implemented | Yes | `STATUS.md` |  |
| AC-L25 | L2502, L5075 | "Never conceal limitations or claim completion without evidence." "Never hide incomplete work." | Implemented | Yes | `REVIEW.md` §6; this file |  |

## The home page against AC-H01

| The brief asks the home page to say | Where it says it (English home page) |
| --- | --- |
| Who we are | Title and hero: "ThinkInnov-NexGen combines PLM domain expertise, technical delivery and a consultative approach…"; head office and branches in the hero facts |
| What we do | Hero headline "Connect your product lifecycle. Innovate more, and faster."; section 01 "End-to-end PLM solutions for consulting, mapping, implementation and adoption"; section 04 services by phase |
| Who we help | Section 08, "PLM should be accessible to businesses of every size", with Startups, SMBs and Enterprises; section 07 industries |
| What problem we solve | Section 02, "We help companies to effectively address the critical business issues of new product development", four problems |
| Why we are different | Section 08, "Why ThinkInnov-NexGen for PLM", three reasons from the original; these are the company's statements, not evidence |
| Why customers should trust us | Section 09 "Our key customers" (21 logos); section 10 "What our clients say" (four quotes); section 11 offices |
| What to do next | Hero: "Book a PLM consultation" and "Find by business need"; section 12: four enquiry routes |
