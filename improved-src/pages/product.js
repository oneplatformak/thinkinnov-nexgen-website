/**
 * One page per Siemens product. Everything on it is one of three things:
 * source text about the product or about ThinkInnov-NexGen's work with it,
 * one attributed sentence from the owner's own site (external-claims.js), or
 * a relationship written down in relations.js. No features, versions,
 * licensing or pricing: those belong to Siemens.
 */
const site = require("../lib/site");
const icons = require("../lib/icons");
const i18n = require("../i18n");
const { esc, pad2 } = require("../lib/html");
const c = require("../lib/components");
const diagrams = require("../lib/diagrams");
const content = require("../content");

function facts(p) {
  const stages = content.productStages[p.key];
  const stageText = stages.length === content.lifecycle.length ? "Every stage" : stages.length ? stages.map((s) => content.lifecycle.find((l) => l.key === s).title).join(", ") : "Not tied to a single stage";
  const rows = [
    ["Product family", p.category],
    ["Lifecycle stage", stageText],
    ["Maker", "Siemens"],
  ];
  if (content.productExpertise[p.key]) rows.push(["Our expertise", content.productExpertise[p.key]]);
  return `<dl class="facts facts-compact">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;
}

function overview(p) {
  const claim = content.external.products[p.key];
  const tm = content.external.trademarks;
  const source = (url) => `<a class="product-source" href="${url}" target="_blank" rel="noopener external">Source<span class="visually-hidden"> (opens in a new tab)</span>${icons.arrowUpRight}</a>`;
  return `<section class="section" id="overview">
    <div class="container split">
      <div>${c.sectionHead({ n: 1, kicker: "Overview", title: "What it is" })}</div>
      <div class="prose">
        <p class="product-text">${esc(p.text)}</p>
        <p class="product-claim">${esc(claim.text)} ${source(claim.url)}</p>
        <p class="note">${esc(tm.byProduct[p.key] || tm.text)} ${source(tm.url)}</p>
        <p class="note">This page describes how ThinkInnov-NexGen works with the product. For features, versions and licensing, please refer to Siemens.</p>
      </div>
    </div>
  </section>`;
}

function lifecycle(p) {
  const on = content.productStages[p.key];
  const all = on.length === content.lifecycle.length;
  const detail = all || !on.length
    ? ""
    : `<div class="stage-detail">${on
        .map((key) => {
          const stage = content.lifecycle.find((l) => l.key === key);
          return `<article><h3>${esc(stage.title)}</h3><p>${esc(stage.text)}</p>${c.linkArrow(site.page(`#lc-${stage.key}`), "See this stage in the lifecycle diagram")}</article>`;
        })
        .join("")}</div>`;
  const summary = all
    ? "Shown at every stage of the lifecycle."
    : on.length
      ? ""
      : "Not tied to a single stage of the lifecycle.";
  return `<section class="section section-tint" id="lifecycle-position">
    <div class="container">
      ${c.sectionHead({ n: 2, kicker: "Product lifecycle", title: "Where it sits in the product lifecycle" })}
      ${diagrams.stageStrip(on)}
      ${summary ? `<p class="stage-summary">${esc(summary)} ${c.linkArrow(site.page("#lifecycle"), "Open the lifecycle diagram")}</p>` : ""}
      ${detail}
      <p class="note note-wide stage-note">The stage shown is this site's reading of the description above. It is a guide to the site, not a statement of what the product can do.</p>
    </div>
  </section>`;
}

function support(p) {
  const items = content.productSupport[p.key].items
    .map(([text, href]) => `<li>${href ? `<a href="${site.page(href)}">${esc(text)}</a>` : esc(text)}</li>`)
    .join("");
  const phases = content.services
    .map(
      (phase, i) => `<li><a href="${site.page(`services.html#${phase.key}`)}"><span class="index-n">${pad2(i + 1)}</span><span class="index-title">${esc(phase.title)}</span><span class="index-text">${phase.blocks.map(([label]) => `<span>${esc(label)}</span>`).join(" · ")}</span></a></li>`
    )
    .join("");
  return `<section class="section" id="support">
    <div class="container split">
      <div>
        ${c.sectionHead({ n: 3, kicker: "ThinkInnov-NexGen", title: "How we work with it", text: content.heroMessages.partner.text })}
        ${items ? `<ul class="ticks support-list">${items}</ul>` : ""}
      </div>
      <div>
        <h3 class="h-sub">Our services</h3>
        <p class="support-intro">${esc(content.servicesIntro.page)}</p>
        <ol class="index-list">${phases}</ol>
      </div>
    </div>
  </section>`;
}

function relatedSolutions(p, n) {
  const solutions = content.solutionsForProduct(p.key);
  if (!solutions.length) return "";
  const cards = solutions
    .map((s) => `<li><a href="${site.page(`solutions.html#${s.key}`)}"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p><span class="card-more">Read about this solution${icons.arrow}</span></a></li>`)
    .join("");
  return `<section class="section section-tint" id="solutions">
    <div class="container">
      ${c.sectionHead({ n, kicker: "Solutions", title: "Related solutions" })}
      <ul class="link-cards">${cards}</ul>
    </div>
  </section>`;
}

function relatedNeeds(p, n) {
  const needs = content.needsForProduct(p.key);
  const industries = content.industriesForProduct(p.key);
  if (!needs.length && !industries.length) return "";
  const col = (title, list) => (list ? `<div><h3 class="h-sub">${esc(title)}</h3>${list}</div>` : "");
  const needList = needs.length ? c.relatedList(needs.map((need) => [site.page(`solutions.html#need-${need.key}`), need.title])) : "";
  const industryList = industries.length ? c.relatedList(industries.map((ind) => [site.page(`industries.html#${ind.key}`), ind.title])) : "";
  return `<section class="section" id="needs">
    <div class="container">
      ${c.sectionHead({ n, kicker: "Find your way", title: "Related business needs and industries" })}
      <div class="split split-even">
        ${col("Business needs", needList)}
        ${col("Industry material that names it", industryList)}
      </div>
    </div>
  </section>`;
}

function careers(p) {
  const roles = content.rolesForProduct(p.key);
  if (!roles.length) return "";
  return `<section class="section section-tint" id="careers">
    <div class="container">
      <h2 class="h-sub">Careers that mention ${esc(p.name)}</h2>
      ${c.relatedList(roles.map((job) => [site.page(`careers/${job.slug}.html`), job.title, job.experience]), { cls: "related-cols" })}
    </div>
  </section>`;
}

function pager(p) {
  const list = content.products;
  const i = list.indexOf(p);
  const prev = list[(i + list.length - 1) % list.length];
  const next = list[(i + 1) % list.length];
  const link = (item, label, cls) => `<a class="pager-link ${cls}" href="${site.page(content.productPath(item.key))}"><span class="pager-label">${esc(label)}</span><span class="pager-name">${c.productMark(item, "sm")}<span translate="no">${esc(item.name)}</span></span></a>`;
  return `<nav class="pager" aria-label="Other products"><div class="container pager-grid">${link(prev, "Previous product", "pager-prev")}<a class="pager-all" href="${site.page("products.html")}">All products</a>${link(next, "Next product", "pager-next")}</div></nav>`;
}

function render(p) {
  const path = content.productPath(p.key);
  const crumbs = c.crumbsFor(p.name, path, [{ label: "Products", path: "products.html" }]);
  const enquire = c.contactHref({ type: "product", topic: `product-${p.key}` });
  const solutions = relatedSolutions(p, 4);
  const needs = relatedNeeds(p, solutions ? 5 : 4);
  const onPage = [
    ["overview", "What it is"], ["lifecycle-position", "Lifecycle"], ["support", "How we work with it"],
    solutions && ["solutions", "Related solutions"], needs && ["needs", "Needs and industries"], ["enquire", "Enquire"],
  ].filter(Boolean);
  return {
    title: `${p.name} | Products | ThinkInnov-NexGen`,
    description: `${p.name} (${p.category}): ${p.text} Lifecycle stage, related solutions, services and enquiries at ThinkInnov-NexGen.`,
    descriptionJa: `${p.name}（${i18n.t(p.category)}）：${i18n.t(p.text)} ライフサイクル上の位置づけ、関連ソリューション、サービス、お問い合わせ先をご案内します。`,
    active: "products",
    crumbs,
    body: [
      `<section class="page-hero product-hero has-aside">
    <div class="container">
      ${c.breadcrumbs(crumbs)}
      <div class="page-hero-grid">
        <div class="page-hero-text">
          <p class="kicker"><span>Siemens</span> · <span>${esc(p.category)}</span></p>
          <h1 class="product-title">${c.productMark(p, "lg")}<span translate="no">${esc(p.name)}</span></h1>
          <p class="lead">${esc(p.text)}</p>
          <div class="actions">
            ${c.button(enquire, "Enquire about this product")}
            ${c.button(site.page("solutions.html#finder"), "Find by business need", "ghost")}
          </div>
        </div>
        <div class="page-hero-aside">${facts(p)}</div>
      </div>
    </div>
  </section>`,
      `<nav class="onpage" aria-label="On this page"><div class="container"><ul>${onPage.map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`).join("")}</ul></div></nav>`,
      overview(p),
      lifecycle(p),
      support(p),
      solutions,
      needs,
      careers(p),
      c.ctaBand({
        id: "enquire",
        title: "Enquire about this product",
        text: "Your enquiry opens with this product already selected, so you do not have to explain where you came from.",
        actions: [[enquire, "Product enquiry"], [c.contactHref({ type: "consultation", topic: `product-${p.key}` }), "Book a PLM consultation", "ghost"]],
      }),
      pager(p),
    ].join("\n"),
  };
}

module.exports = {
  routes: content.products.map((p) => ({ path: content.productPath(p.key), render: () => render(p) })),
};
