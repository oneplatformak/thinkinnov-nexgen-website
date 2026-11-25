/**
 * Digital Transformation: where companies start (the four source problems),
 * the Product Data Maturity Model as the roadmap, the digital thread and
 * enterprise integration as conceptual diagrams, the digital factory and the
 * outcomes. Every term is from the source; the diagrams are labelled
 * conceptual and depict no real system.
 */
const site = require("../lib/site");
const { esc, pad2 } = require("../lib/html");
const c = require("../lib/components");
const diagrams = require("../lib/diagrams");
const content = require("../content");

const d = content.digitalTransformation;

function start() {
  const items = content.behind.problems
    .map(
      ([key, title, text], i) => `<li class="problem">
          <span class="problem-n" aria-hidden="true">${pad2(i + 1)}</span>
          <h3>${esc(title)}</h3>
          <p>${esc(text)}</p>
          ${c.linkArrow(site.page(`solutions.html#need-${key}`), "See what helps")}
        </li>`
    )
    .join("");
  return `<section class="section" id="start">
    <div class="container">
      ${c.sectionHead({ n: 1, kicker: "Where companies start", title: content.behind.problemText })}
      <ol class="problems">${items}</ol>
    </div>
  </section>`;
}

function pdmm() {
  const levels = d.pdmm.levels
    .map(
      ([level, name, text], i) => `<li class="level level-${i + 1}">
          <p class="level-tag">${esc(level)}</p>
          <h3>${esc(name)}</h3>
          <p>${esc(text)}</p>
        </li>`
    )
    .join("");
  return `<section class="section section-tint" id="pdmm">
    <div class="container">
      ${c.sectionHead({ n: 2, kicker: "Strategy and roadmap", title: d.pdmm.title, text: d.pdmm.text })}
      <ol class="levels">${levels}</ol>
      <p class="after-list">${c.linkArrow(c.contactHref({ type: "dx" }), "Discuss where your product data stands")}</p>
    </div>
  </section>`;
}

function thread() {
  return `<section class="section" id="digital-thread">
    <div class="container split split-even split-middle">
      <div>
        ${c.sectionHead({ n: 3, kicker: "Digital thread", title: content.supportingLines.foundation, text: content.homePlm.text })}
        ${c.relatedList([
          [site.page("#lifecycle"), "The connected product lifecycle", "Where products and solutions sit"],
          [site.page("about.html#partnership"), "Digital thread delivery combining PLM, ERP and MES", "Key Value Drivers"],
        ])}
      </div>
      ${diagrams.closedLoop()}
    </div>
  </section>`;
}

function integration() {
  const keys = content.solutionGroups.find((g) => g.key === "integration").items;
  const list = keys.map((key) => {
    const s = content.solutionByKey[key];
    return [site.page(`solutions.html#${s.key}`), s.title, s.text];
  });
  return `<section class="section section-tint" id="integration">
    <div class="container split split-even split-middle split-flip">
      <div>
        ${c.sectionHead({ n: 4, kicker: "Enterprise integration", title: "PLM connected to ERP and MES", text: content.solutionByKey["active-integration"].text })}
        ${c.relatedList(list)}
        <p class="after-list">${c.linkArrow(site.page(content.productPath("teamcenter")), "Teamcenter")}</p>
      </div>
      ${diagrams.integrationMap()}
    </div>
  </section>`;
}

function factory() {
  const s = content.solutionByKey["digital-factory-enterprise"];
  const tx = content.productByKey.tecnomatix;
  return `<section class="section" id="digital-factory">
    <div class="container split">
      <div>${c.sectionHead({ n: 5, kicker: "Digital factory", title: s.title, text: s.text })}</div>
      <div>
        ${c.relatedList([
          [site.page(`solutions.html#${s.key}`), s.title, "Solution"],
          [site.page(content.productPath(tx.key)), tx.name, tx.text],
          [site.page("solutions.html#need-manufacturing"), content.needByKey.manufacturing.title, "Finder"],
        ])}
      </div>
    </div>
  </section>`;
}

function outcomes() {
  const cards = d.outcomes.cards
    .map(([title, text], i) => `<li><span class="index-n">${pad2(i + 1)}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></li>`)
    .join("");
  return `<section class="section section-tint" id="outcomes">
    <div class="container split">
      <div>
        ${c.sectionHead({ n: 6, kicker: "Outcomes", title: d.outcomes.title })}
        ${c.relatedList([
          [site.page("solutions.html#need-unlock-data"), "Gaining insight from product data", "Finder"],
          [site.page("solutions.html#need-predict"), "Predicting product performance earlier", "Finder"],
        ])}
      </div>
      <ul class="outcomes">${cards}</ul>
    </div>
  </section>`;
}

/** Two reading orders for the same material. Navigation only. */
function views() {
  const col = (title, text, links) => `<div class="view">
        <h3>${esc(title)}</h3>
        <p>${esc(text)}</p>
        ${c.relatedList(links)}
      </div>`;
  return `<section class="section" id="views">
    <div class="container">
      ${c.sectionHead({ n: 7, kicker: "Reading guide", title: "Two ways to read this" })}
      <div class="split split-even">
        ${col("For management", "Start from maturity, benefits and the fit for your company size.", [
          [site.page("digital-transformation.html#pdmm"), d.pdmm.title],
          [site.page("plm.html#benefits"), content.plm.benefits.title],
          [site.page("plm.html#business-size"), content.plm.businessSize.title],
          [site.page("about.html#partnership"), content.about.partnership.label],
        ])}
        ${col("For engineering and IT", "Start from integration, deployment and where each product sits.", [
          [site.page("solutions.html#group-integration"), "Enterprise integration"],
          [site.page("plm.html#deployment"), "Deployment options"],
          [site.page("products.html#stage-map"), "Where each product sits in the lifecycle"],
          [site.page("services.html#implementation"), "Implementation"],
        ])}
      </div>
    </div>
  </section>`;
}

function render() {
  const crumbs = c.crumbsFor(d.title, "digital-transformation.html");
  return {
    title: "Digital Transformation | ThinkInnov-NexGen",
    description: "Digital transformation with the Product Data Maturity Model (PDMM): four maturity levels, the digital thread across PLM, ERP and MES, the digital factory and the digital outcomes they support.",
    active: "digital",
    crumbs,
    body: [
      c.pageHero({
        kicker: d.kicker, title: d.title, intro: d.intro, crumbs,
        aside: `<figure class="fig fig-plain">${diagrams.maturitySteps()}<figcaption><span class="fig-no">Fig.</span> Four levels of product data maturity, PDMM L1 to L4.</figcaption></figure>`,
      }),
      start(), pdmm(), thread(), integration(), factory(), outcomes(), views(),
      c.ctaBand({
        title: "Discuss digital transformation",
        text: d.pdmm.text,
        actions: [[c.contactHref({ type: "dx" }), "Discuss digital transformation"], [site.page("services.html#pre-implementation"), "Consulting services", "ghost"]],
      }),
    ].join("\n"),
  };
}

module.exports = { routes: [{ path: "digital-transformation.html", render }] };
