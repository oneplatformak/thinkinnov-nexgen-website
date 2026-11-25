#!/usr/bin/env node
/**
 * Static site generator for ThinkInnov-NexGen.
 *
 *   node improved-src/build.js      (from the repository root)
 *
 * Writes the whole site into docs/: English at the root, Japanese under
 * docs/ja/. Edit content in improved-src/content/, templates in pages/,
 * styles in styles/ and scripts in scripts/, then rebuild. Files under
 * docs/assets/img and docs/assets/fonts, the two PHP handlers and .htaccess
 * are not generated and are left alone.
 */
const fs = require("fs");
const path = require("path");
const site = require("./lib/site");
const seo = require("./lib/seo");
const assets = require("./lib/assets");
const { shell, setAssetVersion } = require("./lib/layout");
const { stripMarkers } = require("./lib/html");
const i18n = require("./i18n");
const content = require("./content");
const registers = require("./lib/registers");
const search = require("./lib/search");

const OUT = path.join(__dirname, "..", "docs");
const NOTES = path.join(__dirname, "..", "notes");

const PAGE_MODULES = [
  "home", "about", "plm", "services", "digital", "products", "product", "solutions", "industries",
  "behind", "careers", "job", "apply", "contact", "search", "legal", "notfound",
];
const only = process.env.ONLY ? process.env.ONLY.split(",") : null; // development aid
const routes = PAGE_MODULES.filter((m) => !only || only.includes(m)).flatMap((m) => require(`./pages/${m}`).routes);

function write(rel, text) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function buildAssets() {
  const css = assets.buildCss();
  const js = assets.buildJs();
  write("assets/styles.css", css.text);
  write("assets/site.js", js.text);
  setAssetVersion({ css: css.version, js: js.version });
  return { css: css.text.length, js: js.text.length };
}

const indexed = { en: [], ja: [] };

function buildPage(route, lang) {
  site.setPage(lang, route.path);
  const page = route.render();
  let html = shell({ ...page, noindex: route.noindex || page.noindex });
  const rel = (lang === "ja" ? "ja/" : "") + (route.path || "index.html");
  if (lang === "ja") html = i18n.apply(html, rel);
  write(rel, stripMarkers(html));
  if (!route.noindex && !page.noindex && route.path !== "search.html") {
    const pick = (re) => (html.match(re) || [, ""])[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    indexed[lang].push({ path: route.path, title: pick(/<title>([^<]*)<\/title>/).split(" | ")[0], description: pick(/<meta name="description" content="([^"]*)"/) });
  }
  return rel;
}

function main() {
  content.validate();
  const sizes = buildAssets();
  const written = [];
  for (const lang of ["en", "ja"]) {
    for (const route of routes) written.push(buildPage(route, lang));
  }

  if (!only) {
    site.setPage("en", "");
    for (const [rel, html] of require("./pages/redirects").stubs()) write(rel, html);
    write("sitemap.xml", seo.sitemapXml(routes.filter((r) => !r.noindex).map((r) => r.path)));
    write("robots.txt", seo.robotsTxt());
    for (const lang of ["en", "ja"]) write(`assets/search-${lang}.json`, search.buildIndex(lang, indexed[lang]));
    write("inc/enquiry-options.php", registers.enquiryOptionsPhp());
    fs.writeFileSync(path.join(NOTES, "JAPANESE-REGISTER.md"), registers.japaneseRegister(i18n));
    fs.writeFileSync(path.join(NOTES, "CLAIM-REGISTER.md"), registers.claimRegister());
    fs.writeFileSync(path.join(NOTES, "CUSTOMER-REGISTER.md"), registers.customerRegister());
    fs.writeFileSync(path.join(NOTES, "ASSET-REGISTER.md"), registers.assetRegister());
  }

  const misses = i18n.report();
  console.log(`Pages: ${written.length} (${routes.length} per language)`);
  console.log(`CSS ${(sizes.css / 1024).toFixed(1)} kB, JS ${(sizes.js / 1024).toFixed(1)} kB`);
  console.log(`Japanese line breaking: ${i18n.phraseEngine}`);
  if (i18n.duplicates.length) console.log(`Duplicate dictionary keys: ${i18n.duplicates.length}\n  ${i18n.duplicates.slice(0, 20).join("\n  ")}`);
  console.log(`Japanese strings without a translation: ${misses.length}`);
  if (misses.length) {
    const show = process.argv.includes("--misses") ? misses : misses.slice(0, 15);
    show.forEach((m) => console.log(`  [${m.page} ${m.kind}] ${m.text}`));
    if (process.argv.includes("--strict")) process.exit(1);
  }
}

main();
