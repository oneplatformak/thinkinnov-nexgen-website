// Career filters. The list is complete in the HTML; this only hides rows.
var $ = window.TIN.$, $$ = window.TIN.$$;
var form = $("[data-role-filters]");
if (form) {
  var rows = $$("[data-role]");
  var count = $("[data-role-count]");
  var q = form.elements.q, discipline = form.elements.discipline, band = form.elements.band;
  var norm = function (s) { return (s || "").toLowerCase().normalize("NFKC").replace(/\s+/g, " ").trim(); };
  rows.forEach(function (row) { row._text = norm(row.textContent); });

  var apply = function (updateUrl) {
    var terms = norm(q.value).split(" ").filter(Boolean);
    var shown = 0;
    rows.forEach(function (row) {
      var ok = (!discipline.value || row.getAttribute("data-discipline") === discipline.value) &&
        (!band.value || row.getAttribute("data-band") === band.value) &&
        terms.every(function (t) { return row._text.indexOf(t) >= 0; });
      row.hidden = !ok;
      if (ok) shown += 1;
    });
    var filtered = terms.length || discipline.value || band.value;
    count.textContent = shown === 0
      ? count.getAttribute("data-l10n-none")
      : filtered ? count.getAttribute("data-l10n-count").replace("{n}", shown).replace("{total}", rows.length) : "";
    if (updateUrl) {
      var params = new URLSearchParams();
      if (q.value.trim()) params.set("q", q.value.trim());
      if (discipline.value) params.set("discipline", discipline.value);
      if (band.value) params.set("band", band.value);
      var qs = params.toString();
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
    }
  };

  var params = new URLSearchParams(location.search);
  if (params.get("q")) q.value = params.get("q");
  ["discipline", "band"].forEach(function (name) {
    var value = params.get(name);
    if (value && $('option[value="' + value.replace(/[^a-z-]/g, "") + '"]', form.elements[name])) form.elements[name].value = value;
  });

  form.addEventListener("input", function () { apply(true); });
  form.addEventListener("change", function () { apply(true); });
  form.addEventListener("submit", function (e) { e.preventDefault(); apply(true); });
  form.addEventListener("reset", function () { setTimeout(function () { apply(true); q.focus(); }, 0); });
  apply(false);
}
