/**
 * Site search. The index is a JSON file written at build time
 * (lib/search.js); matching happens in the browser and nothing is sent to a
 * server. Without scripts the page offers the sitemap instead.
 */
const site = require("../lib/site");
const icons = require("../lib/icons");
const c = require("../lib/components");

function render() {
  const crumbs = c.crumbsFor("Search", "search.html");
  const browse = [
    ["solutions.html#finder", "Find by business need"], ["products.html", "Products"], ["solutions.html#all-solutions", "Solutions"],
    ["industries.html", "Industries"], ["services.html", "Services"], ["careers.html#roles", "Careers"], ["sitemap.html", "Sitemap"],
  ];
  return {
    title: "Search | ThinkInnov-NexGen",
    description: "Search the ThinkInnov-NexGen website: products, solutions, business needs, industries, services and careers.",
    active: "search",
    crumbs,
    bodyClass: "page page-search",
    body: `<section class="page-hero">
      <div class="container">
        ${c.breadcrumbs(crumbs)}
        <div class="page-hero-grid">
          <div class="page-hero-text">
            <p class="kicker">Website</p>
            <h1>Search</h1>
            <form class="search-form" role="search" action="${site.page("search.html")}" method="get" data-search-form data-index="${site.asset(`assets/search-${site.lang()}.json`)}" data-js-only hidden>
              <label class="field-label" for="search-q">Search this website</label>
              <div class="search-row">
                <div class="search-input">${icons.search}<input type="search" id="search-q" name="q" autocomplete="off" spellcheck="false" maxlength="80"></div>
                <button type="submit" class="btn btn-primary">Search</button>
              </div>
              <p class="field-hint">Try a product name, a solution or a business need. Searching happens in your browser; nothing is sent to us.</p>
            </form>
            <noscript><p class="lead">Search needs JavaScript.</p><p>${c.linkArrow(site.page("sitemap.html"), "Sitemap")}</p></noscript>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container search-layout">
        <div>
          <p class="search-status" role="status" data-search-status
            data-l10n-none="No results for “{q}”. Try a product name or a shorter word, or browse the links on this page."
            data-l10n-one="1 result for “{q}”"
            data-l10n-many="{n} results for “{q}”"
            data-l10n-error="The search index could not be loaded. Please use the sitemap."></p>
          <ol class="search-results" data-search-results></ol>
        </div>
        <aside class="search-browse" aria-label="Browse instead">
          <h2 class="h-sub">Browse instead</h2>
          ${c.relatedList(browse.map(([href, label]) => [site.page(href), label]))}
        </aside>
      </div>
    </section>`,
  };
}

module.exports = { routes: [{ path: "search.html", render }] };
