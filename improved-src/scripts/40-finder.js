// Finder: shows one need at a time and carries optional context to the contact form.
var $ = window.TIN.$, $$ = window.TIN.$$;
var root = $("[data-finder]");
if (root) {
  var links = $$("[data-need-link]", root);
  var panels = $$("[data-need-panel]", root);
  var industry = $("[data-finder-industry]", root);
  var size = $("[data-finder-size]", root);
  var stack = window.matchMedia("(max-width: 999px)");

  var show = function (key, focus) {
    var found = false;
    panels.forEach(function (panel) {
      var on = panel.getAttribute("data-need-panel") === key;
      panel.hidden = !on;
      if (on) found = panel;
    });
    if (!found) return false;
    links.forEach(function (link) {
      if (link.getAttribute("data-need-link") === key) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    $("[data-finder-panels]", root).scrollTop = 0;
    if (focus) {
      found.focus({ preventScroll: !stack.matches });
      if (stack.matches) found.scrollIntoView({ block: "start", behavior: window.TIN.reducedMotion ? "auto" : "smooth" });
    }
    return true;
  };

  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var key = link.getAttribute("data-need-link");
      show(key, true);
      history.replaceState(null, "", "#need-" + key);
    });
  });

  // Context: show the matching note and add it to every "discuss" link.
  var updateContext = function () {
    $$("[data-industry-note]", root).forEach(function (n) { n.hidden = n.getAttribute("data-industry-note") !== industry.value; });
    $$("[data-size-note]", root).forEach(function (n) { n.hidden = n.getAttribute("data-size-note") !== size.value; });
    $$("[data-need-cta]", root).forEach(function (a) {
      var url = new URL(a.href);
      ["industry", "size"].forEach(function (name) { url.searchParams.delete(name); });
      if (industry.value) url.searchParams.set("industry", industry.value);
      if (size.value) url.searchParams.set("size", size.value);
      a.href = url.toString();
    });
  };
  industry.addEventListener("change", updateContext);
  size.addEventListener("change", updateContext);

  var fromHash = function (focus) {
    var m = location.hash.match(/^#need-(.+)$/);
    return m ? show(m[1], focus) : false;
  };
  if (!fromHash(false)) show(panels[0].getAttribute("data-need-panel"), false);
  window.addEventListener("hashchange", function () { fromHash(true); });
  // Links elsewhere on the page that point at a need (solution entries).
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#need-"]');
    if (!a || root.contains(a)) return;
    if (show(a.getAttribute("href").slice(6), false)) {
      // let the browser scroll to the finder section instead of a hidden panel
      e.preventDefault();
      history.replaceState(null, "", a.getAttribute("href"));
      $("#finder").scrollIntoView({ behavior: window.TIN.reducedMotion ? "auto" : "smooth" });
      var panel = panels.filter(function (p) { return !p.hidden; })[0];
      if (panel) panel.focus({ preventScroll: true });
    }
  });
}
