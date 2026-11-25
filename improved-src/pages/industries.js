/** Industries: all 11, each with its original infographic. */
const site = require("../lib/site");
const icons = require("../lib/icons");
const { esc, pad2 } = require("../lib/html");
const c = require("../lib/components");
const content = require("../content");

function industry(ind) {
  const file = `assets/img/industries/infographic-${pad2(ind.n)}.webp`;
  return `<article class="industry" id="${ind.key}">
        <div class="industry-text">
          <p class="industry-n">${pad2(ind.n)}</p>
          <h2>${esc(ind.title)}</h2>
          <p>${esc(ind.text)}</p>
          ${c.linkArrow(c.contactHref({ type: "consultation", topic: `industry-${ind.key}` }), "Discuss PLM for this industry")}
        </div>
        <figure class="industry-figure">
          <a href="${site.asset(file)}" data-lightbox data-width="1600" data-height="900" data-caption="Infographic: ${esc(ind.title)}">
            <img src="${site.asset(file)}" width="1600" height="900" alt="Infographic: ${esc(ind.title)}" loading="lazy" decoding="async">
            <span class="gallery-open">${icons.expand}<span class="visually-hidden">Enlarge infographic</span></span>
          </a>
        </figure>
      </article>`;
}

function index() {
  return `<nav class="industry-index" aria-label="Industries">
        <ol>${content.industries
          .map((ind) => `<li><a href="#${ind.key}"><span class="index-n">${pad2(ind.n)}</span><span>${esc(ind.title)}</span></a></li>`)
          .join("")}</ol>
      </nav>`;
}

function render() {
  const crumbs = c.crumbsFor("Industries", "industries.html");
  const intro = content.industriesIntro;
  return {
    title: "Industries | ThinkInnov-NexGen",
    description: "Industry-specific PLM: component manufacturers, PDM to PLM, and Teamcenter X for aerospace and defense, industrial machinery, automotive, battery, consumer products, electronics and marine.",
    active: "industries",
    crumbs,
    body: [
      c.pageHero({ kicker: intro.kicker, title: "Industries", intro: intro.page, crumbs }),
      `<section class="section">
        <div class="container industries-layout">
          <aside class="industries-aside">
            <p class="page-index-title">${esc(intro.sectionTitle)}</p>
            ${index()}
          </aside>
          <div class="industries-list">${content.industries.map(industry).join("")}</div>
        </div>
      </section>`,
      c.ctaBand({
        title: "Talk to us about PLM in your industry",
        text: content.customersIntro.text,
        actions: [[c.contactHref({ type: "consultation" }), "Book a PLM consultation"], [site.page("solutions.html#finder"), "Find by business need", "ghost"]],
      }),
    ].join("\n"),
  };
}

module.exports = { routes: [{ path: "industries.html", render }] };
