// Language preference: remembered when the visitor switches, offered as a
// suggestion on later visits. A direct link is never redirected.
var $ = window.TIN.$, $$ = window.TIN.$$, store = window.TIN.store;
var KEY = "tin-lang";
var current = window.TIN.lang;

$$("[data-lang-switch] a").forEach(function (a) {
  a.addEventListener("click", function () { store.set(KEY, a.getAttribute("data-lang")); });
  // Keep the position on the page when switching.
  if (location.hash || location.search) a.href = a.getAttribute("href") + location.search + location.hash;
});

var preferred = store.get(KEY);
if (!preferred && current === "en" && /^ja\b/i.test(navigator.language || "")) preferred = "ja";

if (preferred && preferred !== current) {
  var link = $('[data-lang-switch] a[data-lang="' + preferred + '"]');
  if (link) {
    var text = preferred === "ja"
      ? { msg: "このページは日本語でもご覧いただけます。", go: "日本語で表示", close: "閉じる" }
      : { msg: "This page is also available in English.", go: "View in English", close: "Dismiss" };
    var bar = document.createElement("div");
    bar.className = "lang-suggest";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", preferred === "ja" ? "言語の選択" : "Language");
    bar.lang = preferred;
    bar.innerHTML = '<div class="container lang-suggest-inner"><span></span><a></a><button type="button"></button></div>';
    bar.querySelector("span").textContent = text.msg;
    var go = bar.querySelector("a");
    go.textContent = text.go;
    go.href = link.href;
    go.addEventListener("click", function () { store.set(KEY, preferred); });
    var btn = bar.querySelector("button");
    btn.textContent = text.close;
    btn.addEventListener("click", function () {
      // Dismissing means "this language is fine": remember it so the offer is not repeated.
      bar.remove();
      store.set(KEY, current);
    });
    var header = $("[data-header]");
    header.parentNode.insertBefore(bar, header.nextSibling);
  }
}
