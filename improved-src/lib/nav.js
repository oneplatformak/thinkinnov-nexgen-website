/** Header: desktop mega menu, language switch, mobile menu dialog. */
const config = require("../config");
const site = require("./site");
const icons = require("./icons");
const { esc } = require("./html");
const content = require("../content");

/** One description of the navigation, used by the header, mobile menu, footer and HTML sitemap. */
function structure() {
  return [
    {
      key: "what",
      label: "What we do",
      lead: content.homeAbout.title,
      groups: [
        {
          title: "Approach",
          links: [
            { href: "plm.html", label: "PLM For Everyone", text: content.plm.navText, active: "plm" },
            { href: "services.html", label: "Services", text: "Consulting, implementation and sustaining services.", active: "services" },
            { href: "digital-transformation.html", label: "Digital Transformation", text: "Strategy and roadmap with the Product Data Maturity Model.", active: "digital" },
          ],
        },
        {
          title: "Solutions",
          links: [
            { href: "solutions.html", label: "All solutions", text: "Fifteen solutions for product data, quality, change and integration.", active: "solutions" },
            { href: "solutions.html#finder", label: "Find by business need", text: "Start from the problem you want to solve." },
            { href: "#lifecycle", label: "Product lifecycle", text: "See where each product and solution fits." },
          ],
        },
      ],
    },
    {
      key: "products",
      label: "Products",
      lead: content.productsIntro.home,
      products: true,
      groups: [
        {
          title: "Siemens portfolio",
          links: content.products.map((p) => ({ href: content.productPath(p.key), label: p.name, text: p.category, mark: p })),
        },
      ],
      more: { href: "products.html", label: "All products", active: "products" },
    },
    { key: "industries", label: "Industries", href: "industries.html", active: "industries" },
    {
      key: "company",
      label: "Company",
      lead: "The people, problem-solving approach and delivery culture behind ThinkInnov-NexGen.",
      groups: [
        {
          title: "About",
          links: [
            { href: "about.html", label: "About Us", text: "Profile, mission, values, gallery, leadership and company profile.", active: "about" },
            { href: "behind-the-brand.html", label: "Behind the Brand", text: "The problems we solve and the team that solves them.", active: "behind" },
          ],
        },
        {
          title: "Work with us",
          links: [
            { href: "careers.html", label: "Careers", text: "Current opportunity areas and how to apply.", active: "careers" },
            { href: "contact.html", label: "Contact", text: "Product enquiries, consultations and support.", active: "contact" },
          ],
        },
      ],
    },
  ];
}

function linkHref(link) {
  return site.page(link.href);
}

function langSwitch(id) {
  const cur = (l) => (site.lang() === l ? ' aria-current="true"' : "");
  return `<nav class="lang-switch" aria-label="Language" data-lang-switch>
        <a href="${site.alternate("en")}" lang="en" hreflang="en" data-lang="en"${cur("en")}>English</a>
        <a href="${site.alternate("ja")}" lang="ja" hreflang="ja" data-lang="ja"${cur("ja")}>日本語</a>
      </nav>`;
}

function megaLink(link, active) {
  const current = link.active && link.active === active ? ' aria-current="page"' : "";
  const mark = link.mark ? `<span class="pmark pmark-sm pmark-${link.mark.key}" aria-hidden="true">${esc(link.mark.mark)}</span>` : "";
  return `<li><a class="mega-link${link.mark ? " has-mark" : ""}" href="${linkHref(link)}"${current}>${mark}<span class="mega-link-body"><span class="mega-link-label">${esc(link.label)}</span><span class="mega-link-text">${esc(link.text)}</span></span></a></li>`;
}

function megaPanel(item, active) {
  const groups = item.groups
    .map(
      (g) => `<div class="mega-group${item.products ? " mega-group-wide" : ""}">
            <p class="mega-title" id="mega-${item.key}-${esc(g.title.toLowerCase().replace(/[^a-z]+/g, "-"))}">${esc(g.title)}</p>
            <ul class="mega-list${item.products ? " mega-list-products" : ""}">${g.links.map((l) => megaLink(l, active)).join("")}</ul>
          </div>`
    )
    .join("");
  const more = item.more ? `<a class="link-arrow" href="${site.page(item.more.href)}">${esc(item.more.label)}${icons.arrow}</a>` : "";
  return `<div class="mega" id="mega-${item.key}" data-mega hidden>
        <div class="container mega-inner">
          <div class="mega-lead">
            <p class="mega-kicker">${esc(item.label)}</p>
            <p class="mega-lead-text">${esc(item.lead)}</p>
            ${more}
          </div>
          ${groups}
        </div>
      </div>`;
}

function isActive(item, active) {
  if (item.active) return item.active === active;
  return item.groups.some((g) => g.links.some((l) => l.active === active)) || (item.more && item.more.active === active);
}

function desktopNav(active) {
  return structure()
    .map((item) => {
      const cls = `nav-trigger${isActive(item, active) ? " is-active" : ""}`;
      if (item.href) {
        return `<li class="nav-item"><a class="${cls}" href="${site.page(item.href)}"${item.active === active ? ' aria-current="page"' : ""}>${esc(item.label)}</a></li>`;
      }
      return `<li class="nav-item">
        <button type="button" class="${cls}" aria-expanded="false" aria-controls="mega-${item.key}" data-mega-trigger>${esc(item.label)}${icons.chevron}</button>
        ${megaPanel(item, active)}
      </li>`;
    })
    .join("");
}

function mobileMenu(active) {
  const sections = structure()
    .map((item) => {
      if (item.href) {
        return `<a class="mm-direct" href="${site.page(item.href)}"${item.active === active ? ' aria-current="page"' : ""}>${esc(item.label)}${icons.arrow}</a>`;
      }
      const links = item.groups
        .flatMap((g) => g.links)
        .map(
          (l) =>
            `<li><a href="${linkHref(l)}"${l.active && l.active === active ? ' aria-current="page"' : ""}>${
              l.mark ? `<span class="pmark pmark-sm pmark-${l.mark.key}" aria-hidden="true">${esc(l.mark.mark)}</span>` : ""
            }<span>${esc(l.label)}</span></a></li>`
        )
        .join("");
      const more = item.more ? `<li><a href="${site.page(item.more.href)}"><span>${esc(item.more.label)}</span></a></li>` : "";
      return `<details class="mm-section"${isActive(item, active) ? " open" : ""}>
          <summary>${esc(item.label)}${icons.plus}</summary>
          <ul>${links}${more}</ul>
        </details>`;
    })
    .join("");
  return `<dialog class="mobile-menu" id="mobile-menu" aria-label="Menu" data-mobile-menu>
    <div class="mm-top">
      <a class="brand" href="${site.page("")}" aria-label="ThinkInnov-NexGen home"><img src="${site.asset(config.logoPath)}" width="118" height="44" alt=""></a>
      <button type="button" class="mm-close" data-menu-close><span>Close</span>${icons.close}</button>
    </div>
    <nav class="mm-nav" aria-label="Mobile">${sections}</nav>
    <div class="mm-foot">
      ${langSwitch()}
      <a class="btn btn-primary btn-block" href="${site.page("contact.html")}">Contact us${icons.arrow}</a>
      <div class="mm-quick">
        <a href="tel:${config.phoneTel}">${icons.phone}<span>${esc(config.phoneDisplay)}</span></a>
        <a href="mailto:${config.email}">${icons.mail}<span>Email us</span></a>
      </div>
    </div>
  </dialog>`;
}

function header(active = "") {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" data-header>
    <div class="container header-bar">
      <a class="brand" href="${site.page("")}" aria-label="ThinkInnov-NexGen home">
        <img src="${site.asset(config.logoPath)}" width="139" height="52" alt="${esc(config.siteName)}">
      </a>
      <nav class="primary-nav" aria-label="Main">
        <ul>${desktopNav(active)}</ul>
      </nav>
      <div class="header-tools">
        ${langSwitch()}
        <a class="btn btn-primary btn-sm header-cta" href="${site.page("contact.html")}">Contact us</a>
        <a class="menu-toggle" href="${site.page("sitemap.html")}" data-menu-open><span>Menu</span>${icons.menu}</a>
      </div>
    </div>
  </header>
  ${mobileMenu(active)}`;
}

module.exports = { header, structure, linkHref, langSwitch };
