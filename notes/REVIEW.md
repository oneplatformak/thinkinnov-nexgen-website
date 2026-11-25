# Design review — ThinkInnov-NexGen site polish

Reviewed every English page and the Japanese mirror at 390px and 1440px after the generator was pointed at `docs/`. Screenshots are in `screenshots-after/` (full page, both widths). No horizontal overflow on any checked page. Link and single-H1 check: 65 HTML files, pass.

Nothing was deployed. Production hosts were not touched.

## What was reviewed

English: home, about, PLM, products, services, solutions, digital transformation, industries, behind the brand, careers, all 18 job pages, apply, contact, 404.

Japanese (`/ja/`): the same set except job pages other than the Teamcenter tech lead (those pages share the job template). Language switch, `lang`, and `hreflang` were checked in the HTML.

## Fixes

### Generator
- `improved-src/build.js` writes straight into `docs/`. The `improved` → `docs` symlink is gone. Asset links stay relative, so the same files work on the GitHub Pages subpath and at a domain root.

### Design (first pass, then a second look)
- Header is a frosted cream bar with a thin orange rule. The full-colour logo stays on that light bar, so it is readable over the dark hero photograph.
- Desktop hero keeps the photograph, with the scrim heavier on the left where the type sits and lighter on the right so the people and the screen still read.
- Mobile hero is a photo band, then the headline on solid ink, so the faces are not cropped under the text.
- The Harumi ribbon-cutting portrait is cropped to about 420px tall (240px on a phone) instead of showing the full 1600px frame.
- Solution cards use a short accent rule. On the home page the blurb is visually clamped to four lines; the full sentence remains in the HTML. The solutions page shows every sentence. The home service timeline lists every item again.
- Card grids stay two columns until 1024px.
- Footer is ink. The logo sits on a white plate so the dark wordmark still works.
- Inner pages no longer add a second header-height gap under the sticky header.
- Motion is a short fade. `prefers-reduced-motion` turns off the marquee, the hero rotation, and the reveals.
- Japanese home headline is broken on purpose after 「と」 and after 「の」, so 「ソリューション」 is not split.

### Japanese
- Real URLs: English at `/`, Japanese at `/ja/`, with `lang`, canonical, and `hreflang` (`en`, `ja`, `x-default`).
- Body copy is Japanese only when that sentence already exists in staging (`pageContentJp` or the JP dictionary).
- Navigation, buttons, form labels, and aria labels are translated as UI chrome.
- The repeated staging filler that replaced each solution, industry, and job paragraph with one generic Japanese sentence was not used. Those paragraphs stay English.
- Everything still in English is listed in `notes/needs-japanese.md` (166 unique strings after the last build).

### Accessibility, performance, forms
- Text and buttons use `#B33E14`. The previous `#C94A1C` was 4.3:1 on the cream background.
- Closed mobile drawer is `inert`, so its links are not focusable while hidden.
- The hero pause button is outside the tablist (a pause button inside `role="tablist"` failed the ARIA children check).
- Visuals that have a 640px WebP get `srcset`. `hal.webp` and `sonalika.webp` are under 30 KB. The master logo SVG is still about 35 KB; SVGO saved under 1% and a harder cut would risk the mark.
- `contact.php` and `apply.php` still post only to `info@thinkinnovnexgen.co.jp`, with honeypot, time trap, and a small rate limit. Names and the visitor email are stripped of CR/LF before `Reply-To`. CV uploads must be an allowed MIME type (pdf/doc/docx, including the zip/octet-stream cases docx often reports). GitHub Pages still falls back to a pre-filled `mailto:` and does not claim the message was sent.

## Lighthouse 12 (local `http://127.0.0.1:8810`, headless Chrome)

Scores are performance / accessibility / best practices / SEO.

| Page | Form | Scores |
|---|---|---|
| Home | mobile | 96 / 100 / 100 / 100 |
| Home | desktop | 100 / 100 / 100 / 100 |
| About | mobile | 97 / 100 / 100 / 100 |
| Contact | mobile | 99 / 100 / 100 / 100 |
| Industries | desktop | 100 / 100 / 100 / 100 |
| Japanese home | mobile | 96 / 100 / 100 / 100 |

Not every URL was run. The failures that the first home-mobile run found (contrast, hidden drawer focus, tablist children) are fixed and the rerun is clean.

## Second-pass notes

After the first screenshots, a second look found: the hero scrim was hiding the photograph, the Japanese headline was splitting 「ソリューション」, orange links failed AA on cream, the pause control was an illegal tablist child, and the closed drawer was still in the tab order. Those are fixed in this pass. The ribbon-cutting photo, logo contrast, mobile hero, service columns, industry cards, contact form, and 404 actions all read clearly at both widths.

## Open questions for the client meeting

Do not guess these. The site keeps the current text until someone decides.

1. **Legal name.** Config uses “ThinkInnov-NexGen Technologies Pvt Ltd”. The company profile table still says “ThinkInnov-NexGen Corporation”, which is what staging printed. Business cards have also been described as “ThinkInnov Solution Technologies Private Limited”. Which string is the registered name, and should the profile table match the footer?
2. **Email domain.** The site uses `info@thinkinnovnexgen.co.jp` (new cards). Staging used `info@thinkinnovnexgen.com`. Confirm the mailbox that should receive the PHP forms.
3. **Siemens partner wording.** The badge says “Siemens Solution Partner”. The About partnership panel says Siemens Certified “Expert Partner - PLM”. Those phrases are both in the source and they are not the same claim. Which one may be published?
4. **About positioning.** The About page still describes a next-generation IT services company (cloud, IoT, AI, since 2014). The home page leads with PLM and digital transformation. Both come from staging. Which story should lead?
5. **Two CEO titles.** The profile lists Rajeshkumar Sankarlingam as President/CEO and Bala Sabari D as Director - CEO. Leadership cards say “CEO & Founder” and “Director - CEO”. Confirm the titles before they are translated or printed on a Japanese legal line.
6. **Founding year and footer year.** About still says customers have been served since 2014 (that sentence is in the Japanese source too). The footer is `© 2026 ThinkInnov-NexGen` only. Staging had `© 2014 - 2026 … Corporation`. Should 2014 return, and is 2026 the copyright year they want?
7. **Japanese translation owner.** UI labels and the staging Japanese sentences are live under `/ja/`. Long product, service, PLM, industry, job, and testimonial-adjacent copy is still English (see `notes/needs-japanese.md`). Who signs off a full Japanese body, and may we keep English in place until then?
8. **Ohmium and Lectrix.** Testimonials name Ohmium and “KISLAY PANKAJ, CEO - LECTRIX”, kept verbatim, including “Thinkin(g) No(w)”. There are no Ohmium or Lectrix logos in the customer set. Confirm we should not add logos, and that those quotes may stay on the public site.
