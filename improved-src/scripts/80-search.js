// Search page: loads the build-time index for this language and matches in
// the browser. Every term must appear in an entry; title matches rank first.
var $ = window.TIN.$;
var form = $("[data-search-form]");
if (form) {
  var input = form.elements.q;
  var list = $("[data-search-results]");
  var status = $("[data-search-status]");
  var index = null;
  var norm = function (s) { return String(s || "").normalize("NFKC").toLowerCase(); };
  var message = function (key, q, n) {
    status.textContent = status.getAttribute("data-l10n-" + key).replace("{q}", q).replace("{n}", n);
  };

  var render = function () {
    var q = input.value.trim();
    list.textContent = "";
    if (!q) { status.textContent = ""; return; }
    if (!index) return;
    var terms = norm(q).split(/\s+/).filter(Boolean);
    var hits = [];
    index.forEach(function (entry, i) {
      var title = norm(entry.t), rest = norm(entry.d + " " + entry.x + " " + entry.k);
      var score = 0;
      for (var j = 0; j < terms.length; j++) {
        if (title.indexOf(terms[j]) >= 0) score += title === terms[j] ? 12 : 6;
        else if (rest.indexOf(terms[j]) >= 0) score += 1;
        else return;
      }
      hits.push({ entry: entry, score: score, order: i });
    });
    hits.sort(function (a, b) { return b.score - a.score || a.order - b.order; });
    hits.slice(0, 40).forEach(function (hit) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = hit.entry.u;
      [["search-kind", hit.entry.k], ["search-title", hit.entry.t], ["search-text", hit.entry.d]].forEach(function (part) {
        var span = document.createElement("span");
        span.className = part[0];
        span.textContent = part[1];
        a.appendChild(span);
      });
      li.appendChild(a);
      list.appendChild(li);
    });
    message(hits.length === 0 ? "none" : hits.length === 1 ? "one" : "many", q, hits.length);
  };

  var timer;
  input.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(render, 120); });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    history.replaceState(null, "", q ? "?q=" + encodeURIComponent(q) : location.pathname);
    render();
  });

  input.value = (new URLSearchParams(location.search).get("q") || "").slice(0, 80);
  fetch(form.getAttribute("data-index"))
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) { index = data; render(); })
    .catch(function () { message("error", "", 0); });
}
