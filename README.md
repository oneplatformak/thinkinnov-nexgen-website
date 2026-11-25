# ThinkInnov-NexGen website (redesign, pre-launch)

Regenerated static website for the ThinkInnov-NexGen joint venture (final domain: thinkinnovnexgen.co.jp). Not deployed to production.

- `docs/` – deployable site root (upload contents to cPanel `public_html`; also served by GitHub Pages for preview). Forms post to `contact.php` / `apply.php`, which only work on PHP hosting (on Pages they fall back to a pre-filled email link).
- `improved-src/` – Node generator (`node build.js` writes the site; edit `config.js` / `content.js`), `COVERAGE.md`, `CHANGELOG.md`, link/H1 checker.
- `notes/` – `BUILD_BRIEF.md` (rules: no invented facts, 100% coverage), `INVENTORY.md` (crawl inventory of staging), generated-visual sources, image contact sheet.
- `staging-original/` – untouched mirror of the staging site https://www.nexware-global.com/thinkinnov-nexgen/ (content source of truth).
- `screenshots-before/`, `screenshots-after/` – full-page screenshots at 390px and 1440px.

Note: `improved-src/build.js` writes to `../improved`; in this repo the site lives in `docs/`, so run the build with the output path adjusted (or symlink `improved -> docs`).
