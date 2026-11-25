/**
 * Build context: which language and page is being rendered, and how to link
 * from it. Every URL in the output is relative, so the same files work at a
 * domain root (cPanel) and under a sub-path (GitHub Pages).
 */
const path = require("path");
const config = require("../config");

const ctx = { lang: "en", path: "" };

function setPage(lang, pagePath) {
  ctx.lang = lang === "ja" ? "ja" : "en";
  ctx.path = pagePath || "";
}

function lang() {
  return ctx.lang;
}

function isJa() {
  return ctx.lang === "ja";
}

function currentPath() {
  return ctx.path;
}

/** Folder of the page being rendered, relative to the site root. */
function fromDir() {
  const file = (ctx.lang === "ja" ? "ja/" : "") + (ctx.path || "index.html");
  const dir = path.posix.dirname(file);
  return dir === "." ? "" : dir;
}

function relative(target) {
  const [file, suffix] = splitSuffix(target);
  const isDir = file === "" || file.endsWith("/");
  let out = path.posix.relative(fromDir(), file.replace(/\/$/, ""));
  if (isDir) out = out ? out + "/" : "./";
  return out + suffix;
}

function splitSuffix(target) {
  const m = String(target).match(/^([^?#]*)(.*)$/);
  return [m[1], m[2]];
}

/** Link to a page in the language being built. "" is the home page. */
function page(target = "") {
  const [file, suffix] = splitSuffix(target);
  const prefix = ctx.lang === "ja" ? "ja/" : "";
  return relative(prefix + file + suffix);
}

/** Link to a file that exists once for both languages (assets, PHP). */
function asset(target) {
  return relative(target);
}

/** The page being rendered, in the other language. */
function alternate(targetLang) {
  const prefix = targetLang === "ja" ? "ja/" : "";
  return relative(prefix + ctx.path);
}

function absolute(pagePath, targetLang) {
  const root = config.baseUrl.replace(/\/$/, "");
  const prefix = targetLang === "ja" ? "/ja/" : "/";
  return root + prefix + (pagePath || "");
}

module.exports = { setPage, lang, isJa, currentPath, page, asset, alternate, absolute, config };
