/** Shared building blocks used by the page modules. */
const config = require("../config");
const site = require("./site");
const icons = require("./icons");
const { esc, verbatim, pad2 } = require("./html");
const content = require("../content");
const { webpSize } = require("./imagesize");

/** crumbs: [{ label, path }]; the last one is the current page. */
function breadcrumbs(crumbs) {
  const items = crumbs
    .map((c, i) =>
      i === crumbs.length - 1
        ? `<li aria-current="page">${esc(c.label)}</li>`
        : `<li><a href="${site.page(c.path)}">${esc(c.label)}</a></li>`
    )
    .join("");
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items}</ol></nav>`;
}

function crumbsFor(label, path, parents = []) {
  return [{ label: "Home", path: "" }, ...parents, { label, path }];
}

/**
 * Inner-page hero. `aside` is optional HTML shown beside the heading on wide
 * screens (a diagram, an index of the page, a photo).
 */
function pageHero({ kicker, title, intro, crumbs, aside = "", actions = "", variant = "" }) {
  return `<section class="page-hero${variant ? ` page-hero-${variant}` : ""}${aside ? " has-aside" : ""}">
    <div class="container">
      ${breadcrumbs(crumbs)}
      <div class="page-hero-grid">
        <div class="page-hero-text">
          ${kicker ? `<p class="kicker">${esc(kicker)}</p>` : ""}
          <h1>${esc(title)}</h1>
          ${intro ? `<p class="lead">${esc(intro)}</p>` : ""}
          ${actions ? `<div class="actions">${actions}</div>` : ""}
        </div>
        ${aside ? `<div class="page-hero-aside">${aside}</div>` : ""}
      </div>
    </div>
  </section>`;
}

/** Numbered section heading: "02 — Kicker" over the title. */
function sectionHead({ n, kicker, title, text, id, level = 2, link }) {
  const marker = n || kicker ? `<p class="marker">${n ? `<span class="marker-n">${pad2(n)}</span>` : ""}${kicker ? `<span>${esc(kicker)}</span>` : ""}</p>` : "";
  return `<header class="section-head">
        ${marker}
        <h${level}${id ? ` id="${id}"` : ""}>${esc(title)}</h${level}>
        ${text ? `<p class="section-text">${esc(text)}</p>` : ""}
        ${link ? `<a class="link-arrow" href="${link[0]}">${esc(link[1])}${icons.arrow}</a>` : ""}
      </header>`;
}

function linkArrow(href, label, cls = "") {
  return `<a class="link-arrow${cls ? ` ${cls}` : ""}" href="${href}">${esc(label)}${icons.arrow}</a>`;
}

function button(href, label, kind = "primary", attrs = "") {
  return `<a class="btn btn-${kind}" href="${href}"${attrs ? ` ${attrs}` : ""}>${esc(label)}${icons.arrow}</a>`;
}

function productMark(product, size = "") {
  return `<span class="pmark${size ? ` pmark-${size}` : ""} pmark-${product.key}" aria-hidden="true">${esc(product.mark)}</span>`;
}

/** Contact link that carries context to the enquiry form. */
function contactHref(params = {}) {
  const query = Object.entries(params)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  return site.page("contact.html" + (query ? `?${query}` : ""));
}

/** Closing invitation used on inner pages. `actions`: [[href, label, kind]]. */
function ctaBand({ title, text, actions, id = "" }) {
  const buttons = actions.map(([href, label, kind]) => button(href, label, kind || "primary")).join("");
  return `<section class="section cta-band"${id ? ` id="${id}"` : ""}>
    <div class="container cta-band-grid">
      <div>
        <h2>${esc(title)}</h2>
        ${text ? `<p>${esc(text)}</p>` : ""}
      </div>
      <div class="actions">${buttons}</div>
    </div>
  </section>`;
}

/** Links between related items: [[href, label, small text]]. */
function relatedList(items, { cls = "" } = {}) {
  if (!items.length) return "";
  return `<ul class="related${cls ? ` ${cls}` : ""}">${items
    .map(
      ([href, label, small]) =>
        `<li><a href="${href}"><span class="related-label">${esc(label)}</span>${small ? `<span class="related-small">${esc(small)}</span>` : ""}${icons.arrow}</a></li>`
    )
    .join("")}</ul>`;
}

function solutionLink(key) {
  const s = content.solutionByKey(key);
  return [site.page(`solutions.html#${s.key}`), s.title];
}

function productLink(key) {
  const p = content.productByKey(key);
  return [site.page(`products.html#${p.key}`), p.name, p.category];
}

/** Customer logo wall: every logo is the real file from the staging customer row. */
function logoWall() {
  return `<ul class="logo-wall" aria-label="Customers">${content.customers
    .map(([file, name]) => {
      const rel = `assets/img/customers/${file}.webp`;
      const [w, h] = webpSize(rel);
      return `<li><img src="${site.asset(rel)}" width="${w}" height="${h}" alt="${verbatim(name)}" loading="lazy" decoding="async"></li>`;
    })
    .join("")}</ul>`;
}

function person([image, name, role], { size = 600 } = {}) {
  return `<li class="person">
          <img src="${site.asset(image)}" width="${size}" height="${size}" alt="" loading="lazy" decoding="async">
          <h3 class="person-name" translate="no">${verbatim(name)}</h3>
          <p class="person-role">${esc(role)}</p>
        </li>`;
}

module.exports = {
  breadcrumbs, crumbsFor, pageHero, sectionHead, linkArrow, button, productMark, contactHref,
  ctaBand, relatedList, solutionLink, productLink, logoWall, person, config,
};
