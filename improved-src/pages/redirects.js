/**
 * Stubs for the three staging URLs that took query strings. On Apache the
 * .htaccess rules answer first with a 301; these stubs cover hosts without
 * rewrite support (GitHub Pages) and keep any #anchor.
 */
const { esc } = require("../lib/html");
const content = require("../content");

function stub(title, script, fallback) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} | ThinkInnov-NexGen</title>
  <meta name="robots" content="noindex">
  <script>${script}</script>
  <noscript><meta http-equiv="refresh" content="0;url=${esc(fallback)}"></noscript>
</head>
<body>
  <h1 style="font:600 1.25rem system-ui,sans-serif">This page has moved</h1>
  <p style="font:1rem system-ui,sans-serif"><a href="${esc(fallback)}">Continue to the new page</a></p>
</body>
</html>
`;
}

const go = (expr) => `(function(){var q=new URLSearchParams(location.search);${expr}location.replace(t+location.hash)})();`;

function stubs() {
  const pages = ["about", "plm", "services", "digital-transformation", "products", "solutions", "industries", "behind-the-brand", "careers"];
  const jobs = Object.fromEntries(content.jobs.map((j) => [String(j.id), j.slug]));
  return [
    ["page.html", stub("Page moved", go(`var m=${JSON.stringify(pages)},p=q.get("page"),t=m.indexOf(p)>=0?p+".html":"./";`), "./")],
    ["jobdetails.html", stub("Job moved", go(`var m=${JSON.stringify(jobs)},s=m[q.get("id")],t=s?"careers/"+s+".html":"careers.html";`), "careers.html")],
    ["application.html", stub("Application form moved", go(`var m=${JSON.stringify(jobs)},s=m[q.get("id")],t="apply.html"+(s?"?job="+s:"");`), "apply.html")],
  ];
}

module.exports = { stubs };
