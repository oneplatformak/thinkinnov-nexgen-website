# Staging site inventory (crawled 2026-11-25 JST from https://www.nexware-global.com/thinkinnov-nexgen/)

Mirror: `staging-original/thinkinnov-nexgen/` (69 files, ~40 MB). Note: the staging server intermittently returns a bot-challenge HTML page instead of assets; leadership/bala.png had to be re-fetched.

## Pages (all JS-rendered from assets/page-data.js except index/jobdetails/application)
| Original URL | Sections / anchors | New page |
|---|---|---|
| index.html | Hero slider (3 slides: Siemens Solution Partner / Innovate more & faster / Mendix), About intro, PLM deployment (On premises / On cloud / SaaS by Siemens), Services (Pre / Implementation / Post), Product catalogue (NX, Solid Edge, Capital, Teamcenter, Tecnomatix, Mendix), Solutions (9), Key customers (21 logos, marquee), Testimonials (4), Contact form, Footer | index.html (+ contact.html) |
| page.html?page=about | #identity, #principles (Vision/Mission/Values), #gallery (12 photos + lightbox), #leadership (4), #partnership (ThinkInnov-NexGen KK, key value drivers), #profile (company profile table) | about.html |
| page.html?page=plm | #benefits, #business-size, #npd, #why | plm.html |
| page.html?page=services | services lists | services.html |
| page.html?page=digital-transformation | | digital-transformation.html |
| page.html?page=products | Siemens product cards | products.html |
| page.html?page=solutions | solution cards | solutions.html |
| page.html?page=industries | 11 industry cards with Teamcenter X infographics I1–I11 | industries.html (all 11 cards kept; nine infographics kept and opened in lightbox; I2 and I11 removed by the owner's decision, 25 November 2026) |
| page.html?page=behind-the-brand | #problem (4), #team (4 people) | behind-the-brand.html |
| page.html?page=careers | intro, 18 job cards | careers.html + careers/01..18-*.html |
| jobdetails.html?id=N | job details from assets/jobs.js | careers/NN-slug.html |
| application.html | job application form (18 fields + CV upload) | apply.html (+ apply.php) |
| sitemap.xml / robots.txt | sitemap points to thinkinnovsolution.com (wrong domain) | regenerated for thinkinnovnexgen.co.jp |
| EN/JP toggle (assets/i18n.js + pageContentJp in page-data.js) | partial JP labels + partial JP About/Solutions text | toggle removed; dictionary archived in improved-src/ (open question) |

## External links
- https://thinkinnovsolution.com/ (parent company)
- Google Maps: Harumi Prime Square
- mailto:info@thinkinnovnexgen.com, tel:+0335258197 (both corrected)
- GoDaddy tccl tracking script (hosting-injected; removed)

## Broken on staging
- assets/customers/bae-systems.png 404, assets/customers/bryka.png 404, assets/hero-background.jpeg 404
- Contact and application forms have no action (submit does nothing); fake "I'm not robot" checkbox
- Inter/Manrope fonts referenced but never loaded
- Hero H1 uses <br> that collapses on mobile -> "forinnovation digitaltransformation"
- application.html overflows to 520px at 390px width; mobile drawer always visible there

Full page-by-page coverage map: `improved-src/COVERAGE.md`. Changelog: `improved-src/CHANGELOG.md`.
