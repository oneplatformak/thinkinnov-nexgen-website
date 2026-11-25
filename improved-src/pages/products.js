/**
 * Products catalogue: the six Siemens products side by side, a map of where
 * each sits in the lifecycle, and a link to each product's own page
 * (pages/product.js). The #nx … #mendix anchors are kept from staging.
 */
const site = require("../lib/site");
const icons = require("../lib/icons");
const { esc, pad2 } = require("../lib/html");
const c = require("../lib/components");
const content = require("../content");

function stageNames(key) {
  const stages = content.productStages[key];
  if (stages.length === content.lifecycle.length) return "Every stage";
  if (!stages.length) return "Not tied to a single stage";
  return stages.map((s) => content.lifecycle.find((l) => l.key === s).title).join(", ");
}

function product(p, i) {
  const claim = content.external.products[p.key];
  const solutions = content.solutionsForProduct(p.key);
  const expertise = content.productExpertise[p.key];
  const href = site.page(content.productPath(p.key));
  const rows = [
    `<div><dt>Product family</dt><dd>${esc(p.category)}</dd></div>`,
    `<div><dt>Lifecycle stage</dt><dd>${esc(stageNames(p.key))}</dd></div>`,
  ];
  if (expertise) rows.push(`<div><dt>Our expertise</dt><dd>${esc(expertise)}</dd></div>`);
  return `<section class="product" id="${p.key}">
      <div class="container product-grid">
        <header class="product-head">
          <p class="product-n">${pad2(i + 1)} / ${pad2(content.products.length)}</p>
          ${c.productMark(p, "lg")}
          <h2><a href="${href}" translate="no">${esc(p.name)}</a></h2>
          <p class="product-cat">${esc(p.category)}</p>
        </header>
        <div class="product-body">
          <p class="product-text">${esc(p.text)}</p>
          <p class="product-claim">${esc(claim.text)} <a class="product-source" href="${claim.url}" target="_blank" rel="noopener external">Source<span class="visually-hidden"> (opens in a new tab)</span>${icons.arrowUpRight}</a></p>
          <div class="actions">
            <a class="btn btn-primary" href="${href}" data-product-page="${p.key}"><span>Product page</span><span class="visually-hidden">: ${esc(p.name)}</span>${icons.arrow}</a>
            ${c.button(c.contactHref({ type: "product", topic: `product-${p.key}` }), "Enquire about this product", "ghost")}
          </div>
        </div>
        <div class="product-related">
          <dl class="product-facts">${rows.join("")}</dl>
          ${solutions.length ? `<div class="product-rel"><h3>Related solutions</h3>${c.relatedList(solutions.map((s) => [site.page(`solutions.html#${s.key}`), s.title]))}</div>` : ""}
        </div>
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

/** Products against lifecycle stages, as a real table. */
function stageMap() {
  const head = content.lifecycle.map((s) => `<th scope="col"><span>${esc(s.title)}</span></th>`).join("");
  const rows = content.products
    .map((p) => {
      const on = content.productStages[p.key];
      const cells = content.lifecycle
        .map((s) => (on.includes(s.key) ? `<td class="is-on"><span class="visually-hidden">Yes</span></td>` : `<td><span class="visually-hidden">No</span></td>`))
        .join("");
      return `<tr><th scope="row"><a href="${site.page(content.productPath(p.key))}">${c.productMark(p, "sm")}<span translate="no">${esc(p.name)}</span></a></th>${cells}</tr>`;
    })
    .join("");
  return `<section class="section section-tint" id="stage-map">
      <div class="container">
        ${c.sectionHead({ kicker: "Product lifecycle", title: "Where each product sits in the lifecycle", text: "Mendix is not tied to a single stage. Each placement is this site's reading of the product descriptions on this page, as a guide to the site." })}
        <div class="table-scroll" tabindex="0" role="region" aria-label="Products by lifecycle stage">
          <table class="stage-map">
            <thead><tr><th scope="col">Product</th>${head}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        ${c.linkArrow(site.page("#lifecycle"), "Open the lifecycle diagram")}
      </div>
    </section>`;
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
      stageMap(),
      `<section class="section"><div class="container">
        <p class="note note-wide">The products on this page are Siemens products, and their names are trademarks of Siemens or its affiliates. Sentences beginning “Siemens describes” or “Mendix … describes” summarise the owner's own public description and link to it; all other text describes ThinkInnov-NexGen's work with the product.</p>
      </div></section>`,
      c.ctaBand({
        title: "Ask about a product",
        text: content.heroMessages.partner.text,
        actions: [[c.contactHref({ type: "product" }), "Product enquiry"], [site.page("solutions.html#finder"), "Find by business need", "ghost"]],
      }),
    ].join("\n"),
  };
}

module.exports = { routes: [{ path: "products.html", render }] };
