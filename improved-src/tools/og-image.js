#!/usr/bin/env node
/**
 * Draws docs/assets/img/og-image.jpg (1200 x 630), the image shown when a page
 * is shared. Uses the real logo, the site fonts and wording that is true of
 * every page: no partner designation, no claims.
 *
 *   NODE_PATH=/path/to/node_modules node improved-src/tools/og-image.js
 */
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");
const config = require("../config");

const DOCS = path.join(__dirname, "..", "..", "docs");
const font = (name) => fs.readFileSync(path.join(DOCS, "assets", "fonts", name)).toString("base64");
const logo = fs.readFileSync(path.join(DOCS, config.logoPath), "utf8");

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: Manrope; src: url(data:font/woff2;base64,${font("manrope-latin.woff2")}); font-weight: 200 800; }
@font-face { font-family: Inter; src: url(data:font/woff2;base64,${font("inter-latin.woff2")}); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #0e1a2e; color: #f6f4ef; font-family: Inter, sans-serif; padding: 72px 80px; border-left: 14px solid #c2410c; display: flex; flex-direction: column; }
.brand { display: flex; align-items: center; gap: 28px; }
.brand svg, .brand img { height: 96px; width: auto; background: #f6f4ef; padding: 10px 14px; }
.name { font: 800 60px/1 Manrope, sans-serif; letter-spacing: -0.02em; }
h1 { margin-top: 64px; font: 700 46px/1.2 Manrope, sans-serif; letter-spacing: -0.01em; max-width: 900px; }
.products { margin-top: 36px; font-size: 26px; color: #aab4c5; }
.url { margin-top: auto; font: 700 26px Manrope, sans-serif; color: #f08a4b; }
</style>
<div class="brand">${logo}<span class="name">ThinkInnov-NexGen</span></div>
<h1>PLM consulting, implementation and support in Japan</h1>
<p class="products">NX · Solid Edge · Capital · Teamcenter · Tecnomatix · Mendix</p>
<p class="url">${config.baseUrl.replace(/^https?:\/\//, "")}</p>`;

(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(DOCS, "assets", "img", "og-image.jpg"), type: "jpeg", quality: 86 });
  await browser.close();
})();
