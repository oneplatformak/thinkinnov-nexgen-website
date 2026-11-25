/** Builds docs/assets/styles.css and docs/assets/site.js from the sources in this folder. */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SRC = path.join(__dirname, "..");

function sources(dir, ext) {
  const full = path.join(SRC, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(ext))
    .sort()
    .map((f) => ({ name: f, text: fs.readFileSync(path.join(full, f), "utf8") }));
}

/** Conservative minifier: comments and redundant whitespace only. */
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{};])\s*/g, "$1")
    .replace(/,\s+/g, ",")
    .replace(/;}/g, "}")
    .trim();
}

function hash(text) {
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, 10);
}

function buildCss() {
  const css = minifyCss(sources("styles", ".css").map((s) => s.text).join("\n"));
  return { text: css + "\n", version: hash(css) };
}

/** Each script file is one module wrapped in its own function scope. */
function buildJs() {
  const js = sources("scripts", ".js")
    .map((s) => `/* ${s.name} */\n(function () {\n"use strict";\n${s.text.trim()}\n})();`)
    .join("\n\n");
  return { text: js + "\n", version: hash(js) };
}

module.exports = { buildCss, buildJs };
