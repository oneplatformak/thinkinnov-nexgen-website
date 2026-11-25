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
  // Quoted strings (content values, font names, url("...")) are set aside so
  // that the whitespace inside them survives.
  const strings = [];
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, (m) => { strings.push(m); return `\u0000${strings.length - 1}\u0000`; })
    .replace(/\s+/g, " ")
    .replace(/\s*([{};])\s*/g, "$1")
    .replace(/,\s+/g, ",")
    .replace(/;}/g, "}")
    .replace(/\u0000(\d+)\u0000/g, (m, i) => strings[Number(i)])
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
