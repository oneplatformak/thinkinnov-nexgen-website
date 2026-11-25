# Deploy ThinkInnov-NexGen site (cPanel `public_html`)

This folder is the finished site. Upload its **contents** (not the parent folder name) into your Hostinger/cPanel `public_html` (or the domain’s document root).

## 1. Upload

1. Zip the contents of `improved/` or use File Manager / FTP / Git.
2. Place files so that `index.html`, `.htaccess`, `contact.php`, and `assets/` sit at the web root.
3. Confirm `.htaccess` uploaded (enable “show hidden files” in File Manager).

## 2. PHP mail recipient

Both handlers send to:

```text
info@thinkinnovnexgen.co.jp
```

Change the `RECIPIENT` constant at the top of:

- `contact.php`
- `apply.php`

`FROM_ADDRESS` should stay on your domain (`noreply@thinkinnovnexgen.co.jp`) so SPF/DKIM align. Create that mailbox or alias in cPanel if needed, or point it at an address allowed by your host’s mail policy.

## 3. Forms

- Contact: posts to `contact.php` (JSON).
- Apply: posts to `apply.php` with CV upload (PDF/DOC/DOCX ≤ 5 MB).
- On GitHub Pages (no PHP), the JS shows a mailto fallback and never claims “sent” without a JSON success response.

## 4. HTTPS & old URLs

`.htaccess` forces HTTPS, maps old `page.html?page=…` URLs to the new HTML pages, sends unknown paths to `404.html`, enables compression, asset caching, and basic security headers.

Stub files `page.html`, `jobdetails.html`, and `application.html` also redirect via JS/meta for GitHub Pages.

## 5. Legal name / contact (single place to edit)

Site generator config: `../improved-src/config.js` — then re-run `node build.js` from `improved-src/`. For a live-only hotfix without rebuilding, search-replace the constants already baked into the HTML footer and PHP files.

## 6. GitHub Pages preview

Serve the folder as a static site. Forms will use the mailto fallback. `.htaccess` is ignored on GitHub Pages; use the HTML redirect stubs for old links.

## 7. Optional rebuild

```bash
cd improved-src
node build.js
```

Assets (WebP, fonts, logo) are already under `improved/assets/`.
