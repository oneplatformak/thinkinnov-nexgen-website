/** Structured data, sitemap.xml and robots.txt. Only facts from config/staging. */
const config = require("../config");
const site = require("./site");

function ld(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

function organization() {
  return ld({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": config.baseUrl + "/#organization",
    name: config.siteName,
    url: config.baseUrl + "/",
    logo: `${config.baseUrl}/${config.logoPath}`,
    email: config.email,
    telephone: config.phoneTel,
    address: { "@type": "PostalAddress", ...config.postal },
  });
}

function website() {
  return ld({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": config.baseUrl + "/#website",
    name: config.siteName,
    url: site.absolute("", site.lang()),
    inLanguage: site.lang(),
    publisher: { "@id": config.baseUrl + "/#organization" },
  });
}

/** crumbs: [{ label, path }] in the language being built; label already translated. */
function breadcrumbs(crumbs) {
  return ld({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: site.absolute(c.path, site.lang()),
    })),
  });
}

function sitemapXml(paths) {
  const abs = (lang, p) => site.absolute(p, lang);
  const urls = paths
    .flatMap((p) =>
      ["en", "ja"].map(
        (lang) => `  <url>
    <loc>${abs(lang, p)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${abs("en", p)}"/>
    <xhtml:link rel="alternate" hreflang="ja" href="${abs("ja", p)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs("en", p)}"/>
  </url>`
      )
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

function robotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${config.baseUrl}/sitemap.xml
`;
}

module.exports = { organization, website, breadcrumbs, sitemapXml, robotsTxt };
