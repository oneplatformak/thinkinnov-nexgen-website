/** Digital Transformation: the Product Data Maturity Model as a progression, then outcomes. */
const site = require("../lib/site");
const { esc, pad2 } = require("../lib/html");
const c = require("../lib/components");
const diagrams = require("../lib/diagrams");
const content = require("../content");

const d = content.digitalTransformation;

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
  return `<section class="section" id="pdmm">
    <div class="container">
      ${c.sectionHead({ n: 1, kicker: "PDMM", title: d.pdmm.title, text: d.pdmm.text })}
      <ol class="levels">${levels}</ol>
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
        ${c.sectionHead({ n: 2, kicker: "Outcomes", title: d.outcomes.title })}
        ${c.relatedList([
          [site.page("#lifecycle"), "The connected product lifecycle", "Where products and solutions sit"],
          [site.page("solutions.html#need-unlock-data"), "Gaining insight from product data", "Finder"],
          [site.page("solutions.html#need-predict"), "Predicting product performance earlier", "Finder"],
        ])}
      </div>
      <ul class="outcomes">${cards}</ul>
    </div>
  </section>`;
}

function render() {
  const crumbs = c.crumbsFor(d.title, "digital-transformation.html");
  return {
    title: "Digital Transformation | ThinkInnov-NexGen",
    description: "Digital transformation with the Product Data Maturity Model (PDMM): four maturity levels from system definition to innovation platform, and the digital outcomes they support.",
    active: "digital",
    crumbs,
    body: [
      c.pageHero({
        kicker: d.kicker, title: d.title, intro: d.intro, crumbs,
        aside: `<figure class="fig fig-plain">${diagrams.maturitySteps()}<figcaption><span class="fig-no">Fig.</span> Four levels of product data maturity, PDMM L1 to L4.</figcaption></figure>`,
      }),
      pdmm(), outcomes(),
      c.ctaBand({
        title: "Discuss digital transformation",
        text: d.pdmm.text,
        actions: [[c.contactHref({ type: "dx" }), "Discuss digital transformation"], [site.page("services.html#pre-implementation"), "Consulting services", "ghost"]],
      }),
    ].join("\n"),
  };
}

module.exports = { routes: [{ path: "digital-transformation.html", render }] };
