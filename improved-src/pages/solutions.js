/** Solutions: the finder by business need, then all 15 solutions in five groups. */
const site = require("../lib/site");
const { esc, pad2 } = require("../lib/html");
const c = require("../lib/components");
const { finder } = require("../features/finder");
const content = require("../content");

function solution(key, n) {
  const s = content.solutionByKey[key];
  const rel = content.solutionProducts[key];
  const product = rel ? content.productByKey[rel.product] : null;
  const stages = content.stagesForSolution(key);
  const needs = content.needsForSolution(key);
  const meta = [];
  if (product) {
    meta.push(`<div><dt>Siemens product</dt><dd><a class="chip chip-product" href="${site.page(content.productPath(product.key))}">${c.productMark(product, "sm")}<span><span class="chip-label">${esc(product.name)}</span><span class="chip-small">${esc(product.category)}</span></span></a></dd></div>`);
  }
  if (stages.length) {
    meta.push(`<div><dt>Lifecycle stage</dt><dd>${stages.map((st) => `<a href="${site.page(`#lc-${st.key}`)}">${esc(st.title)}</a>`).join(", ")}</dd></div>`);
  }
  if (needs.length) {
    meta.push(`<div><dt>Business needs</dt><dd><ul class="plain-list">${needs.map((need) => `<li><a href="#need-${need.key}">${esc(need.title)}</a></li>`).join("")}</ul></dd></div>`);
  }
  return `<article class="solution" id="${s.key}">
          <p class="solution-n">${pad2(n)}</p>
          <div class="solution-main">
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.text)}</p>
            ${c.linkArrow(c.contactHref({ type: "consultation", topic: `solution-${s.key}` }), "Enquire about this solution")}
          </div>
          ${meta.length ? `<dl class="solution-meta">${meta.join("")}</dl>` : ""}
        </article>`;
}

function groups() {
  let n = 0;
  return content.solutionGroups
    .map(
      (group) => `<section class="solution-group" id="group-${group.key}">
        <h2 class="solution-group-title">${esc(group.title)}</h2>
        ${group.items.map((key) => solution(key, ++n)).join("")}
      </section>`
    )
    .join("");
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
          ${c.sectionHead({ kicker: "Catalogue", title: "All 15 solutions", text: intro.home })}
          ${groups()}
        </div>
      </section>`,
      c.ctaBand({
        title: "Not sure which solution fits?",
        text: content.servicesIntro.page,
        actions: [[c.contactHref({ type: "consultation" }), "Book a PLM consultation"], [site.page("products.html"), "Products", "ghost"]],
      }),
    ].join("\n"),
  };
}

module.exports = { routes: [{ path: "solutions.html", render }] };
