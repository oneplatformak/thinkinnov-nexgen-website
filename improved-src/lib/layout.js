/** Document shell: <head>, header, main, footer. */
const config = require("../config");
const site = require("./site");
const seo = require("./seo");
const { esc } = require("./html");
const { header } = require("./nav");
const { footer } = require("./footer");
const i18n = require("../i18n");

let assetVersion = { css: "", js: "" };

function setAssetVersion(v) {
  assetVersion = v;
}

/** "Page | Site" titles: translate the page part, keep the site name. */
function translateTitle(title) {
  return title.split(" | ").map((part) => i18n.t(part)).join(" | ");
}

/**
 * The 404 page is served for any missing path, at any depth. This sets a
 * <base> so its relative links still resolve (site root, or the repository
 * folder on GitHub Pages).
 */
const BASE_404 =
  '<script>(function(){var p=location.pathname.split("/"),r=/github\\.io$/.test(location.hostname)&&p[1]?"/"+p[1]+"/":"/",b=document.createElement("base");b.href=r+LANGDIR;document.head.appendChild(b)})()</script>';

function head({ title, description, noindex, is404 }) {
  const lang = site.lang();
  const pagePath = site.currentPath();
  const canonical = site.absolute(pagePath, lang);
  const pageTitle = translateTitle(title);
  const pageDescription = i18n.t(description);
  const image = `${config.baseUrl}/${config.ogImage}`;
  const base = is404 ? BASE_404.replace("LANGDIR", lang === "ja" ? '"ja/"' : '""') + "\n  " : "";
  const robots = noindex ? '<meta name="robots" content="noindex">\n  ' : "";
  const alternates = noindex
    ? ""
    : `<link rel="canonical" href="${esc(canonical)}">
  <link rel="alternate" hreflang="en" href="${esc(site.absolute(pagePath, "en"))}">
  <link rel="alternate" hreflang="ja" href="${esc(site.absolute(pagePath, "ja"))}">
  <link rel="alternate" hreflang="x-default" href="${esc(site.absolute(pagePath, "en"))}">
  `;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${base}<title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(pageDescription)}">
  ${robots}${alternates}<meta name="theme-color" content="${config.themeColor}">
  <meta name="format-detection" content="telephone=no">
  <meta property="og:title" content="${esc(pageTitle)}">
  <meta property="og:description" content="${esc(pageDescription)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${lang === "ja" ? "ja_JP" : "en_US"}">
  <meta property="og:locale:alternate" content="${lang === "ja" ? "en_US" : "ja_JP"}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="${esc(config.siteName)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(pageTitle)}">
  <meta name="twitter:description" content="${esc(pageDescription)}">
  <meta name="twitter:image" content="${image}">
  <link rel="icon" href="${site.asset("assets/favicon.ico")}" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="${site.asset("assets/img/favicon-32.png")}">
  <link rel="apple-touch-icon" sizes="180x180" href="${site.asset("assets/img/apple-touch-icon.png")}">
  <link rel="preload" href="${site.asset("assets/fonts/manrope-latin.woff2")}" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${site.asset("assets/fonts/inter-latin.woff2")}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${site.asset("assets/styles.css")}?v=${assetVersion.css}">
  <script>document.documentElement.className+=" js"</script>
  <script src="${site.asset("assets/site.js")}?v=${assetVersion.js}" defer></script>
</head>`;
}

/**
 * page: { title, description, active, body, crumbs, jsonLd, bodyClass, noindex, is404 }
 * crumbs: [{ label, path }] (English labels; translated here for JSON-LD).
 */
function shell(page) {
  const ld = [seo.organization()];
  if (site.currentPath() === "") ld.push(seo.website());
  if (page.crumbs && page.crumbs.length > 1) {
    ld.push(seo.breadcrumbs(page.crumbs.map((c) => ({ label: i18n.t(c.label), path: c.path }))));
  }
  return `${head(page)}
<body class="${esc(page.bodyClass || "page")}">
  ${header(page.active || "")}
  <main id="main" tabindex="-1">${page.body}</main>
  ${footer()}
  ${ld.join("\n  ")}
</body>
</html>
`;
}

module.exports = { shell, setAssetVersion };
