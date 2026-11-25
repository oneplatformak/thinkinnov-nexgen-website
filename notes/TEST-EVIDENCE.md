# Test evidence register

Every test run whose result is quoted anywhere in these notes, with its date, the commit it ran on, the command, where the output is saved and the result. Times are UTC, 25 November 2026. Nothing here was measured on the production host or on any device other than the build machine.

## 1. Where the tests ran

| | |
| --- | --- |
| Machine | One Linux virtual machine |
| Browser | Google Chrome 157.0.8103.50, headless, driven by puppeteer-core |
| Node | 22.23.4 |
| PHP | 8.3.6 command-line server, without the `mbstring` extension |
| Python | 3.12.3 |
| Site under test | `docs/`, served by `python3 -m http.server 8810` (plain files, like GitHub Pages) and by `node improved-src/tools/serve.js 8812` (gzip and the headers that `.htaccess` sets) |
| Mail | `sendmail` replaced by a script that writes each message to a file. No real email was sent. |
| Test tools | puppeteer-core, axe-core 4.14.1, Lighthouse 12.8.2. Installed outside the repository; none is a dependency of the site. |

Each output file begins with the time, the commit and the command, and ends with the exit code.

## 2. Final runs

The pages were last changed in commit `12c8dcf`. Commits after it changed tools, tests and documents only (`git diff --stat 45dbdd6 HEAD -- docs improved-src/pages improved-src/styles improved-src/scripts improved-src/content improved-src/i18n` is empty), so every run below is a run on the final pages. The commit named for a run is the one checked out when it ran.

| # | Time | Commit | Command | Output | Result |
| --- | --- | --- | --- | --- | --- |
| 1 | 12:18:26 | `f9e9cf2` | `cd improved-src && node build.js --strict && node build.js --strict`, then `git status --short` on `docs/` and the four generated registers | `notes/test-output/build.txt` | 82 pages (41 per language); CSS 77.6 kB, JS 30.4 kB; 0 Japanese strings without a translation; no file changed by the second build. Pass |
| 2 | 12:18:27 | `f9e9cf2` | `python3 improved-src/check-site.py` | `notes/test-output/check-site.txt` | 85 HTML files; 4,095 internal links and assets resolved, 984 with a fragment; 0 failures in 18 categories. Pass |
| 3 | 12:18:27 | `f9e9cf2` | `python3 improved-src/tools/check-source.py` | `notes/test-output/check-source.txt` | 87 checks passed, 0 failed. Pass |
| 4 | 12:18:28 | `f9e9cf2` | `bash improved-src/tools/test-forms.sh` | `notes/test-output/forms.txt` | 58 passed, 0 failed. Pass |
| 5 | 12:18:30 | `f9e9cf2` | `node improved-src/tools/test-layout.js` | `notes/test-output/layout.txt` | 82 pages × 10 widths (320, 375, 390, 430, 768, 1024, 1280, 1440, 1920, 2560): overflow 0, off-screen 0, clipped 0, broken images 0. Pass |
| 6 | 12:18:45 | `f9e9cf2` | `node improved-src/tools/test-interactions.js` | `notes/test-output/interactions.txt` | 389 passed, 0 failed. Pass |
| 7 | 12:19:29 | `f9e9cf2` | `STATIC=http://127.0.0.1:8812/ node improved-src/tools/test-interactions.js` | `notes/test-output/interactions-csp.txt` | The same 389 with the production Content-Security-Policy in force: 389 passed, 0 failed. Pass |
| 8 | 12:29:50 | `727ca7f` | `node improved-src/tools/test-axe.js` | `notes/test-output/axe.txt` | 82 pages × 2 widths = 164 scans; 61 rules passed somewhere; 0 violations; 36 results axe could not decide, all of one rule (see section 8). Pass. (First run at 12:20:13 on `f9e9cf2` gave the same counts; it was repeated after the script learned to list the undecided results.) |
| 9 | 12:20:50 | `f9e9cf2` | `cd improved-src && npm audit --omit=dev; npm audit; npm ls --all` | `notes/test-output/npm-audit.txt` | 0 known vulnerabilities. One direct dependency (BudouX 0.10.4, build time only) |
| 10 | 12:06:13 to 12:14:41 | `45dbdd6` | `npx lighthouse@12 http://127.0.0.1:8812/<page> [--preset=desktop] --output=json`, 44 times | `notes/test-output/lighthouse.txt` | See below |
| 11 | 12:20:58 to 12:24:20 | `f9e9cf2` | `NAMES=final QUALITY=50 node improved-src/tools/snap.js screenshots-after 390,1440 all` | `screenshots-after/` (164 JPEG) and `screenshots-after/index.json` | 82 pages × 2 widths. Horizontal overflow: no on 164. H1 count: 1 on 164. Images not loaded: 0 on 164 |

All browser commands need `NODE_PATH` set to a folder that holds puppeteer-core and axe-core.

### What each suite covers

- **check-site** (run 2): one H1 per page; `lang`; duplicate ids; missing files; missing anchors; images without alt text or dimensions; title and description present and unique; canonical; `hreflang`; that every English page has a Japanese page and the reverse; anchors of the original site; `sitemap.xml`; tracker strings; resources loaded from other hosts.
- **check-source** (run 3): the four testimonials and their attributions, word for word, against the original home page, in both languages; the 21 customer logos, same names and order; the 18 role titles against the original job data; where each partner wording appears; wording that must not appear; empty headings; star symbols; that structured data parses and contains none of the excluded types or fields; credential patterns in every tracked text file.
- **forms** (run 4): both PHP handlers. Accepts a valid enquiry and a valid application with a PDF. Refuses GET, missing or malformed fields, missing consent, unknown option values, a filled trap field, a submission inside three seconds, too many submissions, a missing or wrong or oversized CV. Ignores a recipient supplied by the sender. Reports a mail failure as a failure. Returns Japanese messages for a Japanese form. Accepts an application that leaves gender, current CTC and notice period empty.
- **layout** (run 5): at each width, whether the page is wider than the window, whether any element ends outside it, whether any text is cut off by its own box, whether any image failed to load.
- **interactions** (runs 6 and 7), in both languages unless noted:

| Group | Checks |
| --- | --- |
| Product pages | 28 per language |
| Journey 1: automotive, enterprise, change management, Teamcenter, implementation services, enquiry with context | 9 per language |
| Journey 2 and journey 3 (the brief's other two examples) | 6 each per language |
| Finder, including hand-over to the contact form | 16 per language |
| Desktop menu | 15 per language |
| Mobile menu | 10 per language |
| Lifecycle diagram at 1440 px and at 390 px | 14 each per language |
| Contact form | 14 per language |
| Application form | 7 per language |
| Career filters | 11 per language |
| Photo viewer | 11 per language |
| Search | 9 per language |
| Pages with scripts turned off | 10 per language |
| Language switch, and that no cookie is set | 11 |
| Old addresses of the original site, through the three stub pages | 18 |

- **axe** (run 8): axe-core rules tagged WCAG 2.0 A and AA, WCAG 2.1 A and AA, WCAG 2.2 AA and best practice, on every page at 390 and 1440.

### Lighthouse (run 10)

Eleven pages, in English and Japanese, with the mobile and the desktop preset: home, the Teamcenter product page, Products, Solutions, Industries, Digital Transformation, Careers, one job page, Contact, About (the page with the photo gallery) and Search. Run after the last change to any of them.

These are laboratory numbers from a server on the same machine, with Lighthouse's simulated throttling. They are not field data. The real host's response time will change them.

| | Mobile (22 runs) | Desktop (22 runs) |
| --- | --- | --- |
| Performance | 100 on 18, 99 on 4 | 100 on 22 |
| Accessibility | 100 on 22 | 100 on 22 |
| Best practices | 100 on 22 | 100 on 22 |
| SEO | 100 on 22 | 100 on 22 |
| Largest Contentful Paint | 1.7 s to 2.1 s | 0.4 s |
| Cumulative Layout Shift | 0 | 0 |
| Total Blocking Time | 0 ms on 16; 30 to 110 ms on 6 | 0 ms |

The four runs at 99 are About (English and Japanese), the Japanese home page and the Japanese Solutions page, all mobile. The full table is in the output file.

**Interaction to Next Paint was not measured.** It is a field metric: it needs real visitors and something to record them, and the site has neither. Total Blocking Time is the usual laboratory stand-in and is reported as that, not as INP.

Lighthouse's accessibility score covers only what it can check automatically.

## 3. Earlier runs in this round

Kept because the round 2 results are compared with them.

| Time | Commit | Command | Output | Result |
| --- | --- | --- | --- | --- |
| between 11:36 and 11:43 | `fbe9625` | `node improved-src/tools/test-axe.js` | `notes/test-output/axe-round1.txt` | **Fail.** 90 violations on 164 scans, of two kinds: landmarks with the same name (three language switches and a second "Products" navigation), and a tab-panel role on an element that may not carry it. Fixed in `43caf0d`; run 8 is the retest |
| between 11:36 and 11:43 | `fbe9625` | Lighthouse 12, mobile preset, ten pages | `notes/test-output/lighthouse-round1.txt` | Search page: performance 96, CLS 0.115. All others 99 or 100 with CLS 0. Fixed in `43caf0d`; run 10 is the retest (search: 100, CLS 0) |

Runs made before this round (on commit `c1f69ec`, with 68 pages) were not saved as files. Their numbers are in the earlier version of `notes/REVIEW.md` in the git history and are not relied on here.

## 4. Third-party scripts and trackers

The copy of the original site in `staging-original/` was fetched from a staging host that adds a visitor-tracking script to every HTML page. The official files from the site's developer do not contain it (`improved-src/COVERAGE.md`, "Two copies of the original"). The rebuilt site must not carry it over, and loads nothing from any other host.

`check-site.py` (run 2) therefore fails the build if either of these is found:

- **Tracker strings**, in any text file under `docs/` (98 files): `_trfq`, `_trfd`, `tccl.min.js`, `tccl.baseHost`, `traffic-assets`, `wsimg.com`, `secureserver.net` (the seven come from the injected script), and `googletagmanager`, `google-analytics`, `gtag(`, `fbq(`, `hotjar`, `clarity.ms`, `doubleclick`. Found: **0**.
- **Resources loaded from another host**: every `src`, stylesheet or icon `href`, `object data`, form `action`, `poster`, `srcset`, CSS `url()` and `@import` (951 references examined). Allowed: none. Found: **0**.

Two further checks agree: every interaction test passes under a Content-Security-Policy of `default-src 'self'` (run 7), and after five page views and a language choice the browser holds no cookie (run 6, "language switch").

## 5. Screenshots

`screenshots-after/` holds one full-page JPEG of every page in both languages at 390 and 1440 pixels wide: 164 files, 36 MB, quality 50. `index.json` lists, for each: page, language, width, height, file, horizontal overflow (yes or no), number of H1 elements, and number of images that had not loaded when the picture was taken. The folder is emptied before each full run, so it holds no file from an earlier build.

Not all 164 were read from top to bottom. Read by the author:

| When | Pages |
| --- | --- |
| Final set (run 11) | Home, English, 1440 (top) and 390 (first third); home, Japanese, 1440 (top); Teamcenter product page, English, 1440 (top) and Japanese, 390 (first half); Products, Japanese, 390 (first half); Solutions, English, 1440 (top); Digital Transformation, English, 1440 (maturity model and digital thread); Industries, English, 390 (first half); About, Japanese, 390 (first half, including the gallery); Apply, Japanese, 390 (whole page); Contact, Japanese, 1440 (whole page) |
| Review round 2, one build earlier (the only difference from the final pages is the two label fixes of `12c8dcf`, which were then looked at again in the final set) | Home, English and Japanese, 1440, whole page; home, English, 390; Teamcenter and Solid Edge product pages, 1440; Mendix and Teamcenter product pages, Japanese, 390; Digital Transformation, 1440, whole page, and Japanese, 390; Industries, 1440; Products, Japanese, 390; About, Japanese, 390; Apply, Japanese, 390; Search, 1440; Contact, 1440 |

The 18 job pages share one template; two were looked at. The privacy, accessibility, sitemap and 404 pages were measured by the layout test and not read in the final set.

## 6. Defects the tests found in this round, and the retest

| # | Found by | Defect | Fix | Retest |
| --- | --- | --- | --- | --- |
| 1 | Layout test | Product pages were wider than the window at small widths: visually hidden labels inside the stage tables still took up width | `cbef166` | Run 5: overflow 0 |
| 2 | axe-core | 90 findings (see section 3) | `43caf0d` | Run 8: 0 |
| 3 | Lighthouse | Search page moved as it loaded (CLS 0.115) | `43caf0d` | Run 10: CLS 0 |
| 4 | Reading screenshots | Japanese fact labels broke one character before the end; a hero label broke inside a katakana word | `12c8dcf` | Seen in the final set; run 5 |
| 5 | Reading screenshots | Two gallery tiles were grey in a screenshot. The page was right; the tool took the picture before the images were decoded | `45dbdd6` (the tool) | Run 11: images not loaded 0 on 164; gallery seen complete |
| 6 | Writing this register | Nothing exercised the three stub pages that forward the original site's addresses | Test added in `f9e9cf2` | Run 6: 18 checks pass. No defect found |
| 7 | First run of `check-source.py` | Four failures, all mistakes in the new check (it read only the first of 18 roles; it did not know the Japanese form of the partner wording; it compared a heading with the wrong capitalisation) | Corrected before `bc0636b` | Run 3: 87 pass |

## 7. What could not be tested

| Not tested | Why | What it leaves unknown |
| --- | --- | --- |
| Apache and `.htaccess` | No Apache host may be touched | The HTTPS redirect, the 301 redirects from old addresses, the security headers, caching, the blocked `inc/` folder, and the 404 status. The same headers were served by `tools/serve.js` and the tests pass under them, which is not the same thing |
| Real email | No real mailbox may be used | Whether the host delivers to `info@thinkinnovnexgen.co.jp`, whether that mailbox exists, whether the message passes SPF and DKIM, whether a CV arrives intact |
| PHP with `mbstring` | Not installed here | The handlers have a fallback and were tested on it; the normal path was not run |
| Safari, Edge, Firefox | Not available here | Rendering and behaviour in any browser other than Chrome |
| Phones and tablets | None available | Touch behaviour, real viewport quirks; widths were emulated |
| Screen readers and other assistive technology | None available | How the pages are announced, in either language |
| Japanese fonts other than Noto Sans CJK | The site uses the visitor's system font | Line lengths with Hiragino, Yu Gothic or Meiryo |
| Native reading of the Japanese | No native reader took part | Tone, word choice and technical terms of the new Japanese |
| Interaction to Next Paint, and any field data | No visitors and no analytics | Real-user performance |
| Search Console, structured-data and social preview validators | External services were not used | Whether Google and social networks read the metadata as intended; the JSON-LD was only checked to parse |
| Outbound links | The link checker does not fetch other sites | Whether the links to Siemens' pages still resolve; they were read on 25 November 2026 when the sentences were sourced |

## 8. Known issues

Every issue found is either fixed (section 6) or listed here.

| Issue | Status |
| --- | --- |
| Enquiries and applications are addressed to `info@thinkinnovnexgen.co.jp`, which the official package does not confirm | Open. Blocks launch. `REVIEW.md` §9, question 2 |
| 36 results that axe-core could not decide, covering 222 elements. All are the colour-contrast rule. On six pages looked at more closely they were of two kinds: drop-down lists, whose arrow is a background image, so axe cannot work out the background (the stylesheet gives them #14181c text on white, about 17 to 1); and spans holding only a punctuation mark | Open. The contrast by the stylesheet is sufficient, but nobody has checked each element by eye |
| On a Japanese page the file-upload control says "Choose File" in the visitor's browser language | Not fixed: the text belongs to the browser, and follows the visitor's own language setting |
| The eleven industry images contain English text that is not translated and is described only briefly for screen readers | Open. Inherited images; needs the client (`REVIEW.md` §9) |
| No unit tests for the generator; it is tested through its output | Accepted |
| Long pages: the home page is about 13,900 px tall at 1440 wide | Accepted |
| Screenshot tooling only: when Chrome captures beyond the visible window while "reduce motion" is emulated, the picture shows some paddings and borders in their small-screen state (the home page's three key messages lose their left padding). The page itself is not in that state: the measured positions are correct before and after the capture. `tools/snap.js` avoids it by growing the window to the page height and capturing only what is inside it, so the committed screenshots are not affected. Found at 12:40 UTC while preparing the pull-request images, and checked with a real window resize under "reduce motion": the layout is normal | Not a defect of the site. Noted so that nobody reads such a capture as one |

## 9. After the owner's change of 25 November (commit `6b55de6`)

The owner asked for one change after everything above was run: the photograph in the home page's Global Presence section. It altered `docs/index.html`, `docs/ja/index.html` and added two image files, so the statement in section 2 that no site file changed after `45dbdd6` holds only up to commit `3e5aa09`. Re-run on the changed build, between 12:59 and 13:04 UTC, output not saved to `test-output/`:

| Check | Result |
| --- | --- |
| `node build.js --strict`, twice | 82 pages, 0 untranslated strings, second build changes nothing |
| `python3 improved-src/check-site.py` | PASS, 0 in every category |
| `python3 improved-src/tools/check-source.py` | 87 passed, 0 failed |
| `node improved-src/tools/test-layout.js` | 82 pages × 10 widths: all zeros |
| `node improved-src/tools/test-interactions.js` | 389 passed, 0 failed |
| Lighthouse, mobile, `index.html` and `ja/index.html` | 100 / 100 / 100 / 100 on both; LCP 1.8 s and 1.7 s; CLS 0 |
| `snap.js` for the two home pages at 390 and 1440 | The four home-page files in `screenshots-after/` were retaken; page heights are unchanged, so `index.json` is unchanged |

Not re-run: axe-core, the interaction tests under the production Content-Security-Policy, the PHP form tests, and Lighthouse on the other pages. The saved files in `test-output/` are from before this change. The section was looked at in Chrome at 1440 and 390 pixels in both languages: all five people in the photograph are in frame from head to foot.
