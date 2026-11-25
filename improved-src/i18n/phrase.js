/**
 * Japanese line breaking for display text.
 *
 * Browsers may break Japanese between any two characters, which strands
 * particles and splits katakana words: "デジタルトランスフォーメー / ション",
 * "晴海プライムスクエ / ア15階". Body paragraphs are left to the browser, as is
 * usual. Display text is not: headings, leads, labels, table headers, buttons,
 * chips, captions, the address, footer links, and any element whose whole text
 * is short (a card title, a fact, a tag, a list item of a few words).
 *
 * For that text the build splits each string into phrases with BudouX, joins
 * the phrases with <wbr> and marks the element `data-phrase`. The stylesheet
 * sets `word-break: keep-all` on `[data-phrase]`, so a line can end only at a
 * <wbr>, a space or punctuation. `overflow-wrap: anywhere` stays as the last
 * resort, so nothing can overflow; the layout test (tools/test-layout.js)
 * reports every place where that last resort is used, and uses SELECTOR and
 * SHORT below so that it checks exactly the text this file treats.
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

/** Display text by element or class. Everything inside is treated. */
const DISPLAY = {
  tags: ["h1", "h2", "h3", "h4", "th", "dt", "label", "legend", "button", "summary", "address", "figcaption"],
  classes: ["btn", "lead", "link-arrow", "chip", "badge", "contact-lines", "footer-col", "footer-contact", "eyebrow", "marker", "kicker"],
};
/** An element whose whole text is at most this long is display text too. */
const SHORT = 30;
/** A heading unit this long (in characters) needs a smaller size on narrow columns. */
const LONG = 10;
const SELECTOR = [...DISPLAY.tags, ...DISPLAY.classes.map((c) => "." + c)].join(",");

const HAS_JA = /[\u3040-\u30ff\u4e00-\u9fff]/;
const KATA = "\u30a1-\u30fa\u30fc";
const KANJI = "\u4e00-\u9fff\u3005";

/**
 * Katakana compounds written without a space. A run of katakana that is made
 * up entirely of these words may break between them ("デジタル / トランス
 * フォーメーション"); any other katakana run is one word and never breaks.
 */
const KATAKANA_WORDS = [
  "アーキテクチャ", "アーキテクト", "アイデア", "アカウント", "アクセシビリティ", "アナリスト", "アプリケーション", "アプローチ", "イノベーション", "インサイド", "インテグレーション",
  "インテリジェンス", "インド", "インフラ", "エグゼクティブ", "エレクトロニクス", "エンジニアリング", "エンジニア", "エンタープライズ", "オートメーション", "オペレーション", "カスタマイズ",
  "カスタマー", "ガバナンス", "キャリア", "ギャラリー", "クラウド", "グローバル", "コーディネーター", "コスト", "コミュニケーション", "コラボレーション", "コンサルティング",
  "コンサルタント", "コンピューター", "コンフィグレーション", "コンプライアンス", "コンポーネント", "サービス", "サステナビリティ", "サプライ", "サプライヤー", "サポート", "システム",
  "システムズ", "シミュレーション", "スイッチ", "スクエア", "スクリーン", "スケーラブル", "スケジュール", "スタートアップ", "ストレージ", "スレッド", "セールス", "セッション",
  "セットアップ", "ソフトウェア", "ソリューション", "チーム", "チェーン", "チューニング", "ツール", "テクニカル", "テクノロジー", "デザイン", "デジタル", "デスクトップ", "デバイス",
  "データ", "デリバリー", "ディレクター", "トラッキング", "トランスフォーメーション", "トレーニング", "ネットワーク", "ノーコード", "パートナー", "パートナーシップ", "バッテリー",
  "パフォーマンス", "ビジネス", "ファクトリー", "フィードバック", "フォト", "フルタイム", "プライム", "プラクティス", "プラットフォーム", "プラント", "プロジェクト", "プロセス",
  "プロダクト", "プロバイダー", "ブリッジ", "ベース", "ベスト", "ポートフォリオ", "ポジショニング", "マッピング", "マネジメント", "マネージャー", "マネージング", "メーカー",
  "モデリング", "モデル", "ユーザー", "ライフサイクル", "リーダー", "リーダーシップ", "リード", "リエンジニアリング", "リレーションシップ", "ループ", "レイヤー", "レガシー",
  "ローカル", "ローコード", "ワークフロー",
].sort((a, b) => b.length - a.length);

/** Proper names that are one unit even though they mix scripts: the head office building. */
const WHOLE = ["晴海プライムスクエア"];
const WHOLE_RE = new RegExp(WHOLE.map((name) => [...name].join("(?:<wbr>)?")).join("|"), "g");

/** Splits a katakana run into the words above, or returns null if it is not made of them. */
function katakanaWords(run) {
  const memo = new Map();
  const walk = (at) => {
    if (at === run.length) return [];
    if (memo.has(at)) return memo.get(at);
    let best = null;
    for (const word of KATAKANA_WORDS) {
      if (!run.startsWith(word, at)) continue;
      const rest = walk(at + word.length);
      if (rest && (!best || rest.length + 1 < best.length)) best = [word, ...rest];
    }
    memo.set(at, best);
    return best;
  };
  return walk(0);
}

/**
 * BudouX keeps a compound noun such as "部品メーカー向けPLM" or
 * "晴海プライムスクエア15階" as one phrase. Where such a phrase is long it is
 * wider than a narrow column and would then break anywhere. Inside a long
 * phrase a break is also allowed where one word visibly ends and the next
 * begins: between two known katakana words, where katakana meets kanji, where
 * hiragana is followed by a katakana word, and where Japanese meets a Latin
 * word or a number. Never before a particle (hiragana), never inside a Latin
 * word, never inside a single katakana word.
 */
function loosen(phrase) {
  if (phrase.length < 8) return phrase;
  const W = "<wbr>";
  return phrase
    .replace(new RegExp(`[${KATA}]{6,}`, "g"), (run) => {
      const words = katakanaWords(run);
      return words && words.length > 1 ? words.join(W) : run;
    })
    .replace(new RegExp(`([${KATA}]{3,})(?=[${KANJI}]{2,})`, "g"), `$1${W}`)
    .replace(new RegExp(`([${KANJI}]{2,})(?=[${KATA}]{3,})`, "g"), `$1${W}`)
    .replace(new RegExp(`([${KATA}${KANJI}\u3041-\u3096]{2,})(?=[A-Za-z]{2,}|[0-9]{2,})`, "g"), `$1${W}`)
    .replace(new RegExp(`([A-Za-z]{2,}|[0-9]{2,})(?=[${KATA}]{3,}|[${KANJI}]{2,})`, "g"), `$1${W}`)
    .replace(new RegExp(`([\u3041-\u3096]{2,})(?=[${KATA}]{3,})`, "g"), `$1${W}`)
    .replace(/(<wbr>)+/g, W)
    .replace(WHOLE_RE, (name) => name.replace(/<wbr>/g, ""));
}

function split(text) {
  if (!parser || !HAS_JA.test(text) || text.trim().length < 4) return text;
  return text
    .split(/(&[a-z#0-9]+;)/)
    .map((part) => (part.startsWith("&") ? part : parser.parse(part).map(loosen).join("<wbr>")))
    .join("");
}

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const OPAQUE = new Set(["script", "style", "title", "textarea", "svg", "option", "noscript"]);
// Comments and declarations, tags, text, and any stray "<": every character of the page is in exactly one token.
const TOKEN = /<!--[\s\S]*?-->|<![^>]*>|<\/?[a-zA-Z][^>]*>|[^<]+|</g;
const textLength = (s) => s.replace(/&[a-z#0-9]+;/g, "x").replace(/\s+/g, " ").trim().length;

/**
 * Inserts <wbr> between phrases in all display text of a Japanese page and
 * marks the elements concerned with `data-phrase`.
 */
function display(html) {
  if (!parser) return html;
  const tokens = html.match(TOKEN) || [];
  if (tokens.join("") !== html) throw new Error("phrase.display: the page was not tokenised losslessly");
  const elements = []; // { open: token index, parent, tag, display, text }
  const owner = new Array(tokens.length).fill(-1); // text token -> element index
  const stack = [];
  let opaque = 0;

  tokens.forEach((token, i) => {
    if (token.startsWith("<!") || token === "<") return;
    if (token[0] !== "<") {
      if (!opaque && stack.length) {
        owner[i] = stack[stack.length - 1];
        const n = textLength(token);
        for (const e of stack) elements[e].text += n;
      }
      return;
    }
    const closing = token[1] === "/";
    const tag = token.slice(closing ? 2 : 1).match(/^[a-zA-Z0-9]+/)[0].toLowerCase();
    if (closing) {
      for (let k = stack.length - 1; k >= 0; k -= 1) {
        if (elements[stack[k]].tag !== tag) continue;
        stack.length = k;
        break;
      }
      if (OPAQUE.has(tag)) opaque = Math.max(0, opaque - 1);
      return;
    }
    if (VOID.has(tag) || token.endsWith("/>")) return;
    if (OPAQUE.has(tag)) opaque += 1;
    const classes = (token.match(/\bclass="([^"]*)"/) || [, ""])[1].split(/\s+/);
    elements.push({
      open: i,
      parent: stack.length ? stack[stack.length - 1] : -1,
      tag,
      display: DISPLAY.tags.includes(tag) || DISPLAY.classes.some((c) => classes.includes(c)) || /\sdata-phrase\b/.test(token),
      unseen: classes.includes("visually-hidden"),
      text: 0,
    });
    stack.push(elements.length - 1);
  });

  const mark = new Set();
  tokens.forEach((token, i) => {
    const e = owner[i];
    if (e < 0 || !HAS_JA.test(token)) return;
    let root = -1;
    let unseen = false;
    for (let a = e; a >= 0; a = elements[a].parent) {
      if (elements[a].display) root = a;
      if (elements[a].unseen) unseen = true;
    }
    if (unseen) return;
    if (root < 0 && elements[e].text <= SHORT) root = e;
    if (root < 0) return;
    tokens[i] = split(token);
    mark.add(root);
  });
  for (const e of mark) {
    const open = tokens[elements[e].open];
    if (!/\sdata-phrase\b/.test(open)) tokens[elements[e].open] = open.replace(/>$/, " data-phrase>");
  }
  // A page or section heading with a unit of LONG characters or more is marked,
  // so that the stylesheet can set it smaller where the column is narrow.
  const out = tokens.join("");
  return out.replace(/<(h[12])\b([^>]*)>([\s\S]*?)<\/\1>/g, (full, tag, attrs, inner) => {
    const units = inner.replace(/<wbr>/g, "\n").replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/g, "x").split(/\s+|(?<=[、・／/）」])/);
    const width = (u) => [...u].reduce((n, ch) => n + (/[\u3000-\u30ff\u4e00-\u9fff\uff00-\uffef]/.test(ch) ? 1 : 0.55), 0); // in characters; Latin is narrower
    const longest = Math.max(0, ...units.filter((u) => HAS_JA.test(u)).map(width));
    return longest >= LONG && !/\sdata-long\b/.test(attrs) ? `<${tag}${attrs} data-long>${inner}</${tag}>` : full;
  });
}

module.exports = { display, engine, SELECTOR, SHORT };
