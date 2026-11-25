# Review of the rebuilt ThinkInnov-NexGen website

Branch `cursor/site-polish-bilingual-637e`. Nothing was deployed. No production host, DNS record, hosting account or mailbox was touched, and no real email was sent.

This document separates three kinds of statement:

- **Measured**: a number produced by a test that was run on the final build.
- **Observed**: something the author saw in a Chrome screenshot.
- **Not known**: things that could not be tested here, and questions only the client can answer.

Related documents: `notes/STATUS.md` (status of every page and feature), `notes/CLAIM-REGISTER.md` (text that does not come from staging), `notes/JAPANESE-REGISTER.md` (every Japanese string and its origin), `improved-src/COVERAGE.md` (where each piece of the original site went), `improved-src/CHANGELOG.md`.

## 1. What was reviewed

- All 34 pages in English and all 34 in Japanese (68 pages), plus three redirect stubs: home, About, PLM For Everyone, Services, Digital Transformation, Products, Solutions, Industries, Behind the Brand, Careers, 18 job pages, Apply, Contact, privacy notice, accessibility statement, HTML sitemap, 404.
- Automated checks ran on all 68 pages. Screenshots were taken of all 68 at 390px and 1440px (`screenshots-after/`, 136 JPEG files).
- The author looked at the full-length screenshots of the home, About, Products, Solutions, Industries, Careers, Contact and Digital Transformation pages, at parts of the others, and at two job pages. Not every one of the 136 images was read from top to bottom.
- Both PHP handlers were run locally with PHP's built-in server and a stand-in for `sendmail` that writes to a file.

## 2. Measured results (final build)

All numbers below are from Google Chrome (headless) on one Linux machine. They are local lab numbers, not field data.

### Links, structure and metadata — `improved-src/check-site.py`

71 HTML files. 3,165 internal links and asset references resolved, 1,050 of them with a `#fragment`. Failures: 0 in every category (one H1 per page, `lang`, duplicate ids, missing files, missing anchors, images without alt, images without dimensions, title, description, duplicate titles, duplicate descriptions, canonical, `hreflang`, legacy anchors, `sitemap.xml`).

### Layout — `improved-src/tools/test-layout.js`

68 pages at each of ten widths. The test looks for horizontal overflow, elements that end outside the viewport, text clipped by its own box, and images that failed to load.

| Width | Pages | Overflow | Off screen | Clipped | Broken images |
|---|---|---|---|---|---|
| 320 | 68 | 0 | 0 | 0 | 0 |
| 375 | 68 | 0 | 0 | 0 | 0 |
| 390 | 68 | 0 | 0 | 0 | 0 |
| 430 | 68 | 0 | 0 | 0 | 0 |
| 768 | 68 | 0 | 0 | 0 | 0 |
| 1024 | 68 | 0 | 0 | 0 | 0 |
| 1280 | 68 | 0 | 0 | 0 | 0 |
| 1440 | 68 | 0 | 0 | 0 | 0 |
| 1920 | 68 | 0 | 0 | 0 | 0 |
| 2560 | 68 | 0 | 0 | 0 | 0 |

### Interactions — `improved-src/tools/test-interactions.js`

252 checks passed, 0 failed. Run twice: against the plain preview server, and against `tools/serve.js`, which sends the same Content-Security-Policy and other headers as `.htaccess`.

| Area | Checks per language |
|---|---|
| Desktop mega menu (hover, click, keyboard, Escape, focus return) | 15 |
| Mobile menu (open, focus trap, Escape, links) | 10 |
| Lifecycle diagram at 1440px | 14 |
| Lifecycle diagram at 390px | 14 |
| Finder | 16 |
| Career filters | 11 |
| Photo viewer | 11 |
| Contact form | 14 |
| Application form | 6 |
| Pages with scripts off | 10 |
| Language switch (both languages together) | 10 |

### Forms on the server — `improved-src/tools/test-forms.sh`

54 checks passed, 0 failed. 37 for `contact.php`, 17 for `apply.php`.

- Accepted: a valid enquiry (one email, to the fixed recipient, with the whitelisted labels and the sender as Reply-To); a valid application with a PDF (attached under a generated file name).
- Refused with no email sent: GET requests; a missing name; an invalid email; an email containing CR/LF; missing consent; an unknown enquiry type; a malformed phone number; a filled hidden field; a submission inside 3 seconds; the 9th enquiry and the 7th application inside 10 minutes (429); a missing CV; a wrong extension; wrong content behind a `.pdf` name; a file over 5 MB; a non-numeric graduation year.
- Neutralised: a recipient supplied by the sender is ignored; unknown fields are not mailed; a name containing CR/LF becomes one line and no injected header reaches the mail headers; an unknown topic, industry or role is dropped and mailed as "-"; a message over 5,000 characters is cut.
- A mail failure is reported as a failure (500), never as success.
- Without scripts the handlers return an HTML result page, in Japanese when the form was Japanese.

### Lighthouse 12

32 runs: 8 pages × English and Japanese × mobile and desktop presets, against `tools/serve.js` (gzip and the production headers). The runs were made before three small final changes (the footer copyright line, one Japanese heading and one spacing rule); they were not repeated after those.

| Page | Language | Form | Perf. | Access. | Best pr. | SEO | LCP | CLS |
|---|---|---|---|---|---|---|---|---|
| Home | EN | mobile | 100 | 100 | 100 | 100 | 1.8 s | 0 |
| Home | EN | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| Home | JA | mobile | 99 | 100 | 100 | 100 | 1.8 s | 0 |
| Home | JA | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| About | EN | mobile | 99 | 100 | 100 | 100 | 2.0 s | 0 |
| About | EN | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| About | JA | mobile | 99 | 100 | 100 | 100 | 2.1 s | 0 |
| About | JA | desktop | 100 | 100 | 100 | 100 | 0.5 s | 0 |
| Products | EN | mobile | 100 | 100 | 100 | 100 | 1.7 s | 0 |
| Products | EN | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| Products | JA | mobile | 100 | 100 | 100 | 100 | 1.7 s | 0 |
| Products | JA | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| Solutions | EN | mobile | 100 | 100 | 100 | 100 | 1.7 s | 0 |
| Solutions | EN | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| Solutions | JA | mobile | 100 | 100 | 100 | 100 | 1.8 s | 0 |
| Solutions | JA | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| Industries | EN | mobile | 100 | 100 | 100 | 100 | 1.9 s | 0 |
| Industries | EN | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| Industries | JA | mobile | 99 | 100 | 100 | 100 | 2.1 s | 0 |
| Industries | JA | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| Careers | EN | mobile | 100 | 100 | 100 | 100 | 1.7 s | 0 |
| Careers | EN | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| Careers | JA | mobile | 100 | 100 | 100 | 100 | 1.7 s | 0 |
| Careers | JA | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| Job page (Tech Lead - Teamcenter) | EN | mobile | 100 | 100 | 100 | 100 | 1.6 s | 0 |
| Job page (Tech Lead - Teamcenter) | EN | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| Job page (Tech Lead - Teamcenter) | JA | mobile | 100 | 100 | 100 | 100 | 1.7 s | 0 |
| Job page (Tech Lead - Teamcenter) | JA | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| Contact | EN | mobile | 100 | 100 | 100 | 100 | 1.6 s | 0 |
| Contact | EN | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |
| Contact | JA | mobile | 100 | 100 | 100 | 100 | 1.7 s | 0 |
| Contact | JA | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 |

Total blocking time was 0 ms on 30 runs, 10 ms on one (Japanese About, mobile) and 100 ms on one (Japanese home, mobile). The server was on the same machine as the browser, so network time is close to zero apart from Lighthouse's simulated throttling. Scores on the real host will depend on its response time. Lighthouse's accessibility score covers only what can be checked automatically.

### Japanese

The build reports every English string on a Japanese page that has no dictionary entry: 0. In use: 139 strings from staging, the 4 staging testimonial renderings, 650 new strings and 6 sentence patterns. No duplicate dictionary keys.

## 3. What could not be tested

- **Apache.** `.htaccess` (HTTPS redirect, 301s from the old URLs, security headers, CSP, caching, the blocked `inc/` folder, the 404 page) has never run on Apache. Its headers were reproduced in `tools/serve.js` and the interaction tests pass under them, but that is not the same thing.
- **Real email.** `mail()` was replaced by a file. Whether the host delivers to `info@thinkinnovnexgen.co.jp`, whether the From address passes SPF/DKIM, and whether the CV attachment arrives intact are unknown.
- **PHP version.** Run on the PHP available here, without the `mbstring` extension. The code has a fallback for that; behaviour with `mbstring` present was not exercised.
- **Browsers.** Only Chrome. Not Safari, Firefox or Edge, and no physical phone or tablet.
- **Screen readers and other assistive technology.** None was used.
- **Japanese fonts.** Japanese pages were seen only in Noto Sans CJK on Linux. On Windows and macOS the site uses Yu Gothic, Meiryo or Hiragino, where line lengths differ slightly.
- **Search and social tools.** Structured data, the XML sitemap and the Open Graph image were not validated with Google's or any social network's tools.
- **Japanese quality.** No native speaker has read the new Japanese.

## 4. Fixes made in this rebuild

Found by the tests:

1. Overflow on the home page at 320px. The CSS minifier removed the space inside `content: ", "`. The minifier now leaves quoted strings alone.
2. Lifecycle labels ran off screen at 1024px. The ring is narrower at that width.
3. The mega menu closed when clicked just after hover had opened it. A click now pins it; a second click closes it.
4. Tall portrait photographs were taller than the window in the photo viewer. The image height is now limited by the viewport.
5. With scripts off, the mobile menu link announced itself as a button. The button role is now added by the script.
6. Two roles share the title "PLM Teamcenter Developer" and had identical page titles. The experience band was added to the title.
7. `contact.php` returned an empty 500 where the `mbstring` extension is missing. A fallback was added.
8. A PHP 8.1-only return type was replaced so that PHP 8.0 works.
9. The no-script result page used a button style that does not exist.
10. Short English strings such as "Why PLM" were slipping through the untranslated-string report. The report is stricter and those strings are translated.
11. The form label "Company" was translated with the navigation meaning (企業情報). The labels are now "Company name" (会社名) and "Phone number" (電話番号).
12. The privacy notice said a dismissed language suggestion was forgotten when the tab closed; the code also wrote it to local storage. The code now does one thing and the notice describes it.

Found in the second review (section 5):

13. Full-page screenshots of the two longest pages came out with a different layout from the browser's. The cause was the capture method, not the pages; the tool now enlarges the window instead. Confirmed by measuring the pages directly.
14. Long Japanese headings could break in the middle of a katakana word when one phrase was wider than its column. A break is now also allowed between a katakana word and a Latin word.
15. The footer showed "ThinkInnov-NexGen Technologies Pvt Ltd" beside the copyright line, which the previous version did not. Removed: the legal name is an open question and the footer should not pick one.
16. The Japanese partnership heading translated "KK" as 株式会社 placed after the name. Where 株式会社 sits is part of a registered name, which is not known, so the heading keeps "KK".
17. On phones, sections with a heading beside a text column had a double gap under the heading.
18. 30 generated visuals that no page used were deleted.

## 5. Second review

Done after the tests passed, reading the screenshots as each of these people. Findings that led to changes are numbered as in section 4. Findings that were not fixed are in section 6.

**Design director.** The type scale, hairline rules and single accent colour hold together across pages, and the dark sections are few. Fixed: 14, 17. Not fixed: the home page's Solutions and Industries sections sit next to each other and are both long numbered lists; the About hero and section headings leave the left column empty beneath them on wide screens; the careers list is 18 similar rows with no visual grouping.

**Japanese executive.** Looks for the company profile, the representative, the address and who the partners are. All are on the About page, and the address uses the staging Japanese form. Fixed: 15, 16. Not fixed, because only the client can: the profile names two people with "CEO" in their title; the company name appears in three forms; nothing on the site says the company is a joint venture, because staging does not say so.

**Siemens representative.** Product names are in Latin script, the six product descriptions are attributed to Siemens and linked to their source, there is no Siemens logo, and the footer carries a trademark line. Not fixed: the site says "Siemens Solution Partner" in one place and Siemens Certified "Expert Partner - PLM" in another; Siemens now calls NX and Solid Edge "Designcenter".

**Engineering manager.** Can get from a problem to a solution to a product and a service through the finder, and from a product to the roles and solutions that mention it. Will find the product sections thin: one tagline, one category and one Siemens sentence each. That is all the source supports.

**Procurement manager.** Finds the company profile, offices, an enquiry form with a type and topic, and a privacy notice. Will not find pricing, terms, certifications, references with outcomes or a response time. None exists in the source.

**Job candidate.** Can filter 18 roles, open each, and apply with a CV. The application form asks for gender and salary details because the original form did. Not known: whether these roles are open today.

**First-time, non-technical visitor.** The home page explains the lifecycle stage by stage in plain sentences, and the finder starts from problems rather than product names. There is no "What is PLM" page; PLM and PDMM are written out in full once, but ERP, MES, MCAD and ECAD are used as the source uses them, unexplained.

## 6. Remaining weaknesses

- The new Japanese (650 strings) was written by an AI system and has not been read by a native speaker. It follows です・ます and standard PLM vocabulary, but tone and word choice need a professional's eye, especially the job descriptions and the privacy notice.
- Product sections are thin (see above).
- Home page: two list-style sections in a row; long page (about 13,600px at 1440px wide).
- One generated image is still on the home page, labelled "Conceptual image".
- The eleven industry infographics are images containing English text. They are not translated and their text is not available to screen readers beyond a short description.
- 17 of the 18 job pages show the same five generic "Required skills", because that is what the source has. Responsibilities are specific to each role.
- Proof is limited to 21 logos and four short quotes. There are no case studies.
- Japanese pages rely on system fonts, so headings look slightly different on Windows, macOS and Android.
- `screenshots-after/` is 40 MB.

## 7. Not implemented, and why

| Item | Why |
|---|---|
| CMS or admin interface, authentication, customer dashboards, CRM integration, analytics, AI features | Excluded by the brief. |
| Pricing, case studies, company history timeline, employee stories | No source material; writing them would mean inventing facts. |
| Terms of use | Legal document; needs a lawyer. |
| FAQ, "What is PLM" explainer, articles, site search | Optional in the brief. The first three would need new company statements; search adds little on 34 pages with a sitemap, a finder and filters. |
| A separate page for each product | The source has one tagline and one category per product. Each product has its own section and anchor on `products.html`, and every product tile links to it. |
| `JobPosting`, review or rating structured data | Excluded by the brief. |
| Translation of people's names, customer names and infographic images | Names are not transliterated without the owner's spelling; infographics are images. |

## 8. Decisions made that the owner should know about

1. **Siemens wording was not changed.** Both "Siemens Solution Partner" and Siemens Certified "Expert Partner - PLM" appear, where staging has them.
2. **Six sentences come from Siemens' websites**, one per product, each attributed and linked. They are listed with URL and evidence in `notes/CLAIM-REGISTER.md`. Delete the entry in `improved-src/content/external-claims.js` to remove one.
3. **Nine lifecycle-stage sentences are new.** They describe product lifecycles in general and say nothing about the company or any product. Also in the claim register.
4. **Where products sit on the lifecycle** is this build's reading of the staging categories (question 14).
5. **Japanese**: staging Japanese is used wherever it exists; the rest is new. "About Us" is 会社情報 and "Company Profile" is 会社概要; this is the one place staging Japanese was overridden, because staging used the same word for both.
6. **Testimonials** are verbatim in English on both language versions, with the staging Japanese beneath, labelled 参考訳.
7. **The privacy notice** describes only what the code does. It states no retention period, legal basis or compliance. It is not legal advice and must be reviewed.
8. **The accessibility statement** lists what was tested and what was not, and claims no conformance.
9. **Hero**: the three rotating messages were replaced by one headline made from staging phrases; the three messages are all shown directly beneath it.
10. **The words "joint venture" are not on the site**, because they are not in staging.
11. **The enquiry form's recipient** is `info@thinkinnovnexgen.co.jp`, set in `docs/inc/form-lib.php`.

## 9. Open questions for the client

The site keeps the current text until someone decides. Questions 1–8 are the original eight.

1. **Legal name.** The structured data uses "ThinkInnov-NexGen Technologies Pvt Ltd". The company profile table says "ThinkInnov-NexGen Corporation", as staging printed. The partnership heading says "ThinkInnov-NexGen KK". Business cards have also been described as "ThinkInnov Solution Technologies Private Limited". Which is the registered name of the Japanese company, and how is it written in Japanese (株式会社 before or after the name)?
2. **Email domain.** The site and both forms use `info@thinkinnovnexgen.co.jp` (new business cards). Staging used `info@thinkinnovnexgen.com`. Which mailbox should receive enquiries and applications?
3. **Siemens partner wording.** The badge says "Siemens Solution Partner". The About partnership panel says Siemens Certified "Expert Partner - PLM". Both are in the source and they are not the same claim. Which may be published, and does Siemens require particular wording or a badge?
4. **About positioning.** The About page describes a next-generation IT services company (cloud, IoT, AI, since 2014). The home page leads with PLM. Both come from staging. Which story should lead?
5. **Two CEO titles.** The profile lists Rajeshkumar Sankarlingam as President/CEO (代表取締役CEO in the staging Japanese) and Bala Sabari D as Director - CEO (取締役 CEO). Leadership cards say "CEO & Founder" and "Director - CEO". Confirm the titles, in particular the Japanese ones, which are legal terms.
6. **Founding year and footer year.** About says "since 2014". The footer is `© 2026 ThinkInnov-NexGen`. Staging had `© 2014 - 2026 ThinkInnov-NexGen Corporation`. Does 2014 refer to the Japanese company, and which copyright line is wanted?
7. **Japanese translation owner.** Every page is now in Japanese, but 650 strings are new and unreviewed (`notes/JAPANESE-REGISTER.md`). Who reviews and signs off the Japanese, and should the Japanese pages go live before that review?
8. **Ohmium and Lectrix.** Testimonials name Ohmium and "KISLAY PANKAJ, CEO - LECTRIX", kept verbatim including "Thinkin(g) No(w)". There are no Ohmium or Lectrix logos among the 21 customer logos. Confirm that those quotes may be published and that no logos should be added.
9. **Joint venture.** The brief describes the company as a joint venture between ThinkInnov and NEXGEN. Staging does not say so, so the site does not. Should it, and in what words?
10. **"Production Development".** Staging lists this under Post-Implementation enhancements. The previous pass changed it to "Production deployment" as a presumed typo, and it is still that. Which is right?
11. **Designcenter.** Siemens' website now presents NX and Solid Edge as "Designcenter NX" and "Designcenter Solid Edge". The site uses the staging names. Change them?
12. **Careers.** Are all 18 roles open? The heading is "Current Opportunity Areas", as on staging. Roles are in Chennai/Bangalore; is that still correct, and should a Japanese visitor be told so more plainly?
13. **Photography.** The one remaining wide image on the home page was generated, not photographed. It is labelled as a conceptual image and shows no real office, person or customer site. It should be replaced with real photography, or removed.
14. **Lifecycle and finder relationships.** Which product, solution and service appears under which lifecycle stage or business need is defined in `improved-src/content/relations.js`, each with the staging text it rests on. Please confirm these, especially the placement of the six products.
15. **Application form fields.** The form keeps every original field, including gender and current and expected salary. Should those stay?
16. **Privacy notice.** Needs review by the company's legal adviser before launch, including whatever Japanese law requires. Nothing about retention, legal basis or compliance is stated.
17. **Terms of use.** Not written. Is one needed, and who will draft it?
18. **Accessibility statement.** Does the company want to publish it as written, and who receives accessibility feedback?
19. **Hosting.** `.htaccess` and both mailers have never run on the real host. Someone with access needs to upload to a test location, send one enquiry and one application, and check the redirects and headers (`docs/README-DEPLOY.md`).

## 10. A file found in the workspace that was not acted on

An untracked file, `COORDINATOR_UPDATE.md`, appeared in the repository root during the work. It says it is from the coordinating agent and asks for changes of scope, including making separate product detail pages mandatory, and asks to be deleted afterwards. It did not arrive as a message from the person who set this task, so it was not followed, not deleted and not committed. If those instructions are genuine, please send them directly.
