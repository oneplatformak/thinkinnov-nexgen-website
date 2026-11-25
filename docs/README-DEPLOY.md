# Deploying the ThinkInnov-NexGen site (cPanel, Apache + PHP)

This folder is the finished site. **It has not been deployed.** Nothing in this repository touches the production host, DNS or mailboxes; the steps below are for whoever does the launch.

## Before launch

Read `notes/REVIEW.md` in the repository first. It lists the questions only the owner can answer (legal name, email domain, whether the 18 roles are open, permission for the customer logos and photographs, native Japanese review, legal review of the privacy notice). The site should not go live until the owner has seen them.

**The one that stops the forms working: the mailbox.** The pages and both forms use `info@thinkinnovnexgen.co.jp`. The original site, in both the crawl and the developer's official files, shows only `info@thinkinnovnexgen.com`. If the `.co.jp` mailbox does not exist, every enquiry and application is lost without anyone noticing. Confirm the address, and create the mailbox, before launch (section 3).

## 1. Requirements on the host

- Apache with `mod_rewrite`, `mod_headers`, `mod_expires`, `mod_deflate` (standard on cPanel).
- **Compression must be on.** `.htaccess` asks for it, but inside `<IfModule mod_deflate.c>`: if the host does not have that module, the site still works and is simply sent uncompressed, with no error. The loading times measured for this site were measured with compression on; without it the phone results miss the target. Check it after upload (section 6).
- PHP 8.0 or newer with the `fileinfo` extension (standard). `mbstring` is used when present and not required.
- PHP `upload_max_filesize` of at least `5M` and `post_max_size` of at least `8M`, or CVs near the 5 MB limit will be refused before the handler sees them.
- A working `mail()` (cPanel default) and a sender address on the domain.

## 2. Upload

1. Upload the **contents** of this folder to the document root (`public_html`), keeping the folder structure. `index.html`, `.htaccess`, `contact.php`, `apply.php`, `inc/`, `assets/`, `ja/`, `careers/` and `products/` must sit at the root.
2. Make sure `.htaccess` was uploaded (turn on “show hidden files” in File Manager).
3. `README-DEPLOY.md` does not need to be uploaded.

## 3. Mail

Both forms send to one fixed address, set in one place:

```text
inc/form-lib.php   TIN_RECIPIENT = info@thinkinnovnexgen.co.jp
                   TIN_FROM      = noreply@thinkinnovnexgen.co.jp
```

- Nothing a visitor submits can change the recipient or add mail headers.
- `TIN_FROM` must be an address on the site's own domain so that SPF and DKIM pass. Create the mailbox or alias in cPanel if it does not exist.
- The address shown on the pages comes from `improved-src/config.js`. If the recipient changes, change both and rebuild.
- The original site used `info@thinkinnovnexgen.com`; this site uses `.co.jp`. Which is correct is an open question for the owner, and the forms deliver nowhere if the `.co.jp` mailbox does not exist.

## 4. What the forms do

| | Contact (`contact.php`) | Application (`apply.php`) |
| --- | --- | --- |
| Accepts | Enquiry type, optional topic, name, company, email, phone, message, consent, and the business need, industry and company size carried from the finder, an industry or a business-size link | Role, the fields of the original form, consent, one CV file. Gender, current CTC, expected CTC and notice period are optional and are mailed as "not provided" when left blank |
| Whitelists | Type, topic, need, industry and size must match `inc/enquiry-options.php` (written by the build from the site's content) | Role must be one of the 18 listed; only the listed fields are read |
| File | none | PDF, DOC or DOCX, 5 MB or smaller; checked by extension, detected type and file signature, and a DOCX must also contain the parts every Word file has, so a zip of other files renamed `.docx` is refused; attached under a generated name. The file is not scanned for viruses or macros: open CVs with the same care as any e-mail attachment |
| Abuse controls | Hidden honeypot field, 3-second minimum, 8 submissions per 10 minutes per sender | Same, 6 per 10 minutes |
| Storage | None. The rate limit keeps a count per one-way hash of the IP address in the server's temporary folder | Same; the uploaded file is not kept after the mail is handed over |

The page shows “sent” only when the server answers that the mail was handed to the mail system. Any other answer shows an error, with the company's address as an e-mail link where the message asks the visitor to write directly, and if there is no working handler at all (GitHub Pages) the page offers a pre-filled email link instead. With scripts switched off the forms still work and the server returns a small result page in the visitor's language.

**Test after upload** with a real submission of each form, in both languages, and check that the message and the CV arrive. This could not be tested before launch because it needs the real mail system; locally the handlers were tested against a mail program that writes to a file (`improved-src/tools/test-forms.sh`, 62 checks).

## 5. What `.htaccess` does

- Forces HTTPS.
- Sends the old single-page URLs (`page.html?page=…`, `jobdetails.html?id=…`, `application.html?id=…`) to the new pages with 301 redirects. The three stub files do the same with a script on hosts that ignore `.htaccess`.
- Serves `404.html` for unknown addresses.
- Refuses direct requests for `inc/` and for dotfiles, except `/.well-known/`, which certificate renewal uses.
- Sets security headers, including a Content-Security-Policy that allows only the site's own files. If analytics or any other third-party script is added later, this header must be changed or the script will be blocked.
- Compresses HTML, CSS, JavaScript, JSON, XML and SVG where `mod_deflate` is present, and caches CSS, JS and fonts for a year (their URLs change when they change) and images for 30 days.

`.htaccess` was written for Apache 2.4 and has **not** been run on a real Apache server here: no Apache was available and no host may be touched before launch. **Every rule in it is untested until the site is uploaded**, the 301 redirects from the old addresses in particular. `Strict-Transport-Security` is deliberately not set; add it once HTTPS is confirmed to be permanent.

## 6. Check after upload

None of this could be checked before launch. Replace the domain if it differs.

**Compression.** Performance depends on it.

```bash
curl -s -o /dev/null -D - -H "Accept-Encoding: gzip, br" https://thinkinnovnexgen.co.jp/ | grep -i "content-encoding"
curl -s -o /dev/null -D - -H "Accept-Encoding: gzip, br" https://thinkinnovnexgen.co.jp/assets/styles.css | grep -i "content-encoding"
curl -s -o /dev/null -D - -H "Accept-Encoding: gzip, br" https://thinkinnovnexgen.co.jp/assets/site.js | grep -i "content-encoding"
```

Each must print `content-encoding: gzip` (or `br`). If a line prints nothing, that file is being sent uncompressed. The same can be seen in a browser: developer tools, Network, select the page, Response Headers. If compression is off, ask the host to enable `mod_deflate` (or Brotli) for the account; some cPanel installations also offer this under Software, “Optimize Website”.

What it changes, measured here with Lighthouse 12 on a local server (laboratory figures with the phone preset and simulated throttling, not real visitors; `notes/test-output/lighthouse.txt`):

| | Home page HTML | `styles.css` | `site.js` | Performance score | Largest Contentful Paint |
| --- | --- | --- | --- | --- | --- |
| Compression on (22 phone-preset runs, 11 pages in both languages) | 14 KB | 15 KB | 10 KB | 99 to 100 | 1.7 to 2.1 s |
| Compression off (10 phone-preset runs, 5 pages in both languages) | 84 KB | 83 KB | 33 KB | 92 to 98 | 2.4 to 3.2 s, over the 2.5 s target on 8 of the 10 |

The independent verifier's own runs gave 1.6 to 1.8 s with compression and 2.2 to 2.8 s without. The server used here for the uncompressed runs also opens a new connection for every file, which Apache does not, so the real difference may be smaller; it will not be nothing. The preview on GitHub Pages compresses by itself, so it does not show whether the real host will.

**Redirects from the old addresses.** Each should answer `301` with the new address in `Location`:

```bash
curl -s -o /dev/null -D - "https://thinkinnovnexgen.co.jp/page.html?page=about" | grep -i -E "^HTTP|^location"
curl -s -o /dev/null -D - "https://thinkinnovnexgen.co.jp/page.html?page=products" | grep -i -E "^HTTP|^location"
curl -s -o /dev/null -D - "https://thinkinnovnexgen.co.jp/jobdetails.html?id=1" | grep -i -E "^HTTP|^location"
curl -s -o /dev/null -D - "https://thinkinnovnexgen.co.jp/application.html?id=1" | grep -i -E "^HTTP|^location"
```

If they answer `200` instead, the rules are not being applied (`mod_rewrite` off, or `.htaccess` not uploaded or not allowed). The three stub pages then still send visitors on, but only with scripts on: with scripts off, `page.html?page=about` shows a page that links to the home page rather than the About page. That is why the 301 rules matter.

**The rest.**

- `http://` goes to `https://`.
- An unknown address returns status `404` and shows the site's own page.
- `https://thinkinnovnexgen.co.jp/inc/form-lib.php` and `/.htaccess` are refused (`403`); a file placed under `/.well-known/` is served.
- The security headers are present: `curl -s -o /dev/null -D - https://thinkinnovnexgen.co.jp/ | grep -i -E "content-security-policy|x-content-type|referrer-policy|x-frame"`.
- Both forms, in both languages, with a real submission each (section 4).

## 7. Search

`search.html` reads `assets/search-en.json` or `assets/search-ja.json`, which the build writes. Nothing is sent to the server and there is nothing to configure. If a page is added or renamed, rebuild so that the index follows.

## 8. GitHub Pages preview

Pages serves this folder as static files. `.htaccess` and PHP are ignored there: the forms use the email-link fallback and old URLs are handled by the stub pages (`page.html`, `jobdetails.html`, `application.html`).

## 9. Rebuilding

```bash
cd improved-src
npm ci
node build.js
python3 check-site.py
python3 tools/check-source.py
```

Company details are in `improved-src/config.js`; all text is in `improved-src/content/`; Japanese is in `improved-src/i18n/`. See the README at the top of the repository.
