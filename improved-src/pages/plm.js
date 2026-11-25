/** PLM For Everyone: benefits, business sizes, NPD process, deployment, why us. */
const site = require("../lib/site");
const icons = require("../lib/icons");
const { esc, pad2 } = require("../lib/html");
const c = require("../lib/components");
const { pageIndex } = require("./about");
const content = require("../content");

const p = content.plm;

function benefits() {
  const cards = p.benefits.cards
    .map(([title, text], i) => `<li><span class="index-n">${pad2(i + 1)}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></li>`)
    .join("");
  return `<section class="section" id="benefits">
    <div class="container split split-sticky">
      <div>${c.sectionHead({ n: 1, kicker: "Why PLM", title: p.benefits.title, text: p.benefits.text })}</div>
      <ul class="grid-2x2">${cards}</ul>
    </div>
  </section>`;
}

function businessSize() {
  const cards = p.businessSize.cards
    .map(
      ([key, title, text], i) => `<li class="tier tier-${i + 1}" id="size-${key}">
          <p class="tier-scale" aria-hidden="true"><i></i><i></i><i></i></p>
          <h3>${esc(title)}</h3>
          <p>${esc(text)}</p>
          <p class="tier-links">${c.linkArrow(site.page(`solutions.html?size=${key}#finder`), "Find by business need")}${c.linkArrow(c.contactHref({ type: "consultation", size: key }), "Talk to us about your situation")}</p>
        </li>`
    )
    .join("");
  return `<section class="section section-tint" id="business-size">
    <div class="container">
      ${c.sectionHead({ n: 2, kicker: "Company size", title: p.businessSize.title, text: p.intro })}
      <ul class="tiers">${cards}</ul>
    </div>
  </section>`;
}

function npd() {
  const steps = p.npd.cards
    .map(([title, text], i) => `<li><span class="step-n">${pad2(i + 1)}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></li>`)
    .join("");
  return `<section class="section" id="npd">
    <div class="container">
      ${c.sectionHead({ n: 3, kicker: "Process", title: p.npd.title })}
      <ol class="steps">${steps}</ol>
      <p class="after-list">${c.linkArrow(site.page("#lifecycle"), "See the whole product lifecycle")}</p>
    </div>
  </section>`;
}

function deployment() {
  const list = content.deployment
    .map((d) => `<li>${icons[d.icon]}<div><h3>${esc(d.title)}</h3><p>${esc(d.text)}</p></div></li>`)
    .join("");
  return `<section class="section section-tint" id="deployment">
    <div class="container split">
      <div>${c.sectionHead({ n: 4, kicker: "Deployment", title: content.supportingLines.plmYourWay, text: content.supportingLines.plmYourWayText })}
        <p class="note">${esc(content.supportingLines.delivery)}</p>
      </div>
      <ul class="deploy-list deploy-list-lg">${list}</ul>
    </div>
  </section>`;
}

function why() {
  const cards = p.why.cards.map(([title, text]) => `<div><dt>${esc(title)}</dt><dd>${esc(text)}</dd></div>`).join("");
  return `<section class="section" id="why">
    <div class="container split">
      <div>${c.sectionHead({ n: 5, kicker: "Why us", title: p.why.title })}</div>
      <dl class="facts facts-lg">${cards}</dl>
    </div>
  </section>`;
}

function render() {
  const crumbs = c.crumbsFor(p.title, "plm.html");
  const index = pageIndex([
    ["benefits", p.benefits.title], ["business-size", p.businessSize.title], ["npd", p.npd.title],
    ["deployment", "Deployment options"], ["why", p.why.title],
  ]);
  return {
    title: "PLM For Everyone | ThinkInnov-NexGen",
    description: "PLM for startups, SMBs and enterprises: the benefits of PLM, the new product development process, deployment options and why ThinkInnov-NexGen for PLM.",
    active: "plm",
    crumbs,
    body: [
      c.pageHero({ kicker: p.kicker, title: p.title, intro: p.intro, crumbs, aside: index }),
      benefits(), businessSize(), npd(), deployment(), why(),
      c.ctaBand({
        title: "Book a PLM consultation",
        text: content.servicesIntro.page,
        actions: [[c.contactHref({ type: "consultation" }), "Book a PLM consultation"], [site.page("solutions.html#finder"), "Find by business need", "ghost"]],
      }),
    ].join("\n"),
  };
}

module.exports = { routes: [{ path: "plm.html", render }] };
