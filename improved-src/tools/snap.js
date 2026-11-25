#!/usr/bin/env node
/**
 * Development screenshots.
 *   node improved-src/tools/snap.js <outDir> <width[,width]> <page> [page...]
 * Needs puppeteer-core and a local Chrome; serves nothing itself (set BASE).
 * Full-page JPEGs; motion is disabled so that every element is in its final state.
 */
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer-core");

const BASE = process.env.BASE || "http://127.0.0.1:8810/";
const [outDir, widthArg, ...pages] = process.argv.slice(2);
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
      const name = (rel.split("#")[0] || "index.html").replace(/\.html$/, "").replace(/\//g, "_") + `_${width}.jpg`;
      await page.screenshot({ path: path.join(outDir, name), fullPage, type: "jpeg", quality: 78 });
      console.log(`${name} overflowX=${overflow}`);
      await page.close();
    }
  }
  await browser.close();
})();
