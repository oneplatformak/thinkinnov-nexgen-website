# ThinkInnov-NexGen website (redesign, pre-launch)

Regenerated static website for the ThinkInnov-NexGen joint venture (final domain: thinkinnovnexgen.co.jp). Not deployed to production.

- `docs/` – deployable site root (upload contents to cPanel `public_html`; also served by GitHub Pages for preview). Forms post to `contact.php` / `apply.php`, which only work on PHP hosting (on Pages they fall back to a pre-filled email link).
- `improved-src/` – Node generator (`node build.js` writes straight into `docs/`; edit `config.js` / `content.js` / `i18n.js`), `COVERAGE.md`, `CHANGELOG.md`, link/H1 checker.
- `notes/` – `BUILD_BRIEF.md` (rules: no invented facts, 100% coverage), `INVENTORY.md` (crawl inventory of staging), generated-visual sources, image contact sheet.
- `staging-original/` – untouched mirror of the staging site https://www.nexware-global.com/thinkinnov-nexgen/ (content source of truth).
- `screenshots-before/`, `screenshots-after/` – full-page screenshots at 390px and 1440px.

English pages are at the site root. Japanese pages (existing staging copy plus UI labels) are under `ja/`, with `hreflang` alternates. Body copy that has no Japanese source stays English; see `notes/needs-japanese.md`.
