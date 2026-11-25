/** 404 page. Served for any missing URL, so its links are resolved against a <base> set in the head. */
const site = require("../lib/site");
const { esc } = require("../lib/html");
const c = require("../lib/components");

function render() {
  const links = [
    ["", "Home"], ["solutions.html#finder", "Find by business need"], ["products.html", "Products"],
    ["services.html", "Services"], ["careers.html", "Careers"], ["contact.html", "Contact"], ["search.html", "Search"], ["sitemap.html", "Sitemap"],
  ];
  return {
    title: "Page not found | ThinkInnov-NexGen",
    description: "The page you were looking for could not be found.",
    is404: true,
    crumbs: [],
    body: `<section class="page-hero notfound">
      <div class="container">
        <div class="page-hero-grid">
          <div class="page-hero-text">
            <p class="kicker">Error 404</p>
            <h1>Page not found</h1>
            <p class="lead">The address may have changed, or the page may have been removed. These links will take you to the main parts of the site.</p>
          </div>
        </div>
        ${c.relatedList(links.map(([href, label]) => [href === "" ? "./" : href, label]), { cls: "related-cols notfound-links" })}
      </div>
    </section>`,
  };
}

module.exports = { routes: [{ path: "404.html", render, noindex: true }] };
