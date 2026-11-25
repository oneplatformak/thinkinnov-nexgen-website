/** About Us: identity, principles, gallery, leadership, partnership, company profile. */
const site = require("../lib/site");
const icons = require("../lib/icons");
const { esc, verbatim, pad2 } = require("../lib/html");
const c = require("../lib/components");
const diagrams = require("../lib/diagrams");
const content = require("../content");
const config = require("../config");
const { webpSize } = require("../lib/imagesize");

const a = content.about;

function pageIndex(items) {
  return `<nav class="page-index" aria-label="On this page">
        <p class="page-index-title">On this page</p>
        <ol>${items.map(([id, label], i) => `<li><a href="#${id}"><span class="index-n">${pad2(i + 1)}</span><span>${esc(label)}</span></a></li>`).join("")}</ol>
      </nav>`;
}

function identity() {
  const cards = a.identity.cards.map(([title, text]) => `<div><dt>${esc(title)}</dt><dd>${esc(text)}</dd></div>`).join("");
  return `<section class="section" id="identity">
    <div class="container split split-wide-left">
      <div>
        ${c.sectionHead({ n: 1, kicker: "Identity", title: a.identity.title, text: a.identity.text })}
        <dl class="facts">${cards}</dl>
      </div>
      <figure class="photo photo-tall">
        <img src="${site.asset("assets/img/about-office.webp")}" srcset="${site.asset("assets/img/about-office-640.webp")} 640w, ${site.asset("assets/img/about-office.webp")} 900w" sizes="(min-width: 900px) 34vw, 100vw" width="900" height="1600" alt="A group cutting a red ribbon at the office entrance" loading="lazy" decoding="async">
      </figure>
    </div>
  </section>`;
}

function principles() {
  const cards = a.principles.cards
    .map(([title, text], i) => `<li><span class="principle-n" aria-hidden="true">${pad2(i + 1)}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></li>`)
    .join("");
  return `<section class="section section-tint" id="principles">
    <div class="container">
      ${c.sectionHead({ n: 2, kicker: "Principles", title: a.principles.title })}
      <ul class="principles">${cards}</ul>
    </div>
  </section>`;
}

function gallery() {
  const items = a.gallery
    .map((g, i) => {
      const [tw, th] = webpSize(g.thumb);
      return `<li class="${g.height > g.width ? "is-portrait" : "is-landscape"}">
          <a href="${site.asset(g.full)}" data-lightbox data-width="${g.width}" data-height="${g.height}" data-caption="${esc(g.alt)}">
            <img src="${site.asset(g.thumb)}" width="${tw}" height="${th}" alt="${esc(g.alt)}" loading="lazy" decoding="async">
            <span class="gallery-open">${icons.expand}<span class="visually-hidden">Enlarge photo ${i + 1} of ${a.gallery.length}</span></span>
          </a>
        </li>`;
    })
    .join("");
  return `<section class="section" id="gallery">
    <div class="container">
      ${c.sectionHead({ n: 3, kicker: "Gallery", title: a.galleryTitle, text: a.galleryText })}
      <ul class="gallery">${items}</ul>
    </div>
  </section>`;
}

function leadership() {
  return `<section class="section section-tint" id="leadership">
    <div class="container">
      ${c.sectionHead({ n: 4, kicker: "Leadership", title: a.leadershipTitle, text: a.leadershipText })}
      <ul class="people">${a.leaders.map((p) => c.person(p)).join("")}</ul>
      <p class="after-list">${c.linkArrow(site.page("behind-the-brand.html#team"), "Meet the delivery team")}</p>
    </div>
  </section>`;
}

function partnership() {
  const p = a.partnership;
  const items = p.items.map((text, i) => `<li><span class="index-n">${pad2(i + 1)}</span><span>${esc(text)}</span></li>`).join("");
  return `<section class="section section-dark" id="partnership">
    <div class="container split">
      <div>
        ${c.sectionHead({ n: 5, kicker: "Partnership", title: p.title, text: p.intro })}
      </div>
      <div>
        <h3 class="list-title">${esc(p.label)}</h3>
        <ol class="drivers">${items}</ol>
      </div>
    </div>
  </section>`;
}

function profile() {
  const rows = a.profile
    .map(([label, value]) => {
      let cell;
      if (value === "map-link") cell = `<a href="${config.mapUrl}" target="_blank" rel="noopener">Click here to view map<span class="visually-hidden"> (opens in a new tab)</span></a>`;
      else if (Array.isArray(value)) cell = value.map((v) => esc(v)).join("<br>");
      else if (label === "Head Office") cell = verbatim(value);
      else cell = `<span translate="no">${verbatim(value)}</span>`;
      return `<div><dt>${esc(label)}</dt><dd>${cell}</dd></div>`;
    })
    .join("");
  return `<section class="section" id="profile">
    <div class="container split">
      <div>
        ${c.sectionHead({ n: 6, kicker: "Profile", title: a.profileTitle, text: a.profileText })}
        ${diagrams.presenceLine()}
      </div>
      <dl class="profile">${rows}</dl>
    </div>
  </section>`;
}

function render() {
  const index = pageIndex([
    ["identity", a.identity.title], ["principles", a.principles.title], ["gallery", a.galleryTitle],
    ["leadership", a.leadershipTitle], ["partnership", "Partnership in Japan"], ["profile", a.profileTitle],
  ]);
  return {
    title: "About Us | ThinkInnov-NexGen",
    description: "ThinkInnov-NexGen profile: who we are, vision, mission and values, gallery, executive leadership, the strategic partnership in Japan and the company profile.",
    active: "about",
    crumbs: c.crumbsFor("About Us", "about.html"),
    body: [
      c.pageHero({ kicker: a.kicker, title: a.title, intro: a.intro, crumbs: c.crumbsFor("About Us", "about.html"), aside: index }),
      identity(), principles(), gallery(), leadership(), partnership(), profile(),
      c.ctaBand({
        title: content.contactIntro.title,
        text: content.contactIntro.text,
        actions: [[c.contactHref({ type: "general" }), "Contact us"], [site.page("careers.html"), "Careers", "ghost"]],
      }),
    ].join("\n"),
  };
}

module.exports = { routes: [{ path: "about.html", render }], pageIndex };
