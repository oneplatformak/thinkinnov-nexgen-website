# Architecture and maintenance

## What the site is

Static HTML, one CSS file and one JavaScript file, plus two PHP mail handlers. No database, no Node runtime on the host, no CMS, no login. That is what the cPanel target (Apache + PHP) runs without anything extra, and it is why everything a visitor reads is in the HTML that the server sends.

```text
improved-src/            the generator (Node, no framework) and its tests
  config.js              company name, address, phone, email, URLs
  content/               every word of site content, as data
  pages/                 one module per page type; returns the page body
  features/              lifecycle diagram, finder
  lib/                   layout, navigation, footer, components, SVG diagrams, forms,
                         SEO, asset pipeline, search index, register writers
  styles/, scripts/      CSS and JavaScript sources, joined and minified by the build
  i18n/                  Japanese dictionaries and the translation step
  tools/                 tests, preview server, screenshots
docs/                    the deployable site (written by the build, except the files listed below)
notes/                   reviews, registers, test evidence
staging-original/        untouched copy of the original site: the source of every company fact
```

Files in `docs/` that the build does **not** write and that are edited by hand: `contact.php`, `apply.php`, `inc/form-lib.php`, `.htaccess`, `README-DEPLOY.md`, and the images and fonts under `assets/`.

## How a page is made

1. `build.js` loads each module in `pages/`. A module exports `routes`: a path and a `render()` function.
2. `render()` returns a title, a description, breadcrumbs and the body HTML, written in English from `content/`.
3. `lib/layout.js` wraps it with the head, header, footer and structured data.
4. For the Japanese copy, the same English HTML is passed through `i18n/`: every text node and every translatable attribute is looked up in the dictionaries. A string with no entry is reported by the build; the count must be 0.
5. The build writes `docs/<path>` and `docs/ja/<path>`, the two search indexes, `sitemap.xml`, `robots.txt`, the PHP whitelist `inc/enquiry-options.php`, and five registers in `notes/`.

The build is deterministic: running it twice leaves `git status` clean. CSS and JS URLs carry a hash of their content, so a change invalidates caches without a version number to remember.

## Decisions and their reasons

| Decision | Reason |
| --- | --- |
| Static generation instead of a framework or CMS | The host is cPanel. Every page is complete HTML for search engines and for visitors without scripts. Nothing to patch or log in to. |
| One content layer (`content/`) and one relation table (`content/relations.js`) | A fact is written once. Product pages, the finder, the lifecycle diagram, the stage tables, the search index and the PHP whitelist all read the same data, so they cannot disagree. Each relation carries a note of the source text it rests on. |
| Japanese produced from the English page by dictionary | The two languages cannot drift in structure, and a missing translation is a build error to see, not a blank on the page. |
| PHP handlers kept outside the generator | They are the only server code. They read a whitelist written by the build, accept nothing else, and have their own test script. |
| Search as a JSON file read in the browser | Fits a static host; no query leaves the visitor's device. |
| Journey context in `sessionStorage` | Lets an industry, company size and business need follow the visitor to the contact form without cookies or a server. Lives only in the tab; the privacy notice says so. |
| No third-party requests | Fonts, scripts and images are all served from the site. `check-site.py` fails the check if a tracker string or a remote resource appears. The Content-Security-Policy in `.htaccess` allows the site's own files only. |
| No runtime dependencies | The built site ships no library. The only build dependency is BudouX (Japanese phrase breaking). Test tools (puppeteer-core, axe-core, Lighthouse) are installed outside the repository. |

## What would have to change for the phase 2 items

- **CMS**: `content/` is already data. A headless or git-based CMS would write those files (or JSON in the same shape) and trigger the build. Pages would not change.
- **CRM**: `contact.php` builds the email from labelled lines (`Enquiry type:`, `Topic:`, `Business need:`, `Industry:`, `Company size:`). The same values can be posted to a CRM at that point.
- **Analytics**: needs a decision on consent first, then a change to the Content-Security-Policy and to the privacy notice, which currently says there is none.

## Maintenance: how to change things

All commands are run from the repository root unless stated.

| To do this | Edit | Then |
| --- | --- | --- |
| Change address, phone, email, copyright line | `improved-src/config.js`; for the email also `docs/inc/form-lib.php` (`TIN_RECIPIENT`, `TIN_FROM`) | Build, run the form tests |
| Change text on a page | The matching entry in `improved-src/content/` | Build. If the build reports an untranslated string, add the Japanese in `improved-src/i18n/` |
| Add a customer logo | Put a WebP in `docs/assets/img/customers/`; add `[file, name]` to `customers` in `content/company.js` | Build. The customer register in `notes/` updates itself |
| Add a job | Add an entry to `content/jobs.js` | Build. The job page, the careers list, the role selector, the sitemap, the search index and the PHP whitelist all pick it up. Add Japanese for the new strings |
| Add a product | Add it to `products` in `content/offerings.js`, to `productStages`, `productSupport` and `productExpertise` in `content/relations.js`, and a sourced sentence in `content/external-claims.js` | Build. `content.validate()` stops the build if a relation points at something that does not exist |
| Add a solution, a business need or an industry relation | `content/offerings.js` and `content/relations.js`, with a `basis` note saying which source text supports it | Build |
| Add a page | New module in `improved-src/pages/` exporting `routes`; add its name to `PAGE_MODULES` in `build.js`; add it to the navigation in `lib/nav.js` if it belongs there | Build; add Japanese; run all tests |
| Change a Japanese string | The dictionary file in `improved-src/i18n/` that holds it (`notes/JAPANESE-REGISTER.md` lists every string and its area) | Build |
| Change the look | `improved-src/styles/`. Colours, type sizes and spacing are tokens in `01-tokens.css` | Build; run the layout test and look at the screenshots |

After any change:

```bash
cd improved-src && node build.js --misses && cd ..
python3 improved-src/check-site.py
bash improved-src/tools/test-forms.sh
# with a static server on docs/ and puppeteer-core available (see README.md):
node improved-src/tools/test-layout.js
node improved-src/tools/test-interactions.js
node improved-src/tools/test-axe.js
```

## Things to keep true

- A statement about the company goes into `content/` only if `staging-original/` or the client supports it. Anything else belongs in `notes/CLAIM-REGISTER.md` with its source, or not on the site.
- A sentence about a Siemens product goes into `content/external-claims.js` with the URL and the words on that page that support it.
- No `JobPosting`, review or rating markup until the client confirms vacancies and reviews.
- The privacy notice (`pages/legal.js`) must be changed in the same commit as any change to what the forms collect or what the browser stores.
