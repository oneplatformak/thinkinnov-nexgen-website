# Deploying the ThinkInnov-NexGen site (cPanel, Apache + PHP)

This folder is the finished site. **It has not been deployed.** Nothing in this repository touches the production host, DNS or mailboxes; the steps below are for whoever does the launch.

## Before launch

Read `notes/REVIEW.md` in the repository first. It lists the questions only the owner can answer (legal name, email domain, Siemens partner wording, whether the 18 roles are open, native Japanese review, legal review of the privacy notice). The site should not go live until the owner has seen them.

## 1. Requirements on the host

- Apache with `mod_rewrite`, `mod_headers`, `mod_expires`, `mod_deflate` (standard on cPanel).
- PHP 8.0 or newer with the `fileinfo` extension (standard). `mbstring` is used when present and not required.
- PHP `upload_max_filesize` of at least `5M` and `post_max_size` of at least `8M`, or CVs near the 5 MB limit will be refused before the handler sees them.
- A working `mail()` (cPanel default) and a sender address on the domain.

## 2. Upload

1. Upload the **contents** of this folder to the document root (`public_html`), keeping the folder structure. `index.html`, `.htaccess`, `contact.php`, `apply.php`, `inc/`, `assets/`, `ja/` and `careers/` must sit at the root.
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
- Staging used `info@thinkinnovnexgen.com`; this site uses `.co.jp`. Which is correct is an open question for the owner.

## 4. What the forms do

| | Contact (`contact.php`) | Application (`apply.php`) |
| --- | --- | --- |
| Accepts | Enquiry type, optional topic, name, company, email, phone, message, consent, and the business need, industry and company size passed from the finder | Role, the 15 fields of the original form, consent, one CV file |
| Whitelists | Type, topic, need, industry and size must match `inc/enquiry-options.php` (written by the build from the site's content) | Role must be one of the 18 listed; only the listed fields are read |
| File | none | PDF, DOC or DOCX, 5 MB or smaller; checked by extension, detected type and file signature; attached under a generated name |
| Abuse controls | Hidden honeypot field, 3-second minimum, 8 submissions per 10 minutes per sender | Same, 6 per 10 minutes |
| Storage | None. The rate limit keeps a count per one-way hash of the IP address in the server's temporary folder | Same; the uploaded file is not kept after the mail is handed over |

The page shows “sent” only when the server answers that the mail was handed to the mail system. Any other answer shows an error, and if there is no working handler at all (GitHub Pages) the page offers a pre-filled email link instead. With scripts switched off the forms still work and the server returns a small result page in the visitor's language.

**Test after upload** with a real submission of each form, in both languages, and check that the message and the CV arrive. This could not be tested before launch because it needs the real mail system; locally the handlers were tested against a mail program that writes to a file (`improved-src/tools/test-forms.sh`, 54 checks).

## 5. What `.htaccess` does

- Forces HTTPS.
- Sends the old single-page URLs (`page.html?page=…`, `jobdetails.html?id=…`, `application.html?id=…`) to the new pages with 301 redirects. The three stub files do the same with a script on hosts that ignore `.htaccess`.
- Serves `404.html` for unknown addresses.
- Refuses direct requests for `inc/` and for dotfiles.
- Sets security headers, including a Content-Security-Policy that allows only the site's own files. If analytics or any other third-party script is added later, this header must be changed or the script will be blocked.
- Compresses text and caches CSS, JS and fonts for a year (their URLs change when they change) and images for 30 days.

`.htaccess` was written for Apache 2.4 and has **not** been run on a real Apache server here. The redirects and the 404 page should be checked after upload. `Strict-Transport-Security` is deliberately not set; add it once HTTPS is confirmed to be permanent.

## 6. GitHub Pages preview

Pages serves this folder as static files. `.htaccess` and PHP are ignored there: the forms use the email-link fallback and old URLs are handled by the stub pages.

## 7. Rebuilding

```bash
cd improved-src
npm ci
node build.js
python3 check-site.py
```

Company details are in `improved-src/config.js`; all text is in `improved-src/content/`; Japanese is in `improved-src/i18n/`. See the README at the top of the repository.
