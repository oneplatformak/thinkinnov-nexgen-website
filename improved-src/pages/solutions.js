/** Solutions: the finder by business need, then all 15 solutions in five groups. */
const site = require("../lib/site");
const { esc, pad2 } = require("../lib/html");
const c = require("../lib/components");
const { finder } = require("../features/finder");
const content = require("../content");

function solution(key, n, group) {
  const s = content.solutionByKey[key];
  const rel = content.solutionProducts[key];
  const product = rel ? content.productByKey[rel.product] : null;
  const stages = content.stagesForSolution(key);
  const needs = content.needsForSolution(key);
  const industries = content.industriesForSolution(key);
  const service = content.solutionServices[key];
  const siblings = group.items.filter((k) => k !== key).map((k) => content.solutionByKey[k]);
  const meta = [];
  if (product) {
    meta.push(`<div><dt>Siemens product</dt><dd><a class="chip chip-product" href="${site.page(content.productPath(product.key))}">${c.productMark(product, "sm")}<span><span class="chip-label">${esc(product.name)}</span><span class="chip-small">${esc(product.category)}</span></span></a></dd></div>`);
  }
  if (stages.length) {
    meta.push(`<div><dt>Lifecycle stage</dt><dd>${stages.map((st) => `<a href="${site.page(`#lc-${st.key}`)}">${esc(st.title)}</a>`).join(", ")}</dd></div>`);
  } else if (content.lifecycleAcross.solutions.includes(key)) {
    meta.push(`<div><dt>Lifecycle stage</dt><dd><a href="${site.page("#lifecycle")}">Not tied to a single stage</a></dd></div>`);
  }
  if (service) {
    meta.push(`<div><dt>Related service or expertise</dt><dd><a href="${site.page(service.href)}">${esc(service.label)}</a> <span class="solution-small">${esc(service.small)}</span></dd></div>`);
  }
  if (industries.length) {
    meta.push(`<div><dt>Industry material</dt><dd><ul class="plain-list">${industries.map((ind) => `<li><a href="${site.page(`industries.html#${ind.key}`)}">${esc(ind.title)}</a></li>`).join("")}</ul></dd></div>`);
  }
  meta.push(`<div><dt>In the same group</dt><dd><ul class="plain-list">${siblings.map((sib) => `<li><a href="#${sib.key}">${esc(sib.title)}</a></li>`).join("")}</ul></dd></div>`);
  const needBlock = needs.length
    ? `<div class="solution-needs">
              <h4>Business needs it relates to</h4>
              <ul>${needs.map((need) => `<li><a href="#need-${need.key}">${esc(need.title)}</a><span class="solution-need-source">${esc(need.source)}</span></li>`).join("")}</ul>
            </div>`
    : "";
  return `<article class="solution" id="${s.key}">
          <p class="solution-n">${pad2(n)}</p>
          <div class="solution-main">
            <h3>${esc(s.title)}</h3>
            <p class="solution-text">${esc(s.text)}</p>
            ${needBlock}
            ${c.linkArrow(c.contactHref({ type: "consultation", topic: `solution-${s.key}` }), "Enquire about this solution")}
          </div>
          <dl class="solution-meta">${meta.join("")}</dl>
        </article>`;
}

function groups() {
  let n = 0;
  return content.solutionGroups
    .map(
      (group) => `<section class="solution-group" id="group-${group.key}">
        <h2 class="solution-group-title">${esc(group.title)}</h2>
        ${group.items.map((key) => solution(key, ++n, group)).join("")}
      </section>`
    )
    .join("");
}

/** Solutions against lifecycle stages, from relations.js, as a real table. */
function stageMap() {
  const head = content.lifecycle.map((st) => `<th scope="col"><span>${esc(st.title)}</span></th>`).join("");
  const rows = content.solutionGroups
    .flatMap((group) => group.items)
    .map((key) => {
      const s = content.solutionByKey[key];
      const across = content.lifecycleAcross.solutions.includes(key);
      const cells = content.lifecycle
        .map((st) => (across || st.solutions.includes(key) ? `<td class="is-on"><span class="visually-hidden">Yes</span></td>` : `<td><span class="visually-hidden">No</span></td>`))
        .join("");
      return `<tr><th scope="row"><a href="#${s.key}">${esc(s.homeTitle || s.title)}</a></th>${cells}</tr>`;
    })
    .join("");
  return `<section class="section section-tint" id="stage-map">
      <div class="container">
        ${c.sectionHead({ kicker: "Product lifecycle", title: "Where each solution sits in the lifecycle", text: "Each placement is this site's reading of the solution descriptions on this page, as a guide to the site." })}
        <div class="table-scroll" tabindex="0" role="region" aria-label="Solutions by lifecycle stage">
          <table class="stage-map stage-map-wide">
            <thead><tr><th scope="col">Solution</th>${head}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        ${c.linkArrow(site.page("#lifecycle"), "Open the lifecycle diagram")}
      </div>
    </section>`;
}

/** The three service phases, which apply to every solution. */
function delivery() {
  const phases = content.services
    .map(
      (phase, i) => `<li><a href="${site.page(`services.html#${phase.key}`)}"><span class="index-n">${pad2(i + 1)}</span><span class="index-title">${esc(phase.title)}</span><span class="index-text">${phase.blocks.map(([label]) => `<span>${esc(label)}</span>`).join(" · ")}</span></a></li>`
    )
    .join("");
  return `<section class="section" id="delivery">
      <div class="container split">
        <div>${c.sectionHead({ kicker: content.servicesIntro.kicker, title: "Our services", text: content.servicesIntro.page, link: [site.page("services.html"), "All services"] })}</div>
        <ol class="index-list">${phases}</ol>
      </div>
    </section>`;
}

function groupIndex() {
  return `<nav class="page-index" aria-label="On this page">
        <p class="page-index-title">On this page</p>
        <ol>
          <li><a href="#finder"><span class="index-n">→</span><span>Find by business need</span></a></li>
          ${content.solutionGroups.map((g, i) => `<li><a href="#group-${g.key}"><span class="index-n">${pad2(i + 1)}</span><span>${esc(g.title)}</span></a></li>`).join("")}
        </ol>
      </nav>`;
}

function render() {
  const crumbs = c.crumbsFor("Solutions", "solutions.html");
  const intro = content.solutionsIntro;
  return {
    title: "Solutions | ThinkInnov-NexGen",
    description: "Fifteen PLM and engineering solutions, from design data management and 3D shape search to quality, change, requirements, ERP integration and low-code, with a finder by business need.",
    active: "solutions",
    crumbs,
    body: [
      c.pageHero({ kicker: intro.kicker, title: "Solutions", intro: intro.page, crumbs, aside: groupIndex() }),
      `<section class="section section-tint" id="finder">
        <div class="container">
          ${c.sectionHead({ kicker: "Finder", title: "Find by business need", text: "Choose the need closest to yours. Each suggestion comes from a statement on this site, shown with it; nothing is scored or personalised." })}
          ${finder()}
        </div>
      </section>`,
      `<section class="section" id="all-solutions">
        <div class="container">
          ${c.sectionHead({ kicker: "Explore Our Solutions", title: "All 15 solutions", text: intro.home })}
          ${groups()}
        </div>
      </section>`,
      stageMap(),
      delivery(),
      c.ctaBand({
        title: "Not sure which solution fits?",
        text: content.servicesIntro.page,
        actions: [[c.contactHref({ type: "consultation" }), "Book a PLM consultation"], [site.page("products.html"), "Products", "ghost"]],
      }),
    ].join("\n"),
  };
}

module.exports = { routes: [{ path: "solutions.html", render }] };
