/** Site footer: identity, full navigation, offices, contact routes, governance links. */
const config = require("../config");
const site = require("./site");
const icons = require("./icons");
const { esc, verbatim } = require("./html");
const content = require("../content");
const { langSwitch } = require("./nav");

function column(title, links) {
  return `<nav class="footer-col" aria-label="${esc(title)}">
        <h2 class="footer-title">${esc(title)}</h2>
        <ul>${links.map(([href, label]) => `<li><a href="${site.page(href)}">${esc(label)}</a></li>`).join("")}</ul>
      </nav>`;
}

function footer() {
  const offices = content.about.locations
    .map((o) => `<li><span class="footer-office-role">${esc(o.role)}</span><span class="footer-office-name">${esc(o.city)}</span></li>`)
    .join("");
  return `<footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <a class="footer-logo" href="${site.page("")}" aria-label="ThinkInnov-NexGen home">
            <img src="${site.asset(config.logoPath)}" width="171" height="64" alt="${esc(config.siteName)}" loading="lazy">
          </a>
          <p class="footer-tagline">${esc(config.tagline)}</p>
        </div>
        <div class="footer-contact">
          <h2 class="footer-title">Head office</h2>
          <address>
            <a href="${config.mapUrl}" target="_blank" rel="noopener">${site.isJa() ? esc(config.addressSingle) : config.addressLines.map((l) => verbatim(l)).join("<br>")}<span class="visually-hidden"> (opens map in a new tab)</span></a>
          </address>
          <p><a href="tel:${config.phoneTel}">${esc(config.phoneDisplay)}</a><br><a href="mailto:${config.email}">${esc(config.email)}</a></p>
          <ul class="footer-offices">${offices}</ul>
        </div>
        ${column("What we do", [
          ["plm.html", "PLM For Everyone"],
          ["services.html", "Services"],
          ["digital-transformation.html", "Digital Transformation"],
          ["solutions.html", "Solutions"],
          ["solutions.html#finder", "Find by business need"],
          ["industries.html", "Industries"],
        ])}
        ${column("Products", content.products.map((p) => [content.productPath(p.key), p.name]))}
        ${column("Company", [
          ["about.html", "About Us"],
          ["behind-the-brand.html", "Behind the Brand"],
          ["careers.html", "Careers"],
          ["contact.html", "Contact"],
        ])}
      </div>
      <div class="footer-bottom">
        <p class="footer-legal">${verbatim(config.copyright)}</p>
        <ul class="footer-meta">
          <li><a href="${site.page("privacy.html")}">Privacy notice</a></li>
          <li><a href="${site.page("accessibility.html")}">Accessibility</a></li>
          <li><a href="${site.page("sitemap.html")}">Sitemap</a></li>
        </ul>
        ${langSwitch()}
        <a class="to-top" href="#main">Back to top${icons.arrowUpRight}</a>
      </div>
      <p class="footer-trademark">Siemens, NX, Solid Edge, Capital, Teamcenter, Tecnomatix and Mendix are trademarks or registered trademarks of their respective owners.</p>
    </div>
  </footer>`;
}

module.exports = { footer };
