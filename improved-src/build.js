#!/usr/bin/env node
/**
 * Generates the finished static site into ../improved/
 */
const fs = require("fs");
const path = require("path");
const content = require("./content");
const L = require("./layout");
const { esc, asset, pageShell, pageHero, sectionNav, ctaBand, contactFormFields, orgJsonLd, config, icons } =
  L;

const OUT = path.join(__dirname, "..", "improved");

function write(rel, html) {
  const dest = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  console.log("wrote", rel);
}

function cards(items, className = "card-grid") {
  return `<div class="${className}">${items
    .map(
      ([title, body], i) =>
        `<article class="card" data-reveal style="--i:${i}"><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`
    )
    .join("")}</div>`;
}

function customerLogos(depth = 0) {
  const a = (p) => asset(p, depth);
  const items = content.customers
    .map(
      ([file, name]) =>
        `<li class="customer-logo"><img src="${a(`assets/img/customers/${file}.webp`)}" alt="${esc(name)} logo" width="160" height="80" loading="lazy" decoding="async"></li>`
    )
    .join("");
  const dup = content.customers
    .map(
      ([file, name]) =>
        `<li class="customer-logo" aria-hidden="true"><img src="${a(`assets/img/customers/${file}.webp`)}" alt="" width="160" height="80" loading="lazy" decoding="async"></li>`
    )
    .join("");
  return `
  <div class="customer-marquee" aria-label="Our key customers">
    <ul class="customer-track">${items}</ul>
    <ul class="customer-track" aria-hidden="true">${dup}</ul>
  </div>`;
}

function contactFormBlock(depth = 0, id = "contact") {
  const a = (p) => asset(p, depth);
  return `
  <form class="contact-form" action="${a("contact.php")}" method="post" data-form="contact" novalidate>
    ${contactFormFields(id)}
  </form>`;
}

/* ========== HOME ========== */
function buildHome() {
  const depth = 0;
  const a = (p) => asset(p, depth);
  const body = `
  <section class="hero" id="home" data-hero>
    <div class="hero-media">
      <img src="${a("assets/img/visuals/hero-engineering.webp")}" alt="" width="1920" height="1080" fetchpriority="high" decoding="async">
      <div class="hero-scrim"></div>
    </div>
    <div class="container hero-content">
      <p class="eyebrow hero-badge">Siemens Solution Partner</p>
      <h1>Your partner for innovation and digital transformation</h1>
      <p class="hero-lead">As experts in specific industries, innovative digital technologies and systems, we reliably meet your requirements using Siemens product and system portfolios.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#solutions">Explore solutions</a>
        <a class="btn btn-secondary" href="${a("contact.html")}">Contact us</a>
      </div>
      <div class="hero-pillars" data-hero-tabs>
        <div class="hero-tablist" role="tablist" aria-label="Focus areas">
          <button type="button" role="tab" aria-selected="true" aria-controls="pillar-1" id="tab-1">Siemens partner</button>
          <button type="button" role="tab" aria-selected="false" aria-controls="pillar-2" id="tab-2">Innovate faster</button>
          <button type="button" role="tab" aria-selected="false" aria-controls="pillar-3" id="tab-3">Mendix</button>
          <button type="button" class="hero-pause" data-hero-pause aria-pressed="false" aria-label="Pause rotation">${icons.pause}</button>
        </div>
        <div class="hero-panels">
          <div role="tabpanel" id="pillar-1" aria-labelledby="tab-1">
            <h2 class="visually-hidden">Siemens Solution Partner</h2>
            <p>Industry expertise with Siemens product and system portfolios for digital transformation.</p>
          </div>
          <div role="tabpanel" id="pillar-2" aria-labelledby="tab-2" hidden>
            <h2 class="visually-hidden">Innovate more and faster</h2>
            <p>Enable customers to innovate more and faster by reusing product lifecycle knowledge through innovative digital solutions.</p>
          </div>
          <div role="tabpanel" id="pillar-3" aria-labelledby="tab-3" hidden>
            <h2 class="visually-hidden">Mendix low-code</h2>
            <p>Mendix accelerates scalable business applications — build, integrate and deploy rapidly while improving collaboration and agility.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="about">
    <div class="container media-band">
      <figure class="media-frame" data-reveal>
        <img src="${a("assets/img/about-office.webp")}" alt="ThinkInnov-NexGen office workspace" width="900" height="1600" loading="lazy" decoding="async">
      </figure>
      <div class="rich-text" data-reveal>
        <p class="eyebrow">About us</p>
        <h2>End-to-end PLM solutions for consulting, mapping, implementation and adoption</h2>
        <p>ThinkInnov-NexGen combines PLM domain expertise, technical delivery and a consultative approach to help companies build a practical digital thread across product development.</p>
        <a class="text-link" href="${a("about.html")}">Know more ${icons.arrow}</a>
      </div>
    </div>
  </section>

  <section class="section section-ink" id="plm">
    <div class="container">
      <div class="section-head" data-reveal>
        <h2>Product Lifecycle Management</h2>
        <p>Collect, analyse and visualize data and processes throughout the product lifecycle. Create closed-loop analytics from development to manufacturing to real-world feedback and then back to design.</p>
      </div>
      <div class="card-grid three">
        <article class="card ink" data-reveal><span class="card-icon">${icons.building}</span><h3>On premises</h3><p>Host, manage and support your PLM software with your IT team.</p></article>
        <article class="card ink" data-reveal><span class="card-icon">${icons.cloud}</span><h3>On cloud</h3><p>Choose your cloud provider, managed by your IT team.</p></article>
        <article class="card ink" data-reveal><span class="card-icon">${icons.layers}</span><h3>On cloud, SaaS by Siemens</h3><p>Get started quickly using software as a service. Operation, maintenance and upgrades are included.</p></article>
      </div>
    </div>
  </section>

  <section class="section section-alt" id="services">
    <div class="container">
      <div class="section-head" data-reveal>
        <h2>Services</h2>
        <p>From startup to enterprise — we guide you to the right software solution, manage implementation, and provide training and ongoing support (sustenance) so you get the best value from your investment.</p>
      </div>
      <ol class="timeline three">
        ${["Pre-Implementation", "Implementation", "Post-Implementation"]
          .map((t, i) => {
            const svc = content.services[i];
            const items = svc.blocks.flatMap(([, list]) => list).slice(0, 6);
            return `<li class="timeline-step" data-reveal>
              <span class="step-num">${String(i + 1).padStart(2, "0")}</span>
              <h3>${esc(t)}</h3>
              <ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            </li>`;
          })
          .join("")}
      </ol>
      <a class="text-link" href="${a("services.html")}">Full services overview ${icons.arrow}</a>
    </div>
  </section>

  <section class="section" id="products">
    <div class="container">
      <div class="section-head center" data-reveal>
        <h2>Our catalogue of products</h2>
        <p>Core Siemens solutions for design, lifecycle management, manufacturing automation and low-code development.</p>
      </div>
      <div class="product-grid">
        ${content.products
          .map(
            ([name, mark, markText, sub]) =>
              `<a class="product-card" href="${a("products.html")}" data-reveal>
                <span class="product-mark ${mark}">${markText}</span>
                <h3>${esc(name)} <span>${esc(sub)}</span></h3>
              </a>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section section-alt" id="solutions">
    <div class="container">
      <div class="section-head center" data-reveal>
        <h2>Explore our solutions</h2>
        <p>Focused PLM and engineering solutions for product data, quality, change, integration and digital manufacturing.</p>
      </div>
      <div class="solution-grid">
        ${content.homeSolutionsPreview
          .map((title, i) => {
            const full = content.solutions.find((s) => s[0].startsWith(title.split(" /")[0].split(" Management")[0]) || s[0] === title || s[0].includes(title.replace(" / ", "/")));
            const body = full ? full[1] : content.solutions[i][1];
            const label = title;
            return `<article class="solution-card" data-reveal><h3>${esc(label)}</h3><p>${esc(body.length > 120 ? body.slice(0, 117) + "…" : body)}</p></article>`;
          })
          .join("")}
      </div>
      <a class="text-link" href="${a("solutions.html")}">All solutions ${icons.arrow}</a>
    </div>
  </section>

  <section class="section" id="customers">
    <div class="container">
      <div class="section-head center" data-reveal>
        <h2>Our key customers</h2>
        <p>Trusted by product-led teams across automotive, aerospace, energy, electrical and manufacturing industries.</p>
      </div>
      ${customerLogos(0)}
      <a class="text-link center-link" href="${a("industries.html")}">Industry focus ${icons.arrow}</a>
    </div>
  </section>

  <section class="section section-alt" id="testimonials">
    <div class="container">
      <div class="section-head center" data-reveal>
        <h2>What our clients say</h2>
        <p>Customer feedback from PLM upgrades, implementation pace and long-term support.</p>
      </div>
      <div class="testimonial-grid">
        ${content.testimonials
          .map(
            (t) => `<blockquote class="testimonial${t.featured ? " is-featured" : ""}" data-reveal>
              <p>“${esc(t.quote)}”</p>
              <footer><strong>${esc(t.name)}</strong>${t.role ? `<span>${esc(t.role)}</span>` : ""}</footer>
            </blockquote>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section section-ink" id="contact">
    <div class="container media-band contact-band">
      <div data-reveal>
        <p class="eyebrow">Contact us</p>
        <h2>We're here to help and answer any questions you might have.</h2>
        <p class="muted">We look forward to hearing from you.</p>
        <ul class="contact-facts">
          <li><a href="mailto:${config.email}">${icons.mail}<span>${esc(config.email)}</span></a></li>
          <li><a href="tel:${config.phoneTel}">${icons.phone}<span>${esc(config.phoneDisplay)}</span></a></li>
          <li><span>${icons.map}<span>${esc(config.addressSingle)}</span></span></li>
        </ul>
      </div>
      <div data-reveal>${contactFormBlock(0, "home-contact")}</div>
    </div>
  </section>`;

  write(
    "index.html",
    pageShell({
      title: "ThinkInnov-NexGen | PLM & Digital Transformation Partner",
      description:
        "ThinkInnov-NexGen provides end-to-end solutions in the PLM domain — business consulting, solution mapping, implementation and adoption services. Siemens Solution Partner in Tokyo.",
      path: "",
      active: "home",
      heroTransparent: true,
      jsonLd: orgJsonLd(),
      body,
    })
  );
}

/* ========== ABOUT ========== */
function buildAbout() {
  const a = content.about;
  const depth = 0;
  const as = (p) => asset(p, depth);
  const body = `
  ${pageHero({
    breadcrumb: [
      { href: "index.html", label: "Home" },
      { href: "about.html", label: "About Us" },
    ],
    kicker: a.kicker,
    h1: a.title,
  })}
  ${sectionNav([
    { id: "identity", label: "Who We Are" },
    { id: "principles", label: "Vision & Values" },
    { id: "gallery", label: "Gallery" },
    { id: "leadership", label: "Leadership" },
    { id: "partnership", label: "Partnership" },
    { id: "profile", label: "Company Profile" },
  ])}
  <section class="section" id="identity">
    <div class="container">
      <div class="section-head" data-reveal><h2>${esc(a.identity.title)}</h2><p>${esc(a.identity.text)}</p></div>
      ${cards(a.identity.cards)}
    </div>
  </section>
  <section class="section section-ink" id="principles">
    <div class="container">
      <div class="section-head" data-reveal><h2>${esc(a.principles.title)}</h2></div>
      ${cards(a.principles.cards, "card-grid three")}
    </div>
  </section>
  <section class="section" id="gallery">
    <div class="container">
      <div class="section-head" data-reveal><h2>Captured Moments</h2><p>A closer look at the spaces, collaborations and delivery culture behind the ThinkInnov-NexGen team.</p></div>
      <div class="gallery-grid" data-gallery>
        ${a.gallery
          .map(
            (g, i) => `<figure class="gallery-item">
              <button type="button" data-gallery-src="${as(g.full)}" data-gallery-alt="${esc(g.alt)}" data-gallery-index="${i}" aria-label="Open gallery image ${i + 1}">
                <img src="${as(g.thumb)}" alt="${esc(g.alt)}" width="600" height="400" loading="lazy" decoding="async">
              </button>
            </figure>`
          )
          .join("")}
      </div>
    </div>
  </section>
  <section class="section section-alt" id="leadership">
    <div class="container">
      <div class="section-head" data-reveal><h2>Executive Leadership</h2><p>ThinkInnov-NexGen is led by a hands-on leadership team focused on strategy, delivery quality and global growth.</p></div>
      <div class="people-grid">
        ${a.leaders
          .map(
            ([img, name, role]) => `<article class="person-card" data-reveal>
              <img src="${as(img)}" alt="${esc(name)}" width="400" height="500" loading="lazy" decoding="async">
              <h3>${esc(name)}</h3><p>${esc(role)}</p>
            </article>`
          )
          .join("")}
      </div>
    </div>
  </section>
  <section class="section" id="partnership">
    <div class="container">
      <article class="partnership-panel" data-reveal>
        <h2>${esc(a.partnership.title)}</h2>
        <p>${esc(a.partnership.intro)}</p>
        <h3>${esc(a.partnership.label)}</h3>
        <ul>${a.partnership.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      </article>
    </div>
  </section>
  <section class="section section-alt" id="profile">
    <div class="container">
      <div class="section-head" data-reveal><h2>Company Profile</h2><p>Key ThinkInnov-NexGen details for leadership, headquarters and branch offices.</p></div>
      <dl class="profile-table" data-reveal>
        ${a.profile
          .map(([label, value]) => {
            if (value === "map-link") {
              return `<div><dt>${esc(label)}</dt><dd><a class="text-link" href="${esc(config.mapUrl)}" target="_blank" rel="noopener noreferrer">View map</a></dd></div>`;
            }
            return `<div><dt>${esc(label)}</dt><dd>${value.includes("<br>") ? value : esc(value)}</dd></div>`;
          })
          .join("")}
      </dl>
    </div>
  </section>
  ${ctaBand(0)}`;

  write(
    "about.html",
    pageShell({
      title: "About Us | ThinkInnov-NexGen",
      description:
        "Learn about ThinkInnov-NexGen — vision, mission, values, leadership, Japan partnership and company profile in Tokyo.",
      path: "about.html",
      active: "about",
      body,
    })
  );
}

/* ========== PLM ========== */
function buildPlm() {
  const p = content.plm;
  const as = (x) => asset(x, 0);
  const body = `
  ${pageHero({ breadcrumb: [{ href: "index.html", label: "Home" }, { href: "plm.html", label: p.title }], kicker: p.kicker, h1: p.title, intro: p.intro })}
  ${sectionNav([
    { id: "benefits", label: "Benefits" },
    { id: "business-size", label: "Business size" },
    { id: "npd", label: "NPD process" },
    { id: "why", label: "Why us" },
  ])}
  <section class="section media-feature">
    <div class="container media-band">
      <figure data-reveal><img src="${as("assets/img/visuals/plm-digital-thread.webp")}" alt="Digital thread and PLM collaboration" width="1600" height="900" loading="lazy" decoding="async"></figure>
      <div data-reveal><p class="eyebrow">Digital thread</p><h2>PLM that connects design, manufacturing and real-world feedback</h2><p>${esc(p.benefits.text)}</p></div>
    </div>
  </section>
  <section class="section" id="benefits"><div class="container"><div class="section-head" data-reveal><h2>${esc(p.benefits.title)}</h2><p>${esc(p.benefits.text)}</p></div>${cards(p.benefits.cards, "card-grid four")}</div></section>
  <section class="section section-alt" id="business-size"><div class="container"><div class="section-head" data-reveal><h2>${esc(p.businessSize.title)}</h2></div>${cards(p.businessSize.cards, "card-grid three")}</div></section>
  <section class="section" id="npd"><div class="container"><div class="section-head" data-reveal><h2>${esc(p.npd.title)}</h2></div>${cards(p.npd.cards, "card-grid three")}</div></section>
  <section class="section section-ink" id="why"><div class="container"><div class="section-head" data-reveal><h2>${esc(p.why.title)}</h2></div>${cards(p.why.cards, "card-grid three")}</div></section>
  ${ctaBand(0)}`;
  write(
    "plm.html",
    pageShell({
      title: "PLM For Everyone | ThinkInnov-NexGen",
      description: p.intro,
      path: "plm.html",
      active: "plm",
      body,
    })
  );
}

/* ========== SERVICES ========== */
function buildServices() {
  const body = `
  ${pageHero({
    breadcrumb: [{ href: "index.html", label: "Home" }, { href: "services.html", label: "Services" }],
    kicker: "Consulting to Adoption",
    h1: "Services",
    intro:
      "From startup to enterprise, ThinkInnov-NexGen guides teams to the right software solution, manages implementation and supports adoption.",
  })}
  <section class="section">
    <div class="container">
      <div class="section-head" data-reveal><h2>Services lifecycle</h2><p>Structured consulting, implementation and sustaining services grouped for clearer reading.</p></div>
      <div class="services-board">
        ${content.services
          .map(
            (col, i) => `<article class="service-column" data-reveal>
              <span class="step-num">${String(i + 1).padStart(2, "0")}</span>
              <h3>${esc(col.title)}</h3>
              ${col.blocks
                .map(
                  ([label, items]) =>
                    `<div class="service-block"><h4>${esc(label)}</h4>${
                      items.length ? `<ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""
                    }</div>`
                )
                .join("")}
            </article>`
          )
          .join("")}
      </div>
    </div>
  </section>
  ${ctaBand(0)}`;
  write(
    "services.html",
    pageShell({
      title: "Services | ThinkInnov-NexGen",
      description:
        "Pre-implementation consulting, PLM implementation and post-implementation support from ThinkInnov-NexGen.",
      path: "services.html",
      active: "services",
      body,
    })
  );
}

/* ========== DIGITAL TRANSFORMATION ========== */
function buildDigital() {
  const d = content.digitalTransformation;
  const as = (p) => asset(p, 0);
  const body = `
  ${pageHero({
    breadcrumb: [{ href: "index.html", label: "Home" }, { href: "digital-transformation.html", label: d.title }],
    kicker: d.kicker,
    h1: d.title,
    intro: d.intro,
  })}
  <section class="section">
    <div class="container media-band">
      <figure data-reveal><img src="${as("assets/img/visuals/siemens-digital-industry.webp")}" alt="Siemens digital industry collaboration" width="1600" height="900" loading="lazy" decoding="async"></figure>
      <div data-reveal>
        <div class="section-head is-flush"><h2>${esc(d.pdmm.title)}</h2><p>${esc(d.pdmm.text)}</p></div>
      </div>
    </div>
    <div class="container">${cards(d.pdmm.cards, "card-grid four")}</div>
  </section>
  <section class="section section-alt">
    <div class="container">
      <div class="section-head" data-reveal><h2>${esc(d.outcomes.title)}</h2></div>
      ${cards(d.outcomes.cards, "card-grid three")}
    </div>
  </section>
  ${ctaBand(0)}`;
  write(
    "digital-transformation.html",
    pageShell({
      title: "Digital Transformation | ThinkInnov-NexGen",
      description: d.intro,
      path: "digital-transformation.html",
      active: "digital",
      body,
    })
  );
}

/* ========== PRODUCTS ========== */
function buildProducts() {
  const as = (p) => asset(p, 0);
  const body = `
  ${pageHero({
    breadcrumb: [{ href: "index.html", label: "Home" }, { href: "products.html", label: "Products" }],
    kicker: "Siemens Portfolio",
    h1: "Products",
    intro: "A catalogue of product development and digital engineering tools for design, modeling, lifecycle management and low-code delivery.",
  })}
  <section class="section">
    <div class="container">
      <div class="section-head" data-reveal><h2>Catalogue of products</h2></div>
      <div class="product-grid page-products">
        ${content.products
          .map(
            ([name, mark, markText, sub, body]) =>
              `<article class="product-card static" data-reveal>
                <span class="product-mark ${mark}">${markText}</span>
                <h3>${esc(name)} <span>${esc(sub)}</span></h3>
                <p>${esc(body)}</p>
              </article>`
          )
          .join("")}
      </div>
      <figure class="feature-visual" data-reveal>
        <img src="${as("assets/img/visuals/mendix-lowcode.webp")}" alt="Low-code application development with Mendix" width="1600" height="900" loading="lazy" decoding="async">
      </figure>
    </div>
  </section>
  ${ctaBand(0)}`;
  write(
    "products.html",
    pageShell({
      title: "Products | ThinkInnov-NexGen",
      description: "Siemens NX, Solid Edge, Capital, Teamcenter, Tecnomatix and Mendix — delivered by ThinkInnov-NexGen.",
      path: "products.html",
      active: "products",
      body,
    })
  );
}

/* ========== SOLUTIONS ========== */
function buildSolutions() {
  const body = `
  ${pageHero({
    breadcrumb: [{ href: "index.html", label: "Home" }, { href: "solutions.html", label: "Solutions" }],
    kicker: "Engineering Outcomes",
    h1: "Solutions",
    intro: "ThinkInnov-NexGen helps customers progress to the next level of product design innovation, manufacturing efficiency and performance.",
  })}
  <section class="section">
    <div class="container">
      <div class="section-head" data-reveal><h2>Explore our solutions</h2></div>
      <div class="solution-grid dense">
        ${content.solutions
          .map(([title, body]) => `<article class="solution-card" data-reveal><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`)
          .join("")}
      </div>
    </div>
  </section>
  ${ctaBand(0)}`;
  write(
    "solutions.html",
    pageShell({
      title: "Solutions | ThinkInnov-NexGen",
      description: "PLM solutions for design data, quality, change, requirements, integration, digital factory and more.",
      path: "solutions.html",
      active: "solutions",
      body,
    })
  );
}

/* ========== INDUSTRIES ========== */
function buildIndustries() {
  const as = (p) => asset(p, 0);
  const body = `
  ${pageHero({
    breadcrumb: [{ href: "index.html", label: "Home" }, { href: "industries.html", label: "Industries" }],
    kicker: "Industry PLM",
    h1: "Industries",
    intro: "Industry-specific PLM solutions tailored to accelerate innovation and digital transformation.",
  })}
  <section class="section">
    <div class="container">
      <div class="section-head" data-reveal><h2>PLM industry focus</h2></div>
      <div class="industry-grid" data-gallery>
        ${content.industries
          .map(
            ([title, body, visual, n], i) => `<article class="industry-card" data-reveal>
              <figure class="industry-media">
                <img src="${as(`assets/img/visuals/${visual}.webp`)}" alt="${esc(title)}" width="800" height="450" loading="lazy" decoding="async">
              </figure>
              <h3>${esc(title)}</h3>
              <p>${esc(body)}</p>
              <button type="button" class="btn btn-ghost btn-sm" data-gallery-src="${as(
                `assets/img/industries/infographic-${String(n).padStart(2, "0")}.webp`
              )}" data-gallery-alt="${esc(title)} infographic" data-gallery-index="${i}">View infographic</button>
            </article>`
          )
          .join("")}
      </div>
    </div>
  </section>
  ${ctaBand(0)}`;
  write(
    "industries.html",
    pageShell({
      title: "Industries | ThinkInnov-NexGen",
      description: "Teamcenter X and PLM solutions for aerospace, automotive, battery, electronics, marine and more.",
      path: "industries.html",
      active: "industries",
      body,
    })
  );
}

/* ========== BEHIND THE BRAND ========== */
function buildBehind() {
  const b = content.behind;
  const as = (p) => asset(p, 0);
  const body = `
  ${pageHero({
    breadcrumb: [{ href: "index.html", label: "Home" }, { href: "behind-the-brand.html", label: b.title }],
    kicker: b.kicker,
    h1: b.title,
    intro: b.intro,
  })}
  ${sectionNav([
    { id: "problem", label: "Problems we solve" },
    { id: "team", label: "Our team" },
  ])}
  <section class="section" id="problem">
    <div class="container">
      <div class="section-head" data-reveal><h2>Problem we solve</h2><p>We help companies effectively address the critical business issues of new product development.</p></div>
      <div class="problem-layout">
        <figure data-reveal>
          <img src="${as("assets/img/visuals/about-engineering-team.webp")}" alt="Engineering team collaborating on product development" width="1600" height="900" loading="lazy" decoding="async">
        </figure>
        <div class="problem-list" data-reveal>
          ${b.problems
            .map(
              ([title, body], i) =>
                `<details ${i === 0 ? "open" : ""}><summary>${esc(title)}</summary><p>${esc(body)}</p></details>`
            )
            .join("")}
        </div>
      </div>
    </div>
  </section>
  <section class="section section-alt" id="team">
    <div class="container">
      <div class="section-head" data-reveal><h2>Our team</h2><p>Delivery leaders and specialists helping customers adopt practical PLM and digital transformation.</p></div>
      <div class="people-grid">
        ${b.team
          .map(
            ([img, name, role]) => `<article class="person-card" data-reveal>
              <img src="${as(img)}" alt="${esc(name)}" width="400" height="500" loading="lazy" decoding="async">
              <h3>${esc(name)}</h3><p>${esc(role)}</p>
            </article>`
          )
          .join("")}
      </div>
    </div>
  </section>
  ${ctaBand(0)}`;
  write(
    "behind-the-brand.html",
    pageShell({
      title: "Behind the Brand | ThinkInnov-NexGen",
      description: b.intro,
      path: "behind-the-brand.html",
      active: "behind",
      body,
    })
  );
}

/* ========== CAREERS + JOBS ========== */
function buildCareers() {
  const c = content.careersIntro;
  const as = (p) => asset(p, 0);
  const body = `
  ${pageHero({
    breadcrumb: [{ href: "index.html", label: "Home" }, { href: "careers.html", label: c.title }],
    kicker: c.kicker,
    h1: c.title,
    intro: c.intro,
  })}
  <section class="section">
    <div class="container">
      <div class="section-head" data-reveal><h2>${esc(c.cultureTitle)}</h2><p>${esc(c.cultureText)}</p></div>
      <div class="job-grid">
        ${content.jobs
          .map(
            (job, i) => `<a class="job-card" href="${as(`careers/${job.slug}.html`)}" data-reveal>
              <span>${String(i + 1).padStart(2, "0")}</span>
              <h3>${esc(job.title)}</h3>
              <p>${esc(job.summary)}</p>
              <p class="job-meta">${esc(job.location)} · ${esc(job.experience)}</p>
            </a>`
          )
          .join("")}
      </div>
      <div class="career-cta" data-reveal>
        <p>${esc(c.ctaTitle)}</p>
        <a class="btn btn-primary" href="${as("apply.html")}">${esc(c.ctaLabel)}</a>
      </div>
    </div>
  </section>
  ${ctaBand(0, { primary: "Apply now", primaryHref: "apply.html", secondary: "Contact us", secondaryHref: "contact.html" })}`;
  write(
    "careers.html",
    pageShell({
      title: "Careers | ThinkInnov-NexGen",
      description: c.intro,
      path: "careers.html",
      active: "careers",
      body,
    })
  );

  content.jobs.forEach((job) => {
    const depth = 1;
    const a = (p) => asset(p, depth);
    const jbody = `
    ${pageHero({
      depth,
      breadcrumb: [
        { href: "index.html", label: "Home" },
        { href: "careers.html", label: "Careers" },
        { href: `careers/${job.slug}.html`, label: job.title },
      ],
      kicker: "Open role",
      h1: job.title,
      intro: `${job.location} · ${job.experience}`,
    })}
    <section class="section">
      <div class="container job-detail">
        <div>
          <h2>Key responsibilities</h2>
          <ul>${job.responsibilities.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
          <h2>Required skills</h2>
          <ul>${job.skills.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
        </div>
        <aside class="job-aside">
          <h2>Job information</h2>
          <dl>
            <div><dt>Location</dt><dd>${esc(job.location)}</dd></div>
            <div><dt>Experience</dt><dd>${esc(job.experience)}</dd></div>
          </dl>
          <a class="btn btn-primary" href="${a(`apply.html?job=${job.slug}`)}">Apply now</a>
          <a class="text-link" href="mailto:${config.email}?subject=${encodeURIComponent("Job enquiry: " + job.title)}">Share via email</a>
        </aside>
      </div>
    </section>
    ${ctaBand(1, { primary: "Apply now", primaryHref: `apply.html?job=${job.slug}`, secondary: "All roles", secondaryHref: "careers.html" })}`;
    write(
      `careers/${job.slug}.html`,
      pageShell({
        title: `${job.title} | Careers | ThinkInnov-NexGen`,
        description: job.summary,
        path: `careers/${job.slug}.html`,
        depth: 1,
        active: "careers",
        body: jbody,
      })
    );
  });
}

/* ========== APPLY ========== */
function buildApply() {
  const jobOptions = content.jobs
    .map((j) => `<option value="${esc(j.slug)}">${esc(j.title)}</option>`)
    .join("");
  const body = `
  ${pageHero({
    breadcrumb: [
      { href: "index.html", label: "Home" },
      { href: "careers.html", label: "Careers" },
      { href: "apply.html", label: "Apply" },
    ],
    kicker: "Careers",
    h1: "Apply for a role",
    intro: "Share your details and CV. We will review applications for open opportunities in Chennai and Bangalore.",
  })}
  <section class="section">
    <div class="container narrow">
      <form class="application-form" action="apply.php" method="post" enctype="multipart/form-data" data-form="apply" novalidate>
        <input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">
        <input type="hidden" name="form_started" value="">
        <div class="form-grid apply-grid">
          <label class="field">First name *<input required name="first_name" autocomplete="given-name"></label>
          <label class="field">Last name *<input required name="last_name" autocomplete="family-name"></label>
          <label class="field">Email *<input required type="email" name="email" autocomplete="email"></label>
          <label class="field">Contact number *<input required type="tel" name="phone" autocomplete="tel"></label>
          <label class="field">Year of graduation *<input required name="graduation" inputmode="numeric"></label>
          <label class="field">Gender *
            <select required name="gender">
              <option value="">Select your gender *</option>
              <option>Male</option>
              <option>Female</option>
              <option>Prefer not to say</option>
            </select>
          </label>
          <label class="field">Overall experience (years) *<input required name="experience"></label>
          <label class="field">Current employer *<input required name="employer"></label>
          <label class="field">Current CTC (LPA) *<input required name="current_ctc"></label>
          <label class="field">Expected CTC (LPA) *<input required name="expected_ctc"></label>
          <label class="field">Notice period (days) *<input required name="notice"></label>
          <label class="field">Skill set *<input required name="skills"></label>
          <label class="field">How did you find this vacancy? *
            <select required name="source">
              <option value="">Select *</option>
              <option>LinkedIn</option>
              <option>Referral</option>
              <option>Website</option>
              <option>Other</option>
            </select>
          </label>
          <label class="field">Current location *<input required name="current_location"></label>
          <label class="field">Preferred location *<input required name="preferred_location"></label>
          <label class="field span-all">Role of interest
            <select name="job" id="job-select">
              <option value="">General application</option>
              ${jobOptions}
            </select>
          </label>
          <label class="field span-all file-field">CV / resume (PDF, DOC, DOCX — max 5 MB) *
            <input required type="file" name="resume" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
          </label>
          <label class="field check span-all">
            <input required type="checkbox" name="consent" value="1">
            <span>I consent to ThinkInnov-NexGen processing my application data for recruitment purposes.</span>
          </label>
        </div>
        <div class="form-status" role="status" aria-live="polite" data-form-status></div>
        <button class="btn btn-primary" type="submit">Apply now</button>
      </form>
    </div>
  </section>`;
  write(
    "apply.html",
    pageShell({
      title: "Apply for a job | ThinkInnov-NexGen",
      description: "Submit your application to ThinkInnov-NexGen careers.",
      path: "apply.html",
      active: "careers",
      body,
    })
  );
}

/* ========== CONTACT ========== */
function buildContact() {
  const body = `
  ${pageHero({
    breadcrumb: [{ href: "index.html", label: "Home" }, { href: "contact.html", label: "Contact" }],
    kicker: "Get in touch",
    h1: "Contact us",
    intro: "We're here to help and answer any questions you might have. We look forward to hearing from you.",
  })}
  <section class="section">
    <div class="container media-band contact-band">
      <div data-reveal>
        <h2>Tokyo headquarters</h2>
        <p>${esc(config.legalName)}</p>
        <p>${esc(config.addressSingle)}</p>
        <ul class="contact-facts">
          <li><a href="mailto:${config.email}">${icons.mail}<span>${esc(config.email)}</span></a></li>
          <li><a href="tel:${config.phoneTel}">${icons.phone}<span>${esc(config.phoneDisplay)}</span></a></li>
          <li><a href="${esc(config.mapUrl)}" target="_blank" rel="noopener noreferrer">${icons.map}<span>View on Google Maps</span></a></li>
        </ul>
        <h3>Branch offices</h3>
        <ul>${config.branches.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      </div>
      <div data-reveal>${contactFormBlock(0, "contact-page")}</div>
    </div>
  </section>`;
  write(
    "contact.html",
    pageShell({
      title: "Contact Us | ThinkInnov-NexGen",
      description: `Contact ThinkInnov-NexGen in Tokyo — ${config.email}, ${config.phoneDisplay}.`,
      path: "contact.html",
      active: "contact",
      body,
    })
  );
}

/* ========== 404 ========== */
function build404() {
  const body = `
  <section class="section page-hero">
    <div class="container">
      <p class="eyebrow">404</p>
      <h1>Page not found</h1>
      <p class="page-intro">The page you requested is not available. Try one of these destinations.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="index.html">Home</a>
        <a class="btn btn-secondary" href="contact.html">Contact</a>
      </div>
    </div>
  </section>`;
  write(
    "404.html",
    pageShell({
      title: "Page not found | ThinkInnov-NexGen",
      description: "The requested page could not be found.",
      path: "404.html",
      body,
    })
  );
}

/* ========== REDIRECT STUBS ========== */
function redirectStub(title, script, fallbackHref = "index.html") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${esc(title)}</title>
  <meta name="robots" content="noindex">
  <meta http-equiv="refresh" content="0;url=${esc(fallbackHref)}">
  <script>${script}</script>
</head>
<body>
  <h1 style="position:absolute;left:-9999px">Redirecting</h1>
  <p>Redirecting… If nothing happens, <a id="fallback" href="${esc(fallbackHref)}">continue here</a>.</p>
</body>
</html>`;
}

function buildRedirects() {
  write(
    "page.html",
    redirectStub(
      "Redirect",
      `(()=>{const p=new URLSearchParams(location.search).get("page")||"about";const map={about:"about.html",plm:"plm.html",services:"services.html","digital-transformation":"digital-transformation.html",products:"products.html",solutions:"solutions.html",industries:"industries.html","behind-the-brand":"behind-the-brand.html",careers:"careers.html"};const t=map[p]||"about.html";const h=location.hash||"";location.replace(t+h);const a=document.getElementById("fallback");if(a)a.href=t+h;})();`,
      "about.html"
    )
  );
  const jobMap = Object.fromEntries(content.jobs.map((j) => [String(j.id), `careers/${j.slug}.html`]));
  write(
    "jobdetails.html",
    redirectStub(
      "Job redirect",
      `(()=>{const map=${JSON.stringify(jobMap)};const id=new URLSearchParams(location.search).get("id")||"1";const t=map[id]||"careers.html";location.replace(t);const a=document.getElementById("fallback");if(a)a.href=t;})();`,
      "careers.html"
    )
  );
  write(
    "application.html",
    redirectStub(
      "Application redirect",
      `(()=>{const id=new URLSearchParams(location.search).get("id");const map=${JSON.stringify(
        Object.fromEntries(content.jobs.map((j) => [String(j.id), j.slug]))
      )};const slug=id&&map[id]?map[id]:"";location.replace("apply.html"+(slug?"?job="+encodeURIComponent(slug):""));})();`,
      "apply.html"
    )
  );
}

function buildSitemapRobots() {
  const pages = [
    "",
    "about.html",
    "plm.html",
    "services.html",
    "digital-transformation.html",
    "products.html",
    "solutions.html",
    "industries.html",
    "behind-the-brand.html",
    "careers.html",
    "apply.html",
    "contact.html",
    ...content.jobs.map((j) => `careers/${j.slug}.html`),
  ];
  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${config.baseUrl}/${p}</loc>
    <changefreq>monthly</changefreq>
  </url>`
    )
    .join("\n");
  write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
  );
  write(
    "robots.txt",
    `User-agent: *
Allow: /

Sitemap: ${config.baseUrl}/sitemap.xml
`
  );
}

function main() {
  buildHome();
  buildAbout();
  buildPlm();
  buildServices();
  buildDigital();
  buildProducts();
  buildSolutions();
  buildIndustries();
  buildBehind();
  buildCareers();
  buildApply();
  buildContact();
  build404();
  buildRedirects();
  buildSitemapRobots();
  // expose jobs for apply preselect
  fs.writeFileSync(
    path.join(OUT, "assets", "jobs-data.json"),
    JSON.stringify(content.jobs.map(({ slug, title, id }) => ({ slug, title, id })), null, 2)
  );
  console.log("Build complete.");
}

main();
