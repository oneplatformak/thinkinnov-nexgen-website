/**
 * Industries: all 11. Nine are shown with the image the original site had
 * (`ind.image`); two have none, by the owner's decision, and use the layout
 * without an image.
 */
const site = require("../lib/site");
const icons = require("../lib/icons");
const { esc, pad2 } = require("../lib/html");
const c = require("../lib/components");
const content = require("../content");

function relations(ind) {
  const rel = content.industryRelations[ind.key];
  const groups = [];
  if (rel.products.length) {
    groups.push(["Siemens product named", `<ul class="chips">${rel.products
      .map((key) => {
        const p = content.productByKey[key];
        return `<li><a class="chip chip-product" href="${site.page(content.productPath(p.key))}">${c.productMark(p, "sm")}<span><span class="chip-label">${esc(p.name)}</span><span class="chip-small">${esc(p.category)}</span></span></a></li>`;
      })
      .join("")}</ul>`]);
  }
  if (rel.solutions.length) {
    groups.push(["Related solutions", `<ul class="plain-list">${rel.solutions.map((key) => `<li><a href="${site.page(`solutions.html#${key}`)}">${esc(content.solutionByKey[key].title)}</a></li>`).join("")}</ul>`]);
  }
  // Following a need from here opens the finder with this industry as context.
  const needs = rel.needs.map((key) => `<li><a href="${site.page(`solutions.html?industry=${ind.key}#need-${key}`)}">${esc(content.needByKey[key].title)}</a></li>`);
  const links = (rel.links || []).map(([href, label]) => `<li><a href="${site.page(href)}">${esc(label)}</a></li>`);
  if (needs.length) groups.push(["Related business needs", `<ul class="plain-list">${needs.join("")}</ul>`]);
  if (links.length) groups.push(["Related on this site", `<ul class="plain-list">${links.join("")}</ul>`]);
  return `<dl class="industry-rel${ind.image ? "" : " industry-rel-rows"}">${groups.map(([title, html]) => `<div><dt>${esc(title)}</dt><dd>${html}</dd></div>`).join("")}</dl>`;
}

function actions(ind) {
  return `<p class="industry-actions">
            ${c.linkArrow(c.contactHref({ type: "consultation", topic: `industry-${ind.key}`, industry: ind.key }), "Discuss PLM for this industry")}
            ${c.linkArrow(site.page(`solutions.html?industry=${ind.key}#finder`), "Find by business need")}
          </p>`;
}

function head(ind) {
  return `<p class="industry-n">${pad2(ind.n)}</p>
          <h2>${esc(ind.title)}</h2>
          <p>${esc(ind.text)}</p>`;
}

/**
 * An entry without an image. The same three parts in the same order, but as
 * three cells of the card's grid: from 800px the relations take the column
 * that holds the image in the other cards, as ruled rows, and the links sit
 * under the description.
 */
function industryWithoutImage(ind) {
  return `<article class="industry industry-plain" id="${ind.key}">
        <div class="industry-text">
          ${head(ind)}
        </div>
        <div class="industry-side">${relations(ind)}</div>
        ${actions(ind)}
      </article>`;
}

function industry(ind) {
  if (!ind.image) return industryWithoutImage(ind);
  const file = `assets/img/industries/infographic-${pad2(ind.image)}.webp`;
  return `<article class="industry" id="${ind.key}">
        <div class="industry-text">
          ${head(ind)}
          ${relations(ind)}
          ${actions(ind)}
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
      `<div class="page-note"><div class="container"><p class="note note-wide">Each card is reading material for one kind of manufacturer, shown with the related products, solutions and business needs on this site. The cards are not a list of customer projects.</p></div></div>`,
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
        text: content.contactIntro.text,
        actions: [[c.contactHref({ type: "consultation" }), "Book a PLM consultation"], [site.page("solutions.html#finder"), "Find by business need", "ghost"]],
      }),
    ].join("\n"),
  };
}

module.exports = { routes: [{ path: "industries.html", render }] };
