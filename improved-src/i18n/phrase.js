/**
 * Japanese line breaking for headings.
 *
 * Browsers may break Japanese between any two characters, which strands
 * particles and splits katakana words in large headings. Here each heading is
 * split into phrases with BudouX and the phrases are joined with <wbr>; the
 * stylesheet sets `word-break: keep-all` on Japanese headings so lines can
 * only break at those points.
 *
 * BudouX is an optional dev dependency (npm install in improved-src/). Without
 * it the build still works and Chrome's `word-break: auto-phrase` is the only
 * protection.
 */
let parser = null;
let engine = "none";
try {
  parser = require("budoux").loadDefaultJapaneseParser();
  engine = "budoux";
} catch (err) {
  parser = null;
}

const HAS_JA = /[\u3040-\u30ff\u4e00-\u9fff]/;

/**
 * BudouX keeps a compound such as "エンドツーエンドPLMソリューションです。" as one
 * phrase, which is wider than a narrow column and then breaks mid-word. In long
 * phrases only, a break is also allowed where a katakana word meets a Latin one.
 */
function loosen(phrase) {
  if (phrase.length < 12) return phrase;
  return phrase
    .replace(/([\u30a1-\u30fc]{4,})(?=[A-Za-z]{2,})/g, "$1<wbr>")
    .replace(/([A-Za-z]{2,})(?=[\u30a1-\u30fc]{4,})/g, "$1<wbr>");
}

function split(text) {
  if (!parser || !HAS_JA.test(text) || text.length < 9) return text;
  return text
    .split(/(&[a-z#0-9]+;)/)
    .map((part) => (part.startsWith("&") ? part : parser.parse(part).map(loosen).join("<wbr>")))
    .join("");
}

const TARGETS = [
  /<(h[1-3])\b([^>]*)>([\s\S]*?)<\/\1>/g,
  /<(p|span|a|li|dt|dd|strong|blockquote|figcaption)\b([^>]*\bdata-phrase\b[^>]*)>([\s\S]*?)<\/\1>/g,
];

/** Inserts <wbr> between phrases in h1–h3 and in elements marked data-phrase. */
function headings(html) {
  if (!parser) return html;
  return TARGETS.reduce(
    (out, re) =>
      out.replace(re, (full, tag, attrs, inner) => {
        const next = inner.replace(/(^|>)([^<]+)(?=<|$)/g, (m, lead, text) => lead + split(text));
        return `<${tag}${attrs}>${next}</${tag}>`;
      }),
    html
  );
}

module.exports = { headings, engine };
