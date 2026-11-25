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
  // "hover" while the pointer opened the panel; the first click then pins it
  // instead of closing what the visitor has just seen open.
  var openedBy = "";

  function open(by) {
    clearTimeout(timer);
    closeAll(trigger);
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    openedBy = by;
  }
  function close() {
    clearTimeout(timer);
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    openedBy = "";
  }

  trigger.addEventListener("click", function () {
    var isOpen = trigger.getAttribute("aria-expanded") === "true";
    if (isOpen && openedBy !== "hover") close(); else open("click");
  });
  // Hover is a convenience for pointer users; click and keyboard always work.
  item.addEventListener("pointerenter", function (e) {
    if (e.pointerType === "mouse" && trigger.getAttribute("aria-expanded") !== "true") open("hover");
  });
  item.addEventListener("pointerleave", function (e) {
    if (e.pointerType !== "mouse" || openedBy !== "hover") return;
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
      open("key");
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
  // Without scripts this is a plain link to the sitemap; here it becomes a menu button.
  opener.setAttribute("role", "button");
  opener.setAttribute("aria-haspopup", "dialog");
  opener.setAttribute("aria-controls", menu.id);
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
