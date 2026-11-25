# ThinkInnov-NexGen website (rebuild, pre-launch)

Static website for ThinkInnov-NexGen, in English and Japanese. Final domain: thinkinnovnexgen.co.jp (cPanel, Apache + PHP). **Not deployed to production.** Preview: GitHub Pages serves `docs/`.

## Layout of this repository

| Path | What it is |
| --- | --- |
| `docs/` | The deployable site. Everything in it except `contact.php`, `apply.php`, `inc/form-lib.php`, `.htaccess`, `README-DEPLOY.md` and the images and fonts under `assets/` is written by the build. |
| `improved-src/` | The generator (Node, no framework) and its tests. |
| `notes/` | `REVIEW.md` (what was reviewed, fixed, measured, and every open client question), `STATUS.md` (status of every page and feature), `CLAIM-REGISTER.md` (text that does not come from staging), `JAPANESE-REGISTER.md` (every Japanese string and where it came from), `BUILD_BRIEF.md`, `INVENTORY.md`. |
| `staging-original/` | Untouched mirror of the staging site. The source of truth for every fact about the company. |
| `screenshots-before/`, `screenshots-after/` | Full-page screenshots of every page at 390px and 1440px. |

## Build

```bash
cd improved-src
npm ci                 # once; installs BudouX, used only at build time for Japanese line breaking
node build.js          # writes docs/, notes/CLAIM-REGISTER.md and notes/JAPANESE-REGISTER.md
node build.js --misses # also lists any English string on a Japanese page that has no translation
node build.js --strict # exits 1 if there is one
```

The build prints the page count, the CSS and JS sizes and the number of untranslated strings (it must be 0).

## Where things live in `improved-src/`

| Path | Contents |
| --- | --- |
| `config.js` | Company name, address, phone, email, URLs. One place to change them. |
| `content/` | All site text as data: `company.js`, `offerings.js`, `jobs.js`, `relations.js` (which product, solution and service relates to which lifecycle stage and business need, each with its basis in staging), `external-claims.js` (the six Siemens-sourced sentences with their source URLs). |
| `pages/` | One module per page type. Each returns the page body; `lib/layout.js` wraps it. |
| `features/` | The lifecycle diagram and the finder. |
| `lib/` | Layout, navigation, footer, components, SVG diagrams, forms, SEO, asset pipeline, register writers. |
| `styles/`, `scripts/` | CSS and JavaScript sources. The build joins and minifies them into `docs/assets/styles.css` and `docs/assets/site.js` and adds a content hash to their URLs. |
| `i18n/` | Japanese: `ja-staging.js` (reused from staging), `ja-ui.js` and `ja-content-*.js` (new, awaiting native review), `ja-testimonials.js`, the translation engine and BudouX phrase breaking. |
| `tools/` | Test and preview tools (below). |
| `COVERAGE.md`, `CHANGELOG.md` | Map of original content to its new location; history of changes. |

No source file is longer than about 500 lines.

## Tests

All tests run locally. None of them sends email or touches an external service.

```bash
python3 improved-src/check-site.py            # links, anchors, H1, ids, titles, descriptions, hreflang, sitemap
bash improved-src/tools/test-forms.sh         # 54 checks of contact.php and apply.php, including failure paths

# These two need Chrome and puppeteer-core (npm i puppeteer-core in any folder, then point NODE_PATH at it)
python3 -m http.server 8810 --directory docs &
NODE_PATH=/path/to/node_modules node improved-src/tools/test-layout.js        # every page, both languages, ten widths
NODE_PATH=/path/to/node_modules node improved-src/tools/test-interactions.js  # menus, lifecycle, finder, filters, viewer, language, forms

node improved-src/tools/serve.js 8812         # preview with the production headers (gzip, caching, CSP); used for Lighthouse
NODE_PATH=/path/to/node_modules node improved-src/tools/snap.js <outDir> 390,1440 index.html ja/index.html   # screenshots
```

Results of the last run are in `notes/REVIEW.md`.

## Languages

English pages are at the site root, Japanese pages under `ja/`, with the same file names, `hreflang` links and a language switch that keeps the visitor on the same page. Every Japanese page is fully translated. The Japanese that was written for this build has **not** had native review; see `notes/JAPANESE-REGISTER.md`.

## Rules this site is built under

- Every factual statement about the company traces to `staging-original/`. Text that does not is listed in `notes/CLAIM-REGISTER.md`.
- Where staging contradicts itself the current text is kept and the question is listed in `notes/REVIEW.md`.
- The one generated image still in use is labelled “Conceptual image” on the page. It does not show the company's offices, staff or customers.
- Deployment: `docs/README-DEPLOY.md`.
