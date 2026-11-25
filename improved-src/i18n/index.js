/**
 * Japanese build support.
 *
 * Templates are written once, in English. For /ja/ pages the built HTML is
 * passed through apply(), which swaps every text node and translatable
 * attribute for its Japanese entry. Anything without an entry is reported, so
 * a /ja/ page cannot silently ship an English sentence.
 *
 * Dictionaries: ja-staging.js (Japanese that already existed on staging),
 * ja-ui.js and ja-content-*.js (new translations awaiting native review).
 */
const site = require("../lib/site");
const { RAW_OPEN } = require("../lib/html");
const phrase = require("./phrase");

const files = [
  ["staging", "./ja-staging"],
  ["new", "./ja-ui"],
  ["new", "./ja-content-home"],
  ["new", "./ja-content-pages"],
  ["new", "./ja-content-offerings"],
  ["new", "./ja-content-careers"],
  ["new", "./ja-content-legal"],
];

const dict = new Map();
const patterns = [];
const keep = new Set();
const duplicates = [];

for (const [source, file] of files) {
  let mod;
  try {
    mod = require(file);
  } catch (err) {
    if (err.code !== "MODULE_NOT_FOUND") throw err;
    continue;
  }
  for (const [en, ja] of Object.entries(mod.entries || {})) {
    if (dict.has(en)) duplicates.push(`${en} (${file})`);
    else dict.set(en, { ja, source, area: mod.area || file, pages: new Set() });
  }
  (mod.patterns || []).forEach((p) => patterns.push(p));
  (mod.keep || []).forEach((k) => keep.add(k));
}

const misses = new Map();

function decode(s) {
  return String(s).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

function encode(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** True when a string needs no entry: no English words, or a kept proper noun. */
function isNeutral(text) {
  if (keep.has(text)) return true;
  if (/^(https?:|mailto:|tel:)/i.test(text) || /^[\w.+-]+@[\w.-]+$/.test(text)) return true;
  const stripped = text.replace(/ThinkInnov-NexGen|Teamcenter X|Teamcenter|Tecnomatix|Solid Edge|Mendix|Capital|Siemens|PDMLink|CATIA/g, "");
  return !/[a-z]{2,}/.test(stripped);
}

function lookup(text, pageRel, kind) {
  const entry = dict.get(text);
  if (entry) {
    entry.pages.add(pageRel || "");
    return entry.ja;
  }
  for (const [re, fn] of patterns) {
    const m = text.match(re);
    if (m) {
      const out = fn(m, (inner) => lookup(inner, pageRel, kind) ?? inner);
      if (out != null) return out;
    }
  }
  if (isNeutral(text)) return null;
  if (!misses.has(text)) misses.set(text, { page: pageRel || "", kind });
  return null;
}

/** Explicit translation for strings the post-processor cannot see (titles, JSON for scripts). */
function t(text) {
  if (!site.isJa()) return text;
  const out = lookup(String(text), "ja/" + site.currentPath(), "t()");
  return out == null ? text : out.replace(/\{\{br\}\}/g, "");
}

function translateNode(raw, pageRel, kind) {
  const trimmed = decode(raw.trim().replace(/\s+/g, " "));
  if (!trimmed) return null;
  const out = lookup(trimmed, pageRel, kind);
  if (out == null) return null;
  const lead = raw.match(/^\s*/)[0];
  const trail = raw.match(/\s*$/)[0];
  return lead + encode(out).replace(/\{\{br\}\}/g, "<br>") + trail;
}

const ATTRS = /\b(aria-label|aria-description|alt|placeholder|title|data-l10n-[a-z-]+)="([^"]*)"/g;

function apply(html, pageRel) {
  const held = [];
  let out = html.replace(/<(script|style|title)\b[\s\S]*?<\/\1>/gi, (block) => {
    held.push(block);
    return `%%HELD${held.length - 1}%%`;
  });

  out = out.replace(/>([^<]+)</g, (full, text) => {
    if (text.includes(RAW_OPEN) || text.includes("%%HELD")) return full;
    const next = translateNode(text, pageRel, "text");
    return next == null ? full : `>${next}<`;
  });

  out = out.replace(ATTRS, (full, attr, value) => {
    if (!value.trim() || value.includes(RAW_OPEN)) return full;
    const next = lookup(decode(value), pageRel, attr);
    return next == null ? full : `${attr}="${encode(next)}"`;
  });

  out = phrase.display(out);
  return out.replace(/%%HELD(\d+)%%/g, (_, i) => held[Number(i)]);
}

function report() {
  return [...misses.entries()].map(([text, info]) => ({ text, ...info })).sort((a, b) => a.text.localeCompare(b.text));
}

function register() {
  return [...dict.entries()].map(([en, entry]) => ({
    en, ja: entry.ja, source: entry.source, area: entry.area, pages: [...entry.pages].sort(),
  }));
}

module.exports = { t, apply, report, register, duplicates, phraseEngine: phrase.engine, get patternCount() { return patterns.length; } };
