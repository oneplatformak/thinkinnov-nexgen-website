// Upgrades the lifecycle stage links to an ARIA tab interface.
var $ = window.TIN.$, $$ = window.TIN.$$;
var root = $("[data-lifecycle]");
if (root) {
  var list = $("[data-lc-tablist]", root);
  var tabs = $$("[data-lc-tab]", root);
  var panels = tabs.map(function (tab) { return document.getElementById(tab.getAttribute("href").slice(1)); });
  var current = $("[data-lc-current]", root);

  list.setAttribute("role", "tablist");
  $$("li", list).forEach(function (li) { li.setAttribute("role", "presentation"); });
  tabs.forEach(function (tab, i) {
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panels[i].id);
    panels[i].setAttribute("role", "tabpanel");
    panels[i].setAttribute("aria-labelledby", tab.id);
    panels[i].setAttribute("tabindex", "0");
  });

  var select = function (index, focus) {
    tabs.forEach(function (tab, i) {
      var on = i === index;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.setAttribute("tabindex", on ? "0" : "-1");
      panels[i].hidden = !on;
    });
    if (current) current.textContent = $(".lc-tab-label", tabs[index]).textContent;
    if (focus) tabs[index].focus();
    var li = tabs[index].parentNode;
    if (list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: li.offsetLeft - 16, behavior: window.TIN.reducedMotion ? "auto" : "smooth" });
    }
  };

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function (e) { e.preventDefault(); select(i, false); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      else if (e.key === " ") { e.preventDefault(); select(i, false); return; }
      if (next !== null) { e.preventDefault(); select(next, true); }
    });
  });

  var fromHash = function () {
    var index = panels.findIndex(function (p) { return "#" + p.id === location.hash; });
    if (index >= 0) { select(index, false); return true; }
    return false;
  };
  if (!fromHash()) select(0, false);
  window.addEventListener("hashchange", fromHash);
}
