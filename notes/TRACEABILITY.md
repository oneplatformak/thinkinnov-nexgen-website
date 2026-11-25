# Requirement traceability

Each requirement of the brief (`notes/MASTER_PROMPT.txt`), where it is implemented, how that was checked, and the result. 255 rows. The brief repeats itself across its three parts; repeats are merged into one row and the `Brief` column gives each place it appears (`L` = line).

The requirement text is shortened; quoted words are the brief's. Read the brief at the line given for the full wording.

**How verified** uses the short names of `notes/ACCEPTANCE.md`: T-build, T-site, T-src, T-forms, T-layout, T-int, T-csp, T-axe, T-lh, T-audit, T-shots. Each is a file in `notes/test-output/` (or `screenshots-after/index.json`), listed with its date and command in `notes/TEST-EVIDENCE.md`. A dash means no test applies: the row is a document, a decision or something not built.

**Result**

| Result | Meaning | Rows |
| --- | --- | --- |
| Met | Done as asked, and checked where a check exists | 126 |
| Met in part | Done as far as the source content, a static site or this environment allows; the row says what is missing | 90 |
| Client decision | Waits on a fact, permission or approval from the client; listed in `REVIEW.md` §9 | 20 |
| Phase 2 | Needs a backend, CMS or external system; listed in `REVIEW.md` §7 | 7 |
| Not adopted | Decided against, with the reason; listed in `REVIEW.md` §8 | 10 |
| Not done | Should have been done and was not | 1 |
| Host | Belongs to the hosting account, not the site files | 1 |
| **Total** | | **255** |

## 1. Global rules: truthfulness, scope, positioning, process

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| GLB-01 | A2 L95–96; B3 L828–829; B25 L2421–2425, L2444; C25 L4320–4337; C37 L4939–4943 | Never invent "business credentials, testimonials, customers, statistics, certifications, partnerships, or achievements" (A); nor "customer relationships, certifications, partnership classifications, employee numbers, financial … | Every factual statement comes from `staging-original/` or the official package; `CLAIM-REGISTER.md` lists each with its source | T-src: testimonials, logos, roles identical to the original; banned and unsupported wording absent | Met |
| GLB-02 | B3 L831–832; C4 L2826–2827, L2873–2874; C15 L3837 | "Do not mix the identities, credentials or capabilities of ThinkInnov, NEXGEN, Nexware and Siemens unless their relationship and attribution are explicitly verified." Do not imply every listed customer is served by the same legal … | Partner wording placed exactly as in the official source; no joint-venture wording; `legalName` left out of structured data; trademark line in the footer | T-src (partner placement, banned wording, JSON-LD keys) | Client decision: which entity is which (`REVIEW.md` §9) |
| GLB-03 | A2 L92–93; A18 L596; B3 L826; B25 L2450; C3 L2820–2822; C37 L4963 | Preserve all valuable existing business information, working functionality and authorised assets. "Do not lose content during the redesign." | `improved-src/COVERAGE.md` maps every original section, anchor, image and form field to its new place | T-src; T-site `legacy anchors: 0` | Met |
| GLB-04 | A7 L308–310; B9 L1623, L1703; B25 L2427–2429; C37 L4935–4937 | Publish only pages and capabilities supported by verified business information. Every page complete, purposeful, connected, functional, with a distinct purpose. No placeholder content, no unfinished pages, no pages built "merely … | 41 pages per language, each from source content; no page for anything the source lacks | T-site (one H1, title, description, no dead ends) | Met |
| GLB-05 | A11 L411–415; B25 L2430–2434; C37 L4947–4953 | Every button, navigation item, form, filter, search function and interactive element performs its intended action. No fake functionality, placeholder buttons, broken links, fake or misleading form confirmations. | All controls in `improved-src/scripts/` | T-int 427/427 | Met |
| GLB-06 | A11 L417; B25 L2446; C37 L4961 | Never expose credentials, API keys or confidential information. | No credentials exist in the repository; recipient address is the only setting | T-src credential scan, 0 hits | Met |
| GLB-07 | A11 L377–380; B24 L2406–2411; B25 L2448; C26 L4343–4347, L4377–4379; C37 L4959 | Inspect the existing stack first; preserve what works; choose the simplest maintainable architecture; no unnecessary frameworks, dependencies, subscriptions, paid dependencies, databases or infrastructure; backend only where a … | `ARCHITECTURE.md`: a build script writes static files; one direct build-time dependency | T-audit; T-build | Met |
| GLB-08 | A15 L506–507; B21 L2253; B24 L2413; B25 L2454; C34 L4755; C37 L4965 | Keep the existing website until the replacement is verified and approved. No unauthorised or irreversible production change or deployment. | Nothing deployed; old site untouched; work is on a branch | `REVIEW.md` §1 | Met |
| GLB-09 | B25 L2456 | "Every important design and engineering decision must have a clear business justification." | `ARCHITECTURE.md` decisions table; `REVIEW.md` §8 | Read by the author | Met |
| GLB-10 | A18 L593–594; C37 L4969–4974 | Make reasonable, reversible decisions independently. Ask only where essential information, legal rights, external integration permissions or irreversible actions require it. Keep working while documenting blocked items. | Decisions in `REVIEW.md` §8; questions only the client can answer in §9 | — | Met |
| GLB-11 | A18 L590–592; B24 L2402–2404; C36 L4922–4929; C39 L5014 | Do not stop at planning, mock-ups, the home page, written code or the first successful build. Deliver the implemented, verified site. | Built, tested and documented site in `docs/` | `TEST-EVIDENCE.md` | Met |
| GLB-12 | A3 L147; A12 L452–453 | No features for personas irrelevant to this business. AI only where it gives measurable value, never as a marketing feature. | No AI feature, chat, login or pricing widget | T-site third-party scan: 0 | Met |
| GLB-13 | B1 L663–684; C1 L2548–2565 | Rethink positioning, IA, journeys, content, visuals, conversion and implementation for every page. Fit to present to Japanese multinationals, global manufacturers, Siemens executives and partners. Visitors should think: "This is … | Every page rebuilt (`COVERAGE.md`); review in `EXECUTIVE-REVIEW.md` | T-shots | Met in part: fitness to present to the named audiences is scored 62–80, limited by missing proof |
| GLB-14 | B4 L836–847; C5 L2877–2880 | Position as a strategic engineering and digital transformation partner. Must not appear to be simply a software reseller, a staffing company, a conventional IT outsourcer, a generic consultancy, or a catalogue of Siemens products. | Home narrative, services by phase, DX page; product pages lead with how the company works with the product | `EXECUTIVE-REVIEW.md` (business positioning 70) | Met in part: no case studies to prove it |
| GLB-15 | B4 L849–872 | Establish "verified capabilities" in: product innovation; PLM; digital engineering; digital transformation; connected manufacturing; engineering knowledge management; enterprise systems integration; lifecycle optimisation … | Capabilities stated only as the source states them (`CLAIM-REGISTER.md`) | T-src | Met in part: "verified" needs the client |
| GLB-16 | B4 L874–879 | Brand narrative based on "Connecting People, Products, Processes and Technology Across the Entire Product Lifecycle." "Treat this as a proposed positioning statement. Refine it using verified business information and existing … | Not used as a headline; the home hero says "Connect your product lifecycle. Innovate more, and faster.", made from the source's phrases | — | Client decision |
| GLB-17 | C5 L2882–2892 | Proposed central narrative "Connecting Engineering. Transforming Industry." with supporting narrative (L2888–2889). Refine using verified capabilities and approved brand guidelines. | Not used; listed as a proposed headline for the client | — | Client decision |
| GLB-18 | C5 L2894–2904 | Establish five core perceptions: technical excellence, business understanding, engineering intelligence, delivery reliability, long-term partnership. | Carried by structure, restraint and accuracy rather than claims | `EXECUTIVE-REVIEW.md` scores | Met in part: delivery reliability and long-term partnership have no evidence in the source |
| GLB-19 | B6 L1013–1064 | "Do not begin the website narrative by listing software products." Start from customer challenges (19 listed, L1019–1054). "For every relevant pain point, connect it to an actual ThinkInnov-NexGen capability, business outcome and … | Home: problem section (02) precedes lifecycle, services and products; finder starts from sixteen business needs | T-int `finder`; T-shots home | Met in part: the source's four problems and sixteen needs, not the brief's list of nineteen |
| GLB-20 | B3 L782–824; C3 L2697–2704, L2751–2752; C4 L2828–2871 | Before changing anything: full audit and crawl (raw and rendered HTML; desktop, mobile, tablet; Japanese and English); verified content inventory; business capability map showing how products, services, industries, solutions … | `notes/INVENTORY.md`; `screenshots-before/`; `COVERAGE.md` | — | Met |
| GLB-21 | C3 L2782–2818 | For each existing page document 16 attributes (purpose, content, business value, audience, visual and content weaknesses, navigation problems, functional defects, responsive, accessibility, SEO, performance, translation … | `notes/INVENTORY.md` per-page notes | — | Met in part: not all sixteen attributes are written out for every page |
| GLB-22 | C3 L2754–2780 | Investigate the client-side rendering of the nine internal pages (dependencies, dynamic loading, JS errors, missing server-rendered content, metadata, deep links, crawlability, refresh, direct URL access, loading and error … | `INVENTORY.md` (the nine pages were rendered by script from `page-data.js`); now each is a static HTML file | T-int `scripts off`: content present with scripts off | Met |
| GLB-23 | B5 L883–886, L1008–1009; C6 L2908, L2989–3005 | Create a stakeholder and persona matrix and "a detailed persona-to-page-to-action matrix": per persona needs, fears, questions, what builds confidence, what blocks action, which pages, next action. "Every relevant stakeholder … | `notes/PERSONA-MATRIX.md` | T-int journeys | Met |
| GLB-24 | B5 L954–981 | For Japanese enterprise customers pay special attention to: reliability, quality assurance, technical accuracy, long-term commitment, clear communication, professional Japanese, organisational transparency, implementation … | Company profile table, offices, plain claims, privacy and accessibility pages, Japanese throughout | `EXECUTIVE-REVIEW.md` reviewer 2 | Met in part: needs native review and registered company details |
| GLB-25 | A1 L55–58; B2 L776–778; C2 L2690–2693 | Evaluate every major decision from the relevant expert perspectives. "Do not merely simulate professional titles. Apply their actual responsibilities, review criteria and quality standards." | `EXECUTIVE-REVIEW.md`: twelve reviewers and five viewpoints, each with findings and fixes | — | Met in part: one author, not twelve people |
| GLB-26 | B7 L1068–1098; B24 L2363; C36 L4877 | Competitor and benchmark analysis (Siemens Digital Industries Software, Dassault Systèmes, PTC, Autodesk, Accenture, IBM Consulting, Hitachi, Mitsubishi Electric, Apple, Stripe, NVIDIA). Study strengths and weaknesses. "Do not … | Not carried out as a written analysis; `EXECUTIVE-REVIEW.md` reviewer 12 compares in general terms | — | Not done: no competitor research was run; recorded as a limitation |

## 2. Navigation, header, footer, information architecture

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| NAV-01 | B13 L1841–1857 | "Elegant and intuitive mega menu" for the full architecture. Visitors navigate by Products, Solutions, Industries, Services, Business needs, Company information, Resources. | Header menus: What we do, Products, Industries, Company (`lib/nav.js`) | T-int `desktop menu`, `mobile menu` | Met in part: four groups, not the brief's eight (see NAV-02) |
| NAV-02 | C22 L4180–4186 | Potential primary structure, in this order: Company, Products, Solutions, Industries, Services, Digital Transformation, Resources, Careers. "Integrate PLM education naturally within the appropriate navigation." | Order kept from the previous build: What we do (PLM, Services, DX, Solutions), Products, Industries, Company (About, Behind the Brand, Careers, Contact) | T-int | Not adopted as written: eight top-level items do not fit at 1024; Resources has no content |
| NAV-03 | B13 L1863–1867; C22 L4192–4196; C29 L4498 | Clear desktop mega menus, excellent mobile-first navigation, keyboard-accessible menus and dialogs. | `scripts/10-nav.js`: click, Enter, Space, arrow keys, Escape; focus held in the mobile menu | T-int menus | Met |
| NAV-04 | A7 L306; B13 L1869; C21 L4172; C22 L4204 | Search functionality. B13 lists it under "Provide"; C22 says "Search where justified"; C21 asks for Japanese and English search "where implemented". | `search.html`, `ja/search.html`; index `assets/search-{en,ja}.json` built from the pages; header search link | T-int `search` (English and Japanese queries, empty and no-result states) | Met |
| NAV-05 | B13 L1871; C22 L4198; C31 L4586 | Breadcrumb navigation on detailed pages. | Breadcrumb on every page except home; `BreadcrumbList` JSON-LD | T-site; T-src JSON-LD | Met |
| NAV-06 | B13 L1859, L1873; C20 L4124–4126; C22 L4200–4202 | Intelligent cross-links between related content, contextual related pages, contextual next steps. "Do not create isolated pages." | `content/relations.js` drives related solutions, products, industries, services and roles on each page | T-site (links); T-int `product pages`, journeys | Met |
| NAV-07 | B13 L1875; C22 L4206 | A clear language switcher. | EN/JA switch in header and mobile menu | T-int `language switch` | Met |
| NAV-08 | B13 L1877–1879; C22 L4208 | Prominent contact options and persistent access to relevant inquiry actions, without overcrowding the header. | "Contact" button in the header on every page; enquiry block at the foot of each content page | T-site; T-shots | Met |
| NAV-09 | C22 L4188, L4210 | Preserve every existing important destination; every important destination discoverable without excessive steps. | `COVERAGE.md` §Routes | T-site `legacy anchors: 0` | Met |
| NAV-10 | B20 L2201; C22 L4212–4214; C31 L4588 | "Preserve existing deep links or provide permanent redirects. Do not break existing shared URLs." | `page.html`, `jobdetails.html`, `application.html` forward old query-string addresses; 301 rules in `.htaccess` | T-int `old addresses` 17/17 | Met in part: the `.htaccess` rules are untested |
| NAV-11 | C8.15 L3238–3264 | Enterprise footer with: company identity, verified contact details, Products, Solutions, Services, Industries, Company information, Careers, Resources, language options, privacy and legal information. "Ensure every link works." | Footer: identity statement, head office, four link groups, language, privacy, accessibility, sitemap, trademark line | T-site; T-shots | Met in part: no Resources column and no social links (none in the source) |
| NAV-12 | B9 L1701–1703 | An information architecture that makes large amounts of enterprise content easy to navigate; every page has a distinct purpose. | One page per subject; `STATUS.md` states each page's purpose | T-site unique titles and descriptions | Met |
| NAV-13 | C28 L4463–4465 | No unusable navigation; no hover-only functionality. | Menus open on click and keyboard | T-int | Met |

## 3. Home page

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| HOM-01 | A6 L227–243 | Home page immediately communicates: who we are, what we do, who we help, what problem we solve, why we are different, why to trust us, what to do next. "Within the first five seconds, a new visitor should understand the … | Table at the end of `ACCEPTANCE.md` | T-shots home | Met |
| HOM-02 | A6 L245–251; B8 L1161–1164; C8 L3074–3075 | One continuous narrative from customer problem to solution, benefits, differentiation, evidence, next steps. Not "a collection of disconnected sections". Understandable to "a completely non-technical visitor". | Section order: problem, lifecycle, services, products, solutions, industries, business size, customers, presence, contact | T-shots | Met |
| HOM-03 | B8.01 L1168–1184; C8.1 L3079–3094 | Hero with headline, supporting message, primary CTA "Explore Our Solutions", secondary CTA "Talk to Our Experts" (B) / "Talk to an Expert" (C). Proposed headlines: "Engineering Innovation. Accelerating Transformation." (B, L1172) … | Hero headline made from the source's phrases; actions are "Book a PLM consultation" and "Find by business need" | T-site; T-shots | Client decision: the brief's proposed headline and button labels are listed for the client |
| HOM-04 | C8.1 L3098–3100 | "Replace competing hero messages with one coherent primary value proposition." "If a carousel is retained, make it accessible, purposeful and user-controlled." | The three rotating slides became one hero; the other two messages are sections below it | `COVERAGE.md` | Met |
| HOM-05 | B8.01 L1186; C8.1 L3096 | Present the verified Siemens partnership professionally "using approved brand assets". | "Siemens Solution Partner" as text in the hero, as in the source; no Siemens logo | T-src | Client decision: no approved Siemens asset is in the repository |
| HOM-06 | B8.01 L1188–1207; C8.1 L3102–3103 | Cinematic, optimised industrial hero visual showing the relationship between product design, engineering and manufacturing. Imagery "must look authentic, technically credible and sophisticated". Avoid "generic AI-generated … | Hero has a lifecycle diagram drawn in code, not a photograph | T-shots | Met in part: not cinematic; no authentic industrial photograph exists in the source |
| HOM-07 | B8.01 L1209–1211 | The hero answers: "Who is ThinkInnov-NexGen? What does it do? Who does it help? Why should visitors continue exploring?" | As HOM-01 | — | Met |
| HOM-08 | B8.02 L1213–1225; C8.2 L3105–3127 | Section 2: visually demonstrate data silos, repeated engineering work, version confusion, information loss, manual approvals, manufacturing communication gaps, disconnected software systems, delayed decisions. Then transition to … | Section 02: the four problems from the source | T-shots | Met in part: only the problems the source names |
| HOM-09 | B8.03 L1227–1255; C8.3 L3129–3147 | Section 3, signature interactive lifecycle: "Idea → Requirements → Design → Engineering → Validation → Manufacturing → Quality → Service → Continuous Improvement". Show information flow. Each stage selectable, showing what … | Section 03: nine stages; each shows products, solutions and services from `relations.js`; keyboard operable; text alternative | T-int `lifecycle` | Met in part: "relevant industries" per stage is not shown |
| HOM-10 | B8.04 L1257–1280; C8.4 L3149–3157 | Section 4, what we do: visually distinct sections for PLM consulting and implementation; digital transformation; digital engineering; manufacturing solutions; enterprise integration; low-code application development; engineering … | Section 04 services by phase; DX and solutions sections | T-shots | Met in part: grouped as the source groups them |
| HOM-11 | B8.05 L1282–1309, L1313–1316; C8.5 L3159–3176 | Section 5: all six products (NX, Solid Edge, Capital, Teamcenter, Tecnomatix, Mendix), their distinct roles and how they complement each other across the lifecycle. Explore individually or by business requirement. "Every product … | Section 05 and `products.html#stage-map` | T-int `product pages` | Met |
| HOM-12 | B8.05 L1311, L1318–1319 | "Validate all product descriptions and available offerings against current authorized information." Do not misrepresent Siemens intellectual property, product availability, partnership status or licensing. | `CLAIM-REGISTER.md` §1: each Siemens-sourced sentence with its URL | — | Client decision: Siemens or the client must confirm current offerings |
| HOM-13 | B8.06 L1321–1348; C8.6 L3178–3182 | Section 6: existing solutions as customer-focused use cases, each "Business challenge → Solution approach → Relevant technology → Business benefits → Next action". Discover by actual challenge. Engineering diagrams and realistic … | Section 06 links to `solutions.html`, where each solution has challenge, approach, product, related items and enquiry | T-int `finder`, journeys | Met in part: benefits only where the source states them |
| HOM-14 | B8.07 L1350–1377; C8.7 L3184–3189 | Section 7: industry exploration with sector-specific challenges, solutions, imagery and approved customer evidence. "Only publish industries supported by actual company capabilities." "Avoid using the same generic text for every … | Section 07 and `industries.html`: the eleven industry pages of the source | T-site | Met in part: no customer evidence per industry |
| HOM-15 | B8.08 L1379–1399; C8.8 L3191–3196 | Section 8: how PLM needs differ for startups, small and medium businesses, large enterprises; help visitors find a starting point without knowing products first. | Section 08; `plm.html#business-size` | T-site anchors | Met |
| HOM-16 | B8.09 L1401–1412; C8.9 L3198–3202 | Section 9: "a clear interactive roadmap: Discover → Assess → Design → Validate → Implement → Integrate → Train → Support → Optimize". "Explain the actual delivery methodology using verified service capabilities." Transparent … | "Before, during and after implementation": three phases with their activities | T-shots | Met in part: the source has three phases, not the brief's nine steps; not interactive |
| HOM-17 | B8.10 L1414–1421; C8.10 L3204–3214 | Section 10: clean, credible showcase of existing approved logos and testimonials. "Verify the right to display each customer logo and testimonial and the correct company attribution." Remove duplicate accessible content. Keep … | Sections 09 and 10: 21 logos, four quotes | T-src | Met in part: permissions unconfirmed |
| HOM-18 | B8.10 L1414 | Section title as written: "Trusted by Industry Leaders". | Heading kept as the source's "Our key customers" | T-src: "Trusted by Industry Leaders" absent | Not adopted: unsupported claim; instruction from the coordinator |
| HOM-19 | B8.10 L1423–1438 | Where approved evidence exists, detailed customer success stories: background, challenges, approach, technologies, implementation journey, outcomes, lessons learned. Measurable results only with approved evidence. | None published | — | Client decision: no approved case study exists |
| HOM-20 | B8.11 L1440–1449; C8.11 L3216–3218 | Section 11: genuine differentiators (engineering expertise, technology capabilities, industry knowledge, consulting approach, implementation experience, international collaboration, ongoing support) shown through evidence. No … | "Why ThinkInnov-NexGen for PLM": the three reasons in the source | T-shots | Met |
| HOM-21 | B8.12 L1451–1460; C8.12 L3220–3223 | Section 12: verified locations and Japanese business presence; "a sophisticated visual representation of relevant locations and collaboration between teams"; accurate office information; cross-cultural capability only "where … | Section 11: four offices with addresses and an event photograph; no map | T-shots | Met in part: no location graphic |
| HOM-22 | B8.13 L1462–1488; C8.13 L3225–3227 | Section 13: knowledge and insights for business leaders and technical professionals (ten potential topics, L1468–1485). | Not built | — | Not adopted: the source has no articles; see RES-01 |
| HOM-23 | B8.14 L1490–1513; C8.14 L3229–3236 | Section 14: closing invitation. Proposed headlines "Let's Build the Future of Your Engineering." (B) / "Let's Build What's Next." (C). Actions: "Discuss Your Business Challenges", "Request a Product Demonstration", "Speak to a … | Section 12: four enquiry routes that preselect the form | T-int `finder` (preselection), `contact form` | Met; the brief's headline is listed for the client |

## 4. About Us

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| ABT-01 | C9 L3273–3289 | "Build a complete corporate identity experience." Who We Are explains who the company is, why it exists, what it specialises in, which customers it serves, how it creates value, how its capabilities connect. | `about.html#identity` | T-site | Met in part: as far as the source goes |
| ABT-02 | B9 L1532; C9 L3291–3297 | Company History: "Create a verified corporate timeline." Meaningful milestones and authorised partnership history. "Do not invent dates or achievements." | Not built | — | Client decision: the source has one year (2014) and no milestones |
| ABT-03 | B9 L1527; C9 L3299–3303 | Vision, Mission and Values in a visually distinctive format. "Explain how company values influence real business practices." | `about.html#principles` | T-shots | Met in part: the source does not say how the values are applied |
| ABT-04 | B9 L1528; C9 L3305–3308 | Leadership profiles "with authorized photographs, names, roles and verified experience". | `about.html#leadership`: four people, photographs, names, roles as in the source | T-src | Met in part: two forms of two titles are in the source; consent unconfirmed |
| ABT-05 | B9 L1525; C9 L3310–3314 | Company Profile: corporate information useful for enterprise procurement and partnership evaluation. "Verify legal entity names and geographic attribution." | `about.html#profile` table | T-site | Client decision: registered name, capital, establishment date are not in the source |
| ABT-06 | B9 L1534; C9 L3316–3318 | Global Presence: accurate office locations and verified operational capabilities. | Home section 11; `contact.html`; footer | T-site | Met |
| ABT-07 | B9 L1538; C9 L3320–3322 | Gallery and Media: authentic gallery of approved company photographs, events, office environments, team activities, business milestones. | `about.html#gallery`: 14 photographs with a keyboard-operable viewer | T-int `photo viewer` | Met in part: consent of the people shown is unconfirmed |
| ABT-08 | C9 L3324–3328 | Final CTA: learn about capabilities, discuss partnerships, contact. The page "must establish institutional trust rather than merely describing company history". | Closing block on `about.html` | T-site | Met |
| ABT-09 | B9 L1536 | Partnerships as a Company page or section. | `about.html#partnership` | T-src | Met in part: one partnership, worded as the source words it |

## 5. PLM For Everyone

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| PLM-01 | C10 L3338–3351 | "The most understandable PLM educational experience possible." Start with "What happens when a business creates a product?" Explain how requirements, designs, documents, revisions, suppliers, manufacturing information and … | `plm.html`: opens with what PLM connects, then benefits, sizes, process | T-shots | Met |
| PLM-02 | C10 L3353–3374 | Cover benefits such as collaboration, product data consistency, revision management, knowledge reuse, process visibility, traceability, change management, less repeated effort, better decisions. "Avoid guaranteeing financial or … | `plm.html#benefits` | T-site | Met |
| PLM-03 | B9 L1632–1636; C10 L3376–3388 | Distinct journeys for startups, small businesses, medium-sized businesses and large enterprises, with their different requirements and implementation considerations. | `plm.html#business-size` with `#size-startups`, `#size-smbs`, `#size-enterprises` | T-site anchors | Met in part: three sizes as in the source |
| PLM-04 | B9 L1640; C10 L3390–3394 | "Create an interactive NPD lifecycle. Connect each development stage to relevant PLM capabilities." | `plm.html#npd`; the interactive lifecycle is on the home page and linked | T-int `lifecycle` | Met in part: the NPD process on this page is a static diagram |
| PLM-05 | B9 L1642; C10 L3396–3408 | Deployment options: preserve and improve on-premises, customer-managed cloud, Siemens-managed SaaS. Explain ownership, maintenance, upgrades, integration, security. "Validate actual product availability and deployment … | `plm.html#deployment`: three options as in the source | T-site | Met in part: ownership, upgrades and integration detail are not in the source |
| PLM-06 | C10 L3410–3412 | Why ThinkInnov-NexGen: verified value of consulting, implementation, adoption and ongoing support. | `plm.html#why` | T-site | Met |
| PLM-07 | C10 L3414–3420; C24 L4279 | "Create an optional interactive assessment" of product development maturity. "Use transparent, rule-based recommendations. Do not pretend that a simple website assessment is a complete enterprise consultation." | Not built | — | Not adopted: "optional" in the brief; the finder gives rule-based direction without scoring a visitor's maturity |
| PLM-08 | C10 L3422–3424 | Final CTA: request a PLM consultation. | "Book a PLM consultation" block; preselects the enquiry type | T-int `finder`: "contact form preselects the PLM consultation type" | Met |
| PLM-09 | B9 L1629–1642; C10 L3336 | Keep the existing sub-navigation: PLM Benefits, Business Size, NPD Process, Why ThinkInnov-NexGen; add PLM Overview and Deployment Options. | In-page navigation on `plm.html` | T-site anchors | Met |

## 6. Services

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| SVC-01 | C11 L3432 | "Organize services around the complete customer implementation journey." | `services.html`: three phases | T-site | Met |
| SVC-02 | C11 L3434–3448 | Phase 1, Pre-Implementation: preserve and improve strategic business consulting, business process re-engineering, solution evaluation, solution mapping, service positioning, proof of concept. | `services.html#pre-implementation` | T-src; `COVERAGE.md` | Met |
| SVC-03 | C11 L3450–3462 | "For every service, explain": business challenge, service purpose, delivery approach, expected deliverables, customer involvement, next steps. | Each service has the source's description | — | Met in part: deliverables, customer involvement and outcomes are not in the source |
| SVC-04 | C11 L3464–3481 | Phase 2, Implementation: solution architecture, technical architecture, project management, customisation, configuration, performance tuning. Explain how technical implementation relates to business adoption. "Create a visual … | `services.html#implementation` | `COVERAGE.md` | Met |
| SVC-05 | C11 L3483–3507 | Phase 3, Post-Implementation: L1, L2, L3 support, requirements analysis, design, development, user acceptance testing, production-related development. "Verify unclear terminology and service scope." "Do not promise response … | `services.html#post-implementation` | `COVERAGE.md` | Met in part: support hours and response terms are not in the source and are not stated |
| SVC-06 | C11 L3509–3526 | Service discovery by situation: planning a new implementation; evaluating technology; migrating an existing system; upgrading a platform; improving performance; integrating enterprise systems; seeking ongoing support. "Publish … | Closing block "Tell us where you are in your PLM journey" | T-site | Met in part: three phases, not eight situations |
| SVC-07 | B9 L1578–1605 | Service pages listed: Strategic Business Consulting; Business Process Assessment; Solution Evaluation; Solution Mapping; Proof of Concept; Solution Architecture; Technical Architecture; Implementation; Customization and … | All services are on one page with an anchor per phase | T-site | Not adopted as separate pages: one or two sentences each in the source |

## 7. Digital Transformation

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| DTX-01 | C12 L3534, L3598–3599 | "The most visually compelling business transformation page"; usable by sales as "an interactive digital transformation presentation" in executive meetings. | `digital-transformation.html`: three diagrams drawn in code (maturity model, digital thread loop, integration map) | T-shots; T-lh | Met in part: clear rather than "most visually compelling"; not tried in a sales meeting |
| DTX-02 | C12 L3536–3567 | Current-state view (disconnected operations, fragmented information, inefficient collaboration) and future-state connected enterprise showing the relationship between people, products, processes, engineering data, CAD, PLM, ERP … | `#start`: the problems, then the connected model | T-shots | Met |
| DTX-03 | C12 L3569–3571 | Digital Thread: how information stays connected through a product's lifecycle. | `#digital-thread` with the loop diagram | T-shots | Met |
| DTX-04 | C12 L3572–3576 | Digital Twin: explain the concept through a simple industrial example. "Do not imply that the company provides specific digital twin capabilities unless verified." | Not built | T-src: "digital twin" absent | Not adopted: not in the source; instruction from the coordinator |
| DTX-05 | C12 L3578–3580 | Digital Factory: how digital manufacturing and connected production planning support transformation. | `#digital-factory` | T-site | Met |
| DTX-06 | C12 L3582–3584; C14 L3737 | Enterprise Integration: illustrate how engineering information connects with enterprise execution systems. "Only describe integrations supported by actual capabilities." | `#integration`: PLM, ERP, MES map; the SAP and Oracle gateways the source names | T-src | Met |
| DTX-07 | C12 L3586–3591 | Transformation roadmap: "Assessment → Strategy → Solution Design → Proof of Concept → Implementation → Integration → Adoption → Optimization." | PDMM levels L1–L4 serve as the roadmap | T-shots | Met in part: the source has the maturity model, not the brief's eight steps |
| DTX-08 | C12 L3593–3596 | Executive view and technical view: executives see business outcomes, engineers can explore technical relationships. | `#views`: a management reading and an engineering reading | T-site; T-shots | Met |
| DTX-09 | B9 L1607–1623 | Digital Transformation pages: Overview, Connected Product Lifecycle, Digital Thread, Digital Twin, Digital Manufacturing, Enterprise Integration, Engineering Process Transformation. "Publish only the pages and capabilities … | One page with an anchor per subject | T-site | Not adopted as separate pages: not enough source content |
| DTX-10 | B25 L2450; C3 L2822 | Keep the existing Product Data Maturity Model (PDMM L1–L4) and the three Digital Outcomes, which the brief never mentions. | `#pdmm`, `#outcomes` | `COVERAGE.md` | Met |

## 8. Products overview

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| PRD-01 | C13 L3607–3622 | "Comprehensive Siemens product catalogue." The overview shows which products are available, what each does, who uses it, what challenges it addresses, where it fits in the lifecycle, how it relates to other products. | `products.html`: six products, category, stage, link to detail | T-int `product pages` | Met in part: "who uses it" only at category level |
| PRD-02 | B10 L1726–1741; C13 L3624 | "Build product discovery by business need, department, industry and lifecycle stage." | By lifecycle stage (`#stage-map`), by business need (finder), by industry (industry pages link to products) | T-int | Met in part: not by department |
| PRD-03 | B9 L1540–1554; C8.5 L3176; C13 L3607, L3626–3651 | Dedicated product detail pages for Siemens NX, Solid Edge, Capital, Teamcenter, Tecnomatix, Mendix, each explaining its "verified" capabilities (design/engineering/manufacturing; mechanical design/modelling/collaboration … | `products/nx.html`, `solid-edge`, `capital`, `teamcenter`, `tecnomatix`, `mendix`, both languages | T-int `product pages`; T-lh (Teamcenter) | Met in part: "verified" needs Siemens or the client |

## 9. Product detail pages

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| PDP-01 | B11 L1752–1776; C13 L3653–3680 | Every product page covers: what the product is / overview; who it is for / target users; business challenges / problem; verified key capabilities; engineering and technical workflows; relation to other enterprise systems … | Each page: what it is, lifecycle position, how the company works with it, related solutions, needs and industries, related roles, enquiry | T-int | Met in part: no features, integrations, deployment or demonstrations (not in the source) |
| PDP-02 | B11 L1778–1780 | Layered content: "Start with a simple business explanation. Allow technical visitors to explore more detailed information." | Plain description first; relations and roles below | T-shots | Met in part: little technical depth to layer |
| PDP-03 | B11 L1781–1783; C13 L3682 | "Use official product imagery only when authorized." "Do not reproduce proprietary Siemens material without permission." Use authorised Siemens branding and official references. | Product tiles from the original site only; no Siemens imagery added | `ASSET-REGISTER.md` | Client decision: origin and licence of the six tiles |
| PDP-04 | C13 L3684 | "Do not invent software features, compatibility, licensing terms, pricing or certifications." | No such statement is made; `CLAIM-REGISTER.md` §1 limits Siemens-sourced text to what the product is | T-src | Met |

## 10. Solutions

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| SOL-00 | C8.6 L3180; C14 L3695 | "Present the nine existing solution categories" / "Build complete dedicated experiences for the nine existing solution areas." | All fifteen solutions of the source are kept | T-src | Not adopted as written: the brief says nine; dropping six would lose content |
| SOL-01 | B9 L1556–1576; C14 L3692–3695 | A solution discovery experience "focused on business problems rather than technical product names", with a dedicated experience per solution area. | `solutions.html#finder`: sixteen needs, each leading to solutions, products, services | T-int `finder` | Met in part: one section per solution, not one page |
| SOL-02 | C14 L3697–3701 | Design Data Management: explain the challenges of managing engineering files, design revisions and product configurations. "Visualize an organized and connected engineering data workflow." | `solutions.html#design-data-management` | T-site anchors | Met |
| SOL-03 | C14 L3703–3706 | 3D Shape Search: how finding geometrically similar components supports engineering reuse and sourcing decisions. | `#3d-shape-search` | T-site | Met |
| SOL-04 | C14 L3708–3711 | Quality Management Solution: quality planning, product quality and lessons learned across the lifecycle. | `#quality-management` | T-site | Met |
| SOL-05 | C14 L3713–3716 | Quality Issue Management: how issues are identified, investigated, managed and connected to engineering information. | `#quality-issue-management` | T-site | Met in part: as far as the source describes it |
| SOL-06 | C14 L3718–3721 | Design Verification Management: verification planning, requirements traceability, specification management. "Avoid claiming guaranteed regulatory compliance." | `#design-verification-management` | T-src (no "guaranteed") | Met |
| SOL-07 | C14 L3723–3726 | Engineering Change Management: visualise a change moving through evaluation, impact assessment, approval and implementation. | `#engineering-change-management` | T-site | Met in part: text, with the lifecycle position shown; no change-flow animation |
| SOL-08 | C14 L3728–3731 | Requirements Management: how complex requirements are organised, managed and linked to development activities. | `#requirements-management` | T-site | Met |
| SOL-09 | C14 L3733–3737 | Active Integration Solution: relationship between Teamcenter and ERP, MES and enterprise systems. "Only describe integrations supported by actual capabilities." | `#active-integration`, `#teamcenter-gateway-sap`, `#teamcenter-gateway-oracle` | T-src | Met |
| SOL-10 | C14 L3739–3741 | Digital Factory and Enterprise: connected digital manufacturing, planning and enterprise transformation. | `#digital-factory-enterprise` | T-site | Met |
| SOL-11 | B8.06 L1344–1348; C14 L3743–3767 | Structure for every solution: real business challenge; current-state workflow; target-state workflow; solution approach; relevant technology; applicable services; potential outcomes; relevant industries; related products … | Each solution: challenge, approach, product, lifecycle stage, related needs, industries and services, enquiry link | T-int `finder`, journeys | Met in part: current-state and target-state workflows, deliverables and evidence are not in the source |
| SOL-12 | B25 L2450; C3 L2822; C37 L4963 | Keep the six existing solutions the brief does not name: Mendix low-code platform; Project Management Solution; Teamcenter Gateway for SAP Business Suite; Teamcenter Gateway for Oracle E-Business Suite; NX programming and … | Six further solutions kept | T-src; `COVERAGE.md` | Met |

## 11. Industries, customer portfolio, case studies

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| IND-01 | B8.07 L1354–1372; B9 L1625–1627; C15 L3774–3794 | "Create an industry discovery platform." Research and validate experience in automotive, aerospace (and defence), industrial machinery, electrical and electronics, energy, electric vehicles, agriculture and heavy equipment … | `industries.html`: the eleven pages of the source | T-site | Met in part: industries the brief names beyond the source are not added |
| IND-02 | C15 L3796–3820 | Every industry explains: industry-specific challenges; product development complexity; collaboration requirements; manufacturing considerations; digital transformation opportunities; applicable Siemens products; relevant … | Each industry: the source text, related products, solutions and services | T-int | Met in part: challenges only as the source states them |
| IND-03 | B8.10 L1419; B21 L2246–2247; C15 L3821–3837; C32 L4666–4668 | Customer portfolio: "Inventory every customer logo displayed on the existing website." Verify correct company name, correct logo version, permission to use, relationship attribution, industry classification. Do not imply all are … | `CUSTOMER-REGISTER.md`: 21 logos with file, label, size, questions | T-src | Client decision: names, versions, permissions |
| IND-04 | B9 L1650; C15 L3839–3847 | Case studies where approved information exists: "Challenge → Approach → Implementation → Outcome". "Do not fabricate projects or measurable results." | None published | — | Client decision |
| IND-05 | B9 L1644–1648 | Customer Success area: Customer Portfolio and Testimonials. | Home sections 09 and 10 | T-src | Met |

## 12. Behind the Brand

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| BTB-01 | C16 L3855–3859 | "Make this page distinct from About Us." About gives institutional credibility; Behind the Brand shows "the human side of engineering innovation". | `behind-the-brand.html`: problems and team; `about.html`: identity, leadership, profile | T-site | Met |
| BTB-02 | C16 L3861–3886 | Potential sections: people behind the technology; engineering culture; how teams collaborate; professional values; problem-solving philosophy; innovation mindset; technical learning; team development; leadership perspectives … | `#problem`, `#team` | T-site | Met in part: two sections, as the source has |
| BTB-03 | C16 L3888–3890 | "Use authentic information and images." "Do not invent employee testimonials or workplace benefits." | Source text and photographs only | T-src | Met |
| BTB-04 | C16 L3892–3893 | The page helps customers understand the people who deliver, and helps candidates understand the organisation's identity. | Team section links to Careers and Contact | T-site | Met |

## 13. Careers

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| CAR-01 | C17 L3901–3915 | Careers home explains: why join; the type of engineering work; verified career development opportunities; actual workplace culture; relevant technical disciplines. | `careers.html#culture` | T-site | Met in part: development opportunities and benefits are not in the source |
| CAR-02 | C17 L3917–3930 | Job discovery "where active positions are verified": role search; location, experience, department and employment-type filters; individual job descriptions. | `careers.html#roles`: search, discipline and experience filters, 18 role pages | T-int `career filters` | Met in part: no location or employment-type filter, because every role has the same value for both |
| CAR-03 | C17 L3932–3950 | Individual job page with approved title, responsibilities, required skills, experience, qualifications, location, employment conditions, application instructions. | `careers/NN-….html`: title, focus, experience, location, employment type, responsibilities, skills, apply link | T-src (titles); T-lh (one page) | Met in part: qualifications and conditions are not in the source; "Bangalore" is not one of the listed offices |
| CAR-04 | B9 L1670; C17 L3961–3962; C37 L4957 | "Do not display fake vacancies or collect applicant information without a functioning recruitment process." "No unverified job vacancies." | Heading "Current Opportunity Areas" as in the source; no `JobPosting` markup | T-src | Client decision: are the roles open, and who receives applications |
| CAR-05 | C17 L3952–3959 | "Create a secure and accessible application workflow." Resume submission "only where authorized infrastructure exists". Validation, file restrictions, consent, data retention controls, access permissions. | `apply.html`, `apply.php`: PDF/DOC/DOCX, 5 MB, type checked by content | T-forms; T-int `application form` | Met in part: delivery to a real mailbox unproven |
| CAR-06 | C17 L3964–3968 | Candidate journey: "Explain the verified recruitment process. Provide a transparent next step." | "Before you apply" on `apply.html` says only what is known | — | Client decision: the recruitment process |
| CAR-07 | B16 L1992; B21 L2243–2244; C18 L3996 | Collect only necessary information; take particular care with job applications. | Gender, current and expected CTC and notice period are optional; privacy notice lists every field | T-forms; T-int | Client decision: whether to collect those three at all |

## 14. Contact Us

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| CON-01 | B9 L1674–1685; B16 L1969–1984; C18 L3973–3991 | Inquiry categories: general business inquiry; (Siemens) product demonstration; PLM consultation; digital transformation consultation; implementation inquiry; technical support; partnership; career inquiry / application. | Seven enquiry types; product enquiry in place of "demonstration" | T-forms | Met; demonstrations are a client question |
| CON-02 | B16 L1986–1990; C18 L3993–3994; C20 L4122 | Context-aware forms: "Automatically preserve relevant product, solution or industry context when visitors enter the contact journey" (e.g. Teamcenter, automotive). | `scripts/05-context.js`, `71-enquiry.js`: links and finder choices preselect type, topic, need, industry | T-int `finder`, `contact form`, journeys | Met |
| CON-03 | B16 L1992; C18 L3996–4018 | Potential fields: name, company, business email, department or role, country, inquiry category, product or solution of interest, message, privacy consent. "Collect only necessary information." "Avoid unnecessarily long forms." | Type, topic, name, company, email, phone, message, consent; need, industry and company size arrive as context from the finder and links | T-forms; T-int `contact form` | Met in part: no department, country or timeline fields, to keep the form short |
| CON-04 | C18 L4035–4036; C32 L4654–4660 | Verify office address, email, telephone number, legal entity name and international telephone formatting. | As in the source; email shown with the `.co.jp` domain | — | Client decision: mailbox, legal name, telephone |
| CON-05 | C18 L4038 | "Make contact information easy to access on mobile." | `contact.html`: `tel:` and `mailto:` links; head office details also in the footer of every page | T-layout; T-shots | Met |
| CON-06 | C18 L4040 | "Never send real test inquiries to company recipients without authorization." | Tests hand mail to a script that writes a file | T-forms header | Met |
| CON-07 | B9 L1683–1685; C6 L2965–2967 | A customer-support route for existing customers; Japan office and other verified locations. | "Support" enquiry type; "Ask about support" in the footer | T-int | Met in part: the support service itself is undefined |

## 15. Resources, insights, FAQ

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| RES-01 | B8.13 L1462–1488; B9 L1652–1662; C8.13 L3225–3227; C31 L4618–4619 | A knowledge section and Resources area: articles, technical insights, product guides, FAQs, approved downloadable resources. Potential topics: What is PLM?; PLM for manufacturing companies; Digital twin fundamentals; Connecting … | Not built | — | Not adopted: the source has no articles, guides or downloads; phase 2 with a CMS |
| RES-02 | B9 L1660; B11 L1774; C13 L3674 | Frequently asked questions (site-level and per product). | Not built | — | Not adopted: no approved answers exist; `FAQPage` markup excluded |

## 16. Discovery and knowledge architecture

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| DIS-01 | B10 L1707–1714; C19 L4044–4047 | "An advanced solution discovery experience" that starts from business challenges: the visitor selects industry, company size and current engineering challenge; the site presents "relevant verified products, solutions and … | `solutions.html#finder` | T-int `finder` | Met |
| DIS-02 | B10 L1726–1741; C19 L4049–4063 | Discovery inputs: industry; business challenge; company size; (engineering) department; product lifecycle stage; Siemens product; deployment preference; digital transformation maturity; existing technology environment. | Inputs: business need, then industry and company size carried to the enquiry; lifecycle stage and product by their own views | T-int | Met in part: no department or deployment input |
| DIS-03 | C19 L4065–4076 | Output: relevant business solutions, applicable products, available services, educational resources, recommended consultation options. | Output: solutions, products, services, consultation link | T-int | Met in part: no educational resources exist |
| DIS-04 | B10 L1743–1745; C19 L4078 | "Implement this using reliable, maintainable content relationships and business rules." "Do not generate unsupported recommendations." "Use transparent content relationships and validated business rules." | `content/relations.js`: every link is a written rule traced to source text | `CLAIM-REGISTER.md` §3 | Met in part: relations need a specialist's sign-off |
| DIS-05 | B10 L1747–1748; C19 L4085 | The visitor must not need to know Siemens product names. | Needs are worded as problems | T-int | Met |
| DIS-06 | C19 L4087 | "The discovery experience must be educational and useful rather than merely collecting leads." | Results explain why each solution is shown | T-shots | Met |
| DIS-07 | B10 L1716–1724; C19 L4080–4083 | Example journeys must work: "Automotive → Enterprise → Engineering Change Management → Relevant Teamcenter Capabilities → Implementation Services → Request Consultation"; "Manufacturing Startup → Managing Design Data → Relevant … | Three scripted journeys | T-int `journey 1`, `journey 2`, `journey 3` | Met |
| DIS-08 | C20 L4089–4126 | "Create structured relationships between" industries, personas, business problems, products, solutions, services, customer evidence, educational resources, contact journeys. Worked example L4113–4122 (automotive page → … | `content/relations.js` | T-site | Met in part: no customer evidence or resources to relate |

## 17. Lead generation and forms

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| LEAD-01 | B16 L1996; C18 L4027; C29 L4486, L4500 | Accessible form validation with meaningful error descriptions. | `scripts/70-forms.js`: messages tied to fields, summary receives focus | T-int forms; T-axe | Met |
| LEAD-02 | B16 L1998; C18 L4023; C32 L4636–4638 | Spam protection and protection against automated form abuse. | Hidden trap field, minimum fill time, rate limit per connection | T-forms | Met |
| LEAD-03 | B16 L2000; C18 L4021, L4025 | Secure server-side processing, server-side validation, secure submission handling. | `contact.php`, `apply.php`, `inc/form-lib.php`: allow-lists, header-injection checks | T-forms 62/62 | Met |
| LEAD-04 | B16 L2002, L2016; B25 L2434; C18 L4029; C37 L4953 | Confirmation messages. "Never display a successful inquiry confirmation unless the submission has actually been accepted." | Success shown only on the server's 200 response | T-forms; T-int | Met |
| LEAD-05 | B16 L2004; C18 L4031 | Reliable inquiry routing; approved email or CRM routing. | One recipient set in `docs/inc/form-lib.php` (`TIN_RECIPIENT`); subject carries the enquiry type | T-forms | Met in part: recipient mailbox unconfirmed |
| LEAD-06 | B16 L2006 | Error recovery. | Entries kept on error; email fallback shown | T-int | Met |
| LEAD-07 | B16 L2008; C18 L4016 | Privacy consent where required. | Required consent box linking to the privacy notice; checked on the server | T-forms | Met |
| LEAD-08 | B16 L2010, L2018–2019; C27 L4417–4418 | Approved CRM integration; investigate integration if an approved CRM or internal platform exists. | Not built | — | Phase 2 |
| LEAD-09 | B16 L2012 | Source and campaign attribution. | The message records enquiry type, topic, need, industry, size and page language | T-forms | Met in part: campaign attribution is phase 2 (analytics) |
| LEAD-10 | B16 L2014 | Appropriate email notifications. | One notification to the company | T-forms | Met in part: no acknowledgement to the sender (needs a sending address the client approves) |
| LEAD-11 | B16 L2021; C27 L4420 | Do not expose internal business systems to the public internet. | `inc/` blocked in `.htaccess`; no admin surface | — | Met in part: the block is untested on Apache |
| LEAD-12 | A11 L399; C34 L4728 | Loading, empty, success and error states. | Sending, sent, failed; empty filter and empty search | T-int | Met |

## 18. Japanese and internationalisation

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| I18N-01 | B12 L1787, L1811; B26 L2464–2466; C21 L4130–4132 | Professional Japanese and English, with the same design quality. "Use Japanese as a first-class enterprise experience, not an afterthought." | `ja/` mirrors every page | T-site `language parity: 0`; T-layout | Met in part: native review outstanding |
| I18N-02 | B12 L1789–1809; C21 L4137–4153 | "Do not simply translate English sentences word for word." Japanese copy natural, professional, respectful, technically accurate, with appropriate keigo and professional terminology for manufacturing, engineering, PLM, enterprise … | `improved-src/i18n/`; choices in `JAPANESE-REGISTER.md` | — | Met in part: native review outstanding |
| I18N-03 | B12 L1815; C21 L4159 | Persistent language preference. | `scripts/20-lang.js`: choice kept in local storage | T-int `language switch` | Met |
| I18N-04 | B12 L1817; C21 L4163 | Language-specific, localised URLs. | `/…` and `/ja/…` | T-site | Met |
| I18N-05 | B12 L1819; C21 L4167; C31 L4574 | Correct hreflang configuration. | `en`, `ja`, `x-default` on every page and in the sitemap | T-site `hreflang: 0` | Met |
| I18N-06 | B12 L1821; C21 L4165 | Localised page titles and metadata. | Titles and descriptions translated | T-site | Met |
| I18N-07 | B12 L1823–1825; B19 L2124; C21 L4155; C30 L4533 | Japanese typography, appropriate line-breaking rules, optimised Japanese font loading. | System Japanese fonts; BudouX phrase breaks; `word-break: keep-all` | T-layout; T-shots | Met in part: one font on one system |
| I18N-08 | B12 L1827–1829 | Localised contact forms and language-specific validation messages. | Japanese form labels, errors and server messages | T-forms; T-int | Met |
| I18N-09 | B12 L1831–1832; C21 L4134–4135 | Localised navigation and complete translation coverage: "Every page, form, navigation element, accessibility label, error message, metadata field and important interaction must be localized." | The build counts strings left without a translation and prints them | T-build: 0 | Met |
| I18N-10 | B12 L1834; C21 L4161 | "When users switch languages, preserve the current page wherever possible." | The switch links to the same page and keeps the fragment | T-int | Met |
| I18N-11 | B12 L1836–1837; B25 L2436; C28 L4467; C37 L4955 | "There must be no untranslated buttons, broken layouts, mixed-language placeholders or awkward Japanese typography." No broken Japanese translations or layouts; no untranslated essential content. | As I18N-07, I18N-09 | T-layout; T-build | Met in part: "awkward" needs a native reader |
| I18N-12 | C21 L4169; C29 L4502 | Correct HTML language attributes. | `lang="en"` / `lang="ja"` on every page; the link to the other language carries its own `lang` | T-site; T-axe | Met |
| I18N-13 | C21 L4170 | Translation completeness checks. | Build count; `check-site.py` parity check | T-build; T-site | Met |
| I18N-14 | C21 L4174–4176 | "Review both languages independently. Flag content requiring native Japanese or technical subject-matter approval." | `JAPANESE-REGISTER.md` flags terms for review | — | Met in part: flagged, not reviewed |

## 19. Design system, imagery, motion, psychology

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| DSN-01 | A4 L150–155; B7 L1100–1114; C7 L3009–3032 | An original, recognisable identity combining Japanese corporate precision, international enterprise credibility, industrial sophistication, modern product design, editorial typography, cinematic storytelling and clear accessible … | `DESIGN-SYSTEM.md` | T-shots | Met in part: a judgement (visual identity 82) |
| DSN-02 | A4 L179–180; B7 L1118–1145; C7 L3036–3037 | A design system covering typography and Japanese fonts, colours, spacing, responsive layouts, navigation, buttons, icons, photography, technical illustrations, interactive diagrams, data visualisation, animations, forms … | `DESIGN-SYSTEM.md`; `improved-src/styles/` | — | Met |
| DSN-03 | B7 L1116; C7 L3034 | Preserve the official company logo, brand identity and authorised Siemens partner assets. | Original logo file unchanged; no Siemens asset added | `ASSET-REGISTER.md` | Met in part: no authorised Siemens partner asset is available |
| DSN-04 | B7 L1147–1150; C7 L3059 | Balance clean light sections with selected cinematic industrial sections. "Avoid making the entire website dark." | Light pages; two dark sections on the home page and the footer | T-shots | Met |
| DSN-05 | A4 L182–185; B7 L1152–1157; B25 L2419, L2440; C7 L3039–3063, L3070; C37 L4933 | Avoid: generic AI-generated look or templates, excessive gradients, neon or glow, glassmorphism, floating cards, random shapes, particles, repetitive card grids, futuristic robots, meaningless animation, fake engineering … | None of the listed effects are used | T-shots | Met |
| DSN-06 | B8.01 L1204; C7 L3065–3068; C16 L3888 | "Use real, approved imagery wherever possible." Conceptual illustrations must be technically credible and clearly distinguished "from actual customer facilities or company projects". | Real photographs for people and events; diagrams drawn in code and captioned as diagrams; nothing generated for this rebuild | `ASSET-REGISTER.md` | Met in part: eleven inherited industry images of unknown origin |
| DSN-07 | A10 L364–373; B15 L1954–1963; C24 L4281–4288 | Motion: tasteful scroll storytelling, subtle parallax, progressive animation, premium transitions. Never reduces usability, accessibility, readability or performance. "Do not force visitors to watch animations before accessing … | `styles/90-motion.css`: short fades; off under reduced motion | T-int `lifecycle`: "with reduced motion nothing animates" | Met in part: no parallax or scroll storytelling, by choice |
| DSN-08 | B15 L1929–1952; C24 L4256–4279 | Potential signature visuals: interactive product lifecycle; connected digital thread; engineering data flow between departments; exploded component diagrams; CAD-to-manufacturing workflow; digital factory; product revision … | Lifecycle, digital thread loop, integration map, PDMM, stage map | T-int; T-shots | Met |
| DSN-09 | A4 L157–177; B15 L1957 | Feel premium, intelligent, modern, professional, authentic, trustworthy, innovative, human-centric, visually impressive, effortlessly simple; "like an interactive engineering exhibition". | — | `EXECUTIVE-REVIEW.md` design scores | Met in part: a judgement |
| DSN-10 | A5 L189–223; B14 L1884–1925; C23 L4218–4252 | Apply ethical psychology: visual hierarchy, cognitive ease, progressive disclosure, information scent, authentic social proof, recognition over recall, risk reduction, evidence-based trust, consistent patterns, customer-focused … | Hierarchy, progressive disclosure, one primary action per section; no urgency or scarcity devices | `EXECUTIVE-REVIEW.md` | Met |
| DSN-11 | B14 L1918–1923; C23 L4247–4250 | Support multi-stakeholder enterprise evaluation (notably Japanese purchasing) with clear product information, implementation methodology, approved case studies, technical resources, consultation options. | Product pages, services by phase, company profile | `PERSONA-MATRIX.md` | Met in part: no case studies, support terms or security documents |

## 20. Content

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| CNT-01 | A8 L314–328; C25 L4292–4296 | Rewrite and improve all content where needed: simple, confident, outcome-led. Correct spelling, grammar, terminology, formatting, capitalisation. Replace generic marketing text with precise communication. | Source wording tidied; errors corrected and logged in `COVERAGE.md` | T-src | Met in part: "Production Development" kept pending the client |
| CNT-02 | C25 L4298–4314 | Content principles: lead with customer problems; explain capabilities; practical value; evidence where available; make complex topics understandable; technical depth where required; consistent engineering terminology; end with a … | Problems first on home, solutions and product pages | — | Met |
| CNT-03 | C25 L4316–4318 | "Do not remove valuable technical content simply to make the design minimal." Layered content for executives and engineers. | All source content kept | `COVERAGE.md` | Met |
| CNT-04 | C25 L4339 | "Maintain a factual claim register and flag items requiring approval." | `CLAIM-REGISTER.md` | Generated by the build | Met |
| CNT-05 | A8 L324–325 | "Every headline must communicate value. Every paragraph must provide useful information. Every call to action must have a clear purpose." | — | Read by the author | Met in part: a judgement |
| CNT-06 | A8 L319–320; B8.11 L1446–1447; C31 L4621 | No exaggerated promises, empty superlatives or unsupported claims. | — | T-src banned wording | Met |

## 21. Accessibility

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| A11Y-01 | A9 L357; C29 L4474 | Target WCAG 2.2 AA. | Built to it; `accessibility.html` states it as a target | T-axe | Met in part: a target, not a tested conformance |
| A11Y-02 | A9 L354–355; C29 L4476–4502 | Semantic HTML; logical headings; keyboard navigation; visible focus states; accessible forms; meaningful alternative text; colour contrast; screen-reader compatibility; reduced-motion support; accessible interactive diagrams … | Landmarks, skip link, heading order, focus styles, labels, alt text, contrast, reduced motion, controls at least 44 px high | T-axe; T-int; T-site | Met |
| A11Y-03 | C29 L4504–4506; C34 L4739–4741 | "Test using automated tools and representative manual checks. Automated scores alone are not proof of full accessibility compliance." | `TEST-EVIDENCE.md` | T-axe; scripted keyboard checks | Met in part: no screen reader |
| A11Y-04 | B25 L2442; C37 L4951 | No inaccessible essential functionality or interactions. | Every control works by keyboard; content readable with scripts off | T-int | Met |

## 22. Performance

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| PERF-01 | A13 L460–474; B19 L2098–2112; C30 L4510–4523 | Targets: Lighthouse Performance 95+, Accessibility 95+, Best Practices 95+, SEO 95+; LCP 2.5 s or less; INP 200 ms or less; CLS 0.1 or less. | — | T-lh | Met, except INP, which needs field data |
| PERF-02 | A13 L476–477; B19 L2114–2135; C30 L4525–4547 | Responsive images, modern formats, efficient asset loading, lazy loading, optimised Japanese font loading, code splitting, efficient caching, minimal JavaScript, GPU-efficient animation, progressive enhancement, reduced-motion … | WebP images with stated dimensions, `srcset` where sizes differ, lazy loading, two variable WOFF2 fonts, one CSS and one JS file, cache rules in `.htaccess` | T-lh; T-site | Met in part: no code splitting (30 kB script); cache rules untested on Apache |
| PERF-03 | A13 L479; B19 L2137; C30 L4549–4553; C34 L4743–4745 | "Use real performance measurements." Measure representative pages on desktop and mobile. "Distinguish laboratory measurements from real-user field data. Do not claim real-user performance metrics when field data is unavailable." | `test-output/lighthouse.txt` | T-lh, mobile and desktop | Met |
| PERF-04 | A13 L457–458; B19 L2139; C24 L4288; C30 L4555 | Optimise for slower mobile networks and weaker devices. Speed and usability before decoration; simplify visuals that cost performance. | No blocking third-party code; system fonts for Japanese | T-lh mobile preset | Met |

## 23. SEO and structured data

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| SEO-01 | A14 L485–486; B20 L2176–2203; C31 L4561–4590 | Semantic HTML; unique page titles; unique meta descriptions; canonical URLs; meaningful heading structures; crawlable main content; multilingual XML sitemaps; hreflang; robots configuration; Open Graph metadata; relevant … | `lib/seo.js` | T-site; T-lh SEO | Met in part: not validated in Search Console |
| SEO-02 | C31 L4559 | "Resolve the current generic internal-page title and content-discoverability concerns." | Each page has its own title and is a file | T-site `duplicate titles: 0` | Met |
| SEO-03 | C26 L4374–4375 | "Every public content page must expose meaningful primary content to search engines without depending exclusively on client-side JavaScript." | Static HTML | T-int `scripts off` | Met |
| SEO-04 | B20 L2146–2174; C31 L4592–4616 | Research search intent around the listed English and Japanese terms. "Validate keyword relevance and business offerings before using them." | `notes/KEYWORD-MAP.md` | — | Met in part: no search-volume data was available |
| SEO-05 | A14 L488–491; B20 L2205–2208; C31 L4618–4621 | Factual, authoritative content that search engines and AI search can interpret. No keyword stuffing, hidden content or misleading techniques. | — | T-src | Met |

## 24. Security, privacy, legal

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| SEC-01 | A15 L500–501; B21 L2216–2220; C32 L4626–4632 | Input validation; cross-site scripting prevention; injection prevention; CSRF protection where applicable. | `inc/form-lib.php`: allow-lists, length limits, header-injection checks; output escaped in the build (`lib/html.js`) | T-forms | Met; CSRF does not apply (no session, no login, nothing stored) |
| SEC-02 | A11 L390–392; B21 L2222–2224; C32 L4634, L4644 | Secure authentication, authorisation, role-based access control; prevent broken access control and unauthorised data access. | Nothing to protect | — | Phase 2 (only if accounts are added) |
| SEC-03 | B21 L2226 | Rate limiting. | Per-address limit in `form-lib.php` | T-forms | Met |
| SEC-04 | B21 L2228; C32 L4640 | Secure file uploads. | `apply.php` | T-forms (wrong type, renamed file, oversize) | Met |
| SEC-05 | B21 L2230; C32 L4642 | Secret management; no secret exposure. | No secrets; `docs/inc/form-lib.php` holds the recipient and sender addresses and nothing else that is configurable (corrected: this row cited `inc/config.php`, a file that does not exist) | T-src | Met |
| SEC-06 | B21 L2231 | Secure HTTP headers. | `.htaccess`: Content-Security-Policy, nosniff, frame, referrer and permissions policies, HTTPS redirect; `Strict-Transport-Security` deliberately not set until HTTPS is confirmed permanent | T-csp under the same CSP on the preview server | Met in part: untested on Apache |
| SEC-07 | B21 L2233; C32 L4646 | Dependency security. | One direct build-time package (BudouX) and its own dependencies; nothing at run time | T-audit: 0 known vulnerabilities | Met |
| SEC-08 | A11 L403–405; B21 L2235–2237 | Logging, monitoring, backup and recovery. | Not built | — | Host: logging, monitoring and backup belong to the hosting account (`README-DEPLOY.md`) |
| SEC-09 | A15 L497–498; B21 L2239–2244; C32 L4648–4650 | Personal data protection. Evaluate Japanese APPI and other privacy rules, especially for inquiries, job applications and international data handling. | `privacy.html` describes what the forms collect and where it goes | — | Client decision: legal review; no compliance is claimed |
| SEC-10 | B21 L2246–2251; C32 L4652–4675 | Verify legal company name, registered business information, office address, contact details, Siemens partnership terminology, trademark usage, customer logo permissions, testimonial attribution, copyright notices, privacy policy … | `REVIEW.md` §9 | — | Client decision |
| SEC-11 | A15 L503–504; B21 L2249; C32 L4677 | Never invent or claim regulatory compliance or certification. | — | T-src | Met |

## 25. Governance pages

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| GOV-01 | A7 L298; B9 L1689; C32 L4672–4674 | Privacy policy with data collection disclosures. | `privacy.html`, `ja/privacy.html` | T-site | Met in part: legal review |
| GOV-02 | A7 L300; B9 L1691 | Terms of Use. | Not written | — | Client decision: legal input |
| GOV-03 | A15 L497; B9 L1693 | Cookie preferences "where required". | No cookies are set; the privacy notice says so; no banner | T-int `language switch`: "no cookie has been set" | Met |
| GOV-04 | A7 L302; B9 L1695 | Accessibility information. | `accessibility.html` | T-site | Met |
| GOV-05 | B9 L1697 | Sitemap page. | `sitemap.html`, `sitemap.xml` | T-site | Met |
| GOV-06 | A7 L304; B9 L1699 | Custom 404 page. | `404.html`, `ja/404.html` | T-site | Met in part: served as 404 only once `.htaccess` is live |

## 26. Operations: CMS, analytics, engineering

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| OPS-01 | B17 L2025–2060; B26 L2478; C27 L4383–4421; C39 L5035 | Content management "where justified" for products, services, solutions, industries, news, articles, case studies, testimonials, logos, leadership, careers, media, contact information, translations, SEO metadata; with permissions … | Not built; content is in `improved-src/content/` | — | Phase 2 |
| OPS-02 | A12 L437; C33 L4681–4709 | "Where approved", privacy-conscious analytics for product, solution and industry interest, language preference, journeys, inquiry starts, server-confirmed submissions, form abandonment, navigation usage, site performance. … | Not built | T-site: no tracker | Phase 2 |
| OPS-03 | A12 L421–450 | Evaluate support for lead generation, CRM, sales automation, onboarding, customer support, content management, analytics, employee workflows, notifications, reporting, administration, retention, AI automation; integrate existing … | Evaluated in `REVIEW.md` §7 | — | Phase 2 |
| OPS-04 | A11 L382–386, L397, L407–409; C26 L4349–4372 | Clean, maintainable architecture; reusable components; maintainable content structures; reliable routing; page-specific metadata; proper error handling; automated testing; deployment configuration. | `ARCHITECTURE.md` | T-build | Met |
| OPS-05 | A11 L388, L394 | Scalable database design; reliable API integrations. | Not needed | — | Phase 2 |
| OPS-06 | A7 L287–296 | Evaluate the need for customer onboarding, authentication, customer dashboards, account management, administrative dashboards, support and help centre. | Evaluated in `REVIEW.md` §7: none needed for this site | — | Phase 2 |
| OPS-07 | A7 L273 | Evaluate the need for pricing. | No pricing shown | — | Client decision |

## 27. Testing and QA

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| QA-01 | A16 L538–540; B22 L2257, L2295; C34 L4713 | "Perform actual browser-based testing." Use real rendering and screenshots. "Do not claim that functionality works merely because the source code compiles." | `improved-src/tools/` | All browser suites | Met |
| QA-02 | B22 L2259; C34 L4715 | "Test every route in both languages": all pages, forms, navigation systems, language versions, user journeys. | — | T-site; T-layout; T-axe; T-shots | Met |
| QA-03 | A16 L513–536; B22 L2261–2284 | Functional, responsive, visual regression, cross-browser, Japanese language, accessibility, performance, security, integration, SEO validation, error handling and end-to-end journey testing. Successful and unsuccessful scenarios. … | `TEST-EVIDENCE.md` | — | Met in part: no cross-browser, no visual-regression baseline, no integration tests |
| QA-04 | C34 L4717–4719 | Functional: "Verify every button, link, form, navigation item, filter, menu, interactive diagram and user journey." | — | T-int; T-site | Met |
| QA-05 | B22 L2288–2293; C34 L4721–4725 | Capture desktop and mobile screenshots of every major page. Inspect every screenshot for inconsistency, alignment, layout, spacing, typography, clutter, branding, content quality, incorrect assets. Fix and repeat. | `screenshots-after/` | T-shots | Met in part: all captured, a sample read by eye |
| QA-06 | C34 L4726–4729 | Technical: routing, direct URL access, refresh behaviour, redirects, loading states, error states, content rendering. | — | T-int `old addresses`, `no script`; T-site | Met in part: server redirects and status codes untested |
| QA-07 | C34 L4731–4733 | Language: complete Japanese and English coverage. | — | T-build; T-site | Met |
| QA-08 | C34 L4735–4737 | Security: test validation, access control, headers, dependency security, form protection. | — | T-forms; T-audit; T-csp | Met in part: headers on Apache |
| QA-09 | A16 L514; B22 L2286; C34 L4747–4749 | Test Chrome, Safari, Edge and Firefox "where available". | — | Chrome only | Met in part |
| QA-10 | C34 L4751–4755 | Verify approved backend, CRM, email and recruitment integrations in appropriate test environments. No unauthorised production actions. | — | T-forms with a stand-in for mail | Met in part: no real integration exists to test |
| QA-11 | B18 L2081; C28 L4425–4445 | Test at 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920 and 2560 px. (B lists eight widths; C adds 430 and 1280.) | `tools/test-layout.js` | T-layout | Met |
| QA-12 | A9 L359–360; B18 L2091–2092; C28 L4453–4469 | Verify: no overlapping elements, no unintended horizontal scrolling, no clipped typography, no broken images, no unusable navigation, no inaccessible hover-only functionality, no broken Japanese layouts, no inconsistent spacing. | — | T-layout; T-int | Met in part: overlap is checked by eye only |
| QA-13 | A9 L332–352; B18 L2064–2089; C28 L4447–4451, L4471 | Device-appropriate experiences for small and large phones, foldables, tablets, laptops, desktops, ultrawide monitors, large presentation displays, touchscreens. Not a shrunk desktop. Suitable for live sales demonstrations in … | — | T-layout at sixteen widths | Met in part: emulated, not devices |
| QA-14 | C34 L4757–4759 | "Maintain a test evidence register. Every known issue must be resolved or explicitly documented." | `TEST-EVIDENCE.md` | — | Met |
| QA-15 | A16 L511, L542; B22 L2293 | Test from every relevant persona's perspective. Identify defects, fix, retest, repeat. | `PERSONA-MATRIX.md`; `EXECUTIVE-REVIEW.md` | T-int journeys | Met |

## 28. Expert reviews

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| REV-01 | A17 L545–578 | After implementation, review separately as CEO, customer, investor, designer, sales expert, psychologist, software architect, cybersecurity expert, accessibility expert, QA engineer, competitor, first-time non-technical visitor. … | `EXECUTIVE-REVIEW.md` §2 | — | Met |
| REV-02 | B23 L2299–2351 | Virtual Executive Review: twelve named reviews, each answering a set question. "Record identified weaknesses and improve the implementation. Repeat the review until no known critical issues remain and all acceptance criteria have … | `EXECUTIVE-REVIEW.md` §2–§4: two rounds | — | Met |
| REV-03 | C35 L4763–4865 | Multi-persona final review: "Score each applicable area from 0 to 100 based on documented criteria" across seven review groups (40 areas). "Do not assign arbitrary perfect scores. Base assessments on observable implementation and … | `EXECUTIVE-REVIEW.md` §5 | — | Met |

## 29. Reporting and deliverables

| ID | Brief | Requirement | Where implemented | How verified | Result |
| --- | --- | --- | --- | --- | --- |
| RPT-01 | A18 L598–599; B24 L2415 | Keep a record of progress, discovered issues and defects, completed tests, assumptions, changes, limitations, unresolved dependencies. | `improved-src/CHANGELOG.md`; `REVIEW.md` | — | Met |
| RPT-02 | A19 L631–634 | Final report: completed features, test results, actual performance metrics, outstanding limitations, deployment status, recommended future improvements. "Never claim that a requirement is complete if it has not been implemented … | `REVIEW.md` | — | Met |
| RPT-03 | B26 L2497–2502; C39 L5061–5075 | Final page-by-page completion report using the statuses Implemented / Tested / Verified / Requires Business Approval / Requires External Integration / Not Implemented. "Never hide incomplete work." | `STATUS.md` | — | Met |
| RPT-04 | C38 L5009–5010 | "Produce a traceability matrix connecting every requirement to its implementation and verification evidence." | This file | — | Met |
| RPT-05 | B26 L2460–2495; C39 L5016–5059 | Deliverables: source code; English site; Japanese site; design system; verified route inventory; all page designs; product and solution experiences; interactive visualisations; inquiry workflows; appropriate content management … | Listed in `REVIEW.md` §6 | — | Met in part: no CMS, no cross-browser report |
| RPT-06 | B25 L2452; C37 L4967 | No unsupported claims of successful testing; no claims of completed tests without evidence. | Every Tested status names an output file | `ACCEPTANCE.md` | Met |
| RPT-07 | A18 L584–588; B24 L2357–2400; C36 L4869–4920 | Follow the execution sequence (audit → research → competitor analysis → inventory → personas → journeys → IA → positioning → design system → English and Japanese content → home → inner pages → visualisations → forms → responsive … | Followed, except competitor analysis | — | Met in part |
