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

/**
 * A product name of two words is one name: "Solid Edge" and "Teamcenter X" are
 * joined with a no-break space in page text so that a line can never end
 * between the two words, and two words written with a slash and no space may
 * part after the slash. Numbers joined by hyphens (a postcode, a block number,
 * a telephone number) are kept on one line. Titles, attributes, scripts and
 * form controls are left alone.
 */
function protectNames(html) {
  return html.replace(/(<(script|style|title|textarea|option)\b[\s\S]*?<\/\2>)|>([^<]+)(?=<)/gi, (full, block, tag, text) =>
    block
      ? full
      : ">" +
        text
          .replace(/Solid Edge/g, "Solid\u00a0Edge")
          .replace(/Teamcenter X(?![A-Za-z0-9])/g, "Teamcenter\u00a0X")
          // "Factory/Enterprise": a line may end after the slash, never inside either word.
          .replace(/([A-Za-z]{3,})\/(?=[A-Za-z]{3,})/g, "$1/<wbr>")
          // "104-0053", "2-1-40", "3-3525-8197": numbers joined by hyphens stay on one line.
          .replace(/(?<![\w-])\d+(?:-\d+)+(?![\w-])/g, '<span class="nb">$&</span>')
          // "L1〜L4": a range between two short codes stays on one line.
          .replace(/[A-Za-z]{0,4}\d+〜[A-Za-z]{0,4}\d+/g, '<span class="nb">$&</span>')
  );
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

module.exports = { esc, verbatim, stripMarkers, protectNames, slugify, pad2, ul, RAW_OPEN, RAW_CLOSE };
