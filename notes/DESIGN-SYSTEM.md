# Design system

The source of truth is the CSS in `improved-src/styles/`. This page describes what is there so that new pages look like the existing ones.

## Idea

Paper and ink. A warm off-white page, near-black text, hairline rules, square corners, and one accent colour taken from the orange in the company logo. A few dark sections (the lifecycle diagram, the closing invitation) for contrast. No gradients, glow, glass effects, floating cards or stock illustrations. The intent is a document a Japanese manufacturer's engineering or purchasing team could read in a meeting room: dense where it needs to be, calm everywhere else.

## Tokens (`01-tokens.css`)

| Group | Tokens | Use |
| --- | --- | --- |
| Surfaces | `--paper` #fbfaf7, `--paper-2` #f4f1ea, `--paper-3` #ebe7dd | Page, tinted sections, marked table cells |
| Text | `--ink` #14181c, `--ink-2` #3b4249, `--ink-3` #5a626a | Headings and body, secondary text, captions |
| Rules | `--rule` #d9d4c9, `--rule-strong` #b5aea0 | Hairlines between rows; box outlines |
| Accent | `--accent` #b33e14, `--accent-deep` #8f300e, `--accent-bright` #e05426 | Links, kickers, primary buttons, hover |
| Dark sections | `--dark` #10151a, `--dark-2`, `--dark-rule`, `--on-dark`, `--on-dark-2`, `--accent-on-dark` | Lifecycle diagram, closing band, footer |
| Status | `--ok` #1e6b43, `--error` #a3261c | Form messages |
| Type sizes | `--t-xs` 0.75rem to `--t-3xl` (fluid, up to 4.25rem) | Eight steps; the five largest scale with the viewport |
| Spacing | `--s-1` 0.25rem to `--s-9` 6rem; `--section` (fluid 4–8rem) | Nine steps; section padding |
| Layout | `--container` 77.5rem (88rem from 1800px), `--gutter` (fluid), `--header-h` 4.5rem, `--radius` 2px | |
| Motion | `--ease` | One easing curve |

## Type

- **Display**: Manrope (self-hosted variable WOFF2), used at weights 600–800 for headings, buttons, kickers and labels.
- **Body**: Inter (self-hosted variable WOFF2).
- **Japanese**: no web font is downloaded. The stack is Hiragino Sans, Yu Gothic UI, Yu Gothic, Meiryo, Noto Sans JP. Line breaks follow phrase boundaries (BudouX at build time), so a heading does not break inside a word. Letter-spacing on uppercase labels is reduced for Japanese.
- Headings use tight tracking and `text-wrap: balance`; body lines are held to a readable measure.

## Components (`03-components.css`, `20-pages.css`, `24-product.css`)

| Component | Class | Notes |
| --- | --- | --- |
| Section head | `.section-head` with `.marker` (number + kicker), `h2`, `.section-text` | Every section starts this way |
| Split layout | `.split`, `.split-even`, `.split-photo`, `.split-middle` | Heading column beside content; stacks below 900px |
| Buttons | `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-sm` | Minimum height 3rem |
| Arrow link | `.link-arrow` | The standard "next step" link |
| Related list | `.related`, `.related-cols` | Ruled rows with an arrow |
| Facts | `dl.facts` | Label and value rows: product facts, company profile |
| Product tile | `.pmark` | Two or three letters in a square. Not a Siemens logo |
| Note | `.note`, `.page-note` | Left-ruled aside for sources and caveats |
| Figure | `.fig`, `.fig-concept` | SVG diagram with a caption; conceptual diagrams carry the label "Conceptual diagram" |
| Stage strip and stage table | `.stage-strip`, `.stage-map` in `.table-scroll` | Nine lifecycle stages; tables scroll inside their own box on phones |
| Page hero | `.page-hero` with breadcrumbs and optional aside | Every inner page |
| CTA band | `.cta-band` | Closing invitation |
| Forms | `.field`, `.field-label`, `.field-req` / `.field-opt`, `.field-error`, `.form-status` | Every field is marked Required or Optional in words |
| Photo viewer | `dialog.lightbox` | Gallery and industry images |

## Layout rules

- One `h1` per page; sections are numbered in order.
- Main breakpoints at 700, 900, 1000 and 1100px, with larger type and a wider container from 1800 and 2400px. Checked at 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920 and 2560px on every page.
- Nothing depends on hover. Menus open on click and keyboard as well.
- Text is never placed in an image by this build. (The eleven industry images inherited from the original site do contain text; see `ASSET-REGISTER.md`.)

## Imagery

- Photographs are the company's own (gallery, leadership, team). They are resized and cropped only.
- Diagrams are SVG drawn in `lib/diagrams.js` from words that are in the source.
- This rebuild adds no generated or stock image, and every generated image from its earlier passes has been deleted. The eleven industry images inherited from the original site are of unknown origin (`ASSET-REGISTER.md` §3).

## Motion (`90-motion.css`)

Section heads fade up once as they enter the viewport; panels fade when they change. All of it is off under `prefers-reduced-motion`, and content is visible without scripts.

## Accessibility built into the components

Visible focus ring (2px outline) on every interactive element; skip link; landmarks with distinct names; form errors tied to their fields and announced; tabs and dialogs follow the usual keyboard patterns. See `accessibility.html` for what was and was not tested.
