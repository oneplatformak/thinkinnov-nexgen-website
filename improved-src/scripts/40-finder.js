// Finder: shows one need at a time and carries optional context to the contact form.
var $ = window.TIN.$, $$ = window.TIN.$$;
var root = $("[data-finder]");
if (root) {
  var links = $$("[data-need-link]", root);
  var panels = $$("[data-need-panel]", root);
  var industry = $("[data-finder-industry]", root);
  var size = $("[data-finder-size]", root);
  var stack = window.matchMedia("(max-width: 999px)");
  var box = $("[data-finder-panels]", root);
  // The style sheet needs the height of the result to keep a tall one in reach.
  var measure = function () { box.style.setProperty("--finder-panel-h", box.offsetHeight + "px"); };
  // Beside the list, a result always starts in view, below the header. Where
  // the result will sit is worked out from the same numbers the style sheet
  // uses, so the answer does not depend on the browser having laid it out yet.
  var toStart = function () {
    var header = $(".site-header").getBoundingClientRect().bottom;
    var natural = root.getBoundingClientRect().top;
    var stuck = Math.min(header + 24, window.innerHeight - box.offsetHeight - 24);
    var top = Math.max(natural, stuck);
    if (top >= header && top < window.innerHeight * 0.6) return;
    window.scrollTo({ top: window.pageYOffset + natural - header - 24, behavior: window.TIN.reducedMotion ? "auto" : "smooth" });
  };

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
    measure();
    if (focus) {
      found.focus({ preventScroll: true });
      if (stack.matches) found.scrollIntoView({ block: "start", behavior: window.TIN.reducedMotion ? "auto" : "smooth" });
      else toStart();
    }
    return true;
  };

  var context = window.TIN.context;
  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var key = link.getAttribute("data-need-link");
      show(key, true);
      context.set("need", key);
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
  // Context chosen earlier in this tab, or passed in the address, is shown here.
  var has = function (select, value) { return Array.prototype.some.call(select.options, function (o) { return o.value === value; }); };
  var saved = context.get();
  if (saved.industry && has(industry, saved.industry)) industry.value = saved.industry;
  if (saved.size && has(size, saved.size)) size.value = saved.size;
  updateContext();
  industry.addEventListener("change", function () { context.set("industry", industry.value); updateContext(); });
  size.addEventListener("change", function () { context.set("size", size.value); updateContext(); });

  var fromHash = function (focus) {
    var m = location.hash.match(/^#need-(.+)$/);
    if (!m || !show(m[1], focus)) return false;
    context.set("need", m[1]);
    return true;
  };
  if (!fromHash(false)) show(panels[0].getAttribute("data-need-panel"), false);
  window.addEventListener("hashchange", function () { fromHash(true); });
  if ("ResizeObserver" in window) new ResizeObserver(measure).observe(box);
  else window.addEventListener("resize", measure);
  // Links elsewhere on the page that point at a need (solution entries).
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#need-"]');
    if (!a || root.contains(a)) return;
    if (show(a.getAttribute("href").slice(6), false)) {
      context.set("need", a.getAttribute("href").slice(6));
      // let the browser scroll to the finder section instead of a hidden panel
      e.preventDefault();
      history.replaceState(null, "", a.getAttribute("href"));
      $("#finder").scrollIntoView({ behavior: window.TIN.reducedMotion ? "auto" : "smooth" });
      var panel = panels.filter(function (p) { return !p.hidden; })[0];
      if (panel) panel.focus({ preventScroll: true });
    }
  });
}
