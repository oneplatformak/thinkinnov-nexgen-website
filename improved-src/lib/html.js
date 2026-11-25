/** Small HTML helpers shared by every template. */

const RAW_OPEN = "\u0001";
const RAW_CLOSE = "\u0002";

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Marks text that must never be translated (verbatim quotes, proper nouns in
 * running text). The markers are stripped before a page is written.
 */
function verbatim(value) {
  return RAW_OPEN + esc(value) + RAW_CLOSE;
}

function stripMarkers(html) {
  return html.split(RAW_OPEN).join("").split(RAW_CLOSE).join("");
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function ul(items, className = "") {
  return `<ul${className ? ` class="${className}"` : ""}>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
}

module.exports = { esc, verbatim, stripMarkers, slugify, pad2, ul, RAW_OPEN, RAW_CLOSE };
