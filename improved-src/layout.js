const config = require("./config");
const icons = require("./icons");

let buildLang = "en";

function setBuildLang(lang) {
  buildLang = lang === "ja" ? "ja" : "en";
}

function isRootFile(file) {
  return file.startsWith("assets/") || /\.php(\?|$)/.test(file);
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function asset(file, depth) {
  const extra = isRootFile(file) && buildLang === "ja" ? 1 : 0;
  const n = (depth || 0) + extra;
  return (n ? "../".repeat(n) : "") + file;
}

function publicUrl(pagePath, lang) {
  const root = config.baseUrl.replace(/\/$/, "");
  if (lang === "ja") return pagePath ? `${root}/ja/${pagePath}` : `${root}/ja/`;
  return pagePath ? `${root}/${pagePath}` : `${root}/`;
}

function langHref(pagePath, depth, target) {
  const same = pagePath || "index.html";
  if (buildLang === "en") {
    if (target === "ja") {
      const ja = pagePath ? `ja/${pagePath}` : "ja/index.html";
      return (depth ? "../".repeat(depth) : "") + ja;
    }
    return (depth ? "../".repeat(depth) : "") + same;
  }
  if (target === "ja") return (depth ? "../".repeat(depth) : "") + same;
  return "../".repeat((depth || 0) + 1) + same;
}

function head({
  title,
  description,
  path = "",
  depth = 0,
  ogType = "website",
  extra = "",
}) {
  const lang = buildLang === "ja" ? "ja" : "en";
  const canonical = publicUrl(path, lang);
  const enUrl = publicUrl(path, "en");
  const jaUrl = publicUrl(path, "ja");
  const a = (p) => asset(p, depth);
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(canonical)}">
  <link rel="alternate" hreflang="en" href="${esc(enUrl)}">
  <link rel="alternate" hreflang="ja" href="${esc(jaUrl)}">
  <link rel="alternate" hreflang="x-default" href="${esc(enUrl)}">
  <meta name="theme-color" content="${config.themeColor}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:locale" content="${lang === "ja" ? "ja_JP" : "en_US"}">
  <meta property="og:locale:alternate" content="${lang === "ja" ? "en_US" : "ja_JP"}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${config.baseUrl}/${config.ogImage}">
  <meta property="og:site_name" content="${esc(config.siteName)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${config.baseUrl}/${config.ogImage}">
  <link rel="icon" href="${a("assets/favicon.ico")}" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="${a("assets/img/favicon-32.png")}">
  <link rel="apple-touch-icon" sizes="180x180" href="${a("assets/img/apple-touch-icon.png")}">
  <link rel="stylesheet" href="${a("assets/fonts.css")}">
  <link rel="stylesheet" href="${a("assets/styles.css")}">
  ${extra}
</head>`;
}

function orgJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.legalName,
    url: config.baseUrl + "/",
    logo: `${config.baseUrl}/${config.logoPath}`,
    email: config.email,
    telephone: config.phoneTel,
    address: {
      "@type": "PostalAddress",
      streetAddress: "15th Floor, Harumi Prime Square, 2-1-40 Harumi",
      addressLocality: "Chuo-ku, Tokyo",
      postalCode: "104-0053",
      addressCountry: "JP",
    },
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function langSwitch(pagePath, depth) {
  const enCurrent = buildLang === "en" ? ' aria-current="page"' : "";
  const jaCurrent = buildLang === "ja" ? ' aria-current="page"' : "";
  return `<nav class="lang-switch" aria-label="Language">
      <a href="${langHref(pagePath, depth, "en")}" lang="en" hreflang="en"${enCurrent}>EN</a>
      <span aria-hidden="true">/</span>
      <a href="${langHref(pagePath, depth, "ja")}" lang="ja" hreflang="ja"${jaCurrent}>日本語</a>
    </nav>`;
}

function header(active = "", depth = 0, pagePath = "") {
  const a = (p) => asset(p, depth);
  const is = (id) => (active === id ? " is-active" : "");
  const langs = langSwitch(pagePath, depth);
  return `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" data-header>
    <div class="nav-shell">
      <a class="brand" href="${a("index.html")}" aria-label="${esc(config.siteName)} home">
        <img src="${a(config.logoPath)}" width="200" height="48" alt="${esc(config.siteName)}">
      </a>
      <nav class="main-nav" aria-label="Main">
        <div class="nav-item has-dropdown">
          <button type="button" class="nav-link" aria-expanded="false" aria-haspopup="true">Company ${icons.chevron}</button>
          <div class="dropdown" role="menu">
            <a role="menuitem" class="${is("about").trim()}" href="${a("about.html")}">About Us</a>
            <a role="menuitem" class="${is("behind").trim()}" href="${a("behind-the-brand.html")}">Behind the Brand</a>
            <a role="menuitem" class="${is("careers").trim()}" href="${a("careers.html")}">Careers</a>
          </div>
        </div>
        <div class="nav-item has-dropdown">
          <button type="button" class="nav-link" aria-expanded="false" aria-haspopup="true">Offerings ${icons.chevron}</button>
          <div class="dropdown" role="menu">
            <a role="menuitem" class="${is("plm").trim()}" href="${a("plm.html")}">PLM For Everyone</a>
            <a role="menuitem" class="${is("services").trim()}" href="${a("services.html")}">Services</a>
            <a role="menuitem" class="${is("digital").trim()}" href="${a("digital-transformation.html")}">Digital Transformation</a>
            <a role="menuitem" class="${is("solutions").trim()}" href="${a("solutions.html")}">Solutions</a>
            <a role="menuitem" class="${is("products").trim()}" href="${a("products.html")}">Products</a>
          </div>
        </div>
        <a class="nav-link${is("industries")}" href="${a("industries.html")}">Industries</a>
      </nav>
      <div class="nav-actions">
        ${langs}
        <a class="btn btn-primary nav-cta" href="${a("contact.html")}">Contact us</a>
      </div>
      <div class="lang-mobile">${langs}</div>
      <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-drawer">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
  <div class="backdrop" data-backdrop hidden></div>
  <aside class="mobile-drawer" id="mobile-drawer" aria-hidden="true" inert data-drawer>
    <div class="drawer-top">
      <img src="${a(config.logoPath)}" width="160" height="38" alt="${esc(config.siteName)}">
      <button class="drawer-close" type="button" aria-label="Close menu">${icons.close}</button>
    </div>
    <nav class="drawer-nav" aria-label="Mobile">
      <details class="drawer-acc">
        <summary>Company</summary>
        <a href="${a("about.html")}">About Us</a>
        <a href="${a("behind-the-brand.html")}">Behind the Brand</a>
        <a href="${a("careers.html")}">Careers</a>
      </details>
      <details class="drawer-acc">
        <summary>Offerings</summary>
        <a href="${a("plm.html")}">PLM For Everyone</a>
        <a href="${a("services.html")}">Services</a>
        <a href="${a("digital-transformation.html")}">Digital Transformation</a>
        <a href="${a("solutions.html")}">Solutions</a>
        <a href="${a("products.html")}">Products</a>
      </details>
      <a href="${a("industries.html")}">Industries</a>
      ${langs}
      <a class="btn btn-primary drawer-cta" href="${a("contact.html")}">Contact us</a>
    </nav>
  </aside>`;
}

function footer(depth = 0) {
  const a = (p) => asset(p, depth);
  return `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <span class="footer-logo-plate"><img class="footer-logo" src="${a(config.logoPath)}" width="180" height="43" alt="${esc(config.siteName)}"></span>
        <p>${esc(config.tagline)}</p>
      </div>
      <div>
        <h2 class="footer-heading">Quick Links</h2>
        <ul>
          <li><a href="${a("about.html")}">About Us</a></li>
          <li><a href="${a("plm.html")}">PLM For Everyone</a></li>
          <li><a href="${a("services.html")}">Services</a></li>
          <li><a href="${a("digital-transformation.html")}">Digital Transformation</a></li>
          <li><a href="${a("products.html")}">Products</a></li>
        </ul>
      </div>
      <div>
        <h2 class="footer-heading">Explore</h2>
        <ul>
          <li><a href="${a("solutions.html")}">Solutions</a></li>
          <li><a href="${a("industries.html")}">Industries</a></li>
          <li><a href="${a("behind-the-brand.html")}">Behind the Brand</a></li>
          <li><a href="${a("careers.html")}">Careers</a></li>
          <li><a href="${a("contact.html")}">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <h2 class="footer-heading">Locate Us</h2>
        <p>${esc(config.legalName)}<br>${esc(config.addressSingle)}</p>
        <ul class="footer-contact">
          <li><a href="mailto:${config.email}">${icons.mail}<span>${esc(config.email)}</span></a></li>
          <li><a href="tel:${config.phoneTel}">${icons.phone}<span>${esc(config.phoneDisplay)}</span></a></li>
          <li><a href="${esc(config.mapUrl)}" target="_blank" rel="noopener noreferrer">${icons.map}<span>View map</span></a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>${esc(config.copyright)}</span>
      <span>${esc(config.siteName)}. All rights reserved.</span>
    </div>
  </footer>
  <div class="lightbox" data-lightbox hidden>
    <button type="button" class="lightbox-close" aria-label="Close lightbox">${icons.close}</button>
    <button type="button" class="lightbox-prev" aria-label="Previous image">${icons.chevron}</button>
    <figure class="lightbox-figure"><img alt="" data-lightbox-img><figcaption data-lightbox-cap></figcaption></figure>
    <button type="button" class="lightbox-next" aria-label="Next image">${icons.chevron}</button>
  </div>
  <script src="${a("assets/site.js")}" defer></script>
</body>
</html>`;
}

function pageShell({ title, description, path, depth = 0, active, body, jsonLd = "", heroTransparent = false }) {
  const langClass = buildLang === "ja" ? " lang-ja" : "";
  return `${head({ title, description, path, depth, extra: jsonLd })}
<body class="${heroTransparent ? "has-hero" : "page"}${langClass}">
  <script>document.documentElement.classList.add("js");</script>
  ${header(active, depth, path)}
  <main id="main">${body}</main>
  ${footer(depth)}`;
}

function pageHero({ breadcrumb, kicker, h1, intro, depth = 0 }) {
  const a = (p) => asset(p, depth);
  const crumbs = breadcrumb
    .map((c, i) =>
      i < breadcrumb.length - 1
        ? `<a href="${a(c.href)}">${esc(c.label)}</a><span aria-hidden="true">/</span>`
        : `<span aria-current="page">${esc(c.label)}</span>`
    )
    .join("");
  return `
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">${crumbs}</nav>
      <p class="eyebrow">${esc(kicker)}</p>
      <h1>${esc(h1)}</h1>
      ${intro ? `<p class="page-intro">${esc(intro)}</p>` : ""}
    </div>
  </section>`;
}

function sectionNav(items) {
  return `<nav class="section-nav" aria-label="On this page"><ul>${items
    .map((i) => `<li><a href="#${i.id}">${esc(i.label)}</a></li>`)
    .join("")}</ul></nav>`;
}

function ctaBand(depth = 0, opts = {}) {
  const a = (p) => asset(p, depth);
  return `
  <section class="cta-band">
    <div class="container cta-band-inner">
      <div>
        <p class="eyebrow">${esc(opts.eyebrow || "Next step")}</p>
        <h2>${esc(opts.title || "Ready to discuss your PLM or digital transformation goals?")}</h2>
        <p>${esc(opts.text || "Talk with our Tokyo and India teams about consulting, implementation and adoption.")}</p>
      </div>
      <div class="cta-actions">
        <a class="btn btn-primary" href="${a(opts.primaryHref || "contact.html")}">${esc(opts.primary || "Contact us")}</a>
        <a class="btn btn-ghost" href="${a(opts.secondaryHref || "careers.html")}">${esc(opts.secondary || "View careers")}</a>
      </div>
    </div>
  </section>`;
}

function contactFormFields(prefix = "contact") {
  return `
    <input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">
    <input type="hidden" name="form_started" value="">
    <div class="form-grid">
      <label class="field">Name *
        <input required type="text" name="name" autocomplete="name" id="${prefix}-name">
      </label>
      <label class="field">Email *
        <input required type="email" name="email" autocomplete="email" id="${prefix}-email">
      </label>
      <label class="field">Company name
        <input type="text" name="company" autocomplete="organization" id="${prefix}-company">
      </label>
      <label class="field">Phone
        <input type="tel" name="phone" autocomplete="tel" id="${prefix}-phone">
      </label>
      <label class="field span-all">Message *
        <textarea required name="message" rows="5" id="${prefix}-message"></textarea>
      </label>
      <label class="field check span-all">
        <input required type="checkbox" name="consent" value="1">
        <span>I agree to be contacted about my enquiry. See our privacy practices on request.</span>
      </label>
    </div>
    <div class="form-status" role="status" aria-live="polite" data-form-status></div>
    <button class="btn btn-primary" type="submit">Send message</button>`;
}

module.exports = {
  esc,
  asset,
  head,
  orgJsonLd,
  header,
  footer,
  pageShell,
  pageHero,
  sectionNav,
  ctaBand,
  contactFormFields,
  config,
  icons,
  setBuildLang,
  publicUrl,
};
