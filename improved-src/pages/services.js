/** Services: what happens before, during and after implementation. */
const site = require("../lib/site");
const { esc, pad2 } = require("../lib/html");
const c = require("../lib/components");
const content = require("../content");

const WHEN = ["Before", "During", "After"];
const ENQUIRY = ["consultation", "implementation", "support"];
const ENQUIRY_LABEL = ["Book a PLM consultation", "Discuss an implementation", "Ask about support"];

function phase(svc, i) {
  const blocks = svc.blocks
    .map(
      ([label, items]) => `<div class="svc-block">
            <h3>${esc(label)}</h3>
            ${items.length ? `<ul class="ticks">${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}
          </div>`
    )
    .join("");
  return `<section class="svc" id="${svc.key}">
        <header class="svc-head">
          <p class="svc-when"><span class="marker-n">${pad2(i + 1)}</span> ${WHEN[i]}</p>
          <h2>${esc(svc.title)}</h2>
          ${c.linkArrow(c.contactHref({ type: ENQUIRY[i], topic: `service-${svc.key}` }), ENQUIRY_LABEL[i])}
        </header>
        <div class="svc-blocks">${blocks}</div>
      </section>`;
}

function rail() {
  return `<ol class="rail" aria-label="Service phases">${content.services
    .map((svc, i) => `<li><a href="#${svc.key}"><span class="rail-when">${WHEN[i]}</span><span class="rail-title">${esc(svc.title)}</span></a></li>`)
    .join("")}</ol>`;
}

function render() {
  const crumbs = c.crumbsFor("Services", "services.html");
  const intro = content.servicesIntro;
  return {
    title: "Services | ThinkInnov-NexGen",
    description: "Pre-implementation, implementation and post-implementation services: consulting, solution mapping, development, deployment, L1 to L3 support and enhancements.",
    active: "services",
    crumbs,
    body: [
      c.pageHero({ kicker: intro.kicker, title: "Services", intro: intro.page, crumbs, aside: rail() }),
      `<div class="section"><div class="container">
        <p class="section-text svc-intro">${esc(intro.home)}</p>
        ${content.services.map(phase).join("")}
      </div></div>`,
      c.ctaBand({
        title: "Tell us where you are in your PLM journey",
        text: intro.boardText,
        actions: [[c.contactHref({ type: "consultation" }), "Book a PLM consultation"], [site.page("solutions.html#finder"), "Find by business need", "ghost"]],
      }),
    ].join("\n"),
  };
}

module.exports = { routes: [{ path: "services.html", render }] };
