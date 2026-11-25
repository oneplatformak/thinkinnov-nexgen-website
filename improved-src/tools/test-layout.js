#!/usr/bin/env node
/**
 * Layout check: loads every page in both languages at sixteen widths and reports
 *  - horizontal overflow of the document,
 *  - visible elements that extend past the right or left edge of the viewport,
 *  - text that is cut off (an element whose content is wider than its box
 *    while overflow is hidden),
 *  - images that failed to load,
 *  - links and controls in the header, forms, open dialogs and the footer
 *    that are smaller than 24 by 24 CSS pixels, and
 *  - words broken across lines:
 *      a Latin word, number, e-mail address or product name ("Solid Edge",
 *      "Teamcenter X") split between two lines, anywhere on the page, in either language;
 *      and on Japanese pages, in headings, leads, labels, table headers,
 *      buttons, chips, the address, footer links and any other short text,
 *      a line break that is not at a phrase boundary. Phrase boundaries are
 *      the <wbr> elements the build inserts, spaces and punctuation; a break
 *      anywhere else inside a text node is a break inside a phrase.
 *
 * The ten original widths are the common device sizes. 360, 900, 1000, 1100,
 * 1180 and 1366 were added because columns are at their narrowest just above
 * a breakpoint, which is where words broke and no device size happened to be.
 * Results shown one at a time (the sixteen needs of the finder, the nine
 * stages of the lifecycle diagram) are each opened and checked.
 *
 * WB_JSON=<file> writes every broken word found, for diagnosis.
 * PAGES=<regex> limits the run to matching pages while working on a fix.
 *
 * Usage: NODE_PATH=<dir with puppeteer-core> node improved-src/tools/test-layout.js [widths]
 * Env:   BASE (default http://127.0.0.1:8810/), CHROME (default /usr/bin/google-chrome)
 */
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");
const phrase = require("../i18n/phrase");

const BASE = process.env.BASE || "http://127.0.0.1:8810/";
const DOCS = path.join(__dirname, "..", "..", "docs");
const WIDTHS = (process.argv[2] || "320,360,375,390,430,768,900,1000,1024,1100,1180,1280,1366,1440,1920,2560").split(",").map(Number);
const STUBS = new Set(["page.html", "jobdetails.html", "application.html"]);

function pages(dir, prefix = "") {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return ["ja", "careers", "products"].includes(entry.name) ? pages(path.join(dir, entry.name), prefix + entry.name + "/") : [];
    return entry.name.endsWith(".html") && !STUBS.has(entry.name) ? [prefix + entry.name] : [];
  });
}

function inspect() {
  const vw = document.documentElement.clientWidth;
  const out = { overflowX: document.documentElement.scrollWidth - vw, offscreen: [], clipped: [], brokenImages: [], small: [] };
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
  // Controls and links in the header, forms, open dialogs and the footer: at least 24 by 24 CSS pixels.
  for (const el of document.querySelectorAll("header a, header button, form a, form button, form input, form select, form textarea, form label, dialog[open] a, dialog[open] button, footer a, footer button")) {
    if (el.type === "hidden" || el.closest("[hidden], dialog:not([open]), .visually-hidden, .skip-link, .field-trap")) continue;
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.width < 24 || r.height < 24) out.small.push(`${describe(el)} ${Math.round(r.width * 10) / 10}x${Math.round(r.height * 10) / 10} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}"`);
  }
  out.small = out.small.slice(0, 8);
  out.offscreen = out.offscreen.slice(0, 5);
  out.clipped = out.clipped.slice(0, 5);
  return out;
}

/** Controls that switch one result for another, and where the result appears. */
const SWITCHED = [
  ["[data-need-link]", "[data-need-panel]:not([hidden])"],
  ["[data-lc-tab]", "[data-lifecycle] [role=tabpanel]:not([hidden])"],
];

/** Words and Japanese phrases broken across lines. Runs in the page. */
function wordBreaks(JA_TARGETS, JA_SHORT, ROOT) {
  const isJa = document.documentElement.lang === "ja";
  // Japanese display text that must break at phrase boundaries only: the
  // elements and classes the build treats, and any element whose whole text
  // is short. Both come from i18n/phrase.js so test and build cannot drift.
  const SKIP = "script,style,noscript,svg,[hidden],dialog:not([open]),.visually-hidden,.skip-link,.field-trap,option,textarea";
  const OK_BEFORE = "、。・，．：；！？）］｝」』】〉》/-–—…";
  const OK_AFTER = "（［｛「『【〈《";
  // Product names of two words, e-mail addresses, numbers joined by hyphens
  // (postcode, block number, telephone number), then any Latin word or number.
  const TOKEN = /Solid[ \u00a0]Edge|Teamcenter[ \u00a0]X|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|\d+(?:-\d+)+|[A-Za-z0-9][A-Za-z0-9'’]*[A-Za-z0-9]/g;
  const describe = (el) => {
    const parts = [];
    for (let e = el, k = 0; e && e !== document.body && k < 3; e = e.parentElement, k += 1) parts.push(e.tagName.toLowerCase() + (typeof e.className === "string" && e.className.trim() ? "." + e.className.trim().split(/\s+/).join(".") : ""));
    return parts.join(" < ");
  };
  const out = [];
  const range = document.createRange();
  const topOf = (node, i) => {
    range.setStart(node, i);
    range.setEnd(node, i + 1);
    const r = range.getClientRects()[0];
    return r && r.width > 0.5 ? r.top : null;
  };
  const walker = document.createTreeWalker(ROOT ? document.querySelector(ROOT) : document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const el = node.parentElement;
    const text = node.nodeValue;
    if (!el || text.trim().length < 2 || el.closest(SKIP)) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") continue;
    range.selectNodeContents(node);
    const lineTops = new Set([...range.getClientRects()].filter((r) => r.width > 0.5).map((r) => Math.round(r.top)));
    if (lineTops.size < 2) continue;
    const lineStep = parseFloat(style.fontSize) * 0.6;

    for (const m of text.matchAll(TOKEN)) {
      let first = null;
      let at = -1;
      for (let i = m.index; i < m.index + m[0].length; i += 1) {
        if (/\s/.test(text[i])) continue;
        const top = topOf(node, i);
        if (top == null) continue;
        if (first == null) first = top;
        else if (Math.abs(top - first) > lineStep) { at = i - m.index; break; }
      }
      if (at > 0) out.push({ kind: "latin", word: m[0], split: m[0].slice(0, at) + "/" + m[0].slice(at), where: describe(el), box: Math.round(el.getBoundingClientRect().width), font: style.fontSize });
    }

    if (!isJa || !(el.closest(JA_TARGETS) || el.textContent.trim().length <= JA_SHORT)) continue;
    let prevTop = null;
    let prevIndex = -1;
    for (let i = 0; i < text.length; i += 1) {
      if (/\s/.test(text[i])) continue;
      const top = topOf(node, i);
      if (top == null) continue;
      if (prevTop != null && Math.abs(top - prevTop) > lineStep && prevIndex === i - 1) {
        const a = text[i - 1];
        const b = text[i];
        const bothLatin = /[A-Za-z0-9]/.test(a) && /[A-Za-z0-9]/.test(b);
        if (!bothLatin && !OK_BEFORE.includes(a) && !OK_AFTER.includes(b)) {
          out.push({ kind: "phrase", word: text.trim().slice(0, 40), split: text.slice(Math.max(0, i - 8), i) + "/" + text.slice(i, i + 8), where: describe(el), box: Math.round(el.getBoundingClientRect().width), font: style.fontSize });
        }
      }
      prevTop = top;
      prevIndex = i;
    }
  }
  return out;
}

(async () => {
  const only = process.env.PAGES ? new RegExp(process.env.PAGES) : null; // development aid
  const list = pages(DOCS).sort().filter((rel) => !only || only.test(rel));
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const totals = Object.fromEntries(WIDTHS.map((w) => [w, { pages: 0, overflow: 0, offscreen: 0, clipped: 0, broken: 0, small: 0, wordBreaks: 0 }]));
  const failures = [];
  const broken = [];
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
      await page.evaluate(() => document.fonts.ready);
      const r = await page.evaluate(inspect);
      const words = await page.evaluate(wordBreaks, phrase.SELECTOR, phrase.SHORT);
      // Results that scripts show one at a time: every need of the finder and
      // every stage of the lifecycle diagram is opened and checked as well.
      for (const [control, shown] of SWITCHED) {
        const n = await page.$$eval(control, (cs) => cs.length);
        for (let i = 1; i < n; i += 1) {
          await page.$$eval(control, (cs, k) => cs[k].click(), i);
          words.push(...(await page.evaluate(wordBreaks, phrase.SELECTOR, phrase.SHORT, shown)).map((w) => ({ ...w, where: `${w.where} (result ${i + 1})` })));
        }
      }
      const t = totals[width];
      t.pages += 1;
      if (words.length) t.wordBreaks += 1;
      for (const w of words) broken.push({ rel, width, ...w });
      if (r.overflowX > 0) t.overflow += 1;
      if (r.offscreen.length) t.offscreen += 1;
      if (r.clipped.length) t.clipped += 1;
      if (r.brokenImages.length) t.broken += 1;
      if (r.small.length) t.small += 1;
      if (r.overflowX > 0 || r.offscreen.length || r.clipped.length || r.brokenImages.length || r.small.length) failures.push({ rel, width, ...r });
    }
    await page.close();
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  await browser.close();

  console.log(`Pages: ${list.length} (${list.filter((p) => p.startsWith("ja/")).length} Japanese), widths: ${WIDTHS.join(", ")}`);
  console.log("width  pages  overflow  offscreen  clipped  broken-images  small-targets  pages-with-broken-words");
  for (const w of WIDTHS) {
    const t = totals[w];
    console.log(`${String(w).padStart(5)}  ${String(t.pages).padStart(5)}  ${String(t.overflow).padStart(8)}  ${String(t.offscreen).padStart(9)}  ${String(t.clipped).padStart(7)}  ${String(t.broken).padStart(13)}  ${String(t.small).padStart(13)}  ${String(t.wordBreaks).padStart(23)}`);
  }
  for (const f of failures.slice(0, 40)) console.log(JSON.stringify(f));
  if (failures.length > 40) console.log(`... and ${failures.length - 40} more`);

  if (process.env.WB_JSON) fs.writeFileSync(process.env.WB_JSON, JSON.stringify(broken, null, 1) + "\n");
  if (broken.length) {
    // One line per distinct broken word and place, with how many pages and which widths.
    const groups = new Map();
    for (const b of broken) {
      const key = `${b.kind}|${b.word}|${b.where}|${b.rel.startsWith("ja/") ? "ja" : "en"}`;
      const g = groups.get(key) || { ...b, pages: new Set(), widths: new Set() };
      g.pages.add(b.rel);
      g.widths.add(b.width);
      groups.set(key, g);
    }
    const rows = [...groups.values()].sort((a, b) => b.pages.size * b.widths.size - a.pages.size * a.widths.size);
    const count = (kind) => broken.filter((b) => b.kind === kind).length;
    console.log(`Broken words: ${broken.length} (Latin word or product name: ${count("latin")}; Japanese phrase: ${count("phrase")}), ${rows.length} distinct`);
    for (const g of rows.slice(0, 60)) {
      const ws = [...g.widths].sort((a, b) => a - b);
      console.log(`  ${g.kind.padEnd(6)} ${g.split}  [${g.where}]  ${g.pages.size} page(s), e.g. ${[...g.pages][0]}; widths ${ws.join(",")}`);
    }
    if (rows.length > 60) console.log(`  ... and ${rows.length - 60} more distinct`);
  } else {
    console.log("Broken words: 0");
  }
  const bad = failures.length + broken.length;
  console.log(bad ? `FAIL (${failures.length} page/width combinations with layout faults; ${broken.length} broken words)` : "PASS");
  process.exit(bad ? 1 : 0);
})();
