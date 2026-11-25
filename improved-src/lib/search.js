/**
 * Build-time search index: one JSON file per language, read by
 * scripts/80-search.js on the search page. Entries come from the pages that
 * were just built and from the content data, so the index cannot name
 * anything the site does not contain.
 */
const site = require("./site");
const i18n = require("../i18n");
const content = require("../content");

/** pages: [{ path, title, description }] already in the language being indexed. */
function buildIndex(lang, pages) {
  site.setPage(lang, "search.html");
  const t = (s) => i18n.t(s);
  const entries = [];
  const add = (kind, title, text, url, extra = "") => entries.push({ k: t(kind), t: title, d: text, u: url, x: extra });

  const kindOf = (path) => (path.startsWith("products/") ? "Product" : path.startsWith("careers/") ? "Careers" : "Page");
  pages.forEach((p) => add(kindOf(p.path), p.path === "" ? t("Home") : p.title, p.description, p.path || "./"));
  content.solutions.forEach((s) => add("Solution", t(s.title), t(s.text), `solutions.html#${s.key}`, s.title));
  content.needs.forEach((n) => add("Business need", t(n.title), t(n.source), `solutions.html#need-${n.key}`, n.title));
  content.industries.forEach((ind) => add("Industry", t(ind.title), t(ind.text), `industries.html#${ind.key}`, ind.title));
  content.services.forEach((svc) =>
    svc.blocks.forEach(([label, items]) => add("Service", `${t(svc.title)}: ${t(label)}`, items.map(t).join(", "), `services.html#${svc.key}`, [svc.title, label, ...items].join(" ")))
  );
  content.lifecycle.forEach((s) => add("Lifecycle stage", t(s.title), t(s.text), `./#lc-${s.key}`, s.title));
  content.digitalTransformation.pdmm.levels.forEach(([level, name, text]) => add("Maturity level", `${level}: ${t(name)}`, t(text), "digital-transformation.html#pdmm", name));
  return JSON.stringify(entries) + "\n";
}

module.exports = { buildIndex };
