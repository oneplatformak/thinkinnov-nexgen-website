/** Home page: one continuous story from problem to contact. */
const site = require("../lib/site");
const icons = require("../lib/icons");
const { esc, verbatim, pad2 } = require("../lib/html");
const c = require("../lib/components");
const diagrams = require("../lib/diagrams");
const { lifecycle } = require("../features/lifecycle");
const content = require("../content");
const config = require("../config");
const jaQuotes = require("../i18n/ja-testimonials");

function hero() {
  const m = content.heroMessages;
  return `<section class="hero" id="home">
    <div class="container hero-grid">
      <div class="hero-text">
        <p class="badge">${esc(m.partner.label)}</p>
        <h1>Connect your product lifecycle. <span class="h1-accent">Innovate more, and faster.</span></h1>
        <p class="lead">${esc(content.homeAbout.text)}</p>
        <div class="actions">
          ${c.button(c.contactHref({ type: "consultation" }), "Book a PLM consultation")}
          ${c.button(site.page("solutions.html#finder"), "Find by business need", "ghost")}
        </div>
        <dl class="hero-facts">
          <div><dt>Head office</dt><dd>Harumi, Tokyo</dd></div>
          <div><dt>Branch offices</dt><dd><span>Nagaoka</span> · <span>Coimbatore</span> · <span>Chennai</span></dd></div>
          <div><dt>Siemens portfolio</dt><dd>${content.products.map((p) => verbatim(p.name)).join(" · ")}</dd></div>
        </dl>
      </div>
      ${diagrams.heroLoop()}
    </div>
  </section>`;
}

function messages() {
  const items = Object.values(content.heroMessages)
    .map(
      (m, i) => `<article class="message">
          <p class="marker"><span class="marker-n">${pad2(i + 1)}</span><span>${esc(m.label)}</span></p>
          <h2>${esc(m.title)}</h2>
          <p>${esc(m.text)}</p>
        </article>`
    )
    .join("");
  return `<section class="messages" aria-label="Key messages"><div class="container messages-grid">${items}</div></section>`;
}

function about() {
  return `<section class="section" id="about">
    <div class="container split split-wide-left">
      <div>
        <p class="marker"><span class="marker-n">01</span><span>${esc(content.supportingLines.coCreated)}</span></p>
        <h2 class="display">${esc(content.homeAbout.title)}</h2>
      </div>
      <div class="prose">
        <p class="lead">${esc(content.supportingLines.foundation)}</p>
        <p>${esc(content.about.intro)}</p>
        ${diagrams.approachStrip()}
        ${c.linkArrow(site.page("about.html"), "About ThinkInnov-NexGen")}
      </div>
    </div>
  </section>`;
}

function problems() {
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
  return `<section class="section section-tint" id="problem">
    <div class="container">
      ${c.sectionHead({ n: 2, kicker: "Problems we solve", title: content.behind.problemText })}
      <ol class="problems">${items}</ol>
    </div>
  </section>`;
}

function lifecycleSection() {
  return `<section class="section section-dark" id="plm">
    <div class="container">
      ${c.sectionHead({ n: 3, kicker: content.homePlm.title, title: "One connected lifecycle, from idea to continuous improvement", text: content.homePlm.text })}
      ${lifecycle()}
    </div>
  </section>`;
}

function services() {
  const labels = ["Before", "During", "After"];
  const phases = content.services
    .map(
      (phase, i) => `<li class="phase">
          <p class="phase-when">${labels[i]}</p>
          <h3><a href="${site.page(`services.html#${phase.key}`)}">${esc(phase.title)}</a></h3>
          <dl>${phase.blocks
            .map(([label, items]) => `<div><dt>${esc(label)}</dt>${items.length ? `<dd><ul class="inline-list">${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></dd>` : ""}</div>`)
            .join("")}</dl>
        </li>`
    )
    .join("");
  return `<section class="section" id="services">
    <div class="container">
      ${c.sectionHead({ n: 4, kicker: content.servicesIntro.kicker, title: "Before, during and after implementation", text: content.servicesIntro.home, link: [site.page("services.html"), "All services"] })}
      <ol class="phases">${phases}</ol>
    </div>
  </section>`;
}

function stageNames(key) {
  const stages = content.productStages[key];
  if (stages.length === content.lifecycle.length) return "Every stage";
  if (!stages.length) return "Not tied to a single stage";
  return stages.map((s) => content.lifecycle.find((l) => l.key === s).title).join(", ");
}

function products() {
  const rows = content.products
    .map(
      (p) => `<li>
          <a class="portfolio-row" href="${site.page(`products.html#${p.key}`)}">
            ${c.productMark(p)}
            <span class="portfolio-name">${esc(p.name)}</span>
            <span class="portfolio-cat">${esc(p.category)}</span>
            <span class="portfolio-text">${esc(p.text)}</span>
            <span class="portfolio-stage"><span class="portfolio-stage-label">Lifecycle stage</span> ${esc(stageNames(p.key))}</span>
            ${icons.arrow}
          </a>
        </li>`
    )
    .join("");
  return `<section class="section section-tint" id="products">
    <div class="container">
      ${c.sectionHead({ n: 5, kicker: content.productsIntro.kicker, title: "Six Siemens products, and where each one sits", text: content.productsIntro.home, link: [site.page("products.html"), "All products"] })}
      <ul class="portfolio">${rows}</ul>
    </div>
  </section>`;
}

function solutions() {
  const items = content.homeSolutionOrder
    .map((key, i) => {
      const s = content.solutionByKey[key];
      return `<li><a href="${site.page(`solutions.html#${s.key}`)}"><span class="index-n">${pad2(i + 1)}</span><span class="index-title">${esc(s.homeTitle)}</span><span class="index-text">${esc(s.homeText)}</span></a></li>`;
    })
    .join("");
  return `<section class="section" id="solutions">
    <div class="container split split-sticky">
      <div>
        ${c.sectionHead({ n: 6, kicker: content.solutionsIntro.kicker, title: "Solutions", text: content.solutionsIntro.home })}
        <div class="callout">
          <h3>Start from your business need</h3>
          <p>Choose the problem you want to solve and see the solutions, products and services our site relates to it.</p>
          ${c.button(site.page("solutions.html#finder"), "Open the finder", "ghost")}
        </div>
      </div>
      <div>
        <ol class="index-list">${items}</ol>
        ${c.linkArrow(site.page("solutions.html"), "All 15 solutions")}
      </div>
    </div>
  </section>`;
}

function industries() {
  const items = content.industries
    .map((ind) => `<li><a href="${site.page(`industries.html#${ind.key}`)}"><span class="index-n">${pad2(ind.n)}</span><span>${esc(ind.title)}</span>${icons.arrow}</a></li>`)
    .join("");
  return `<section class="section section-tint" id="industries">
    <div class="container split">
      <div>
        ${c.sectionHead({ n: 7, kicker: content.industriesIntro.kicker, title: content.industriesIntro.sectionTitle, text: content.industriesIntro.page, link: [site.page("industries.html"), "All industries"] })}
        ${c.conceptual("siemens-digital-industry", "Conceptual image of an automated factory floor", { sizes: "(min-width: 900px) 38vw, 100vw" })}
      </div>
      <ul class="link-list">${items}</ul>
    </div>
  </section>`;
}

function plmForEveryone() {
  const sizes = content.plm.businessSize.cards
    .map(([key, title, text]) => `<li><h3>${esc(title)}</h3><p>${esc(text)}</p></li>`)
    .join("");
  const deploy = content.deployment
    .map((d) => `<li>${icons[d.icon]}<div><h4>${esc(d.title)}</h4><p>${esc(d.text)}</p></div></li>`)
    .join("");
  return `<section class="section" id="plm-for-everyone">
    <div class="container">
      ${c.sectionHead({ n: 8, kicker: content.plm.title, title: content.plm.intro, link: [site.page("plm.html"), "PLM For Everyone"] })}
      <ul class="sizes">${sizes}</ul>
      <div class="deploy">
        <div class="deploy-head">
          <h3>${esc(content.supportingLines.plmYourWay)}</h3>
          <p>${esc(content.supportingLines.plmYourWayText)}</p>
          <p class="deploy-note">${esc(content.supportingLines.delivery)}</p>
        </div>
        <ul class="deploy-list">${deploy}</ul>
      </div>
    </div>
  </section>`;
}

function quote(t, featured) {
  const translation = site.isJa() && jaQuotes[t.name]
    ? `<p class="quote-translation" lang="ja"><span class="quote-translation-label">${verbatim("参考訳")}</span>${verbatim(jaQuotes[t.name])}</p>`
    : "";
  return `<figure class="quote${featured ? " quote-featured" : ""}">
          <blockquote lang="en"><p>${verbatim(t.quote)}</p></blockquote>
          ${translation}
          <figcaption><span class="quote-name" translate="no">${verbatim(t.name)}</span>${t.role ? `<span class="quote-role" translate="no">${verbatim(t.role)}</span>` : ""}</figcaption>
        </figure>`;
}

function proof() {
  const featured = content.testimonials.find((t) => t.featured);
  const others = content.testimonials.filter((t) => !t.featured);
  const note = site.isJa() ? `<p class="quote-note">${verbatim("お客様の声は英語の原文を正とし、日本語は参考訳として併記しています。")}</p>` : "";
  return `<section class="section section-tint" id="customers">
    <div class="container">
      ${c.sectionHead({ n: 9, kicker: "Customers", title: content.customersIntro.title, text: content.customersIntro.text })}
      ${c.logoWall()}
    </div>
  </section>
  <section class="section" id="testimonials">
    <div class="container">
      ${c.sectionHead({ n: 10, kicker: "Testimonials", title: content.testimonialsIntro.title, text: content.testimonialsIntro.text })}
      <div class="quotes">
        ${quote(featured, true)}
        <div class="quotes-rest">${others.map((t) => quote(t)).join("")}</div>
      </div>
      ${note}
    </div>
  </section>`;
}

function presence() {
  const p = content.about.partnership;
  return `<section class="section section-tint" id="presence">
    <div class="container split">
      <div>
        ${c.sectionHead({ n: 11, kicker: "Japan and India", title: p.title, text: p.intro, link: [site.page("about.html#partnership"), p.label] })}
      </div>
      <div>
        ${diagrams.presenceLine()}
        <p class="presence-note">${esc(content.about.identity.cards[2][1])}</p>
        ${c.linkArrow(site.page("about.html#profile"), "Company profile")}
      </div>
    </div>
  </section>`;
}

function contact() {
  const actions = [
    ["demo", "Request a product demonstration", "See a Siemens product with our team."],
    ["consultation", "Book a PLM consultation", "Talk through your product data and processes."],
    ["dx", "Discuss digital transformation", "Start from the Product Data Maturity Model."],
    ["support", "Ask about support", "L1, L2 and L3 support and enhancements."],
  ]
    .map(
      ([type, label, text]) =>
        `<li><a href="${c.contactHref({ type })}"><span class="action-label">${esc(label)}</span><span class="action-text">${esc(text)}</span>${icons.arrow}</a></li>`
    )
    .join("");
  return `<section class="section section-dark closing" id="contact">
    <div class="container split">
      <div>
        <p class="marker"><span class="marker-n">12</span><span>Contact</span></p>
        <h2 class="display">${esc(content.contactIntro.title)}</h2>
        <p class="lead">${esc(content.contactIntro.text)}</p>
        <ul class="contact-lines">
          <li>${icons.phone}<a href="tel:${config.phoneTel}">${esc(config.phoneDisplay)}</a></li>
          <li>${icons.mail}<a href="mailto:${config.email}">${esc(config.email)}</a></li>
          <li>${icons.map}<a href="${config.mapUrl}" target="_blank" rel="noopener">${esc(config.addressSingle)}<span class="visually-hidden"> (opens map in a new tab)</span></a></li>
        </ul>
      </div>
      <ul class="action-list">${actions}</ul>
    </div>
  </section>`;
}

function render() {
  return {
    title: "ThinkInnov-NexGen | PLM consulting, implementation and support in Japan",
    description: "ThinkInnov-NexGen, a Siemens Solution Partner in Tokyo, provides PLM consulting, implementation and support around NX, Solid Edge, Capital, Teamcenter, Tecnomatix and Mendix.",
    active: "home",
    bodyClass: "page page-home",
    crumbs: [{ label: "Home", path: "" }],
    body: [hero(), messages(), about(), problems(), lifecycleSection(), services(), products(), solutions(), industries(), plmForEveryone(), proof(), presence(), contact()].join("\n"),
  };
}

module.exports = { routes: [{ path: "", render }], quote };
