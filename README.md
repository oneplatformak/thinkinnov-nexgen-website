# ThinkInnov-NexGen website (rebuild, pre-launch)

Static website for ThinkInnov-NexGen, in English and Japanese. Final domain: thinkinnovnexgen.co.jp (cPanel, Apache + PHP). **Not deployed to production.** Preview: GitHub Pages serves `docs/`.

## Preview this branch on your own machine

Nothing needs to be built to look at the site: `docs/` is committed.

```bash
git fetch origin cursor/site-polish-bilingual-637e
git checkout cursor/site-polish-bilingual-637e

# Option 1: any static server. English at /, Japanese at /ja/
python3 -m http.server 8810 --directory docs
# then open http://127.0.0.1:8810/ and http://127.0.0.1:8810/ja/

# Option 2: the same headers as production (gzip, caching, Content-Security-Policy)
node improved-src/tools/serve.js 8812
# then open http://127.0.0.1:8812/

# Option 3: with the two forms working (needs PHP 8). No mail leaves the machine:
# each message is written to /tmp/tin-mail-<time>.eml
printf '#!/bin/sh\ncat > /tmp/tin-mail-$(date +%%s%%N).eml\n' > /tmp/tin-capture.sh && chmod +x /tmp/tin-capture.sh
php -d sendmail_path=/tmp/tin-capture.sh -S 127.0.0.1:8820 -t docs
# then open http://127.0.0.1:8820/contact.html
```

With options 1 and 2 the forms have no server to answer them, so they show an error and offer a pre-filled email link, as they do on GitHub Pages. The 301 redirects, the HTTPS redirect and the 404 status need Apache and can only be seen on the real host.

## Layout of this repository

| Path | What it is |
| --- | --- |
| `docs/` | The deployable site. Everything in it except `contact.php`, `apply.php`, `inc/form-lib.php`, `.htaccess`, `README-DEPLOY.md` and the images and fonts under `assets/` is written by the build. |
| `improved-src/` | The generator (Node, no framework) and its tests. |
| `notes/` | Reviews, registers and test evidence (table below). |
| `staging-original/` | Untouched crawl of the original site. The source of every fact about the company. |
| `screenshots-before/`, `screenshots-after/` | Full-page screenshots of every page at 390px and 1440px. `screenshots-after/index.json` lists each file with its page, language, width, whether it overflows sideways, and its H1 count. |

### `notes/`

| File | What it answers |
| --- | --- |
| `REVIEW.md` | What was built, measured and left open; the phase 2 list; every open client question. Start here. |
| `STATUS.md` | Status of every page and feature. |
| `ACCEPTANCE.md` | Each of the brief's 157 acceptance criteria with its status and evidence. |
| `TRACEABILITY.md` | Each of the brief's requirements: where it is implemented and how it was checked. |
| `TEST-EVIDENCE.md` | Every test run: date, command, where the output is, result. Outputs are in `test-output/`. |
| `EXECUTIVE-REVIEW.md` | The brief's review: twelve reviewers, forty scored areas, two rounds. |
| `CLAIM-REGISTER.md` | Every statement on the site and where it comes from. *Written by the build.* |
| `CUSTOMER-REGISTER.md` | The 21 customer logos and four testimonials, with what is not yet confirmed. *Written by the build.* |
| `ASSET-REGISTER.md` | Every image and font, its origin, and open rights questions. *Written by the build.* |
| `JAPANESE-REGISTER.md` | Every Japanese string and where it came from. *Written by the build.* |
| `PERSONA-MATRIX.md` | Which visitor uses which page to do what, and which test covers it. |
| `KEYWORD-MAP.md` | The brief's search terms against real offerings and pages. |
| `ARCHITECTURE.md`, `DESIGN-SYSTEM.md` | How the site is put together, how to change it, and the design tokens and components. |
| `MASTER_PROMPT.txt`, `BUILD_BRIEF.md`, `INVENTORY.md` | The governing brief, the earlier build brief and the inventory of the original site. |
| `nexware-official-src/` | The two photographs taken from the official Nexware package, untouched. |

## Build

```bash
cd improved-src
npm ci                 # once; installs BudouX, used only at build time for Japanese line breaking
node build.js          # writes docs/ and the four generated registers in notes/
node build.js --misses # also lists any English string on a Japanese page that has no translation
node build.js --strict # exits 1 if there is one
```

The build prints the page count, the CSS and JS sizes and the number of untranslated strings (it must be 0). Running it twice changes nothing: `git status` stays clean.

## Where things live in `improved-src/`

| Path | Contents |
| --- | --- |
| `config.js` | Company name, address, phone, email, URLs. One place to change them. |
| `content/` | All site text as data: `company.js`, `offerings.js`, `jobs.js`, `relations.js` (which product, solution and service relates to which lifecycle stage, business need and industry, each with its basis in the original), `external-claims.js` (the sentences taken from Siemens' own websites, with their source URLs). |
| `pages/` | One module per page type. Each returns the page body; `lib/layout.js` wraps it. |
| `features/` | The lifecycle diagram and the finder. |
| `lib/` | Layout, navigation, footer, components, SVG diagrams, forms, SEO, asset pipeline, search index, register writers. |
| `styles/`, `scripts/` | CSS and JavaScript sources. The build joins and minifies them into `docs/assets/styles.css` and `docs/assets/site.js` and adds a content hash to their URLs. |
| `i18n/` | Japanese: `ja-staging.js` (reused from the original), `ja-ui.js` and `ja-content-*.js` (new, awaiting native review), `ja-testimonials.js`, the translation step and BudouX phrase breaking. |
| `tools/` | Test and preview tools (below). |
| `COVERAGE.md`, `CHANGELOG.md` | Map of original content to its new location; history of changes. |

How to add a page, a product, a job or a translation: `notes/ARCHITECTURE.md`.

## Tests

All tests run locally. None of them sends email or touches an external service.

```bash
# No browser needed
python3 improved-src/check-site.py             # links, anchors, one H1, ids, titles, descriptions, canonical, hreflang,
                                               # sitemap, English/Japanese page pairs, trackers and third-party resources
python3 improved-src/tools/check-source.py     # testimonials, logos, roles and every English sentence match the
                                               # original; partner wording once; diagrams captioned as conceptual;
                                               # banned wording; excluded structured data; credentials
bash improved-src/tools/test-forms.sh          # 62 checks of contact.php and apply.php, including failure paths (needs PHP 8)

# These need Chrome and two npm packages installed anywhere outside the repository:
#   mkdir -p /tmp/shot && cd /tmp/shot && npm i puppeteer-core axe-core
# CHROME=/path/to/chrome if it is not /usr/bin/google-chrome
export NODE_PATH=/tmp/shot/node_modules
python3 -m http.server 8810 --directory docs &   # the tests read http://127.0.0.1:8810/ by default
node improved-src/tools/test-layout.js           # every page, both languages, sixteen widths from 320 to 2560px; fails on overflow, clipped text, small controls and words broken across lines
node improved-src/tools/test-interactions.js     # menus, lifecycle, finder and its result panel at three desktop sizes,
                                                 # filters, viewer, language, product pages, the three journeys, search,
                                                 # forms (starts its own PHP servers)
node improved-src/tools/test-axe.js              # axe-core on every page at 390 and 1440px

# Screenshots of every page in both languages, with index.json
NAMES=final QUALITY=50 node improved-src/tools/snap.js screenshots-after 390,1440 all

# Lighthouse, against the server that sends the production headers
node improved-src/tools/serve.js 8812 &
npx lighthouse@12 http://127.0.0.1:8812/index.html --output=json --output-path=home-mobile.json \
  --chrome-flags="--headless=new --no-sandbox"                    # add --preset=desktop for desktop
```

Results of the last runs, with dates and output files: `notes/TEST-EVIDENCE.md`.

## Languages

English pages are at the site root, Japanese pages under `ja/`, with the same file names, `hreflang` links and a language switch that keeps the visitor on the same page. Every Japanese page is fully translated. The Japanese that was written for this build has **not** had native review; see `notes/JAPANESE-REGISTER.md`.

Three files exist in English only: `page.html`, `jobdetails.html` and `application.html`. They are not pages. They forward the original site's query-string addresses to the new pages, and the original site had no Japanese addresses to forward.

## Rules this site is built under

- Every factual statement about the company in the site's text traces to `staging-original/`, and the original's English sentences are kept word for word (`improved-src/COVERAGE.md` lists the exceptions). Every statement and its source is in `notes/CLAIM-REGISTER.md`.
- Where the original contradicts itself the current text is kept and the question is listed in `notes/REVIEW.md`.
- This rebuild adds no generated or stock image. The eleven industry images come from the original site and their origin is unknown; two of them carry a Siemens wordmark and unsourced figures about a Siemens product, and are left as they are by the owner's decision (`notes/ASSET-REGISTER.md` §3, `notes/CLAIM-REGISTER.md` §6, `notes/REVIEW.md` §9). The four diagrams are drawn in SVG from wording in the original and each is captioned “Conceptual diagram” (概念図).
- An independent verifier checked the site at commit `30c9b8a`; what it found and what was done is in `notes/REVIEW.md` §12.
- The site loads nothing from any other host and sets no cookie.
- Deployment: `docs/README-DEPLOY.md`.
