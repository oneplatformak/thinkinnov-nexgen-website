#!/usr/bin/env node
/**
 * Scripted keyboard and click tests in headless Chrome: menus, lifecycle
 * diagram, finder, product pages, the brief's three worked journeys through
 * to the contact form, search, career filters, photo viewer, language switch,
 * both forms, and the same pages with scripts switched off.
 *
 * Forms are posted to a local PHP server whose sendmail writes to a file, so
 * no mail leaves the machine.
 *
 * Usage: NODE_PATH=<dir with puppeteer-core> node improved-src/tools/test-interactions.js
 * Env:   STATIC (default http://127.0.0.1:8810/), CHROME
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const puppeteer = require("puppeteer-core");

const STATIC = process.env.STATIC || "http://127.0.0.1:8810/";
const DOCS = path.join(__dirname, "..", "..", "docs");
const WORK = fs.mkdtempSync(path.join(os.tmpdir(), "tin-ui-"));
const MAILDIR = path.join(WORK, "mail");
fs.mkdirSync(MAILDIR);
const PHP_OK = "http://127.0.0.1:8825/";
const PHP_FAIL = "http://127.0.0.1:8826/";

let pass = 0;
const failed = [];
let group = "";
function ok(name, condition, detail = "") {
  if (condition) { pass += 1; console.log(`PASS  ${group}: ${name}`); }
  else { failed.push(`${group}: ${name}`); console.log(`FAIL  ${group}: ${name} ${detail}`); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const mails = () => fs.readdirSync(MAILDIR).length;
const clearRate = () => ["tin_contact_rl", "tin_apply_rl"].forEach((d) => fs.rmSync(path.join(os.tmpdir(), d), { recursive: true, force: true }));

function startPhp(port, sendmail) {
  return spawn("php", ["-d", "upload_max_filesize=8M", "-d", "post_max_size=10M", "-d", `sendmail_path=${sendmail}`, "-S", `127.0.0.1:${port}`, "-t", DOCS], { stdio: "ignore" });
}

async function open(browser, url, { width = 1440, height = 900, js = true, lang } = {}) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width, height });
  await page.setJavaScriptEnabled(js);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  if (lang) await page.evaluateOnNewDocument((l) => { Object.defineProperty(navigator, "language", { get: () => l }); }, lang);
  page.errors = [];
  page.on("pageerror", (e) => page.errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") page.errors.push(m.text()); });
  await page.goto(url, { waitUntil: "load" });
  return page;
}
const done = (page) => page.browserContext().close();
const active = (page) => page.evaluate(() => { const a = document.activeElement; return a ? { tag: a.tagName, id: a.id, text: a.textContent.trim().slice(0, 40), cls: String(a.className) } : null; });
const focusRing = (page) => page.evaluate(() => { const s = getComputedStyle(document.activeElement); return s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2; });

async function testDesktopNav(browser, base, labels) {
  group = `desktop menu (${labels.lang})`;
  const page = await open(browser, base + labels.prefix + "about.html");
  await page.keyboard.press("Tab");
  ok("first Tab stop is the skip link", (await active(page)).cls.includes("skip-link"));
  ok("skip link shows a focus indicator", await focusRing(page));
  await page.keyboard.press("Enter");
  ok("skip link moves to the main content", await page.evaluate(() => location.hash === "#main"));
  await page.focus("[data-mega-trigger]");
  await page.keyboard.press("Enter");
  ok("Enter opens the first menu", await page.$eval("[data-mega-trigger]", (t) => t.getAttribute("aria-expanded") === "true" && !document.getElementById(t.getAttribute("aria-controls")).hidden));
  await page.keyboard.press("Escape");
  ok("Escape closes it and keeps focus on the button", await page.$eval("[data-mega-trigger]", (t) => t.getAttribute("aria-expanded") === "false" && document.activeElement === t));
  await page.keyboard.press("ArrowDown");
  ok("ArrowDown opens it and focuses the first link", await page.evaluate(() => document.activeElement.tagName === "A" && !!document.activeElement.closest("[data-mega]")));
  ok("menu link shows a focus indicator", await focusRing(page));
  const count = await page.$eval("[data-mega-trigger]", (t) => document.getElementById(t.getAttribute("aria-controls")).querySelectorAll("a").length);
  for (let i = 0; i < count; i += 1) await page.keyboard.press("Tab");
  ok("tabbing past the last link closes the menu", await page.$eval("[data-mega-trigger]", (t) => t.getAttribute("aria-expanded") === "false"), `links=${count}`);
  const triggers = await page.$$("[data-mega-trigger]");
  await triggers[1].hover();
  ok("hovering with a mouse opens a menu", await page.$$eval("[data-mega-trigger]", (ts) => ts[1].getAttribute("aria-expanded") === "true"));
  await triggers[1].click();
  ok("clicking a menu that hover opened keeps it open", await page.$$eval("[data-mega-trigger]", (ts) => ts[1].getAttribute("aria-expanded") === "true"));
  await triggers[1].click();
  ok("a second click closes it", await page.$$eval("[data-mega-trigger]", (ts) => ts[1].getAttribute("aria-expanded") === "false"));
  await triggers[1].click();
  await triggers[0].click();
  ok("opening one menu closes the other", await page.$$eval("[data-mega-trigger]", (ts) => ts[0].getAttribute("aria-expanded") === "true" && ts[1].getAttribute("aria-expanded") === "false"));
  await page.click("h1");
  ok("a click outside closes the menu", await page.$$eval("[data-mega-trigger]", (ts) => ts.every((t) => t.getAttribute("aria-expanded") === "false")));
  ok("the current section is marked in the navigation", await page.$$eval('.site-header [aria-current="page"], .site-header .is-active', (els) => els.length > 0));
  ok("no script errors", page.errors.length === 0, page.errors.join(" | "));
  await done(page);
}

async function testMobileMenu(browser, base, labels) {
  group = `mobile menu (${labels.lang})`;
  const page = await open(browser, base + labels.prefix + "index.html", { width: 390, height: 800 });
  ok("menu button is visible, desktop navigation is not", await page.evaluate(() => document.querySelector("[data-menu-open]").offsetParent !== null && document.querySelector("[data-mega-trigger]").offsetParent === null));
  await page.focus("[data-menu-open]");
  await page.keyboard.press("Enter");
  ok("Enter opens the menu dialog", await page.$eval("[data-mobile-menu]", (d) => d.open));
  ok("button reports expanded", await page.$eval("[data-menu-open]", (b) => b.getAttribute("aria-expanded") === "true"));
  let inside = true;
  for (let i = 0; i < 40; i += 1) {
    await page.keyboard.press("Tab");
    inside = inside && (await page.evaluate(() => { const a = document.activeElement; return a === document.body || !!a.closest("[data-mobile-menu]"); }));
  }
  ok("focus stays inside the dialog for 40 Tab presses", inside);
  const fits = await page.$eval("[data-mobile-menu]", (d) => { const r = d.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth + 1; });
  ok("dialog fits the 390px viewport", fits);
  await page.$eval("[data-mobile-menu] details summary", (s) => s.focus());
  await page.keyboard.press("Enter");
  ok("a section expands with Enter", await page.$eval("[data-mobile-menu] details", (d) => d.open));
  await page.keyboard.press("Escape");
  ok("Escape closes the dialog", await page.$eval("[data-mobile-menu]", (d) => !d.open));
  ok("focus returns to the menu button", await page.evaluate(() => document.activeElement === document.querySelector("[data-menu-open]")));
  await page.click("[data-menu-open]");
  await page.click("[data-menu-close]");
  ok("the close button closes the dialog", await page.$eval("[data-mobile-menu]", (d) => !d.open));
  ok("no script errors", page.errors.length === 0, page.errors.join(" | "));
  await done(page);
}

async function testLifecycle(browser, base, labels, width) {
  group = `lifecycle ${width}px (${labels.lang})`;
  const page = await open(browser, base + labels.prefix + "index.html", { width, height: 900 });
  const state = () => page.evaluate(() => {
    const tabs = [...document.querySelectorAll("[data-lc-tab]")];
    const panels = [...document.querySelectorAll("[data-lc-panel]")];
    return { tabs: tabs.length, selected: tabs.findIndex((t) => t.getAttribute("aria-selected") === "true"), visible: panels.map((p, i) => (p.hidden ? -1 : i)).filter((i) => i >= 0), focused: tabs.indexOf(document.activeElement) };
  });
  let s = await state();
  ok("nine stages, first selected, one panel shown", s.tabs === 9 && s.selected === 0 && s.visible.join() === "0", JSON.stringify(s));
  ok("tab roles are set", await page.evaluate(() => document.querySelector("[data-lc-tablist]").getAttribute("role") === "tablist" && document.querySelector("[data-lc-panel]").getAttribute("role") === "tabpanel"));
  await page.focus('[data-lc-tab][aria-selected="true"]');
  await page.keyboard.press("ArrowRight");
  s = await state();
  ok("ArrowRight selects and focuses the second stage", s.selected === 1 && s.focused === 1 && s.visible.join() === "1", JSON.stringify(s));
  await page.keyboard.press("End");
  s = await state();
  ok("End selects the last stage", s.selected === 8 && s.focused === 8 && s.visible.join() === "8");
  await page.keyboard.press("ArrowRight");
  s = await state();
  ok("ArrowRight wraps to the first stage", s.selected === 0 && s.focused === 0);
  await page.keyboard.press("ArrowLeft");
  s = await state();
  ok("ArrowLeft wraps to the last stage", s.selected === 8);
  await page.keyboard.press("Home");
  s = await state();
  ok("Home selects the first stage", s.selected === 0);
  ok("only the selected tab is in the Tab order", await page.$$eval("[data-lc-tab]", (ts) => ts.filter((t) => t.tabIndex === 0).length === 1));
  ok("selected tab shows a focus indicator", await focusRing(page));
  await page.$$eval("[data-lc-tab]", (ts) => ts[4].click());
  s = await state();
  ok("clicking the fifth stage shows its panel", s.selected === 4 && s.visible.join() === "4");
  ok("the panel names the stage and is labelled by its tab", await page.evaluate(() => { const p = document.querySelector("[data-lc-panel]:not([hidden])"); return !!p.querySelector("h3") && !!document.getElementById(p.getAttribute("aria-labelledby")); }));
  ok("with reduced motion nothing animates for longer than an instant", await page.evaluate(() => document.getAnimations().every((a) => a.effect.getTiming().duration <= 0.01)));
  await page.goto(base + labels.prefix + "index.html#lc-quality", { waitUntil: "load" });
  ok("a direct link to a stage selects it", await page.evaluate(() => document.querySelector('[data-lc-tab][aria-selected="true"]').getAttribute("href") === "#lc-quality"));
  ok("no script errors", page.errors.length === 0, page.errors.join(" | "));
  await done(page);
}

async function testFinder(browser, base, labels) {
  group = `finder (${labels.lang})`;
  const page = await open(browser, base + labels.prefix + "solutions.html");
  const visible = () => page.$$eval("[data-need-panel]", (ps) => ps.filter((p) => !p.hidden).map((p) => p.getAttribute("data-need-panel")));
  ok("one need is shown at first", (await visible()).length === 1);
  const keys = await page.$$eval("[data-need-link]", (ls) => ls.map((l) => l.getAttribute("data-need-link")));
  ok("sixteen needs are offered", keys.length === 16, String(keys.length));
  await page.focus(`[data-need-link="${keys[5]}"]`);
  await page.keyboard.press("Enter");
  ok("Enter on a need shows only that need", (await visible()).join() === keys[5]);
  ok("the chosen need is marked current", await page.$eval(`[data-need-link="${keys[5]}"]`, (l) => l.getAttribute("aria-current") === "true"));
  ok("focus moves to the result", await page.evaluate(() => document.activeElement.hasAttribute("data-need-panel")));
  ok("the result quotes its source and links to real pages", await page.evaluate(() => { const p = document.querySelector("[data-need-panel]:not([hidden])"); return p.querySelectorAll("a[href]").length >= 2 && !!p.querySelector("blockquote, .need-source"); }));
  const industry = await page.$eval("[data-finder-industry]", (s) => s.options[3].value);
  const size = await page.$eval("[data-finder-size]", (s) => s.options[2].value);
  await page.select("[data-finder-industry]", industry);
  await page.select("[data-finder-size]", size);
  ok("choosing an industry shows its note", await page.$eval(`[data-industry-note="${industry}"]`, (n) => !n.hidden));
  const href = await page.$eval("[data-need-panel]:not([hidden]) [data-need-cta]", (a) => a.href);
  const q = new URL(href).searchParams;
  ok("the contact link carries need, industry and size", q.get("need") === keys[5] && q.get("industry") === industry && q.get("size") === size && q.get("type") === "consultation", href);
  await page.goto(href, { waitUntil: "load" });
  ok("contact form preselects the PLM consultation type", await page.$eval("[data-enquiry-type]", (s) => s.value === "consultation"));
  ok("contact form shows the three items passed on", await page.$eval("[data-enquiry-context]", (b) => !b.hidden && [...b.querySelectorAll("[data-context-item]")].filter((i) => !i.hidden).length === 3));
  ok("hidden fields hold the passed values", await page.evaluate((k, i, s) => { const f = document.querySelector("form[data-form]"); return f.elements.need.value === k && f.elements.industry.value === i && f.elements.size.value === s; }, keys[5], industry, size));
  await page.click("[data-context-clear]");
  ok("Remove clears the passed context", await page.evaluate(() => { const f = document.querySelector("form[data-form]"); return f.elements.need.value === "" && f.elements.industry.value === "" && document.querySelector("[data-enquiry-context]").hidden; }));
  await page.goto(base + labels.prefix + "contact.html?type=evil&topic=%3Cscript%3E&need=nope&industry=x&size=y", { waitUntil: "load" });
  ok("unknown values in the address are ignored", await page.evaluate(() => { const f = document.querySelector("form[data-form]"); return f.elements.type.value !== "evil" && f.elements.topic.value === "" && f.elements.need.value === "" && document.querySelector("[data-enquiry-context]").hidden; }));
  await page.goto(base + labels.prefix + "products.html", { waitUntil: "load" });
  const demo = await page.$eval('#teamcenter a[href*="contact.html"]', (a) => a.href);
  await page.goto(demo, { waitUntil: "load" });
  ok("a product's enquiry link preselects type and topic", await page.evaluate(() => { const f = document.querySelector("form[data-form]"); return f.elements.type.value === "product" && f.elements.topic.value === "product-teamcenter"; }), demo);
  await page.goto(base + labels.prefix + "solutions.html#need-quality", { waitUntil: "load" });
  ok("a direct link to a need shows it", (await visible()).join() === "quality");
  ok("no script errors", page.errors.length === 0, page.errors.join(" | "));
  await done(page);
}

async function testCareers(browser, base, labels) {
  group = `career filters (${labels.lang})`;
  const page = await open(browser, base + labels.prefix + "careers.html");
  const shown = () => page.$$eval("[data-role]", (rs) => rs.filter((r) => !r.hidden).length);
  const countText = () => page.$eval("[data-role-count]", (c) => c.textContent);
  ok("18 roles listed and the filter form is shown", (await shown()) === 18 && (await page.$eval("[data-role-filters]", (f) => !f.hidden)));
  await page.focus('[data-role-filters] [name="q"]');
  await page.keyboard.type("Capital");
  const n = await shown();
  ok("typing 'Capital' narrows the list to roles that mention it", n > 0 && n < 18 && (await page.$$eval("[data-role]", (rs) => rs.filter((r) => !r.hidden).every((r) => /capital/i.test(r.textContent)))), String(n));
  ok("the count is announced", (await countText()) === labels.count(n, 18), await countText());
  ok("the address records the search", await page.evaluate(() => new URLSearchParams(location.search).get("q") === "Capital"));
  await page.click('[data-role-filters] [type="reset"]');
  await sleep(50);
  ok("Clear filters restores all 18", (await shown()) === 18 && (await countText()) === "");
  const discipline = await page.$eval('[name="discipline"]', (s) => s.options[1].value);
  await page.select('[name="discipline"]', discipline);
  const d = await shown();
  ok("discipline filter shows only that discipline", d > 0 && d < 18 && (await page.$$eval("[data-role]", (rs, v) => rs.filter((r) => !r.hidden).every((r) => r.getAttribute("data-discipline") === v), discipline)));
  const band = await page.$eval('[name="band"]', (s) => s.options[s.options.length - 1].value);
  await page.select('[name="band"]', band);
  const b = await shown();
  ok("experience filter combines with discipline", b <= d && (await page.$$eval("[data-role]", (rs, v) => rs.filter((r) => !r.hidden).every((r) => r.getAttribute("data-band") === v), band)));
  await page.focus('[data-role-filters] [name="q"]');
  await page.keyboard.type("zzzzqqqq");
  ok("no match shows the empty message", (await shown()) === 0 && (await countText()) === labels.none, await countText());
  await page.goto(`${base}${labels.prefix}careers.html?discipline=${discipline}&q=Teamcenter`, { waitUntil: "load" });
  ok("filters in the address are applied on load", await page.evaluate((v) => document.querySelector('[name="discipline"]').value === v && document.querySelector('[name="q"]').value === "Teamcenter" && [...document.querySelectorAll("[data-role]")].some((r) => r.hidden), discipline));
  const first = await page.$eval("[data-role]:not([hidden]) a", (a) => a.getAttribute("href"));
  ok("each role links to its own page", /^careers\/\d\d-[a-z0-9-]+\.html$/.test(first), first);
  ok("no script errors", page.errors.length === 0, page.errors.join(" | "));
  await done(page);
}

async function testLightbox(browser, base, labels) {
  group = `photo viewer (${labels.lang})`;
  const page = await open(browser, base + labels.prefix + "about.html");
  const info = () => page.evaluate(() => { const d = document.querySelector("dialog.lightbox"); return { open: d.open, src: d.querySelector("img").getAttribute("src") || "", count: d.querySelector("[data-lb-count]").textContent, alt: d.querySelector("img").alt }; });
  const hrefs = await page.$$eval("[data-lightbox]", (ls) => ls.map((l) => l.href));
  ok("fourteen photos", hrefs.length === 14);
  await page.focus("[data-lightbox]");
  ok("photo link shows a focus indicator", await focusRing(page));
  await page.keyboard.press("Enter");
  let i = await info();
  ok("Enter opens the viewer on the first photo", i.open && i.src === hrefs[0] && i.count === "1 / 14", JSON.stringify(i));
  ok("the photo has a text alternative", i.alt.length > 10);
  await page.keyboard.press("ArrowRight");
  i = await info();
  ok("ArrowRight shows the second photo", i.src === hrefs[1] && i.count === "2 / 14");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  i = await info();
  ok("ArrowLeft wraps to the last photo", i.src === hrefs[13] && i.count === "14 / 14");
  let inside = true;
  for (let k = 0; k < 8; k += 1) { await page.keyboard.press("Tab"); inside = inside && (await page.evaluate(() => document.activeElement === document.body || !!document.activeElement.closest("dialog.lightbox"))); }
  ok("focus stays inside the viewer", inside);
  await page.waitForFunction(() => { const im = document.querySelector("dialog.lightbox img"); return im.complete && im.naturalWidth > 0; });
  ok("the viewer fits the window", await page.evaluate(() => { const r = document.querySelector("dialog.lightbox img").getBoundingClientRect(); return r.width > 100 && r.right <= innerWidth && r.bottom <= innerHeight; }));
  await page.keyboard.press("Escape");
  ok("Escape closes it and returns focus to the photo", await page.evaluate(() => !document.querySelector("dialog.lightbox").open && document.activeElement === document.querySelector("[data-lightbox]")));
  await page.goto(base + labels.prefix + "industries.html", { waitUntil: "load" });
  await page.$eval("[data-lightbox]", (l) => l.click());
  ok("an industry infographic opens in the viewer", (await info()).open && (await page.$$eval("[data-lightbox]", (ls) => ls.length)) === 11);
  ok("no script errors", page.errors.length === 0, page.errors.join(" | "));
  await done(page);
}

async function testLanguage(browser, base) {
  group = "language switch";
  let page = await open(browser, base + "about.html#gallery");
  await Promise.all([page.waitForNavigation(), page.click('[data-lang-switch] a[data-lang="ja"]')]);
  ok("switching keeps the page and the anchor", page.url() === base + "ja/about.html#gallery", page.url());
  ok("the choice is remembered", await page.evaluate(() => localStorage.getItem("tin-lang") === "ja"));
  ok("Japanese page declares lang=ja and marks the current language", await page.evaluate(() => document.documentElement.lang === "ja" && !!document.querySelector('[data-lang-switch] [aria-current="true"], [data-lang-switch] [aria-current="page"]')));
  await page.goto(base + "services.html", { waitUntil: "load" });
  ok("a direct link to an English page is not redirected", page.url() === base + "services.html");
  ok("the remembered language is offered instead", await page.$eval(".lang-suggest a", (a) => a.href.endsWith("/ja/services.html") && a.closest(".lang-suggest").lang === "ja"));
  await page.click(".lang-suggest button");
  await page.reload({ waitUntil: "load" });
  ok("dismissing the offer stops it from returning", (await page.$(".lang-suggest")) === null);
  await page.goto(base + "careers/05-project-manager.html", { waitUntil: "load" });
  await Promise.all([page.waitForNavigation(), page.click('[data-lang-switch] a[data-lang="ja"]')]);
  ok("switching works from a role page", page.url() === base + "ja/careers/05-project-manager.html", page.url());
  await Promise.all([page.waitForNavigation(), page.click('[data-lang-switch] a[data-lang="en"]')]);
  ok("and back to English", page.url() === base + "careers/05-project-manager.html", page.url());
  const cookies = await page.browserContext().cookies();
  ok("no cookie has been set after five page views and a language choice", cookies.length === 0 && (await page.evaluate(() => document.cookie)) === "", JSON.stringify(cookies));
  await done(page);
  page = await open(browser, base + "index.html", { lang: "ja-JP" });
  ok("a Japanese browser is offered Japanese on the English home page, without a redirect", page.url() === base + "index.html" && (await page.$(".lang-suggest")) !== null);
  await done(page);
  page = await open(browser, base + "ja/index.html", { lang: "en-US" });
  ok("an English browser on a Japanese page is left alone", (await page.$(".lang-suggest")) === null);
  await done(page);
}

// The original site's addresses (page.html?page=…, jobdetails.html?id=…, application.html?id=…)
// as the three stub files forward them. On Apache the same moves are 301s in .htaccess, which
// this test cannot reach.
async function testLegacyUrls(browser, base) {
  group = "old addresses";
  const land = async (from, js = true) => {
    const page = await open(browser, base + from, { js });
    await page.waitForFunction(() => !/\/(page|jobdetails|application)\.html$/.test(location.pathname), { timeout: 5000 }).catch(() => null);
    await page.waitForFunction(() => document.readyState === "complete", { timeout: 5000 }).catch(() => null);
    const result = { url: page.url(), h1: await page.$eval("h1", (h) => h.textContent.trim()).catch(() => ""), errors: page.errors.length };
    result.anchor = await page.evaluate(() => (location.hash ? !!document.getElementById(location.hash.slice(1)) : true));
    result.role = await page.$eval('[name="job"]', (el) => el.value).catch(() => null);
    await done(page);
    return result;
  };
  const pages = ["about", "plm", "services", "digital-transformation", "products", "solutions", "industries", "behind-the-brand", "careers"];
  for (const name of pages) {
    const r = await land(`page.html?page=${name}`);
    ok(`page.html?page=${name} opens ${name}.html`, r.url === `${base}${name}.html` && r.h1 !== "" && r.h1 !== "This page has moved", `${r.url} "${r.h1}"`);
  }
  let r = await land("page.html?page=about#leadership");
  ok("an old anchor is carried over and exists on the new page", r.url === base + "about.html#leadership" && r.anchor, r.url);
  r = await land("page.html?page=plm#business-size");
  ok("a second old anchor is carried over and exists", r.url === base + "plm.html#business-size" && r.anchor, r.url);
  r = await land("page.html?page=no-such-page");
  ok("an unknown old page name opens the home page", r.url === base || r.url === base + "index.html", r.url);
  r = await land("jobdetails.html?id=1");
  ok("jobdetails.html?id=1 opens the first role", r.url === base + "careers/01-tech-lead-teamcenter.html" && r.h1 === "Tech Lead - Teamcenter", `${r.url} "${r.h1}"`);
  r = await land("jobdetails.html?id=18");
  ok("jobdetails.html?id=18 opens the last role", r.url === base + "careers/18-mendix-developer.html" && r.h1 === "Mendix Developer", `${r.url} "${r.h1}"`);
  r = await land("jobdetails.html?id=99");
  ok("an unknown role number opens the careers page", r.url === base + "careers.html", r.url);
  r = await land("application.html?id=5");
  ok("application.html?id=5 opens the application form with that role chosen", r.url === base + "apply.html?job=05-project-manager" && r.role === "05-project-manager", `${r.url} ${r.role}`);
  r = await land("application.html");
  ok("application.html without a number opens the application form", r.url === base + "apply.html", r.url);
  r = await land("page.html?page=about", false);
  ok("with scripts off the old address still leads somewhere: the home page, or a page with a link to it", r.url === base || r.url === base + "index.html" || r.h1 === "This page has moved", `${r.url} "${r.h1}"`);
}

async function fillContact(page) {
  await page.select('[name="type"]', "product");
  await page.type('[name="name"]', "Test Person");
  await page.type('[name="email"]', "test.person@example.com");
  await page.type('[name="message"]', "Local test message.");
  await page.click('[name="consent"]');
}
const status = (page) => page.$eval("[data-form-status]", (s) => s.textContent.trim());
const waitStatus = (page, previous) => page.waitForFunction((p) => { const t = document.querySelector("[data-form-status]").textContent.trim(); return t && t !== p && !document.querySelector('form[data-form] button[type="submit"]').disabled; }, { timeout: 15000 }, previous);

async function testContactForm(browser, labels) {
  group = `contact form (${labels.lang})`;
  let page = await open(browser, STATIC + labels.prefix + "contact.html");
  await page.focus('form[data-form] button[type="submit"]');
  await page.keyboard.press("Enter");
  const invalid = await page.$$eval('[aria-invalid="true"]', (els) => els.map((e) => e.name));
  ok("empty submit marks name, email, message and consent", ["name", "email", "message", "consent"].every((n) => invalid.includes(n)), invalid.join());
  ok("focus moves to the first field with an error", (await page.evaluate(() => document.activeElement.name)) === invalid[0]);
  ok("each error is announced with its field", await page.$$eval('[aria-invalid="true"]', (els) => els.every((e) => { const ids = (e.getAttribute("aria-describedby") || "").split(" "); return ids.some((id) => { const n = document.getElementById(id); return n && !n.hidden && n.textContent.trim(); }); })));
  ok("the summary message is shown", (await status(page)) === labels.invalid, await status(page));
  await page.type('[name="email"]', "not-an-email");
  await page.keyboard.press("Tab");
  ok("a malformed email gets its own message", await page.$eval('[name="email"]', (e) => e.getAttribute("aria-invalid") === "true"));
  await page.$eval('[name="email"]', (e) => { e.value = ""; });
  await fillContact(page);
  await page.focus('form[data-form] button[type="submit"]');
  await page.keyboard.press("Enter");
  await waitStatus(page, labels.sending);
  const text = await status(page);
  ok("on a static host the page does not claim success", !text.includes(labels.sentContact), text);
  ok("and offers the enquiry as an email instead", await page.$eval("[data-form-status] a", (a) => a.href.startsWith("mailto:info@thinkinnovnexgen.co.jp?subject=") && decodeURIComponent(a.href).includes("Local test message.")));
  await done(page);

  clearRate();
  page = await open(browser, PHP_OK + labels.prefix + "contact.html?type=product&topic=product-nx");
  const before = mails();
  await page.type('[name="name"]', "Test Person");
  await page.type('[name="email"]', "test.person@example.com");
  await page.type('[name="message"]', "Local test message.");
  await page.click('[name="consent"]');
  await page.click('form[data-form] button[type="submit"]');
  await waitStatus(page, labels.sending);
  ok("a submission within three seconds is refused by the server", (await status(page)) === labels.tooFast && mails() === before, await status(page));
  await sleep(3200);
  await page.click('form[data-form] button[type="submit"]');
  await waitStatus(page, labels.tooFast);
  ok("with a working server the success message appears", (await status(page)) === labels.sentContact, await status(page));
  ok("exactly one message was handed to the mail system", mails() === before + 1);
  const mail = fs.readFileSync(path.join(MAILDIR, fs.readdirSync(MAILDIR).sort().pop()), "utf8");
  ok("it carries the type and topic from the address", mail.includes("Enquiry type: Product enquiry") && mail.includes("Topic: NX") && mail.startsWith("To: info@thinkinnovnexgen.co.jp"));
  ok("the form is cleared after sending", await page.$eval('[name="message"]', (m) => m.value === ""));
  await done(page);

  clearRate();
  page = await open(browser, PHP_FAIL + labels.prefix + "contact.html");
  await sleep(3200);
  await fillContact(page);
  await page.click('form[data-form] button[type="submit"]');
  await waitStatus(page, labels.sending);
  ok("when the mail system fails the page says so", (await status(page)) === labels.mailFailed, await status(page));
  ok("and the visitor's text is kept", await page.$eval('[name="message"]', (m) => m.value === "Local test message."));
  await done(page);
}

async function testApplyForm(browser, labels) {
  group = `application form (${labels.lang})`;
  clearRate();
  const pdf = path.join(WORK, "cv.pdf");
  const txt = path.join(WORK, "cv.txt");
  fs.writeFileSync(pdf, "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n");
  fs.writeFileSync(txt, "plain text");
  const page = await open(browser, PHP_OK + labels.prefix + "apply.html?job=05-project-manager");
  ok("the role from the address is preselected", await page.$eval("[data-job-select]", (s) => s.value === "05-project-manager"));
  await page.click('form[data-form] button[type="submit"]');
  const invalid = await page.$$eval('[aria-invalid="true"]', (els) => els.length);
  ok("empty submit marks the 13 required fields and none of the optional ones", invalid === 13 && await page.$$eval('[name="gender"], [name="current_ctc"], [name="expected_ctc"], [name="notice"]', (els) => els.length === 4 && els.every((e) => !e.required && e.getAttribute("aria-invalid") !== "true")), String(invalid));
  const values = { first_name: "Test", last_name: "Candidate", email: "candidate@example.com", phone: "+91 98765 43210", graduation: "2015", experience: "8", employer: "Example Ltd", current_location: "Chennai", preferred_location: "Coimbatore", skills: "Teamcenter, ITK" };
  for (const [name, value] of Object.entries(values)) await page.type(`[name="${name}"]`, value);
  await page.select('[name="source"]', await page.$eval('[name="source"]', (s) => s.options[1].value));
  await page.click('[name="consent"]');
  const file = await page.$('[name="resume"]');
  await file.uploadFile(txt);
  await page.click('form[data-form] button[type="submit"]');
  ok("a .txt file is refused before sending", await page.$eval('[name="resume"]', (e) => e.getAttribute("aria-invalid") === "true"));
  await file.uploadFile(pdf);
  await sleep(3200);
  const before = mails();
  await page.click('form[data-form] button[type="submit"]');
  await waitStatus(page, labels.sendingApply);
  ok("a complete application with a PDF is accepted", (await status(page)) === labels.sentApply && mails() === before + 1, await status(page));
  const mail = fs.readFileSync(path.join(MAILDIR, fs.readdirSync(MAILDIR).sort().pop()), "utf8");
  ok("the mail names the role and carries the CV", mail.includes("Role: Project Manager") && mail.includes('filename="cv-Test-Candidate.pdf"'));
  ok("optional fields left blank are mailed as not provided", ["Gender", "Current CTC (LPA)", "Expected CTC (LPA)", "Notice period (days)"].every((l) => mail.includes(`${l}: not provided`)));
  ok("no script errors", page.errors.length === 0, page.errors.join(" | "));
  await done(page);
}

async function testNoScript(browser, base, labels) {
  group = `scripts off (${labels.lang})`;
  let page = await open(browser, base + labels.prefix + "index.html", { js: false });
  ok("all nine lifecycle stages are readable", await page.$$eval("[data-lc-panel]", (ps) => ps.length === 9 && ps.every((p) => p.offsetParent !== null && p.textContent.trim().length > 40)));
  ok("stage links jump to their text", await page.$$eval("[data-lc-tab]", (ts) => ts.every((t) => document.getElementById(t.getAttribute("href").slice(1)))));
  ok("the menu button is a plain link to the sitemap", await page.$eval("[data-menu-open]", (a) => a.getAttribute("href").endsWith("sitemap.html") && !a.hasAttribute("role")));
  ok("content is visible without the reveal script", await page.$$eval(".section-head", (els) => els.every((e) => getComputedStyle(e).opacity === "1")));
  await page.goto(base + labels.prefix + "solutions.html", { waitUntil: "load" });
  ok("every finder result is readable", await page.$$eval("[data-need-panel]", (ps) => ps.length === 16 && ps.every((p) => p.offsetParent !== null)));
  ok("controls that need scripts are hidden", await page.$$eval("[data-js-only]", (els) => els.every((e) => e.hidden)));
  await page.goto(base + labels.prefix + "careers.html", { waitUntil: "load" });
  ok("all 18 roles are listed", await page.$$eval("[data-role]", (rs) => rs.length === 18 && rs.every((r) => r.offsetParent !== null)));
  await page.goto(base + labels.prefix + "about.html", { waitUntil: "load" });
  ok("gallery photos link straight to the image files", await page.$$eval("[data-lightbox]", (ls) => ls.every((l) => /\.webp$/.test(l.getAttribute("href")))));
  await done(page);

  clearRate();
  page = await open(browser, PHP_OK + labels.prefix + "contact.html", { js: false });
  await page.select('[name="type"]', "support");
  await page.type('[name="name"]', "Test Person");
  await page.type('[name="email"]', "test.person@example.com");
  await page.type('[name="message"]', "No-script test.");
  await page.click('[name="consent"]');
  const before = mails();
  await Promise.all([page.waitForNavigation(), page.click('form[data-form] button[type="submit"]')]);
  ok("the form still sends and shows a result page", (await page.$eval("p[role]", (p) => p.textContent)) === labels.sentContact && mails() === before + 1);
  ok("the result page links back to the form", await page.$eval("a.btn", (a) => a.getAttribute("href") === (document.documentElement.lang === "ja" ? "ja/contact.html" : "contact.html")));
  await done(page);
}

const go = async (page, selector) => {
  const href = await page.$eval(selector, (a) => a.href);
  await Promise.all([page.waitForNavigation({ waitUntil: "load" }), page.$eval(selector, (a) => a.click())]);
  return href;
};
const formValues = (page) => page.evaluate(() => { const f = document.querySelector("form[data-form]"); return { type: f.elements.type.value, topic: f.elements.topic.value, need: f.elements.need.value, industry: f.elements.industry.value, size: f.elements.size.value, shown: [...document.querySelectorAll("[data-context-item]")].filter((i) => !i.hidden).length }; });
const lastMail = () => fs.readFileSync(path.join(MAILDIR, fs.readdirSync(MAILDIR).sort().pop()), "utf8");
async function sendEnquiry(page, labels, message) {
  await page.type('[name="name"]', "Test Person");
  await page.type('[name="email"]', "test.person@example.com");
  await page.type('[name="message"]', message);
  await page.click('[name="consent"]');
  await sleep(3200);
  const before = mails();
  await page.click('form[data-form] button[type="submit"]');
  await waitStatus(page, labels.sending);
  return (await status(page)) === labels.sentContact && mails() === before + 1;
}

async function testProductPages(browser, base, labels) {
  group = `product pages (${labels.lang})`;
  const page = await open(browser, base + labels.prefix + "products.html");
  const keys = await page.$$eval("[data-product-page]", (as) => as.map((a) => a.getAttribute("data-product-page")));
  ok("the catalogue links to six product pages", keys.join() === "nx,solid-edge,capital,teamcenter,tecnomatix,mendix", keys.join());
  for (const key of keys) {
    await page.goto(base + labels.prefix + "products.html", { waitUntil: "load" });
    await go(page, `[data-product-page="${key}"]`);
    const info = await page.evaluate(() => ({
      path: location.pathname, h1: document.querySelectorAll("h1").length,
      sections: ["overview", "lifecycle-position", "support", "enquire"].filter((id) => !document.getElementById(id)),
      onpage: [...document.querySelectorAll(".onpage a")].every((a) => document.getElementById(a.getAttribute("href").slice(1))),
      marked: document.querySelectorAll(".stage-strip .is-on").length, stages: document.querySelectorAll(".stage-strip li").length,
      sources: [...document.querySelectorAll('#overview a[href^="https://"]')].map((a) => a.hostname).filter((h) => !/(^|\.)(siemens|mendix)\.com$/.test(h)),
      enquire: document.querySelector('.page-hero a[href*="contact.html"]').getAttribute("href"),
    }));
    ok(`${key}: page opens with one H1, its sections and working in-page links`, info.path.endsWith(`products/${key}.html`) && info.h1 === 1 && info.sections.length === 0 && info.onpage, JSON.stringify(info));
    ok(`${key}: lifecycle strip shows nine stages${key === "mendix" ? ", none marked (the source ties Mendix to no single stage)" : " with at least one marked"}`, info.stages === 9 && (key === "mendix" ? info.marked === 0 : info.marked >= 1), `${info.marked}/${info.stages}`);
    ok(`${key}: outside links in the overview go to Siemens' own sites only`, info.sources.length === 0, info.sources.join());
    await go(page, '.page-hero a[href*="contact.html"]');
    const v = await formValues(page);
    ok(`${key}: enquiry opens the contact form with the product as topic`, v.type === "product" && v.topic === `product-${key}`, JSON.stringify(v));
  }
  await page.goto(base + labels.prefix + "products/teamcenter.html", { waitUntil: "load" });
  await page.focus(".pager a");
  ok("previous and next product links are reachable by keyboard", await focusRing(page));
  await page.goto(base + labels.prefix + "index.html", { waitUntil: "load" });
  ok("home product rows link to the product pages", await page.$$eval('#products a[href*="products/"]', (as) => new Set(as.map((a) => a.getAttribute("href"))).size === 6));
  ok("no script errors", page.errors.length === 0, page.errors.join(" | "));
  await done(page);
}

/**
 * The three journeys the brief works through, run by clicking the links a
 * visitor would use. Each ends on the contact form; the first is sent to the
 * local handler to show that the context reaches the email.
 */
async function testJourneys(browser, labels) {
  const base = PHP_OK + labels.prefix;
  clearRate();

  group = `journey 1: automotive, enterprise, change management (${labels.lang})`;
  let page = await open(browser, base + "industries.html");
  await go(page, '#automotive a[href*="solutions.html?industry=automotive"][href$="#finder"]');
  ok("industry card opens the finder with the industry chosen", await page.$eval("[data-finder-industry]", (s) => s.value === "automotive"));
  await page.select("[data-finder-size]", "enterprises");
  await page.click('[data-need-link="change"]');
  ok("the change need shows the change management solution and Teamcenter", await page.$eval('[data-need-panel="change"]', (p) => !p.hidden && !!p.querySelector('a[href$="#engineering-change-management"]') && !!p.querySelector('a[href$="products/teamcenter.html"]')));
  await go(page, '[data-need-panel="change"] a[href$="products/teamcenter.html"]');
  ok("Teamcenter page lists the change management solution", await page.$eval("#solutions", (el) => !!el.querySelector('a[href$="#engineering-change-management"]')));
  await go(page, '#support a[href$="services.html#implementation"]');
  ok("the product page leads to implementation services", await page.evaluate(() => location.pathname.endsWith("services.html") && location.hash === "#implementation"));
  const href1 = await go(page, '#implementation a[href*="contact.html"]');
  let v = await formValues(page);
  ok("the contact form carries service, need, industry and size", v.type === "implementation" && v.topic === "service-implementation" && v.need === "change" && v.industry === "automotive" && v.size === "enterprises" && v.shown === 3, href1 + " " + JSON.stringify(v));
  ok("the enquiry is accepted by the handler", await sendEnquiry(page, labels, "Journey 1 test."));
  const mail = lastMail();
  ok("the email names the enquiry type, topic, need, industry and size", ["Enquiry type: Implementation", "Topic: Implementation", "Business need: Keep engineering change under control", "Industry: Teamcenter X for Automotive", "Company size: Enterprises"].every((line) => mail.includes(line)), mail.split("\n").slice(0, 30).filter((l) => /^(Enquiry|Topic|Business|Industry|Company)/.test(l)).join(" / "));
  await page.goto(base + "contact.html", { waitUntil: "load" });
  v = await formValues(page);
  ok("the context is cleared after sending", v.need === "" && v.industry === "" && v.size === "" && v.shown === 0, JSON.stringify(v));
  ok("no script errors", page.errors.length === 0, page.errors.join(" | "));
  await done(page);

  group = `journey 2: startup, design data (${labels.lang})`;
  page = await open(browser, base + "plm.html");
  await go(page, '#size-startups a[href*="solutions.html?size=startups"]');
  ok("the startup tier opens the finder with the size chosen", await page.$eval("[data-finder-size]", (s) => s.value === "startups"));
  await page.click('[data-need-link="duplication"]');
  ok("the need shows design data management and a product page", await page.$eval('[data-need-panel="duplication"]', (p) => !p.hidden && !!p.querySelector('a[href$="#design-data-management"]') && !!p.querySelector('a[href*="products/"]')));
  await go(page, '[data-need-panel="duplication"] a[href$="#design-data-management"]');
  ok("the solution entry is reached and names its product", await page.evaluate(() => location.hash === "#design-data-management" && !!document.querySelector('#design-data-management a[href*="products/"]')));
  await go(page, '#design-data-management a[href*="contact.html"]');
  v = await formValues(page);
  ok("the contact form carries the solution, need and size", v.topic === "solution-design-data-management" && v.need === "duplication" && v.size === "startups" && v.industry === "" && v.shown === 2, JSON.stringify(v));
  await page.click("[data-context-clear]");
  await page.goto(base + "services.html", { waitUntil: "load" });
  ok("after Remove, later contact links carry nothing", await page.$eval('#implementation a[href*="contact.html"]', (a) => !/need=|size=|industry=/.test(a.href)));
  ok("no script errors", page.errors.length === 0, page.errors.join(" | "));
  await done(page);

  group = `journey 3: engineering revisions (${labels.lang})`;
  page = await open(browser, base + "index.html");
  await go(page, 'a[href$="solutions.html#finder"]');
  await page.click('[data-need-link="change"]');
  const found = await page.$eval('[data-need-panel="change"]', (p) => ({ change: !!p.querySelector('a[href$="#engineering-change-management"]'), plm: !!p.querySelector('a[href$="products/teamcenter.html"]') }));
  ok("the finder leads to change management and to the PLM product", found.change && found.plm, JSON.stringify(found));
  ok("the same finder offers the design data needs beside it", await page.$$eval("[data-need-panel]", (ps) => ps.some((p) => p.getAttribute("data-need-panel") !== "change" && p.querySelector('a[href$="#design-data-management"]'))));
  await go(page, '[data-need-panel="change"] a[href$="products/teamcenter.html"]');
  ok("the PLM product page lists both design data management and change management", await page.$eval("#solutions", (el) => !!el.querySelector('a[href$="#design-data-management"]') && !!el.querySelector('a[href$="#engineering-change-management"]')));
  await page.goto(base + "search.html?q=" + encodeURIComponent(labels.revisionQuery), { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelector("[data-search-status]").textContent.trim() !== "");
  const hits = await page.$$eval(".search-results a", (as) => as.map((a) => a.getAttribute("href")));
  ok("search for the same problem finds the solution and the need", hits.includes("solutions.html#engineering-change-management") && hits.includes("solutions.html#need-change"), hits.join());
  await page.goto(base + "products/teamcenter.html", { waitUntil: "load" });
  await go(page, '.page-hero a[href*="contact.html"]');
  v = await formValues(page);
  ok("an enquiry from the product page still carries the need", v.type === "product" && v.topic === "product-teamcenter" && v.need === "change", JSON.stringify(v));
  ok("no script errors", page.errors.length === 0, page.errors.join(" | "));
  await done(page);
}

async function testSearch(browser, base, labels) {
  group = `search (${labels.lang})`;
  const page = await open(browser, base + labels.prefix + "index.html");
  await go(page, ".header-search");
  ok("the header search link opens the search page", await page.evaluate(() => location.pathname.endsWith("search.html")));
  await page.focus("#search-q");
  await page.keyboard.type("Teamcenter");
  await page.waitForFunction(() => document.querySelectorAll(".search-results a").length > 0);
  const first = await page.$eval(".search-results a", (a) => a.getAttribute("href"));
  ok("typing a product name lists its page first", first === "products/teamcenter.html", first);
  ok("the number of results is announced", await page.$eval("[data-search-status]", (s) => s.getAttribute("role") === "status" && /\d/.test(s.textContent)));
  const hrefs = await page.$$eval(".search-results a", (as) => as.map((a) => a.href));
  const missing = [];
  for (const href of [...new Set(hrefs.map((h) => h.split("#")[0]))]) { const r = await page.evaluate((u) => fetch(u).then((x) => x.status), href); if (r !== 200) missing.push(href); }
  ok("every result leads to a page that exists", missing.length === 0, missing.join());
  await page.$eval("#search-q", (i) => { i.value = ""; });
  await page.keyboard.type("zzzzqq");
  await page.keyboard.press("Enter");
  await sleep(200);
  ok("a search with no match says so and keeps the browse links", await page.evaluate(() => document.querySelectorAll(".search-results a").length === 0 && document.querySelector("[data-search-status]").textContent.includes("zzzzqq") && document.querySelectorAll(".search-browse a").length >= 5));
  ok("the address keeps the query", await page.evaluate(() => new URLSearchParams(location.search).get("q") === "zzzzqq"));
  await page.goto(base + labels.prefix + "search.html?q=" + encodeURIComponent('<img src=x onerror="window.__x=1">'), { waitUntil: "load" });
  await sleep(300);
  ok("markup in the query is shown as text", await page.evaluate(() => !window.__x && !document.querySelector("[data-search-status] img")));
  ok("no script errors", page.errors.length === 0, page.errors.join(" | "));
  await done(page);
  const off = await open(browser, base + labels.prefix + "search.html", { js: false });
  ok("without scripts the form is hidden and the sitemap is offered", await off.evaluate(() => getComputedStyle(document.querySelector("[data-search-form]")).display === "none" && !!document.querySelector('noscript') ));
  await done(off);
}

const EN = {
  lang: "en", prefix: "", invalid: "Please check the highlighted fields.", sending: "Sending your enquiry…", sendingApply: "Sending your application…",
  sentContact: "Thank you. Your enquiry has been sent.", sentApply: "Thank you. Your application has been sent.",
  tooFast: "The form was submitted too quickly. Please wait a moment and try again.", mailFailed: "Your message could not be sent. Please try again, or email us directly.",
  count: (n, total) => `${n} of ${total} roles shown`, none: "No roles match these filters.", revisionQuery: "engineering change",
};
const JA = {
  lang: "ja", prefix: "ja/", invalid: "入力内容をご確認ください。", sending: "お問い合わせを送信しています…", sendingApply: "応募内容を送信しています…",
  sentContact: "お問い合わせありがとうございます。内容を送信いたしました。", sentApply: "ご応募ありがとうございます。応募内容を送信いたしました。",
  tooFast: "送信が早すぎます。少し時間をおいてから、もう一度お試しください。", mailFailed: "送信できませんでした。お手数ですが、もう一度お試しいただくか、メールで直接ご連絡ください。",
  count: (n, total) => `全${total}職種中${n}職種を表示`, none: "条件に一致する職種はありません。", revisionQuery: "変更",
};

(async () => {
  const capture = path.join(WORK, "capture.sh");
  fs.writeFileSync(capture, `#!/bin/sh\ncat > "${MAILDIR}/$(date +%s%N).eml"\n`, { mode: 0o755 });
  const servers = [startPhp(8825, capture), startPhp(8826, "/bin/false")];
  await sleep(800);
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  try {
    for (const labels of [EN, JA]) {
      await testDesktopNav(browser, STATIC, labels);
      await testMobileMenu(browser, STATIC, labels);
      await testLifecycle(browser, STATIC, labels, 1440);
      await testLifecycle(browser, STATIC, labels, 390);
      await testFinder(browser, STATIC, labels);
      await testProductPages(browser, STATIC, labels);
      await testJourneys(browser, labels);
      await testSearch(browser, STATIC, labels);
      await testCareers(browser, STATIC, labels);
      await testLightbox(browser, STATIC, labels);
      await testContactForm(browser, labels);
      await testApplyForm(browser, labels);
      await testNoScript(browser, STATIC, labels);
    }
    await testLanguage(browser, STATIC);
    await testLegacyUrls(browser, STATIC);
  } catch (err) {
    failed.push(`${group}: crashed: ${err.message}`);
    console.log(`FAIL  ${group}: crashed`, err);
  }
  await browser.close();
  servers.forEach((s) => s.kill());
  clearRate();
  fs.rmSync(WORK, { recursive: true, force: true });
  console.log(`\nPassed: ${pass}  Failed: ${failed.length}`);
  failed.forEach((f) => console.log("  " + f));
  process.exit(failed.length ? 1 : 0);
})();
