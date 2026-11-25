#!/usr/bin/env node
/**
 * Runs axe-core on every built page in headless Chrome, at a phone and a
 * desktop width, and prints every violation. An automated scan finds only
 * part of what a person would; a pass here is not a conformance claim.
 *
 * Usage: NODE_PATH=<dir with puppeteer-core and axe-core> node improved-src/tools/test-axe.js [base-url]
 */
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");
const axeSource = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const BASE = process.argv[2] || "http://127.0.0.1:8810/";
const DOCS = path.join(__dirname, "..", "..", "docs");
const STUBS = new Set(["page.html", "jobdetails.html", "application.html"]);

function pages(dir, prefix = "") {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return ["ja", "careers", "products"].includes(entry.name) ? pages(path.join(dir, entry.name), prefix + entry.name + "/") : [];
    return entry.name.endsWith(".html") && !STUBS.has(entry.name) ? [prefix + entry.name] : [];
  });
}

(async () => {
  const list = pages(DOCS).sort();
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  let violations = 0, incomplete = 0, checks = 0;
  const rules = new Set();
  for (const width of [390, 1440]) {
    await page.setViewport({ width, height: 900 });
    for (const rel of list) {
      await page.goto(BASE + rel, { waitUntil: "load" });
      await page.evaluate(axeSource);
      const result = await page.evaluate(() => window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } }));
      checks += 1;
      result.passes.forEach((p) => rules.add(p.id));
      incomplete += result.incomplete.length;
      for (const v of result.violations) {
        violations += v.nodes.length;
        console.log(`VIOLATION ${rel} @${width}: ${v.id} (${v.impact}) x${v.nodes.length}: ${v.help}`);
        v.nodes.slice(0, 3).forEach((n) => console.log(`    ${n.target.join(" ")}  ${(n.failureSummary || "").replace(/\s+/g, " ").slice(0, 160)}`));
      }
    }
  }
  await browser.close();
  console.log(`\naxe-core ${require("axe-core/package.json").version}: ${list.length} pages x 2 widths = ${checks} scans, ${rules.size} rules passed somewhere`);
  console.log(`Violations: ${violations}. Items axe could not decide and left for a person: ${incomplete}`);
  console.log(violations ? "FAIL" : "PASS");
  process.exit(violations ? 1 : 0);
})();
