#!/usr/bin/env node
/**
 * Development screenshots.
 *   node improved-src/tools/snap.js <outDir> <width[,width]> <page> [page...]
 *   NAMES=final node improved-src/tools/snap.js screenshots-after 390,1440 all
 * With "all", stale .jpg files in <outDir> are removed first and an index.json
 * is written: page, language, width, height, file, horizontal overflow, H1 count,
 * images not loaded.
 * Needs puppeteer-core and a local Chrome; serves nothing itself (set BASE).
 * Full-page JPEGs; motion is disabled so that every element is in its final state.
 */
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer-core");

const BASE = process.env.BASE || "http://127.0.0.1:8810/";
const [outDir, widthArg, ...pageArgs] = process.argv.slice(2);
const docs = path.join(__dirname, "..", "..", "docs");
const STUBS = new Set(["page.html", "jobdetails.html", "application.html"]);
const htmlIn = (dir) => fs.readdirSync(path.join(docs, dir)).filter((f) => f.endsWith(".html") && !STUBS.has(f)).sort().map((f) => path.posix.join(dir, f));
const pages = pageArgs[0] === "all" ? ["", "careers", "products", "ja", "ja/careers", "ja/products"].flatMap(htmlIn) : pageArgs;
const widths = widthArg.split(",").map(Number);
const fullPage = process.env.FOLD !== "1";

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const all = pageArgs[0] === "all";
  if (all) fs.readdirSync(outDir).filter((f) => /\.(jpg|json)$/.test(f)).forEach((f) => fs.unlinkSync(path.join(outDir, f)));
  const index = [];
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME || "/usr/bin/google-chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"],
  });
  for (const rel of pages) {
    for (const width of widths) {
      const page = await browser.newPage();
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
      await page.setViewport({ width, height: width < 700 ? 844 : 900, deviceScaleFactor: 1 });
      await page.goto(BASE + rel, { waitUntil: "networkidle0", timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(async () => {
        const max = document.documentElement.scrollHeight;
        for (let y = 0; y < max; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 12)); }
        window.scrollTo(0, 0);
        await Promise.all(Array.from(document.images).map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }))));
      });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      const file = rel.split("#")[0] || "index.html";
      // NAMES=final gives the delivery names: ja_about_html_mobile.jpg, index_html_desktop.jpg.
      const name = process.env.NAMES === "final"
        ? file.replace(/[/.]/g, "_") + (width < 700 ? "_mobile.jpg" : "_desktop.jpg")
        : file.replace(/\.html$/, "").replace(/\//g, "_") + `_${width}.jpg`;
      if (fullPage) {
        // Chrome's own full-page capture sometimes re-lays out very tall pages with
        // viewport units at zero. Growing the viewport to the page height and taking
        // an ordinary screenshot is deterministic.
        for (let i = 0; i < 3; i += 1) {
          const height = await page.evaluate(() => document.documentElement.scrollHeight);
          if (page.viewport().height === height) break;
          await page.setViewport({ width, height, deviceScaleFactor: 1 });
        }
      }
      // Images are lazy and decode asynchronously; without this a few are still blank when the picture is taken.
      await page.evaluate(async () => {
        document.querySelectorAll("img[loading=lazy]").forEach((img) => { img.loading = "eager"; });
        await Promise.all(Array.from(document.images).map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }))));
        await Promise.all(Array.from(document.images).map((img) => img.decode().catch(() => null)));
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      });
      await page.screenshot({ path: path.join(outDir, name), type: "jpeg", quality: Number(process.env.QUALITY || 80), captureBeyondViewport: false });
      const h1 = await page.evaluate(() => document.querySelectorAll("h1").length);
      const notLoaded = await page.evaluate(() => Array.from(document.querySelectorAll("img[src]")).filter((img) => !img.complete || img.naturalWidth === 0).length);
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      index.push({ page: file.replace(/^ja\//, ""), language: file.startsWith("ja/") ? "ja" : "en", width, height, file: name, horizontalOverflow: overflow > 0 ? "yes" : "no", h1Count: h1, imagesNotLoaded: notLoaded });
      console.log(`${name} overflowX=${overflow} h1=${h1} imagesNotLoaded=${notLoaded}`);
      await page.close();
    }
  }
  await browser.close();
  if (all) fs.writeFileSync(path.join(outDir, "index.json"), JSON.stringify(index, null, 1) + "\n");
})();
