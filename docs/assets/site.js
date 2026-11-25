/* 00-util.js */
(function () {
"use strict";
// Shared helpers, exposed on one namespace for the other modules.
var TIN = (window.TIN = window.TIN || {});
TIN.$ = function (sel, root) { return (root || document).querySelector(sel); };
TIN.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
TIN.lang = document.documentElement.lang === "ja" ? "ja" : "en";
TIN.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
TIN.store = {
  get: function (key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
  set: function (key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ } },
};
// Elements that only make sense when scripts run are hidden in the HTML.
TIN.$$("[data-js-only]").forEach(function (el) { el.hidden = false; });
})();

/* 05-context.js */
(function () {
"use strict";
// Journey context: the industry, company size and business need a visitor
// picks are kept for this browser tab only (sessionStorage) and added to
// links that lead to the contact form, so an enquiry can say where it came
// from. Nothing is sent anywhere until the visitor submits the form.
var TIN = window.TIN;
var KEY = "tin-context";
var KINDS = ["industry", "size", "need"];
var valid = function (v) { return typeof v === "string" && /^[a-z0-9-]{1,60}$/.test(v); };
var read = function () {
  try {
    var data = JSON.parse(window.sessionStorage.getItem(KEY) || "{}");
    var out = {};
    KINDS.forEach(function (k) { if (valid(data[k])) out[k] = data[k]; });
    return out;
  } catch (e) { return {}; }
};
var write = function (data) {
  try {
    if (Object.keys(data).length) window.sessionStorage.setItem(KEY, JSON.stringify(data));
    else window.sessionStorage.removeItem(KEY);
  } catch (e) { /* storage unavailable: links still carry their own parameters */ }
};

var decorate = function () {
  var data = read();
  TIN.$$('a[href*="contact.html"]').forEach(function (a) {
    var url;
    try { url = new URL(a.href); } catch (e) { return; }
    if (!a.hasAttribute("data-context-own")) {
      // Remember which parameters the link was built with, so they are never overwritten.
      a.setAttribute("data-context-own", KINDS.filter(function (k) { return url.searchParams.has(k); }).join(","));
    }
    var own = a.getAttribute("data-context-own").split(",");
    KINDS.forEach(function (k) {
      if (own.indexOf(k) >= 0) return;
      if (data[k]) url.searchParams.set(k, data[k]);
      else url.searchParams.delete(k);
    });
    a.href = url.toString();
  });
};

TIN.context = {
  get: read,
  set: function (kind, value) {
    var data = read();
    if (valid(value)) data[kind] = value;
    else delete data[kind];
    write(data);
    decorate();
  },
  clear: function () { write({}); decorate(); },
};

// A link such as solutions.html?industry=automotive#finder starts a journey.
var params = new URLSearchParams(location.search);
var onContact = !!TIN.$("[data-enquiry-type]");
if (!onContact) {
  var incoming = read();
  var changed = false;
  KINDS.forEach(function (k) {
    if (valid(params.get(k))) { incoming[k] = params.get(k); changed = true; }
  });
  if (changed) write(incoming);
}
decorate();
})();

/* 10-nav.js */
(function () {
"use strict";
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
})();

/* 20-lang.js */
(function () {
"use strict";
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
})();

/* 30-lifecycle.js */
(function () {
"use strict";
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
})();

/* 40-finder.js */
(function () {
"use strict";
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
})();

/* 50-careers.js */
(function () {
"use strict";
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
})();

/* 60-lightbox.js */
(function () {
"use strict";
// Photo and infographic viewer. Each trigger is a plain link to the image, so
// without scripts the image simply opens.
var $ = window.TIN.$, $$ = window.TIN.$$;
var triggers = $$("[data-lightbox]");
if (triggers.length && typeof HTMLDialogElement !== "undefined") {
  var ja = window.TIN.lang === "ja";
  var label = ja
    ? { close: "閉じる", prev: "前へ", next: "次へ", viewer: "画像ビューア" }
    : { close: "Close", prev: "Previous", next: "Next", viewer: "Image viewer" };
  var dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", label.viewer);
  dialog.innerHTML =
    '<div class="lightbox-bar"><span data-lb-count aria-live="polite"></span><button type="button" data-lb-close></button></div>' +
    '<div class="lightbox-stage"><img alt="" data-lb-img></div>' +
    '<div class="lightbox-foot"><button type="button" data-lb-prev></button><p class="lightbox-caption" data-lb-caption></p><button type="button" data-lb-next></button></div>';
  document.body.appendChild(dialog);
  var img = $("[data-lb-img]", dialog), caption = $("[data-lb-caption]", dialog), counter = $("[data-lb-count]", dialog);
  var prev = $("[data-lb-prev]", dialog), next = $("[data-lb-next]", dialog), close = $("[data-lb-close]", dialog);
  close.textContent = label.close; prev.textContent = "← " + label.prev; next.textContent = label.next + " →";
  var index = 0, opener = null;

  var show = function (i) {
    index = (i + triggers.length) % triggers.length;
    var t = triggers[index];
    img.src = t.href;
    img.width = t.getAttribute("data-width");
    img.height = t.getAttribute("data-height");
    img.alt = t.getAttribute("data-caption") || "";
    caption.textContent = t.getAttribute("data-caption") || "";
    counter.textContent = index + 1 + " / " + triggers.length;
  };

  triggers.forEach(function (t, i) {
    t.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      opener = t;
      show(i);
      dialog.showModal();
      close.focus();
    });
  });
  prev.hidden = next.hidden = triggers.length < 2;
  prev.addEventListener("click", function () { show(index - 1); });
  next.addEventListener("click", function () { show(index + 1); });
  close.addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog || e.target.classList.contains("lightbox-stage")) dialog.close(); });
  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  dialog.addEventListener("close", function () {
    img.removeAttribute("src");
    if (opener) opener.focus();
  });
}
})();

/* 70-forms.js */
(function () {
"use strict";
// Both forms: validation with messages from the page, submission by fetch,
// and an honest result. "Sent" appears only when the server answers ok.
var $ = window.TIN.$, $$ = window.TIN.$$;

function messageFor(control) {
  var v = control.validity;
  if (control.type === "file" && control.files && control.files[0]) {
    var file = control.files[0];
    var max = Number(control.getAttribute("data-max-bytes") || 0);
    if (!/\.(pdf|docx?)$/i.test(file.name)) return control.getAttribute("data-l10n-invalid");
    if (max && file.size > max) return control.getAttribute("data-l10n-toolarge");
  }
  if (v.valueMissing) return control.getAttribute("data-l10n-required");
  if (v.typeMismatch || v.patternMismatch) return control.getAttribute("data-l10n-invalid") || control.getAttribute("data-l10n-required");
  if (control.type === "email" && control.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(control.value)) return control.getAttribute("data-l10n-invalid");
  return "";
}

function validate(control) {
  var field = control.closest("[data-field]");
  if (!field) return true;
  var slot = $("[data-error]", field);
  var message = messageFor(control);
  if (message) {
    control.setAttribute("aria-invalid", "true");
    slot.textContent = message;
    slot.hidden = false;
    return false;
  }
  control.removeAttribute("aria-invalid");
  slot.textContent = "";
  slot.hidden = true;
  return true;
}

function mailtoHref(form) {
  var lines = [];
  $$("input, select, textarea", form).forEach(function (el) {
    if (!el.name || el.type === "hidden" || el.type === "file" || el.type === "checkbox" || el.name === "website" || !el.value) return;
    var label = $('label[for="' + el.id + '"]', form);
    var name = label ? label.firstChild.textContent.trim() : el.name;
    var value = el.tagName === "SELECT" ? el.options[el.selectedIndex].text : el.value;
    lines.push(name + ": " + value);
  });
  var to = (form.getAttribute("data-mailto") || "");
  return "mailto:" + to + "?subject=" + encodeURIComponent(form.getAttribute("data-l10n-mail-subject")) + "&body=" + encodeURIComponent(lines.join("\n"));
}

$$("form[data-form]").forEach(function (form) {
  var status = $("[data-form-status]", form);
  var button = $('button[type="submit"]', form);
  var controls = $$("input, select, textarea", form).filter(function (el) { return el.closest("[data-field]"); });
  form.elements.form_started.value = String(Date.now());
  // Without scripts the browser's own validation applies; with them, ours does.
  form.setAttribute("novalidate", "");

  var say = function (kind, text, link) {
    status.className = "form-status" + (kind ? " is-" + kind : "");
    status.textContent = text;
    if (link) {
      status.appendChild(document.createTextNode(" "));
      var a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.text;
      status.appendChild(a);
    }
  };

  controls.forEach(function (control) {
    control.addEventListener("blur", function () { if (control.value || control.getAttribute("aria-invalid")) validate(control); });
    control.addEventListener("change", function () { if (control.getAttribute("aria-invalid")) validate(control); });
    control.addEventListener("input", function () { if (control.getAttribute("aria-invalid")) validate(control); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var invalid = controls.filter(function (control) { return !validate(control); });
    if (invalid.length) {
      say("error", form.getAttribute("data-l10n-invalid"));
      invalid[0].focus();
      return;
    }
    button.disabled = true;
    say("", form.getAttribute("data-l10n-sending"));
    var email = form.getAttribute("data-mailto");
    // A message that asks the visitor to write to us carries the address as a link.
    var direct = { href: "mailto:" + email, text: email };
    var fallback = function () {
      // No working mail handler here (for example a static preview host).
      say("error", form.getAttribute("data-l10n-fallback"), { href: mailtoHref(form), text: email });
      status.focus();
    };
    fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (res) {
        return res.text().then(function (text) {
          var data = null;
          try { data = JSON.parse(text); } catch (err) { /* not JSON */ }
          return { res: res, data: data };
        });
      })
      .then(function (r) {
        if (r.data && r.data.ok === true) {
          say("ok", form.getAttribute("data-l10n-success"));
          form.reset();
          form.elements.form_started.value = String(Date.now());
          form.dispatchEvent(new CustomEvent("tin:sent"));
        } else if (r.data && r.data.error) {
          say("error", r.data.error, /^(rate|rejected|mail_failed)$/.test(r.data.code || "") ? direct : null);
        } else if (!r.data) {
          fallback();
          return;
        } else {
          say("error", form.getAttribute("data-l10n-failed"), direct);
        }
        status.focus();
      })
      .catch(fallback)
      .then(function () { button.disabled = false; });
  });
});

// Apply page: preselect the role named in the URL.
var jobSelect = $("[data-job-select]");
if (jobSelect) {
  var job = new URLSearchParams(location.search).get("job");
  if (job && $('option[value="' + job.replace(/[^a-z0-9-]/g, "") + '"]', jobSelect)) jobSelect.value = job;
}
})();

/* 71-enquiry.js */
(function () {
"use strict";
// Contact page: read the context passed in the URL (type, topic, need,
// industry, size), show it, and put it in the form. Unknown values are ignored.
var $ = window.TIN.$, $$ = window.TIN.$$;
var type = $("[data-enquiry-type]");
if (type) {
  var form = type.form;
  var topic = $("[data-enquiry-topic]");
  var box = $("[data-enquiry-context]");
  var params = new URLSearchParams(location.search);
  var has = function (select, value) {
    return Array.prototype.some.call(select.options, function (o) { return o.value === value; });
  };
  if (params.get("type") && has(type, params.get("type"))) type.value = params.get("type");
  if (params.get("topic") && has(topic, params.get("topic"))) topic.value = params.get("topic");

  // Context comes from the link that was followed; a link without any falls
  // back to what was chosen earlier in this tab.
  var context = window.TIN.context;
  var saved = context.get();
  var any = false;
  ["need", "industry", "size"].forEach(function (kind) {
    var value = params.get(kind) || saved[kind];
    if (!value) return;
    var item = $$("[data-context-item]", box).filter(function (li) { return li.getAttribute("data-context-item") === kind + ":" + value; })[0];
    if (!item) return;
    item.hidden = false;
    form.elements[kind].value = value;
    any = true;
  });
  box.hidden = !any;

  var clear = function () {
    context.clear();
    ["need", "industry", "size"].forEach(function (kind) { form.elements[kind].value = ""; });
    $$("[data-context-item]", box).forEach(function (li) { li.hidden = true; });
    box.hidden = true;
  };
  $("[data-context-clear]", box).addEventListener("click", function () { clear(); type.focus(); });
  form.addEventListener("tin:sent", clear);
}
})();

/* 80-search.js */
(function () {
"use strict";
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
})();

/* 90-reveal.js */
(function () {
"use strict";
// Section headings ease in once as they enter the viewport. Skipped entirely
// when the visitor prefers reduced motion or the browser lacks the observer.
var $$ = window.TIN.$$;
if (!window.TIN.reducedMotion && "IntersectionObserver" in window) {
  var items = $$(".section-head, .fig-hero");
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already on screen: leave as is
    el.classList.add("will-reveal");
    observer.observe(el);
  });
}
})();
