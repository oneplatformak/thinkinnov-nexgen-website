#!/usr/bin/env node
/**
 * Layout check: loads every page in both languages at ten widths and reports
 *  - horizontal overflow of the document,
 *  - visible elements that extend past the right or left edge of the viewport,
 *  - text that is cut off (an element whose content is wider than its box
 *    while overflow is hidden), and
 *  - images that failed to load.
 *
 * Usage: NODE_PATH=<dir with puppeteer-core> node improved-src/tools/test-layout.js [widths]
 * Env:   BASE (default http://127.0.0.1:8810/), CHROME (default /usr/bin/google-chrome)
 */
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const BASE = process.env.BASE || "http://127.0.0.1:8810/";
const DOCS = path.join(__dirname, "..", "..", "docs");
const WIDTHS = (process.argv[2] || "320,375,390,430,768,1024,1280,1440,1920,2560").split(",").map(Number);
const STUBS = new Set(["page.html", "jobdetails.html", "application.html"]);

function pages(dir, prefix = "") {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return ["ja", "careers"].includes(entry.name) ? pages(path.join(dir, entry.name), prefix + entry.name + "/") : [];
    return entry.name.endsWith(".html") && !STUBS.has(entry.name) ? [prefix + entry.name] : [];
  });
}

function inspect() {
  const vw = document.documentElement.clientWidth;
  const out = { overflowX: document.documentElement.scrollWidth - vw, offscreen: [], clipped: [], brokenImages: [] };
  const describe = (el) => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : "");
  const scrollerOf = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (/(auto|scroll)/.test(s.overflowX) && p.scrollWidth > p.clientWidth) return p;
    }
    return null;
  };
  for (const el of document.querySelectorAll("body *")) {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || el.closest("[hidden], dialog:not([open]), .visually-hidden, .skip-link, .field-trap")) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    // Content inside a deliberate horizontal scroller (the lifecycle stepper on small screens) may sit off-screen.
    if ((r.right > vw + 1 || r.left < -1) && !scrollerOf(el)) out.offscreen.push(`${describe(el)} [${Math.round(r.left)}..${Math.round(r.right)} of ${vw}]`);
    if (el.scrollWidth > el.clientWidth + 1 && /(hidden|clip)/.test(style.overflowX) && el.childElementCount === 0 && el.textContent.trim()) {
      out.clipped.push(`${describe(el)} "${el.textContent.trim().slice(0, 40)}"`);
    }
  }
  for (const img of document.images) {
    if (img.complete && img.naturalWidth === 0 && !img.closest("dialog:not([open])")) out.brokenImages.push(img.getAttribute("src"));
  }
  out.offscreen = out.offscreen.slice(0, 5);
  out.clipped = out.clipped.slice(0, 5);
  return out;
}

(async () => {
  const list = pages(DOCS).sort();
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const totals = Object.fromEntries(WIDTHS.map((w) => [w, { pages: 0, overflow: 0, offscreen: 0, clipped: 0, broken: 0 }]));
  const failures = [];
  const queue = list.flatMap((p) => WIDTHS.map((w) => [p, w]));
  const worker = async () => {
    const page = await browser.newPage();
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    for (let job = queue.shift(); job; job = queue.shift()) {
      const [rel, width] = job;
      await page.setViewport({ width, height: width < 700 ? 800 : 900, deviceScaleFactor: 1 });
      await page.goto(BASE + rel, { waitUntil: "load" });
      // Force lazy images to load so that broken ones are detected.
      await page.evaluate(() => { document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = "eager"; }); });
      await page.evaluate(() => Promise.all([...document.images].map((img) => img.complete ? null : new Promise((res) => { img.onload = img.onerror = res; }))));
      const r = await page.evaluate(inspect);
      const t = totals[width];
      t.pages += 1;
      if (r.overflowX > 0) t.overflow += 1;
      if (r.offscreen.length) t.offscreen += 1;
      if (r.clipped.length) t.clipped += 1;
      if (r.brokenImages.length) t.broken += 1;
      if (r.overflowX > 0 || r.offscreen.length || r.clipped.length || r.brokenImages.length) failures.push({ rel, width, ...r });
    }
    await page.close();
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  await browser.close();

  console.log(`Pages: ${list.length} (${list.filter((p) => p.startsWith("ja/")).length} Japanese), widths: ${WIDTHS.join(", ")}`);
  console.log("width  pages  overflow  offscreen  clipped  broken-images");
  for (const w of WIDTHS) {
    const t = totals[w];
    console.log(`${String(w).padStart(5)}  ${String(t.pages).padStart(5)}  ${String(t.overflow).padStart(8)}  ${String(t.offscreen).padStart(9)}  ${String(t.clipped).padStart(7)}  ${String(t.broken).padStart(13)}`);
  }
  for (const f of failures.slice(0, 40)) console.log(JSON.stringify(f));
  if (failures.length > 40) console.log(`... and ${failures.length - 40} more`);
  console.log(failures.length ? `FAIL (${failures.length} page/width combinations)` : "PASS");
  process.exit(failures.length ? 1 : 0);
})();
