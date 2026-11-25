// Desktop mega menu (disclosure buttons) and the mobile menu dialog.
var $ = window.TIN.$, $$ = window.TIN.$$;
var triggers = $$("[data-mega-trigger]");

function panelOf(trigger) { return document.getElementById(trigger.getAttribute("aria-controls")); }

function closeAll(except) {
  triggers.forEach(function (t) {
    if (t === except) return;
    t.setAttribute("aria-expanded", "false");
    panelOf(t).hidden = true;
  });
}

triggers.forEach(function (trigger) {
  var panel = panelOf(trigger);
  var item = trigger.parentNode;
  var timer;

  function open() {
    clearTimeout(timer);
    closeAll(trigger);
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
  }
  function close() {
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  }

  trigger.addEventListener("click", function () {
    if (trigger.getAttribute("aria-expanded") === "true") close(); else open();
  });
  // Hover is a convenience for pointer users; click and keyboard always work.
  item.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") open(); });
  item.addEventListener("pointerleave", function (e) {
    if (e.pointerType !== "mouse") return;
    timer = setTimeout(close, 180);
  });
  item.addEventListener("focusout", function (e) {
    if (!item.contains(e.relatedTarget)) close();
  });
  item.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
      close();
      trigger.focus();
    }
    if (e.key === "ArrowDown" && e.target === trigger) {
      e.preventDefault();
      open();
      var first = $("a", panel);
      if (first) first.focus();
    }
  });
});

document.addEventListener("click", function (e) {
  if (!e.target.closest(".nav-item")) closeAll();
});

// Mobile menu: a native modal dialog, so focus is trapped and Escape closes it.
var menu = $("[data-mobile-menu]");
var opener = $("[data-menu-open]");
if (menu && opener && typeof menu.showModal === "function") {
  opener.setAttribute("aria-expanded", "false");
  opener.addEventListener("click", function (e) {
    e.preventDefault();
    menu.showModal();
    opener.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("menu-open");
  });
  opener.addEventListener("keydown", function (e) {
    if (e.key === " ") { e.preventDefault(); opener.click(); }
  });
  menu.addEventListener("close", function () {
    opener.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("menu-open");
    opener.focus();
  });
  menu.addEventListener("click", function (e) {
    if (e.target === menu || e.target.closest("[data-menu-close]")) menu.close();
    // Same-page links: close first so the target is visible.
    var link = e.target.closest("a[href]");
    if (link && link.getAttribute("href").charAt(0) === "#") menu.close();
  });
  window.matchMedia("(min-width: 1100px)").addEventListener("change", function (e) {
    if (e.matches && menu.open) menu.close();
  });
}
