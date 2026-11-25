/**
 * Products: one anchored section per Siemens product. Each section combines
 * the staging description, one attributed category-level sentence from
 * Siemens (content/external-claims.js) and the relationships in relations.js.
 */
const site = require("../lib/site");
const icons = require("../lib/icons");
const { esc, pad2 } = require("../lib/html");
const c = require("../lib/components");
const content = require("../content");

function stageLinks(key) {
  const stages = content.productStages[key];
  if (stages.length === content.lifecycle.length) return `<a href="${site.page("#lifecycle")}">Every stage of the lifecycle</a>`;
  if (!stages.length) return `<a href="${site.page("#lifecycle")}">Not tied to a single stage</a>`;
  return stages
    .map((s) => {
      const stage = content.lifecycle.find((l) => l.key === s);
      return `<a href="${site.page(`#lc-${stage.key}`)}">${esc(stage.title)}</a>`;
    })
    .join(", ");
}

function product(p, i) {
  const claim = content.external.products[p.key];
  const solutions = content.solutionsForProduct(p.key);
  const roles = content.rolesForProduct(p.key);
  const expertise = content.productExpertise[p.key];
  const rows = [
    `<div><dt>Category</dt><dd>${esc(p.category)}</dd></div>`,
    `<div><dt>Lifecycle stage</dt><dd>${stageLinks(p.key)}</dd></div>`,
  ];
  if (expertise) {
    rows.push(`<div><dt>Our expertise</dt><dd><a href="${site.page("about.html#partnership")}">${esc(expertise)}</a></dd></div>`);
  }
  const related = [];
  if (solutions.length) {
    related.push(`<div class="product-rel"><h3>Related solutions</h3>${c.relatedList(solutions.map((s) => [site.page(`solutions.html#${s.key}`), s.title]))}</div>`);
  }
  if (roles.length) {
    related.push(`<div class="product-rel"><h3>Careers that mention ${esc(p.name)}</h3>${c.relatedList(roles.map((job) => [site.page(`careers/${job.slug}.html`), job.title, job.experience]))}</div>`);
  }
  return `<section class="product" id="${p.key}">
      <div class="container product-grid">
        <header class="product-head">
          <p class="product-n">${pad2(i + 1)} / ${pad2(content.products.length)}</p>
          ${c.productMark(p, "lg")}
          <h2 translate="no">${esc(p.name)}</h2>
          <p class="product-cat">${esc(p.category)}</p>
        </header>
        <div class="product-body">
          <p class="product-text">${esc(p.text)}</p>
          <p class="product-claim">${esc(claim.text)} <a class="product-source" href="${claim.url}" target="_blank" rel="noopener external">Source<span class="visually-hidden"> (opens in a new tab)</span>${icons.arrowUpRight}</a></p>
          <dl class="product-facts">${rows.join("")}</dl>
          <div class="actions">
            ${c.button(c.contactHref({ type: "product", topic: `product-${p.key}` }), "Enquire about this product")}
            ${c.button(c.contactHref({ type: "consultation", topic: `product-${p.key}` }), "Ask a question", "ghost")}
          </div>
        </div>
        ${related.length ? `<div class="product-related">${related.join("")}</div>` : ""}
      </div>
    </section>`;
}

function jumpNav() {
  return `<nav class="pjump" aria-label="Products">
        <ul>${content.products
          .map((p) => `<li><a href="#${p.key}">${c.productMark(p)}<span class="pjump-name">${esc(p.name)}</span><span class="pjump-cat">${esc(p.category)}</span></a></li>`)
          .join("")}</ul>
      </nav>`;
}

function render() {
  const crumbs = c.crumbsFor("Products", "products.html");
  const intro = content.productsIntro;
  return {
    title: "Products | ThinkInnov-NexGen",
    description: "The Siemens products ThinkInnov-NexGen works with: NX, Solid Edge, Capital, Teamcenter, Tecnomatix and Mendix, with related solutions and where each sits in the product lifecycle.",
    active: "products",
    crumbs,
    body: [
      c.pageHero({ kicker: intro.kicker, title: "Products", intro: intro.page, crumbs }),
      `<div class="pjump-wrap"><div class="container">${jumpNav()}</div></div>`,
      content.products.map(product).join("\n"),
      `<section class="section section-tint"><div class="container">
        <p class="note note-wide">Product names are trademarks of their respective owners. Sentences beginning “Siemens describes” or “Mendix … describes” summarise the owner's own public description and link to it; all other text describes ThinkInnov-NexGen's work with the product.</p>
      </div></section>`,
      c.ctaBand({
        title: "Ask about a product",
        text: content.heroMessages.partner.text,
        actions: [[c.contactHref({ type: "product" }), "Product enquiry"], [site.page("solutions.html"), "Solutions", "ghost"]],
      }),
    ].join("\n"),
  };
}

module.exports = { routes: [{ path: "products.html", render }] };
