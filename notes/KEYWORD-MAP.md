# Search terms: which offering and which page

The brief (Part B §20 L2146–2174, Part C §31 L4592–4616) lists example search terms and says: "Validate keyword relevance and business offerings before using them."

**What this is.** A check of each term against what the company offers according to the source, and a note of which page answers it. Presence was counted in the built pages on 25 November 2026 (visible text, titles and descriptions).

**What this is not.** Keyword research. No search-volume, ranking or competitor data was available in this environment, so nothing here says how often a term is searched or how hard it is to rank for. That needs a keyword tool and a person who knows the Japanese market; it is listed under phase 2 in `REVIEW.md`.

No term was added to a page for its own sake. Where a term is not on the site, the reason is given.

## English

| Term in the brief | Is it an offering in the source? | Page that answers it | Where the words appear |
| --- | --- | --- | --- |
| PLM solutions Japan / PLM consulting Japan | Yes. Tokyo head office; PLM consulting, implementation and support | Home; `plm.html`; `services.html` | "PLM consulting" in the home title and description; "PLM solutions" in the menu on every page ("End-to-end PLM solutions for consulting, mapping, implementation and adoption", source wording) and in the Industries introduction; "Tokyo" in the home and contact descriptions |
| Siemens PLM consulting | Yes. Consulting in the Pre-Implementation list; Siemens products | `services.html#pre-implementation`; `products.html` | "Siemens products" and "consulting" in the home description. The exact phrase is not used |
| Teamcenter implementation (Japan) | Partly. Teamcenter is a product the company works with and Implementation is a service phase. The source does not join the two words except in job advertisements | `products/teamcenter.html`; `services.html#implementation` | Teamcenter in the title and description of its page. "Teamcenter implementation" appears once, in a job summary on `careers.html` |
| Digital manufacturing solutions | Yes. Tecnomatix (source: "Process automation and digital manufacturing planning") and the Digital Factory/Enterprise solution | `products/tecnomatix.html`; `solutions.html#digital-factory-enterprise`; `digital-transformation.html#digital-factory` | In the Tecnomatix description and on eight pages |
| Siemens NX solutions / Siemens NX consulting | Partly. NX is a product the company works with; "NX Programming & Customization" is a solution | `products/nx.html`; `solutions.html#nx-programming-customization` | The pages say "NX" and name Siemens as its maker. The compound "Siemens NX" is not used, because the source does not use it and Siemens now calls the product Designcenter NX (open question) |
| Engineering digital transformation / Manufacturing digital transformation | Yes. Digital Transformation is a source page | `digital-transformation.html` | In the title and description of that page |
| Product lifecycle management | Yes | Home; `plm.html`; `products/teamcenter.html` | Written out on three pages; "PLM" elsewhere |
| Mendix development (Japan) | Partly. Mendix is a product the company works with, and the source lists Mendix among its areas of expertise and in job advertisements. "Development in Japan" is not stated | `products/mendix.html`; `solutions.html#mendix-low-code` | Mendix in the title and description of its page |

## Japanese

| Term in the brief | Is it an offering in the source? | Page that answers it | Where the words appear |
| --- | --- | --- | --- |
| PLM導入支援 | Yes (PLM implementation and support) | `ja/plm.html`; `ja/services.html` | "PLM導入" on the home and PLM pages; the home description says PLMのコンサルティング、導入、サポート. The exact compound 導入支援 is not used |
| 製品ライフサイクル管理 | Yes | `ja/index.html`; `ja/products/teamcenter.html` | Written out on three pages |
| 製造業DX | Partly. The source speaks of digital transformation, in full, and of manufacturing customers. It does not use the abbreviation DX | `ja/digital-transformation.html` | Not used. The page uses デジタルトランスフォーメーション, as the original site's Japanese does. Whether to adopt 製造業DX is a wording decision for the native reviewer |
| Teamcenter導入 | Partly, as for "Teamcenter implementation" | `ja/products/teamcenter.html`; `ja/services.html` | Once, in a job summary |
| デジタルマニュファクチャリング | Yes, but the original site's Japanese says デジタル製造 | `ja/products/tecnomatix.html` | デジタル製造 is used throughout, following the source. The katakana form is not used |

## What follows from this

- Every term describes something the source supports, in whole or in part. None was rejected as irrelevant to the business.
- Three wordings the brief lists are not on the site because the source uses a different one: "Siemens NX", 製造業DX and デジタルマニュファクチャリング. They are choices for the client and the native reviewer, not gaps in the build.
- Titles and descriptions are unique on all 82 pages (checked by `improved-src/check-site.py`). No page repeats a term to rank for it.
