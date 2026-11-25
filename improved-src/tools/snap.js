#!/usr/bin/env node
/**
 * Development screenshots.
 *   node improved-src/tools/snap.js <outDir> <width[,width]> <page> [page...]
 *   NAMES=final node improved-src/tools/snap.js screenshots-after 390,1440 all
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
const pages = pageArgs[0] === "all" ? ["", "careers", "ja", "ja/careers"].flatMap(htmlIn) : pageArgs;
const widths = widthArg.split(",").map(Number);
const fullPage = process.env.FOLD !== "1";

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
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
      await page.screenshot({ path: path.join(outDir, name), type: "jpeg", quality: Number(process.env.QUALITY || 80), captureBeyondViewport: false });
      console.log(`${name} overflowX=${overflow}`);
      await page.close();
    }
  }
  await browser.close();
})();
