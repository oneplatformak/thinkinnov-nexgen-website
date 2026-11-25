# Persona, page and action matrix

The brief (Part B §5, Part C §6) asks for each kind of visitor to have a path to something useful and a clear next action. This table says what the site gives each of them, where, and what it cannot give because the source has nothing to say.

- **Pages** are English paths; the Japanese page is the same path under `ja/`.
- **Action** is the link the visitor ends on. Contact links carry an enquiry type, and where it applies a topic, business need, industry and company size, to the contact form (`improved-src/scripts/05-context.js`, `71-enquiry.js`).
- **Scripted** names the test in `improved-src/tools/test-interactions.js` that walks the path in Chrome in both languages. "No" means the links are covered only by the link checker.

## Enterprise leadership

| Persona | What they look for | Where the site answers | Action | Scripted | What the site cannot answer |
| --- | --- | --- | --- | --- | --- |
| CEO / Managing Director | Who the company is, what it does, who it works with | Home hero and `#about`; About `#identity`, `#leadership`, `#partnership`, `#profile`; home `#customers`, `#testimonials` | "Book a PLM consultation" → `contact.html?type=consultation` | No | Company history, case studies and results: none in source |
| CFO | Business value, cost, risk | `plm.html#benefits`, `plm.html#why`; `digital-transformation.html#outcomes`; `digital-transformation.html#views` ("For management") | "Book a PLM consultation" | No | Pricing, total cost of ownership, any figure: none in source |
| CTO / CIO / CDO | Architecture, integration, deployment | `digital-transformation.html#integration` and `#digital-thread`; `plm.html#deployment`; `solutions.html#active-integration` and the two Teamcenter gateways; `products/teamcenter.html` | "Discuss digital transformation" → `contact.html?type=dx` | Partly (journey 1 passes through the Teamcenter page) | Security certifications, reference architectures: none in source |

## Engineering and manufacturing

| Persona | What they look for | Where the site answers | Action | Scripted | What the site cannot answer |
| --- | --- | --- | --- | --- | --- |
| Engineering Director | Faster development, change control | Finder need "Keep engineering change under control" (`solutions.html#need-change`); `solutions.html#engineering-change-management`; `products/teamcenter.html` | Contact with need and topic | **Journey 1**, **Journey 3** | How a change workflow is configured: not in source |
| R&D Head | Reuse of knowledge, shorter cycles | Needs "We want to reuse existing designs and IP…", "Shorten the product development cycle"; `plm.html#npd` | Contact with need | Finder test | — |
| Design Engineer | CAD, design data, versions | `products/nx.html`, `products/solid-edge.html`; `solutions.html#design-data-management`, `#3d-shape-search`, `#nx-programming-customization` | "Enquire about this product" → `contact.html?type=product&topic=product-nx` | **Product pages** test, **Journey 2** | Product features and versions: the site refers the visitor to Siemens |
| Manufacturing Director | Connected production, planning | `products/tecnomatix.html`; `solutions.html#digital-factory-enterprise`; `digital-transformation.html#digital-factory` | Contact with topic | Product pages test | Shop-floor examples: none in source |
| Quality Manager | Quality planning, issues | Need "Manage quality from planning to production"; `solutions.html#quality-management`, `#quality-issue-management` | Contact with need | Finder test (direct link to `#need-quality`) | Compliance statements: none are made |
| PLM Administrator | Upgrades, support, migration | `services.html#post-implementation`; needs "Upgrade PLM or move it to the cloud", "Keep our PLM running and improving" | "Ask about support" → `contact.html?type=support&topic=service-post-implementation` | Scripts-off test sends a support enquiry | Support hours, response times, SLAs: none in source |
| IT Manager | Security, access, infrastructure | `plm.html#deployment` (on premises, cloud, SaaS); `privacy.html` | Contact | No | Security controls of the delivered systems: not in source |

## Commercial stakeholders

| Persona | What they look for | Where the site answers | Action | Scripted | What the site cannot answer |
| --- | --- | --- | --- | --- | --- |
| Procurement Manager | Vendor identity, scope, offices | About `#profile` (company name as the source prints it, officers, head office, branches); `services.html` (three phases with every item); `contact.html` | General or partnership enquiry | No | Registered legal name (open question), terms, certifications, references with outcomes |
| Project Manager | How delivery runs | `services.html` rail: before, during, after; About `#partnership` (bilingual PM / PMO, onsite and offshore) | "Discuss an implementation" → `contact.html?type=implementation` | **Journey 1** | Milestones, methods and timelines: not in source |
| Siemens Representative | Correct names, marks and claims | Product pages (Siemens-attributed sentence with source, trademark sentence, "refer to Siemens" note); footer trademark line; partner wording only where the source has it | — | Product pages test checks that outside links go only to Siemens' sites | Which partner designation is current (open question) |
| Business Partner | Ways to work together | About `#partnership`; Contact type "Partnership" | `contact.html?type=partnership` | No | Partner programme: none in source |

## Japanese enterprise customers

| Concern in the brief | Where the site answers | What remains open |
| --- | --- | --- |
| Professional Japanese | Every page exists under `ja/` with 0 untranslated strings; phrase-aware line breaking | No native review yet (`JAPANESE-REGISTER.md`) |
| Organisational transparency | About `#profile`, `#leadership`; Tokyo head office in the footer of every page | Legal name; two CEO-titled roles |
| Implementation responsibility and support after it | `services.html` | No SLA or response time exists in source |
| Information security, risk | `privacy.html` describes what the website itself does | Nothing about project security exists in source |

## Other personas

| Persona | Path | Action | Scripted |
| --- | --- | --- | --- |
| Startup founder | `plm.html#size-startups` → "Find by business need" (finder opens with the size chosen) → a need → solution entry → contact | Contact with solution, need and size | **Journey 2** |
| SME manufacturing owner | `plm.html#size-smbs` → finder | Contact with size | Same mechanism as Journey 2 |
| Global enterprise customer | `plm.html#size-enterprises`; an industry card → finder with the industry chosen | Contact with industry, size and need | **Journey 1** |
| Existing customer needing support | Footer "Ask about support"; `services.html#post-implementation` → "Ask about support" | `contact.html?type=support` | Scripts-off test |
| Non-technical visitor | Home lifecycle diagram (plain sentence per stage); finder starts from problems, not product names; search | Any contact link | Lifecycle, finder and search tests |
| Technical specialist | Product pages; `solutions.html#stage-map`; `products.html#stage-map` | Product enquiry | Product pages test |
| Potential employee, experienced PLM engineer, graduate | `careers.html#roles` (filters) → role page → `apply.html?job=<role>` | Application form | Career filters and application form tests |
| International business partner | English pages; About; Contact type "Partnership" | `contact.html?type=partnership` | No |
| Mobile visitor | Every page at 320–430 px; full-screen menu; `tel:` and `mailto:` links | Any | Mobile menu test; layout test at sixteen widths |
| Visitor with accessibility needs | Keyboard operation, visible focus, skip link, text alternatives, `accessibility.html` | Any | Interaction tests are keyboard-driven; axe-core on every page |

## The three journeys the brief works through

Each is run by `testJourneys` in `improved-src/tools/test-interactions.js`, in English and Japanese, by clicking the links a visitor would use.

1. **"Automotive → Enterprise → Engineering Change Management → Relevant Teamcenter Capabilities → Implementation Services → Request Consultation"** (master prompt L1718–1719). Industries, card "Teamcenter X for Automotive" → finder with the industry already chosen → company size "Enterprises" → need "Keep engineering change under control" → Teamcenter product page → Services, Implementation → "Discuss an implementation". The contact form opens with type Implementation, topic Implementation, the need, the industry and the size. The test then sends the enquiry to the local handler and reads the captured email: all five lines are in it.
2. **"Manufacturing Startup → Managing Design Data → Relevant PLM or CAD Solutions → Speak to an Expert"** (L1723–1724). PLM For Everyone, Startups → finder with the size chosen → need "Duplicate parts and systems keep appearing" → Design Data Management Solution → enquiry link. The form carries the solution, the need and the size. "Remove" clears them and later links carry nothing.
3. **"A manufacturing company struggling with engineering revisions should discover relevant design data management, change management and PLM information"** (L4082–4083). Home → finder → the change need shows the change management solution and Teamcenter; the same list offers the design data needs; the Teamcenter page lists both solutions; search for "engineering change" (Japanese: 変更) finds the solution and the need; an enquiry from the product page still carries the need.

What "Relevant Teamcenter Capabilities" means here: the Teamcenter page shows the source tagline, the source category, one Siemens-attributed sentence and the solutions the source ties to Teamcenter. It does not list product capabilities, because the source does not.
